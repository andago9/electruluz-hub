import { createFileRoute } from "@tanstack/react-router";
import { Award, MapPin, Target, Users } from "lucide-react";
import storeImg from "@/assets/store-interior.jpg";
import { buildPageHead } from "@/lib/seo";

export const Route = createFileRoute("/nosotros")({
	head: () =>
		buildPageHead({
			title: "Nosotros — Ferretería Electroluz",
			description:
				"Más de una década sirviendo a La Dorada y la región con materiales de calidad y atención personalizada.",
			path: "/nosotros",
			image: storeImg,
			breadcrumbs: [
				{ name: "Inicio", path: "/" },
				{ name: "Nosotros", path: "/nosotros" },
			],
		}),
	component: Nosotros,
});

function Nosotros() {
	return (
		<>
			<section className="bg-gradient-hero text-white py-20">
				<div className="mx-auto max-w-7xl px-4 lg:px-8">
					<span
						className="text-sm font-bold uppercase tracking-widest"
						style={{ color: "var(--brand-yellow)" }}
					>
						Nosotros
					</span>
					<h1 className="mt-2 text-4xl md:text-6xl font-extrabold">
						Calidad, respaldo y <span className="text-gradient-fire">atención personalizada</span>
					</h1>
					<p className="mt-6 max-w-2xl text-lg text-white/80">
						Somos Ferretería Electroluz, una empresa local comprometida con el desarrollo de La
						Dorada y sus alrededores.
					</p>
				</div>
			</section>

			<section className="py-20">
				<div className="mx-auto max-w-7xl px-4 lg:px-8 grid gap-12 lg:grid-cols-2 items-center">
					<img
						src={storeImg}
						alt="Tienda Electroluz"
						loading="lazy"
						width={1600}
						height={900}
						className="rounded-2xl shadow-card"
					/>
					<div>
						<h2 className="text-3xl md:text-4xl font-extrabold">Nuestra historia</h2>
						<p className="mt-4 text-muted-foreground text-lg">
							Nacimos con el propósito de ofrecer a nuestra comunidad una ferretería moderna donde
							encontrar todo en un solo lugar: desde un tornillo hasta un sistema completo de
							energía solar.
						</p>
						<p className="mt-4 text-muted-foreground text-lg">
							Hoy somos referente en La Dorada, Caldas, gracias a la confianza de cientos de
							clientes constructores, electricistas, empresas y hogares.
						</p>
					</div>
				</div>
			</section>

			<section className="py-16 bg-secondary">
				<div className="mx-auto max-w-7xl px-4 lg:px-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{[
						{
							i: Award,
							t: "Experiencia",
							d: "Años de trayectoria en el sector ferretero y eléctrico.",
						},
						{
							i: Users,
							t: "Atención cercana",
							d: "Asesoría real, humana y técnica para tu proyecto.",
						},
						{ i: Target, t: "Compromiso", d: "Cumplimos con calidad, tiempos y promesas." },
						{ i: MapPin, t: "Cobertura local", d: "La Dorada, Caldas y municipios cercanos." },
					].map((x) => (
						<div key={x.t} className="rounded-2xl bg-card p-6 shadow-card">
							<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-fire">
								<x.i className="h-6 w-6 text-white" />
							</div>
							<h3 className="mt-4 text-lg font-extrabold">{x.t}</h3>
							<p className="mt-1 text-sm text-muted-foreground">{x.d}</p>
						</div>
					))}
				</div>
			</section>
		</>
	);
}
