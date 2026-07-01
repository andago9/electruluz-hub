<?php
/** CRUD de posts. Lectura pública; escritura requiere sesión de admin. */

declare(strict_types=1);

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/lib/response.php';
require_once __DIR__ . '/lib/auth.php';
require_once __DIR__ . '/lib/storage.php';

$method = require_method(['GET', 'POST', 'DELETE']);
$slug = isset($_GET['slug']) ? trim((string) $_GET['slug']) : '';

if ($method === 'GET') {
    if ($slug !== '') {
        $post = read_post($slug);
        if (!$post) {
            send_error('Post no encontrado.', 404);
        }
        send_json($post);
    }
    send_json(list_posts());
}

// Escrituras: sesión + refuerzo CSRF.
require_admin();
require_csrf_header();

if ($method === 'POST') {
    $input = read_json_body();
    $post = save_post($input);
    send_json($post);
}

if ($method === 'DELETE') {
    if ($slug === '') {
        send_error('Falta el slug.', 400);
    }
    if (!delete_post($slug)) {
        send_error('Post no encontrado.', 404);
    }
    send_json(['ok' => true]);
}
