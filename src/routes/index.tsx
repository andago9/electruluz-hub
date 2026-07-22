import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowRight,
	BadgeCheck,
	Cable,
	Droplets,
	Fan,
	Hammer,
	Headphones,
	Layers,
	Lightbulb,
	MessageCircle,
	PaintBucket,
	Shield,
	Snowflake,
	Star,
	Truck,
	Wrench,
	Zap,
} from "lucide-react";
import { useEffect } from "react";
import heroImg from "@/assets/hero-store.png";
import storefrontImg from "@/assets/storefront-electroluz.png";
import { buildPageHead, buildWebSiteSchema } from "@/lib/seo";
import { waLink } from "@/lib/site";

const RATING_STARS = [1, 2, 3, 4, 5] as const;
const SOCIABLEKIT_REVIEWS_SCRIPT =
	"https://widgets.sociablekit.com/google-reviews/widget.js";
const SOCIABLEKIT_EMBED_ID = "25699087";

export const Route = createFileRoute("/")({
	head: () =>
		buildPageHead({
			title: "Ferretería Electroluz | La Dorada, Caldas — Eléctricos, construcción y refrigeración",
			description:
				"Materiales eléctricos, construcción, herramientas y refrigeración en La Dorada. Cotización rápida por WhatsApp.",
			path: "/",
			image: heroImg,
			extraScripts: [
				{
					type: "application/ld+json",
					children: JSON.stringify(buildWebSiteSchema()),
				},
			],
		}),
	component: Home,
});

const categories = [
	{ icon: Cable, name: "Materiales eléctricos", desc: "Cables, breakers, contadores y más" },
	{ icon: Lightbulb, name: "Bombillería LED", desc: "Iluminación moderna y eficiente" },
	{ icon: Hammer, name: "Herramientas", desc: "Eléctricas y manuales de marcas top" },
	{ icon: Layers, name: "Drywall y Superboard", desc: "Para acabados y divisiones" },
	{ icon: PaintBucket, name: "Pinturas y acabados", desc: "Variedad para interior y exterior" },
	{ icon: Droplets, name: "PVC y grifería", desc: "Tubería, accesorios y baños" },
	{ icon: Snowflake, name: "Refrigeración", desc: "Equipos, repuestos y accesorios" },
	{ icon: Shield, name: "Seguridad industrial", desc: "EPP y dotación profesional" },
];

const benefits = [
	{ icon: Headphones, t: "Excelente atención", d: "Asesoría personalizada todos los días" },
	{ icon: Wrench, t: "Amplia variedad", d: "Miles de productos en un solo lugar" },
	{ icon: BadgeCheck, t: "Precios competitivos", d: "Mejor relación calidad-precio" },
	{ icon: Truck, t: "Entrega rápida", d: "Despacho local en La Dorada" },
];

const brands = [
	{ name: "Schneider", logo: "/brands/schneider.png" },
	{ name: "Legrand", logo: "/brands/legrand.png" },
	{ name: "Bosch", logo: "/brands/bosch.png" },
	{ name: "Stanley", logo: "/brands/stanley.png" },
	{ name: "Truper", logo: "/brands/truper.png" },
	{ name: "Total", logo: "/brands/total.png" },
	{ name: "DeWalt", logo: "/brands/dewalt.png" },
	{ name: "Pavco", logo: "/brands/pavco.png" },
	{ name: "Sika", logo: "/brands/sika.png" },
	{ name: "Eveready", logo: "/brands/eveready.png" },
	{ name: "Sapolin", logo: "/brands/sapolin.png" },
	{ name: "Midea", logo: "/brands/midea.png" },
	{ name: "Alteza", logo: "/brands/alteza.png" },
	{ name: "KDK", logo: "/brands/kdk.png" },
];

