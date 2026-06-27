import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

for (const dir of [".build", join("dist", "server")]) {
	try {
		rmSync(join(root, dir), { recursive: true, force: true });
	} catch {
		/* ignore */
	}
}

function loadEnvValue(key) {
	for (const file of [".env.production.local", ".env.production"]) {
		try {
			const env = readFileSync(join(root, file), "utf8");
			const match = env.match(new RegExp(`^${key}=(.+)$`, "m"));
			if (match) return match[1].trim().replace(/^["']|["']$/g, "");
		} catch {
			/* ignore */
		}
	}
	return process.env[key] ?? "";
}

const basePath = (() => {
	const raw = loadEnvValue("VITE_BASE_PATH") || "/";
	return raw.endsWith("/") ? raw : `${raw}/`;
})();

const siteUrl = loadEnvValue("VITE_SITE_URL").replace(/\/$/, "");
const rewriteBase = basePath;

const routes = [
	{ path: "/", priority: "1.0", changefreq: "weekly" },
	{ path: "/nosotros", priority: "0.8", changefreq: "monthly" },
	{ path: "/productos", priority: "0.9", changefreq: "weekly" },
	{ path: "/energia-solar", priority: "0.9", changefreq: "monthly" },
	{ path: "/blog", priority: "0.7", changefreq: "weekly" },
	{ path: "/contacto", priority: "0.8", changefreq: "monthly" },
];

const lastmod = new Date().toISOString().split("T")[0];

function toAbsoluteUrl(path) {
	const base = basePath === "/" ? "" : basePath.replace(/\/$/, "");
	const normalized = path.startsWith("/") ? path : `/${path}`;
	const hasExtension = /\.[a-z0-9]+$/i.test(normalized);
	const pathname =
		normalized === "/"
			? `${base}/`
			: hasExtension
				? `${base}${normalized}`
				: `${base}${normalized}/`;
	if (!siteUrl) return pathname;
	return `${siteUrl}${pathname}`.replace(/([^:]\/)\/+/g, "$1");
}

const htaccess = `<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase ${rewriteBase}

  # Nunca reescribir assets estáticos
  RewriteRule ^assets/ - [L]
  RewriteCond %{REQUEST_URI} \\.(js|css|png|jpg|jpeg|gif|svg|ico|webp|woff2?|map|xml|txt)$ [NC]
  RewriteRule ^ - [L]

  # Servir archivos y carpetas existentes
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # /nosotros → /nosotros/
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_URI} !/$
  RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI}/index.html -f
  RewriteRule ^(.*)$ $1/ [R=301,L]

  # SPA fallback
  RewriteRule ^ index.html [L]
</IfModule>
`;

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
	.map(
		(route) => `  <url>
    <loc>${toAbsoluteUrl(route.path)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
	)
	.join("\n")}
</urlset>
`;

const robots = siteUrl
	? `User-agent: *
Allow: /

Sitemap: ${toAbsoluteUrl("/sitemap.xml")}
`
	: `User-agent: *
Allow: /
`;

writeFileSync(join(root, "dist", ".htaccess"), htaccess, "utf8");
writeFileSync(join(root, "dist", "sitemap.xml"), sitemap, "utf8");
writeFileSync(join(root, "dist", "robots.txt"), robots, "utf8");

console.log(`Build listo (base: ${rewriteBase})`);
if (siteUrl) {
	console.log(`SEO: sitemap y robots generados para ${siteUrl}`);
} else {
	console.log("SEO: configura VITE_SITE_URL en .env.production para URLs absolutas en sitemap.");
}
console.log("Sube el CONTENIDO de dist/ a tu hosting, no la carpeta dist en sí.");
