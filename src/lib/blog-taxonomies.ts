/** Categorías fijas del blog (slug → etiqueta). */

export const BLOG_CATEGORIES = [
	{ slug: "energia-solar", label: "Energía solar" },
	{ slug: "electricidad", label: "Electricidad" },
	{ slug: "iluminacion", label: "Iluminación" },
	{ slug: "construccion", label: "Construcción" },
	{ slug: "herramientas", label: "Herramientas" },
	{ slug: "novedades", label: "Novedades" },
] as const;

export type BlogCategorySlug = (typeof BLOG_CATEGORIES)[number]["slug"];

const LABEL_BY_SLUG = Object.fromEntries(
	BLOG_CATEGORIES.map((c) => [c.slug, c.label]),
) as Record<string, string>;

export function getCategoryLabel(slug: string | null | undefined): string {
	if (!slug) return "";
	return LABEL_BY_SLUG[slug] ?? slug;
}

export function isBlogCategorySlug(value: string): value is BlogCategorySlug {
	return value in LABEL_BY_SLUG;
}

/** Cuenta posts por categoría (ignora posts sin categoría). */
export function countPostsByCategory(
	posts: { category?: string | null }[],
): Record<string, number> {
	const counts: Record<string, number> = {};
	for (const post of posts) {
		const key = post.category;
		if (!key) continue;
		counts[key] = (counts[key] ?? 0) + 1;
	}
	return counts;
}

/** Normaliza un tag a kebab-case (cliente; el servidor vuelve a normalizar). */
export function normalizeTag(raw: string): string | null {
	const map: Record<string, string> = {
		á: "a",
		à: "a",
		ä: "a",
		â: "a",
		ã: "a",
		é: "e",
		è: "e",
		ë: "e",
		ê: "e",
		í: "i",
		ì: "i",
		ï: "i",
		î: "i",
		ó: "o",
		ò: "o",
		ö: "o",
		ô: "o",
		õ: "o",
		ú: "u",
		ù: "u",
		ü: "u",
		û: "u",
		ñ: "n",
		ç: "c",
	};
	let text = raw.trim().toLowerCase();
	text = text.replace(/[áàäâãéèëêíìïîóòöôõúùüûñç]/g, (ch) => map[ch] ?? ch);
	text = text.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
	return text || null;
}
