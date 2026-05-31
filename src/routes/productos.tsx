import { createFileRoute } from "@tanstack/react-router";
import {
	Cable,
	Droplets,
	Fan,
	Gauge,
	Hammer,
	Layers,
	Lightbulb,
	MessageCircle,
	PaintBucket,
	Shield,
	Sun,
	Zap,
} from "lucide-react";
import logoImg from "@/assets/Horizotal-Logo.jpg";
import { buildPageHead } from "@/lib/seo";
import { waLink } from "@/lib/site";

export const Route = createFileRoute("/productos")({
	head: () =>
		buildPageHead({
			title: "Productos y Servicios — Ferretería Electroluz",
			description:
				"Materiales eléctricos, herramientas, drywall, pintura, PVC, energía solar, seguridad industrial y más en La Dorada.",
			path: "/productos",
			image: logoImg,
			breadcrumbs: [
				{ name: "Inicio", path: "/" },
				{ name: "Productos", path: "/productos" },
			],
		}),
	component: Productos,
});

const items = [
	{
		i: Cable,
		t: "Materiales eléctricos",
		d: "Tomas, interruptores, breakers, canaletas y todo lo necesario para instalaciones residenciales e industriales.",
	},
	{
		i: Gauge,
		t: "Cables y contadores",
		d: "Cable encauchetado, THHN, THW y contadores de energía certificados.",
	},
	{
		i: Lightbulb,
		t: "Bombillería LED",
		d: "Iluminación LED de alta eficiencia para hogar, comercio y exteriores.",
	},
	{
		i: Hammer,
		t: "Herramientas eléctricas y manuales",
		d: "Taladros, pulidoras, soldadores y herramientas profesionales de marcas reconocidas.",
	},
	{
		i: Layers,
		t: "Drywall y Superboard",
		d: "Láminas, perfiles, masilla y accesorios para acabados modernos.",
	},
	{
		i: PaintBucket,
		t: "Pinturas y acabados",
		d: "Vinilos, esmaltes, anticorrosivos y acabados decorativos.",
	},
	{
		i: Droplets,
		t: "PVC y grifería",
		d: "Tubería sanitaria, presión, accesorios y grifería para baño y cocina.",
	},
	{ i: Sun, t: "Energía solar", d: "Paneles, inversores, baterías e instalación profesional." },
	{ i: Shield, t: "Seguridad industrial", d: "EPP, cascos, guantes, botas y dotación completa." },
	{
		i: Zap,
		t: "Cercas eléctricas",
		d: "Equipos energizadores, aisladores, alambre y servicio de instalación.",
	},
	{ i: Fan, t: "Ventiladores de techo", d: "Variedad de modelos modernos para hogar y oficina." },
];

function Productos() {
	return (
		<>
			<section className="bg-gradient-hero text-white py-20">
				<div className="mx-auto max-w-7xl px-4 lg:px-8">
					<span
						className="text-sm font-bold uppercase tracking-widest"
						style={{ color: "var(--brand-yellow)" }}
					>
						Productos y servicios
					</span>
					<h1 className="mt-2 text-4xl md:text-6xl font-extrabold">
						Todo para tus proyectos en <span className="text-gradient-fire">un solo lugar</span>
					</h1>
					<p className="mt-6 max-w-2xl text-lg text-white/80">
						Catálogo completo con asesoría profesional. Cotiza al instante por WhatsApp.
					</p>
				</div>
			</section>

			<section className="py-20">
				<div className="mx-auto max-w-7xl px-4 lg:px-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{items.map((x) => (
						<div
							key={x.t}
							className="group rounded-2xl border border-border bg-card p-6 shadow-card hover:shadow-glow hover:-translate-y-1 transition-all"
						>
							<div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary group-hover:bg-gradient-fire transition-colors">
								<x.i className="h-7 w-7 text-primary group-hover:text-white" />
							</div>
							<h3 className="mt-5 font-extrabold text-lg">{x.t}</h3>
							<p className="mt-2 text-sm text-muted-foreground">{x.d}</p>
							<a
								href={waLink(`Hola, quisiera información sobre ${x.t}`)}
								target="_blank"
								rel="noopener noreferrer"
								className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
							>
								<MessageCircle className="h-4 w-4" /> Cotizar
							</a>
						</div>
					))}
				</div>
			</section>
		</>
	);
}
