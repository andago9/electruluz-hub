import { SITE } from "@/lib/site";

export type PageHeadOptions = {
	title: string;
	description: string;
	path: string;
	image?: string;
	breadcrumbs?: Array<{ name: string; path: string }>;
	extraScripts?: Array<{ type: string; children: string }>;
};

type HeadLink = { rel: string; href: string; sizes?: string; type?: string };
type HeadMeta =
	| { charSet: string }
	| { name: string; content: string }
	| { property: string; content: string }
	| { title: string };
type HeadScript = { type: string; children: string };

export function getSiteUrl(): string {
	const url = import.meta.env.VITE_SITE_URL ?? "";
	return url.replace(/\/$/, "");
}

function getBasePath(): string {
	const base = import.meta.env.BASE_URL ?? "/";
	if (base === "/") return "";
	return base.replace(/\/$/, "");
}

export function absoluteUrl(path: string): string {
	const normalized = path.startsWith("/") ? path : `/${path}`;
	const base = getBasePath();
	const pathname =
		base && (normalized === base || normalized.startsWith(`${base}/`))
			? normalized
			: `${base}${normalized}`.replace(/\/{2,}/g, "/");
	const site = getSiteUrl();
	if (!site) return pathname;
	return `${site}${pathname}`;
}

function resolveImageUrl(image?: string): string | undefined {
	if (!image) return SITE.defaultOgImage ? absoluteUrl(SITE.defaultOgImage) : undefined;
	if (image.startsWith("http://") || image.startsWith("https://")) return image;
	return absoluteUrl(image);
}

function jsonLdScript(data: unknown): HeadScript {
	return {
		type: "application/ld+json",
		children: JSON.stringify(data),
	};
}

const DAY_MAP: Record<string, string[]> = {
	"Lunes a Viernes": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
	Sábados: ["Saturday"],
	Domingos: ["Sunday"],
};

function parseTime12h(time: string): string | null {
	const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
	if (!match) return null;
	let hours = Number.parseInt(match[1], 10);
	const minutes = match[2];
	const period = match[3].toUpperCase();
	if (period === "PM" && hours !== 12) hours += 12;
	if (period === "AM" && hours === 12) hours = 0;
	return `${String(hours).padStart(2, "0")}:${minutes}`;
}

function buildOpeningHours() {
	return SITE.hours
		.filter((entry) => !entry.h.toLowerCase().includes("cerrado"))
		.flatMap((entry) => {
			const days = DAY_MAP[entry.d];
			if (!days) return [];
			const [opensRaw, closesRaw] = entry.h.split("–").map((part) => part.trim());
			const opens = parseTime12h(opensRaw);
			const closes = parseTime12h(closesRaw);
			if (!opens || !closes) return [];
			return [
				{
					"@type": "OpeningHoursSpecification",
					dayOfWeek: days,
					opens,
					closes,
				},
			];
		});
}

export function buildLocalBusinessSchema() {
	const image = SITE.defaultOgImage ? absoluteUrl(SITE.defaultOgImage) : undefined;
	const logo = SITE.logoImage ? absoluteUrl(SITE.logoImage) : image;

	return {
		"@context": "https://schema.org",
		"@type": ["HardwareStore", "LocalBusiness"],
		name: SITE.name,
		description:
			"Ferretería en La Dorada, Caldas. Materiales eléctricos, construcción, herramientas, iluminación y energía solar.",
		url: getSiteUrl() ? absoluteUrl("/") : undefined,
		telephone: SITE.phone,
		image,
		logo,
		address: {
			"@type": "PostalAddress",
			streetAddress: "Calle 11 #7-52",
			addressLocality: "La Dorada",
			addressRegion: "Caldas",
			addressCountry: "CO",
		},
		geo: {
			"@type": "GeoCoordinates",
			latitude: SITE.geo.lat,
			longitude: SITE.geo.lng,
		},
		openingHoursSpecification: buildOpeningHours(),
		sameAs: SITE.sameAs,
	};
}

export function buildWebSiteSchema() {
	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: SITE.name,
		url: getSiteUrl() ? absoluteUrl("/") : undefined,
		inLanguage: "es-CO",
	};
}

export function buildBreadcrumbSchema(items: Array<{ name: string; path: string }>) {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: getSiteUrl() ? absoluteUrl(item.path) : item.path,
		})),
	};
}

export function buildPageHead(options: PageHeadOptions) {
	const { title, description, path, image, breadcrumbs, extraScripts = [] } = options;
	const canonical = absoluteUrl(path === "/" ? "/" : path.replace(/\/$/, ""));
	const ogImage = resolveImageUrl(image);

	const meta: HeadMeta[] = [
		{ title },
		{ name: "description", content: description },
		{ name: "robots", content: "index, follow" },
		{ property: "og:title", content: title },
		{ property: "og:description", content: description },
		{ property: "og:type", content: "website" },
		{ property: "og:locale", content: "es_CO" },
		{ property: "og:site_name", content: SITE.name },
		{ name: "twitter:card", content: "summary_large_image" },
		{ name: "twitter:title", content: title },
		{ name: "twitter:description", content: description },
	];

	if (getSiteUrl()) {
		meta.push({ property: "og:url", content: canonical });
	}
	if (ogImage) {
		meta.push(
			{ property: "og:image", content: ogImage },
			{ name: "twitter:image", content: ogImage },
		);
	}

	const links: HeadLink[] = [{ rel: "canonical", href: canonical }];

	const scripts: HeadScript[] = [...extraScripts];
	if (breadcrumbs?.length) {
		scripts.push(jsonLdScript(buildBreadcrumbSchema(breadcrumbs)));
	}

	return { meta, links, scripts };
}

export function buildRootHeadLinks(stylesheet: string, favicon: string): HeadLink[] {
	return [
		{ rel: "stylesheet", href: stylesheet },
		{ rel: "icon", href: favicon, type: "image/svg+xml" },
		{ rel: "apple-touch-icon", href: favicon },
	];
}

export function buildRootHeadScripts(): HeadScript[] {
	return [jsonLdScript(buildLocalBusinessSchema())];
}
