<?php
/** Login / logout / estado de sesión. */

declare(strict_types=1);

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/lib/response.php';
require_once __DIR__ . '/lib/auth.php';

$action = $_GET['action'] ?? '';

if ($action === 'status') {
    require_method(['GET']);
    send_json(['authenticated' => is_admin()]);
}

if ($action === 'logout') {
    require_method(['POST']);
    require_csrf_header();
    clear_admin_session();
    send_json(['ok' => true]);
}

if ($action === 'login') {
    require_method(['POST']);
    require_csrf_header();

    if (login_is_locked()) {
        send_error('Demasiados intentos. Espera unos minutos e inténtalo de nuevo.', 429);
    }

    $body = read_json_body();
    $password = (string) ($body['password'] ?? '');

    if ($password === '' || !password_verify($password, ADMIN_PASSWORD_HASH)) {
        login_record_failure();
        // Pequeño retardo para desincentivar el tanteo.
        usleep(400000);
        send_error('Contraseña incorrecta.', 401);
    }

    login_clear_failures();
    set_admin_authenticated();
    send_json(['ok' => true]);
}

send_error('Acción no válida.', 400);
