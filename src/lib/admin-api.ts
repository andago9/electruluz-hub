/**
 * Cliente tipado del backend PHP del blog.
 * Rutas same-origin. Las escrituras envían la cabecera X-Requested-With
 * (refuerzo CSRF) y la cookie de sesión (credentials: "same-origin").
 */

export type PostSummary = {
	title: string;
	slug: string;
	publishedAt: string | null;
	excerpt: string;
	coverImage: string | null;
	category: string | null;
	tags: string[];
};

export type Post = PostSummary & {
	body: string;
	updatedAt: string | null;
};

export type PostInput = {
	title: string;
	publishedAt?: string;
	excerpt?: string;
	coverImage?: string | null;
	category: string;
	tags?: string[];
	body: string;
	/** Presente al editar; ausente al crear. */
	slug?: string;
};

const WRITE_HEADERS = { "X-Requested-With": "XMLHttpRequest" };

async function parseError(res: Response): Promise<never> {
	let message = `Error ${res.status}`;
	try {
		const data = await res.json();
		if (data?.error) message = data.error;
	} catch {
		/* respuesta sin JSON */
	}
	throw new Error(message);
}

async function getJson<T>(url: string): Promise<T> {
	const res = await fetch(url, { credentials: "same-origin" });
	if (!res.ok) return parseError(res);
	return res.json() as Promise<T>;
}

async function sendJson<T>(url: string, method: string, body?: unknown): Promise<T> {
	const res = await fetch(url, {
		method,
		credentials: "same-origin",
		headers: { "Content-Type": "application/json", ...WRITE_HEADERS },
		body: body === undefined ? undefined : JSON.stringify(body),
	});
	if (!res.ok) return parseError(res);
	return res.json() as Promise<T>;
}

/* ---- Auth ---- */

export async function getAuthStatus(): Promise<boolean> {
	const { authenticated } = await getJson<{ authenticated: boolean }>(
		"/api/auth.php?action=status",
	);
	return authenticated;
}

export async function login(password: string): Promise<void> {
	await sendJson("/api/auth.php?action=login", "POST", { password });
}

export async function logout(): Promise<void> {
	await sendJson("/api/auth.php?action=logout", "POST");
}

/* ---- Posts ---- */

function normalizeSummary(raw: Record<string, unknown>): PostSummary {
	return {
		title: String(raw.title ?? ""),
		slug: String(raw.slug ?? ""),
		publishedAt: (raw.publishedAt as string | null) ?? null,
		excerpt: String(raw.excerpt ?? ""),
		coverImage: (raw.coverImage as string | null) || null,
		category: (raw.category as string | null) || null,
		tags: Array.isArray(raw.tags) ? (raw.tags as string[]) : [],
	};
}

function normalizePost(raw: Record<string, unknown>): Post {
	return {
		...normalizeSummary(raw),
		body: String(raw.body ?? ""),
		updatedAt: (raw.updatedAt as string | null) ?? null,
	};
}

export async function listPosts(): Promise<PostSummary[]> {
	const data = await getJson<Record<string, unknown>[]>("/api/posts.php");
	return data.map(normalizeSummary);
}

export async function getPost(slug: string): Promise<Post> {
	const data = await getJson<Record<string, unknown>>(
		`/api/posts.php?slug=${encodeURIComponent(slug)}`,
	);
	return normalizePost(data);
}

export function savePost(input: PostInput): Promise<Post> {
	return sendJson<Post>("/api/posts.php", "POST", input).then((p) =>
		normalizePost(p as unknown as Record<string, unknown>),
	);
}

export function deletePost(slug: string): Promise<{ ok: true }> {
	return sendJson<{ ok: true }>(`/api/posts.php?slug=${encodeURIComponent(slug)}`, "DELETE");
}

/* ---- Imágenes ---- */

export async function uploadImage(file: File): Promise<string> {
	const form = new FormData();
	form.append("file", file);
	const res = await fetch("/api/upload.php", {
		method: "POST",
		credentials: "same-origin",
		headers: WRITE_HEADERS,
		body: form,
	});
	if (!res.ok) return parseError(res);
	const { url } = (await res.json()) as { url: string };
	return url;
}
