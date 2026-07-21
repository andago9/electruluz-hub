import faviconSvg from "@/assets/Favicon.svg";
import logoImg from "@/assets/Horizotal-Logo.jpg";
import heroImg from "@/assets/hero-industrial.jpg";

export const SITE = {
	name: "Ferretería Electroluz",
	url: import.meta.env.VITE_SITE_URL ?? "",
	phone: "+57 312 288 1095",
	phoneRaw: "573122881095",
	address: "Calle 11 #7-52, La Dorada, Caldas",
	geo: {
		lat: 5.4528,
		lng: -74.6636,
	},
	defaultOgImage: heroImg,
	logoImage: logoImg,
	favicon: faviconSvg,
	sameAs: [] as string[],
	hours: [
		{ d: "Lunes a Viernes", h: "7:00 AM – 6:00 PM" },
		{ d: "Sábados", h: "7:00 AM – 12:30 PM" },
		{ d: "Festivos", h: "7:00 AM – 12:00 PM" },
		{ d: "Domingos", h: "Cerrado" },
	],
};

export const waLink = (msg = "Hola, quiero solicitar una cotización") =>
	`https://wa.me/${SITE.phoneRaw}?text=${encodeURIComponent(msg)}`;
