import { createFileRoute } from "@tanstack/react-router";
import { Clock, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import heroImg from "@/assets/hero-industrial.jpg";
import { buildPageHead } from "@/lib/seo";
import { SITE, waLink } from "@/lib/site";

export const Route = createFileRoute("/contacto")({
	head: () =>
		buildPageHead({
			title: "Contacto — Ferretería Electroluz, La Dorada",
			description: "Visítanos en Calle 11 #7-52, La Dorada. WhatsApp +57 312 288 1095.",
			path: "/contacto",
			image: heroImg,
			breadcrumbs: [
				{ name: "Inicio", path: "/" },
				{ name: "Contacto", path: "/contacto" },
			],
		}),
	component: Contacto,
});

const schema = z.object({
	name: z.string().trim().min(2, "Ingresa tu nombre").max(100),
	phone: z.string().trim().min(7, "Teléfono inválido").max(20),
	message: z.string().trim().min(5, "Cuéntanos un poco más").max(1000),
});

function Contacto() {
	const [errors, setErrors] = useState<Record<string, string>>({});

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const fd = new FormData(e.currentTarget);
		const data = {
			name: String(fd.get("name") || ""),
			phone: String(fd.get("phone") || ""),
			message: String(fd.get("message") || ""),
		};
		const r = schema.safeParse(data);
		if (!r.success) {
			const errs: Record<string, string> = {};
			r.error.issues.forEach((i) => {
				errs[String(i.path[0])] = i.message;
			});
			setErrors(errs);
			return;
		}
		setErrors({});
		const text = `Hola, soy ${r.data.name} (${r.data.phone}). ${r.data.message}`;
		window.open(waLink(text), "_blank");
	};

	return (
		<>
			<section className="bg-gradient-hero text-white py-20">
				<div className="mx-auto max-w-7xl px-4 lg:px-8">
					<span
						className="text-sm font-bold uppercase tracking-widest"
						style={{ color: "var(--brand-yellow)" }}
					>
						Contacto
					</span>
					<h1 className="mt-2 text-4xl md:text-6xl font-extrabold">
						Estamos para <span className="text-gradient-fire">ayudarte</span>
					</h1>
					<p className="mt-6 max-w-2xl text-lg text-white/80">
						Visítanos, llámanos o escríbenos por WhatsApp. Atención inmediata.
					</p>
				</div>
			</section>

			<section className="py-16">
				<div className="mx-auto max-w-7xl px-4 lg:px-8 grid gap-10 lg:grid-cols-2">
					<div className="space-y-4">
						{[
							{ i: MapPin, t: "Dirección", d: SITE.address },
							{ i: Phone, t: "WhatsApp / Teléfono", d: SITE.phone },
						].map((x) => (
							<div
								key={x.t}
								className="flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-card"
							>
								<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-fire">
									<x.i className="h-6 w-6 text-white" />
								</div>
								<div>
									<div className="font-extrabold">{x.t}</div>
									<div className="text-muted-foreground">{x.d}</div>
								</div>
							</div>
						))}
						<div className="rounded-2xl border border-border bg-card p-5 shadow-card">
							<div className="flex items-center gap-3 mb-3">
								<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-fire">
									<Clock className="h-6 w-6 text-white" />
								</div>
								<div className="font-extrabold">Horarios de atención</div>
							</div>
							<ul className="space-y-1.5 text-sm">
								{SITE.hours.map((h) => (
									<li
										key={h.d}
										className="flex justify-between border-b border-border last:border-0 pb-1.5"
									>
										<span className="text-muted-foreground">{h.d}</span>
										<span className="font-semibold">{h.h}</span>
									</li>
								))}
							</ul>
						</div>
						<a
							href={waLink()}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center justify-center gap-2 rounded-xl px-7 py-4 font-bold text-white shadow-glow"
							style={{ backgroundColor: "var(--whatsapp)" }}
						>
							<MessageCircle className="h-5 w-5" /> Escribir por WhatsApp
						</a>
					</div>

					<form
						onSubmit={onSubmit}
						className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-4"
						noValidate
					>
						<h2 className="text-2xl font-extrabold">Envíanos tu cotización</h2>
						<p className="text-sm text-muted-foreground">
							Completa el formulario y te responderemos al instante por WhatsApp.
						</p>
						{[
							{ n: "name", l: "Nombre completo", t: "text", p: "Tu nombre" },
							{ n: "phone", l: "Teléfono", t: "tel", p: "300 000 0000" },
						].map((f) => (
							<div key={f.n}>
								<label className="block text-sm font-semibold mb-1.5">{f.l}</label>
								<input
									name={f.n}
									type={f.t}
									placeholder={f.p}
									className="w-full rounded-lg border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-ring"
								/>
								{errors[f.n] && <p className="mt-1 text-xs text-destructive">{errors[f.n]}</p>}
							</div>
						))}
						<div>
							<label className="block text-sm font-semibold mb-1.5">¿Qué necesitas cotizar?</label>
							<textarea
								name="message"
								rows={4}
								placeholder="Describe los productos o servicios que necesitas..."
								className="w-full rounded-lg border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-ring resize-none"
							/>
							{errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
						</div>
						<button
							type="submit"
							className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-7 py-4 font-bold text-white bg-gradient-fire hover:opacity-90"
						>
							<Send className="h-5 w-5" /> Enviar cotización
						</button>
					</form>
				</div>
			</section>

			<section className="pb-20">
				<div className="mx-auto max-w-7xl px-4 lg:px-8">
					<div className="overflow-hidden rounded-2xl shadow-card border border-border">
						<iframe
							title="Ubicación Ferretería Electroluz"
							src="https://www.google.com/maps?q=Calle+11+%237-52,+La+Dorada,+Caldas&output=embed"
							width="100%"
							height="420"
							loading="lazy"
							referrerPolicy="no-referrer-when-downgrade"
							style={{ border: 0 }}
						/>
					</div>
				</div>
			</section>
		</>
	);
}
