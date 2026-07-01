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

export function listPosts(): Promise<PostSummary[]> {
	return getJson<PostSummary[]>("/api/posts.php");
}

export function getPost(slug: string): Promise<Post> {
	return getJson<Post>(`/api/posts.php?slug=${encodeURIComponent(slug)}`);
}

export function savePost(input: PostInput): Promise<Post> {
	return sendJson<Post>("/api/posts.php", "POST", input);
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
