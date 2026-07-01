<?php
/** Helpers de respuesta JSON y de entrada para la API. */

declare(strict_types=1);

/** Envía $data como JSON con el código HTTP dado y termina. */
function send_json($data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/** Envía un error JSON { error: mensaje } y termina. */
function send_error(string $message, int $status = 400): void
{
    send_json(['error' => $message], $status);
}

/** Exige que el método HTTP sea uno de los permitidos; si no, 405. */
function require_method(array $methods): string
{
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    if (!in_array($method, $methods, true)) {
        header('Allow: ' . implode(', ', $methods));
        send_error('Método no permitido.', 405);
    }
    return $method;
}

/**
 * Refuerzo CSRF para escrituras: exige la cabecera X-Requested-With (que un
 * formulario cross-site no puede enviar sin CORS). Combinado con la cookie
 * SameSite=Strict, mitiga CSRF.
 */
function require_csrf_header(): void
{
    if (empty($_SERVER['HTTP_X_REQUESTED_WITH'])) {
        send_error('Petición no autorizada.', 403);
    }
}

/** Lee y decodifica el cuerpo JSON de la petición. */
function read_json_body(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === '' || $raw === false) {
        return [];
    }
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        send_error('Cuerpo JSON inválido.', 400);
    }
    return $data;
}
