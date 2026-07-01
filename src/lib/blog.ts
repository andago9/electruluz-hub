import { getPost, listPosts, type Post, type PostSummary } from "@/lib/admin-api";

// El blog se sirve en runtime desde el backend PHP (/api/posts.php). El SEO de
// cada post lo genera blog.php en el servidor; aquí solo consumimos la API.

export type BlogPostSummary = PostSummary;
export type BlogPost = Post;

/** Resuelve rutas de imágenes respetando el base path (p. ej. /electruluz-hub/dist/). */
export function withBase(src: string): string {
	if (!src || /^https?:\/\//.test(src) || src.startsWith("data:")) return src;
	const base = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");
	if (!base) return src.startsWith("/") ? src : `/${src}`;
	if (src === base || src.startsWith(`${base}/`)) return src;
	return `${base}/${src.replace(/^\//, "")}`;
}

export function getAllPosts(): Promise<BlogPostSummary[]> {
	return listPosts();
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
	try {
		return await getPost(slug);
	} catch {
		return undefined;
	}
}
