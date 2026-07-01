<?php
/** Sesión de administrador + freno anti-fuerza bruta. */

declare(strict_types=1);

require_once __DIR__ . '/response.php';

/** Inicia la sesión con cookie httpOnly + SameSite=Strict. */
function start_admin_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }
    $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (($_SERVER['SERVER_PORT'] ?? '') === '443');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'httponly' => true,
        'samesite' => 'Strict',
        'secure' => $secure,
    ]);
    session_name(SESSION_NAME);
    session_start();
}

/** ¿La sesión actual está autenticada como admin? */
function is_admin(): bool
{
    start_admin_session();
    return !empty($_SESSION['is_admin']);
}

/** Exige sesión de admin; si no, 401 y termina. */
function require_admin(): void
{
    if (!is_admin()) {
        send_error('No autenticado.', 401);
    }
}

/** Marca la sesión como autenticada (tras verificar la contraseña). */
function set_admin_authenticated(): void
{
    start_admin_session();
    session_regenerate_id(true);
    $_SESSION['is_admin'] = true;
}

/** Cierra la sesión. */
function clear_admin_session(): void
{
    start_admin_session();
    $_SESSION = [];
    session_destroy();
}

/* ---- Freno anti-fuerza bruta (por IP, basado en archivo) ---- */

function client_ip(): string
{
    return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
}

/** ¿La IP está bloqueada por demasiados intentos fallidos? */
function login_is_locked(): bool
{
    $data = read_throttle();
    $ip = client_ip();
    $entry = $data[$ip] ?? null;
    if (!$entry) {
        return false;
    }
    if (($entry['t'] + LOGIN_WINDOW_SECONDS) < time()) {
        return false; // ventana expirada
    }
    return $entry['n'] >= LOGIN_MAX_ATTEMPTS;
}

/** Registra un intento fallido de login. */
function login_record_failure(): void
{
    $data = read_throttle();
    $ip = client_ip();
    $entry = $data[$ip] ?? null;
    if (!$entry || ($entry['t'] + LOGIN_WINDOW_SECONDS) < time()) {
        $data[$ip] = ['n' => 1, 't' => time()];
    } else {
        $data[$ip] = ['n' => $entry['n'] + 1, 't' => $entry['t']];
    }
    write_throttle($data);
}

/** Limpia los intentos de la IP tras un login exitoso. */
function login_clear_failures(): void
{
    $data = read_throttle();
    unset($data[client_ip()]);
    write_throttle($data);
}

function read_throttle(): array
{
    if (!is_file(THROTTLE_FILE)) {
        return [];
    }
    $raw = file_get_contents(THROTTLE_FILE);
    $data = $raw ? json_decode($raw, true) : [];
    return is_array($data) ? $data : [];
}

function write_throttle(array $data): void
{
    // Poda de entradas expiradas para que el archivo no crezca sin límite.
    $now = time();
    foreach ($data as $ip => $entry) {
        if (($entry['t'] + LOGIN_WINDOW_SECONDS) < $now) {
            unset($data[$ip]);
        }
    }
    if (!is_dir(CONTENT_DIR)) {
        @mkdir(CONTENT_DIR, 0775, true);
    }
    @file_put_contents(THROTTLE_FILE, json_encode($data), LOCK_EX);
}
