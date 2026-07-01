<?php
/** Almacenamiento de posts: archivos .md con frontmatter + índice JSON. */

declare(strict_types=1);

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/response.php';

/** Asegura que existan las carpetas de datos. */
function ensure_dirs(): void
{
    foreach ([CONTENT_DIR, POSTS_DIR, UPLOADS_DIR] as $dir) {
        if (!is_dir($dir) && !@mkdir($dir, 0775, true) && !is_dir($dir)) {
            send_error('No se pudo crear el directorio de datos: ' . $dir, 500);
        }
    }
}

/** Convierte un título en slug (minúsculas, sin acentos, guiones). */
function slugify(string $text): string
{
    $map = [
        'á' => 'a', 'à' => 'a', 'ä' => 'a', 'â' => 'a', 'ã' => 'a', 'å' => 'a',
        'é' => 'e', 'è' => 'e', 'ë' => 'e', 'ê' => 'e',
        'í' => 'i', 'ì' => 'i', 'ï' => 'i', 'î' => 'i',
        'ó' => 'o', 'ò' => 'o', 'ö' => 'o', 'ô' => 'o', 'õ' => 'o',
        'ú' => 'u', 'ù' => 'u', 'ü' => 'u', 'û' => 'u',
        'ñ' => 'n', 'ç' => 'c',
        'Á' => 'a', 'À' => 'a', 'É' => 'e', 'È' => 'e', 'Í' => 'i', 'Ì' => 'i',
        'Ó' => 'o', 'Ò' => 'o', 'Ú' => 'u', 'Ù' => 'u', 'Ñ' => 'n', 'Ü' => 'u',
        'Ç' => 'c',
    ];
    $text = strtr(trim($text), $map);
    $text = function_exists('mb_strtolower') ? mb_strtolower($text, 'UTF-8') : strtolower($text);
    $text = preg_replace('/[^a-z0-9]+/', '-', $text);
    $text = trim((string) $text, '-');
    return $text !== '' ? $text : 'post';
}

/** Ruta absoluta del archivo .md de un slug (valida el slug). */
function post_path(string $slug): string
{
    if (!preg_match('/^[a-z0-9-]+$/', $slug)) {
        send_error('Slug inválido.', 400);
    }
    return POSTS_DIR . '/' . $slug . '.md';
}

/** Escritura atómica con bloqueo (temp + rename). */
function atomic_write(string $file, string $content): void
{
    $dir = dirname($file);
    if (!is_dir($dir)) {
        @mkdir($dir, 0775, true);
    }
    $tmp = $file . '.tmp' . bin2hex(random_bytes(4));
    if (@file_put_contents($tmp, $content, LOCK_EX) === false) {
        send_error('No se pudo escribir el archivo (¿permisos?).', 500);
    }
    if (@rename($tmp, $file)) {
        return;
    }
    // En Windows rename() falla si el destino ya existe: borrar y reintentar.
    if (is_file($file) && @unlink($file) && @rename($tmp, $file)) {
        return;
    }
    @unlink($tmp);
    send_error('No se pudo guardar el archivo.', 500);
}

