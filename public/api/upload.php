<?php
/** Subida de imágenes del blog. Requiere sesión de admin. */

declare(strict_types=1);

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/lib/response.php';
require_once __DIR__ . '/lib/auth.php';
require_once __DIR__ . '/lib/storage.php';

require_method(['POST']);
require_admin();
require_csrf_header();

if (empty($_FILES['file']) || !is_array($_FILES['file'])) {
    send_error('No se recibió ningún archivo.', 400);
}

$file = $_FILES['file'];

if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
    $msg = ($file['error'] === UPLOAD_ERR_INI_SIZE || $file['error'] === UPLOAD_ERR_FORM_SIZE)
        ? 'La imagen supera el tamaño permitido.'
        : 'Error al subir el archivo.';
    send_error($msg, 400);
}

if (($file['size'] ?? 0) > MAX_UPLOAD_BYTES) {
    send_error('La imagen supera el tamaño permitido (máx. 5 MB).', 413);
}

// Validar que sea realmente una imagen (MIME real + dimensiones).
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime = (string) $finfo->file($file['tmp_name']);
if (!in_array($mime, ALLOWED_IMAGE_MIME, true)) {
    send_error('Tipo de archivo no permitido. Sube una imagen.', 415);
}
if (@getimagesize($file['tmp_name']) === false) {
    send_error('El archivo no es una imagen válida.', 415);
}

// Extensión a partir del MIME (no confiamos en el nombre original).
$extByMime = [
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/webp' => 'webp',
    'image/gif' => 'gif',
    'image/avif' => 'avif',
];
$ext = $extByMime[$mime];

ensure_dirs();
$name = bin2hex(random_bytes(8)) . '.' . $ext;
$dest = UPLOADS_DIR . '/' . $name;

if (!@move_uploaded_file($file['tmp_name'], $dest)) {
    send_error('No se pudo guardar la imagen (¿permisos de la carpeta uploads?).', 500);
}

send_json(['url' => UPLOADS_URL . '/' . $name]);
