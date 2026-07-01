<?php
/**
 * Utilidad SOLO por línea de comandos para generar el hash de la contraseña.
 *
 *   php api/set-password.php "MiNuevaClave"
 *
 * Copia la línea que imprime dentro de api/config.php (constante ADMIN_PASSWORD_HASH).
 * No expone nada por web: si se accede vía HTTP, se rechaza.
 */

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    exit('Solo disponible por línea de comandos.');
}

$password = $argv[1] ?? '';
if ($password === '') {
    fwrite(STDERR, "Uso: php api/set-password.php \"MiNuevaClave\"\n");
    exit(1);
}

$hash = password_hash($password, PASSWORD_DEFAULT);
echo "Pega esta línea en api/config.php:\n\n";
echo "define('ADMIN_PASSWORD_HASH', '" . $hash . "');\n";
