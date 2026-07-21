<?php
/**
 * Render SEO server-side de /blog y /blog/:slug.
 *
 * Toma index.html (el shell del SPA) como plantilla, inyecta en el <head> los
 * metadatos (title, description, og:*, canonical, JSON-LD) y, para un post, su
 * contenido HTML en un contenedor oculto (para crawlers sin JS). El SPA arranca
 * normal y toma el control de la navegación.
 */

declare(strict_types=1);

require_once __DIR__ . '/api/config.php';
require_once __DIR__ . '/api/lib/storage.php';
require_once __DIR__ . '/api/lib/Parsedown.php';

$template = @file_get_contents(WEB_ROOT . '/index.html');
if ($template === false) {
    http_response_code(500);
    exit('index.html no encontrado.');
}

// Origen actual para URLs absolutas.
$scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'] ?? 'localhost';
$origin = $scheme . '://' . $host;

$uriPath = (string) parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$parts = array_values(array_filter(explode('/', trim($uriPath, '/')), 'strlen'));
$slug = $parts[1] ?? ''; // parts[0] === 'blog'

$SITE = 'Ferretería Electroluz';

function h(string $s): string
{
    return htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
}

function absolute_url(string $origin, ?string $path): string
{
    if (!$path) {
        return '';
    }
    if (preg_match('#^https?://#', $path)) {
        return $path;
    }
    return $origin . '/' . ltrim($path, '/');
}

$headTags = '';
$seoBody = '';
$status = 200;

if ($slug !== '') {
    // Solo consultamos si el slug tiene formato válido; si no, es un 404 HTML
    // (evita que post_path() responda con un error JSON en contexto HTML).
    $post = preg_match('/^[a-z0-9-]+$/', $slug) ? read_post($slug) : null;
    if (!$post) {
        $status = 404;
        $title = 'Artículo no encontrado — ' . $SITE;
        $description = 'El artículo que buscas no existe o fue movido.';
        $canonical = $origin . '/blog';
        $headTags = seo_head_tags($title, $description, $canonical, '', 'website');
    } else {
        $title = $post['title'] . ' — Blog ' . $SITE;
        $description = $post['excerpt'] !== '' ? $post['excerpt'] : ('Artículo del blog de ' . $SITE . '.');
        $canonical = $origin . '/blog/' . $post['slug'];
        $image = absolute_url($origin, $post['coverImage']);
        $headTags = seo_head_tags($title, $description, $canonical, $image, 'article');
        $postTags = is_array($post['tags'] ?? null) ? $post['tags'] : [];
        if ($postTags !== []) {
            $keywords = implode(', ', array_map('strval', $postTags));
            $headTags .= "\n" . '<meta name="keywords" content="' . h($keywords) . '">';
        }
        $headTags .= "\n" . article_jsonld($post, $canonical, $image, $SITE);

        $parsedown = new Parsedown();
        $parsedown->setSafeMode(true);
        $articleHtml = $parsedown->text($post['body']);
        $cover = $image ? '<img src="' . h($image) . '" alt="' . h($post['title']) . '">' : '';
        $seoBody = '<div id="seo-content" hidden><article><h1>' . h($post['title']) . '</h1>'
            . $cover . $articleHtml . '</article></div>';
    }
} else {
    $title = 'Blog — ' . $SITE;
    $description = 'Guías, novedades y consejos sobre energía solar, iluminación, construcción y ferretería en La Dorada, Caldas.';
    $canonical = $origin . '/blog';
    $headTags = seo_head_tags($title, $description, $canonical, '', 'website');

    // Enlaces a los posts para que el crawler los descubra.
    $items = '';
    foreach (list_posts() as $p) {
        $items .= '<li><a href="' . h($origin . '/blog/' . $p['slug']) . '">' . h($p['title']) . '</a></li>';
    }
    if ($items !== '') {
        $seoBody = '<div id="seo-content" hidden><nav><ul>' . $items . '</ul></nav></div>';
    }
}

/** Construye los tags SEO del <head>. */
function seo_head_tags(string $title, string $description, string $canonical, string $image, string $type): string
{
    $tags = [];
    $tags[] = '<title>' . h($title) . '</title>';
    $tags[] = '<meta name="description" content="' . h($description) . '">';
    $tags[] = '<link rel="canonical" href="' . h($canonical) . '">';
    $tags[] = '<meta property="og:type" content="' . h($type) . '">';
    $tags[] = '<meta property="og:title" content="' . h($title) . '">';
    $tags[] = '<meta property="og:description" content="' . h($description) . '">';
    $tags[] = '<meta property="og:url" content="' . h($canonical) . '">';
    $tags[] = '<meta name="twitter:card" content="' . ($image ? 'summary_large_image' : 'summary') . '">';
    if ($image) {
        $tags[] = '<meta property="og:image" content="' . h($image) . '">';
        $tags[] = '<meta name="twitter:image" content="' . h($image) . '">';
    }
    return implode("\n", $tags);
}

/** JSON-LD de tipo Article para rich snippets. */
function article_jsonld(array $post, string $url, string $image, string $site): string
{
    $data = [
        '@context' => 'https://schema.org',
        '@type' => 'Article',
        'headline' => $post['title'],
        'description' => $post['excerpt'],
        'datePublished' => $post['publishedAt'],
        'dateModified' => $post['updatedAt'] ?? $post['publishedAt'],
        'mainEntityOfPage' => $url,
        'author' => ['@type' => 'Organization', 'name' => $site],
        'publisher' => ['@type' => 'Organization', 'name' => $site],
    ];
    if ($image) {
        $data['image'] = $image;
    }
    return '<script type="application/ld+json">'
        . json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)
        . '</script>';
}

// --- Inyección en la plantilla ---

// Quitar los metadatos SEO que ya trae la plantilla (del prerender del home)
// para no duplicarlos con los del post.
$html = preg_replace('#<title>.*?</title>#is', '', $template, 1);
$html = preg_replace('#<meta\s+name="description"[^>]*>#i', '', (string) $html);
$html = preg_replace('#<meta\s+property="og:[^"]*"[^>]*>#i', '', (string) $html);
$html = preg_replace('#<meta\s+name="twitter:[^"]*"[^>]*>#i', '', (string) $html);
$html = preg_replace('#<link\s+rel="canonical"[^>]*>#i', '', (string) $html);
// Insertar los tags SEO del post antes de </head>.
$html = preg_replace('#</head>#i', $headTags . "\n</head>", (string) $html, 1);
// Insertar el contenido SEO justo después de la apertura de <body>.
if ($seoBody !== '') {
    $html = preg_replace('#(<body[^>]*>)#i', '$1' . "\n" . $seoBody, (string) $html, 1);
}

http_response_code($status);
header('Content-Type: text/html; charset=utf-8');
echo $html;