/** Serializa metadatos + cuerpo a texto .md. Usa JSON por campo (escape seguro). */
function serialize_post(array $meta, string $body): string
{
    $keys = ['title', 'slug', 'publishedAt', 'excerpt', 'coverImage', 'updatedAt'];
    $lines = ['---'];
    foreach ($keys as $key) {
        $value = $meta[$key] ?? '';
        $lines[] = $key . ': ' . json_encode($value, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
    $lines[] = '---';
    return implode("\n", $lines) . "\n" . rtrim($body) . "\n";
}

/** Parsea un .md en [meta, body]. */
function parse_post(string $raw): array
{
    if (!preg_match('/^---\r?\n(.*?)\r?\n---\r?\n?(.*)$/s', $raw, $m)) {
        return [[], trim($raw)];
    }
    $meta = [];
    foreach (preg_split('/\r?\n/', $m[1]) as $line) {
        if (!preg_match('/^(\w+):\s*(.*)$/', $line, $mm)) {
            continue;
        }
        $decoded = json_decode($mm[2], true);
        $meta[$mm[1]] = $decoded === null && $mm[2] !== 'null' ? trim($mm[2], '"') : $decoded;
    }
    return [$meta, ltrim($m[2])];
}

/** Lee un post completo (meta + body) o null si no existe. */
function read_post(string $slug): ?array
{
    $path = post_path($slug);
    if (!is_file($path)) {
        return null;
    }
    [$meta, $body] = parse_post((string) file_get_contents($path));
    return [
        'title' => (string) ($meta['title'] ?? $slug),
        'slug' => $slug,
        'publishedAt' => $meta['publishedAt'] ?? null,
        'excerpt' => (string) ($meta['excerpt'] ?? ''),
        'coverImage' => ($meta['coverImage'] ?? '') ?: null,
        'updatedAt' => $meta['updatedAt'] ?? null,
        'body' => $body,
    ];
}

/** Devuelve el resumen de un post (sin body) para el índice. */
function post_summary(array $post): array
{
    return [
        'title' => $post['title'],
        'slug' => $post['slug'],
        'publishedAt' => $post['publishedAt'],
        'excerpt' => $post['excerpt'],
        'coverImage' => $post['coverImage'],
    ];
}

/** Reconstruye content/index.json a partir de los .md (orden: fecha desc). */
function rebuild_index(): array
{
    ensure_dirs();
    $summaries = [];
    foreach (glob(POSTS_DIR . '/*.md') ?: [] as $file) {
        $slug = basename($file, '.md');
        $post = read_post($slug);
        if ($post) {
            $summaries[] = post_summary($post);
        }
    }
    usort($summaries, static function ($a, $b) {
        return strcmp((string) ($b['publishedAt'] ?? ''), (string) ($a['publishedAt'] ?? ''));
    });
    atomic_write(INDEX_FILE, json_encode($summaries, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
    return $summaries;
}

/** Lista de posts desde el índice (lo reconstruye si falta). */
function list_posts(): array
{
    if (!is_file(INDEX_FILE)) {
        return rebuild_index();
    }
    $data = json_decode((string) file_get_contents(INDEX_FILE), true);
    return is_array($data) ? $data : [];
}

/**
 * Crea o edita un post. $input: title, publishedAt, excerpt, coverImage, body,
 * y slug (obligatorio al editar). Devuelve el post guardado.
 */
function save_post(array $input): array
{
    ensure_dirs();
    $title = trim((string) ($input['title'] ?? ''));
    if ($title === '') {
        send_error('El título es obligatorio.', 400);
    }
    $body = (string) ($input['body'] ?? '');

    $existingSlug = isset($input['slug']) ? trim((string) $input['slug']) : '';
    if ($existingSlug !== '') {
        // Edición: se conserva el slug original.
        $slug = $existingSlug;
        post_path($slug); // valida formato
    } else {
        // Creación: slug desde el título, garantizando unicidad.
        $base = slugify($title);
        $slug = $base;
        $i = 2;
        while (is_file(POSTS_DIR . '/' . $slug . '.md')) {
            $slug = $base . '-' . $i++;
        }
    }

    $publishedAt = trim((string) ($input['publishedAt'] ?? ''));
    if ($publishedAt === '') {
        $publishedAt = date('Y-m-d');
    }

    $meta = [
        'title' => $title,
        'slug' => $slug,
        'publishedAt' => $publishedAt,
        'excerpt' => trim((string) ($input['excerpt'] ?? '')),
        'coverImage' => trim((string) ($input['coverImage'] ?? '')),
        'updatedAt' => date('c'),
    ];

    atomic_write(post_path($slug), serialize_post($meta, $body));
    rebuild_index();

    return read_post($slug);
}

/** Borra un post. Devuelve true si existía. */
function delete_post(string $slug): bool
{
    $path = post_path($slug);
    if (!is_file($path)) {
        return false;
    }
    @unlink($path);
    rebuild_index();
    return true;
}
