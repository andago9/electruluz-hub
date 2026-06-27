import { load as parseYaml } from "js-yaml";

export type BlogPost = {
	slug: string;
	title: string;
	publishedAt: string | null;
	excerpt: string;
	coverImage: string | null;
	body: string;
};

// Los .mdoc generados por Keystatic se empaquetan en build (funciona en hosting estático).
const rawFiles = import.meta.glob("/src/content/posts/**/*.mdoc", {
	query: "?raw",
	import: "default",
	eager: true,
}) as Record<string, string>;

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

function slugFromPath(path: string): string {
	const rel = path.replace("/src/content/posts/", "").replace(/\.mdoc$/, "");
	return rel.endsWith("/index") ? rel.slice(0, -"/index".length) : rel;
}

function asString(value: unknown): string {
	return typeof value === "string" ? value : "";
}

function parsePost(path: string, raw: string): BlogPost {
	const match = FRONTMATTER_RE.exec(raw);
	const frontmatter = match ? ((parseYaml(match[1]) as Record<string, unknown>) ?? {}) : {};
	const body = match ? match[2] : raw;
	const slug = slugFromPath(path);

	const cover = frontmatter.coverImage;

	return {
		slug,
		title: asString(frontmatter.title) || slug,
		publishedAt: typeof frontmatter.publishedAt === "string" ? frontmatter.publishedAt : null,
		excerpt: asString(frontmatter.excerpt),
		coverImage: typeof cover === "string" && cover.length > 0 ? cover : null,
		body: body.trim(),
	};
}

// Resuelve rutas de imágenes respetando el base path (p. ej. /electruluz-hub/dist/).
export function withBase(src: string): string {
	if (!src || /^https?:\/\//.test(src) || src.startsWith("data:")) return src;
	const base = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");
	if (!base) return src.startsWith("/") ? src : `/${src}`;
	if (src === base || src.startsWith(`${base}/`)) return src;
	return `${base}/${src.replace(/^\//, "")}`;
}

let cache: BlogPost[] | null = null;

export function getAllPosts(): BlogPost[] {
	if (!cache) {
		cache = Object.entries(rawFiles)
			.map(([path, raw]) => parsePost(path, raw))
			.sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
	}
	return cache;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
	return getAllPosts().find((post) => post.slug === slug);
}
