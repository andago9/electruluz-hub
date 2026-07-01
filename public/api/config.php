<?php
/**
 * Configuración central del backend del blog.
 *
 * Rutas: este archivo vive en <raíz web>/api/config.php, así que la raíz web es
 * el directorio padre de /api. content/ y uploads/ son DATOS (persisten entre
 * deploys, no se deben borrar).
 */

declare(strict_types=1);

// Raíz web = carpeta que contiene index.html, api/, blog.php, content/, uploads/
define('WEB_ROOT', dirname(__DIR__));

define('CONTENT_DIR', WEB_ROOT . '/content');
define('POSTS_DIR', CONTENT_DIR . '/posts');
define('INDEX_FILE', CONTENT_DIR . '/index.json');
define('THROTTLE_FILE', CONTENT_DIR . '/.login-throttle.json');

define('UPLOADS_DIR', WEB_ROOT . '/uploads/blog');
define('UPLOADS_URL', '/uploads/blog'); // Base path del sitio = "/"

// Contraseña de administrador (solo el hash bcrypt; NUNCA la clave en claro).
// Para cambiarla: php api/set-password.php "NuevaClave" y pega el resultado aquí.
define('ADMIN_PASSWORD_HASH', '$2y$10$YFOTaBh3O3TLH8dUZmoMgelhAUA0XGWWFVxzzN0rY1rqR5So62LUW');

// Subida de imágenes.
define('MAX_UPLOAD_BYTES', 5 * 1024 * 1024); // 5 MB
const ALLOWED_IMAGE_EXT = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'];
const ALLOWED_IMAGE_MIME = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/avif',
];

// Anti-fuerza bruta en el login.
define('LOGIN_MAX_ATTEMPTS', 6);
define('LOGIN_WINDOW_SECONDS', 600); // 10 min

// Nombre de la cookie de sesión.
define('SESSION_NAME', 'electroluz_admin');