function Home() {
	useEffect(() => {
		const existing = document.querySelector(
			`script[src="${SOCIABLEKIT_REVIEWS_SCRIPT}"]`,
		);
		if (existing) {
			existing.remove();
		}
		const script = document.createElement("script");
		script.src = SOCIABLEKIT_REVIEWS_SCRIPT;
		script.defer = true;
		document.body.appendChild(script);
		return () => {
			script.remove();
		};
	}, []);

	return (
		<>
			{/* HERO */}
			<section className="relative overflow-hidden">
				<div className="absolute inset-0">
					<img
						src={heroImg}
						alt="Ferretería Electroluz"
						width={1920}
						height={1080}
						fetchPriority="high"
						className="h-full w-full object-cover"
					/>
					<div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />
				</div>
				<div className="relative mx-auto max-w-7xl px-4 lg:px-8 py-24 md:py-36">
					<div className="max-w-3xl">
						<span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
							<Zap
								className="h-3.5 w-3.5"
								style={{ color: "var(--brand-yellow)" }}
								fill="currentColor"
							/>
							La Dorada, Caldas
						</span>
						<h1 className="mt-5 text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05]">
							Todo para la{" "}
							<span className="text-gradient-fire">
								construcción, refrigeración, electricidad
							</span>{" "}
							y herramientas eléctricas en un solo lugar
						</h1>
						<p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl">
							Calidad, respaldo y atención personalizada. Cotiza al instante por WhatsApp y recibe
							los mejores precios.
						</p>
						<div className="mt-8 flex flex-wrap gap-3">
							<a
								href={waLink("Hola, me gustaría hacer una cotización")}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-2 rounded-xl px-7 py-4 text-base font-bold text-white shadow-glow hover:scale-[1.02] transition-transform"
								style={{ backgroundColor: "var(--whatsapp)" }}
							>
								<MessageCircle className="h-5 w-5" /> Cotizar por WhatsApp
							</a>
							<Link
								to="/blog"
								className="inline-flex items-center gap-2 rounded-xl px-7 py-4 text-base font-bold text-brand-dark bg-gradient-fire hover:opacity-90"
								style={{ color: "var(--brand-dark)" }}
							>
								Ver productos <ArrowRight className="h-5 w-5" />
							</Link>
						</div>
						<div className="mt-10 flex items-center gap-6 text-white">
							<div className="flex items-center gap-1">
								{RATING_STARS.map((star) => (
									<Star
										key={star}
										className="h-5 w-5"
										style={{ color: "var(--brand-yellow)" }}
										fill="currentColor"
									/>
								))}
							</div>
							<div className="text-sm">
								<strong className="text-2xl font-extrabold">4.6</strong>
								<span className="ml-2 text-white/70">Reputación de nuestros clientes</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* BENEFITS */}
			<section className="py-16 bg-secondary">
				<div className="mx-auto max-w-7xl px-4 lg:px-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{benefits.map((b) => (
						<div
							key={b.t}
							className="rounded-2xl bg-card p-6 shadow-card hover:-translate-y-1 transition-transform"
						>
							<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-fire">
								<b.icon className="h-6 w-6 text-white" />
							</div>
							<h3 className="mt-4 text-lg font-extrabold">{b.t}</h3>
							<p className="mt-1 text-sm text-muted-foreground">{b.d}</p>
						</div>
					))}
				</div>
			</section>

			{/* CATEGORIES */}
			<section className="py-20">
				<div className="mx-auto max-w-7xl px-4 lg:px-8">
					<div className="text-center max-w-2xl mx-auto">
						<span
							className="text-sm font-bold uppercase tracking-widest"
							style={{ color: "var(--brand-orange)" }}
						>
							Categorías
						</span>
						<h2 className="mt-2 text-3xl md:text-5xl font-extrabold">
							Expertos en materiales{" "}
							<span className="text-gradient-fire">eléctricos y construcción</span>
						</h2>
						<p className="mt-4 text-muted-foreground">
							Encuentra todo lo que tu proyecto necesita con la mejor asesoría profesional.
						</p>
					</div>
					<div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
						{categories.map((c) => (
							<Link
								key={c.name}
								to="/productos"
								className="group rounded-2xl border border-border bg-card p-6 shadow-card hover:border-transparent hover:shadow-glow transition-all"
							>
								<div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary group-hover:bg-gradient-fire transition-colors">
									<c.icon className="h-7 w-7 text-primary group-hover:text-white" />
								</div>
								<h3 className="mt-5 font-extrabold text-lg">{c.name}</h3>
								<p className="mt-1.5 text-sm text-muted-foreground">{c.desc}</p>
								<div className="mt-4 inline-flex items-center text-sm font-bold text-primary group-hover:gap-2 gap-1 transition-all">
									Ver más <ArrowRight className="h-4 w-4" />
								</div>
							</Link>
						))}
					</div>
				</div>
			</section>

			{/* REFRIGERACIÓN BANNER */}
			<section className="relative overflow-hidden bg-gradient-hero">
				<div className="mx-auto max-w-7xl px-4 lg:px-8 py-20 grid gap-10 lg:grid-cols-2 items-center">
					<div>
						<span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
							<Snowflake className="h-3.5 w-3.5" style={{ color: "var(--brand-yellow)" }} />{" "}
							Clima y frío
						</span>
						<h2 className="mt-4 text-3xl md:text-5xl font-extrabold text-white">
							Soluciones en <span className="text-gradient-fire">refrigeración</span> para el hogar
							y empresas
						</h2>
						<p className="mt-4 text-white/75 text-lg">
							Equipos, repuestos y accesorios de refrigeración con asesoría experta para tu
							proyecto.
						</p>
						<a
							href={waLink("Hola, me interesa cotizar productos de refrigeración")}
							target="_blank"
							rel="noopener noreferrer"
							className="mt-8 inline-flex items-center gap-2 rounded-xl px-7 py-4 font-bold text-brand-dark bg-gradient-solar hover:opacity-90"
							style={{ color: "var(--brand-dark)" }}
						>
							Cotizar ahora <ArrowRight className="h-5 w-5" />
						</a>
					</div>
					<div className="relative">
						<div className="absolute -inset-4 bg-gradient-fire opacity-30 blur-3xl rounded-full" />
						<img
							src={storefrontImg}
							alt="Ferretería Electroluz — refrigeración"
							loading="lazy"
							width={1600}
							height={900}
							className="relative rounded-2xl shadow-glow"
						/>
					</div>
				</div>
			</section>

			{/* GOOGLE REVIEWS */}
			<section className="py-20">
				<div className="mx-auto max-w-7xl px-4 lg:px-8">
					<div className="text-center max-w-2xl mx-auto">
						<span
							className="text-sm font-bold uppercase tracking-widest"
							style={{ color: "var(--brand-orange)" }}
						>
							Testimonios
						</span>
						<h2 className="mt-2 text-3xl md:text-5xl font-extrabold">
							Lo que dicen nuestros clientes
						</h2>
					</div>
					<div className="mt-12">
						<div
							className="sk-ww-google-reviews"
							data-embed-id={SOCIABLEKIT_EMBED_ID}
						/>
					</div>
				</div>
			</section>

			{/* BRANDS */}
			<section className="py-12 bg-secondary overflow-hidden">
				<div className="mx-auto max-w-7xl px-4 lg:px-8">
					<p className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">
						Marcas que distribuimos
					</p>
				</div>
				<div className="relative">
					<div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-secondary to-transparent md:w-24" />
					<div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-secondary to-transparent md:w-24" />
					<div className="flex w-max items-center animate-brands-marquee hover:[animation-play-state:paused]">
						{[...brands, ...brands].map((b, i) => (
							<div
								key={`${b.name}-${i}`}
								className="mx-7 flex h-14 shrink-0 items-center justify-center md:mx-10 md:h-16"
							>
								<img
									src={b.logo}
									alt={b.name}
									width={160}
									height={64}
									loading="lazy"
									decoding="async"
									className="h-10 w-auto max-w-[9rem] object-contain opacity-85 transition-opacity hover:opacity-100 md:h-12 md:max-w-[10rem]"
								/>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className="py-16">
				<div className="mx-auto max-w-5xl px-4 lg:px-8">
					<div className="rounded-3xl bg-gradient-hero p-10 md:p-14 text-center shadow-glow">
						<Fan className="mx-auto h-12 w-12 text-white opacity-80" />
						<h2 className="mt-4 text-3xl md:text-5xl font-extrabold text-white">
							Todo para tus proyectos en un solo lugar
						</h2>
						<p className="mt-4 text-white/75 max-w-xl mx-auto">
							Contáctanos ahora y recibe una cotización rápida sin compromiso.
						</p>
						<a
							href={waLink()}
							target="_blank"
							rel="noopener noreferrer"
							className="mt-8 inline-flex items-center gap-2 rounded-xl px-8 py-4 font-bold text-white shadow-glow hover:scale-[1.02] transition-transform"
							style={{ backgroundColor: "var(--whatsapp)" }}
						>
							<MessageCircle className="h-5 w-5" /> Cotizar ahora
						</a>
					</div>
				</div>
			</section>
		</>
	);
}
