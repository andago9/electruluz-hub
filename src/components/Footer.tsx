import { Link } from "@tanstack/react-router";
import { Clock, MapPin, Phone } from "lucide-react";
import faviconWhite from "@/assets/Favicon_white.svg";
import { SITE } from "@/lib/site";

export function Footer() {
	return (
		<footer className="bg-brand-dark text-white" style={{ backgroundColor: "var(--brand-dark)" }}>
			<div className="mx-auto max-w-7xl px-4 lg:px-8 py-14 grid gap-10 md:grid-cols-4">
				<div>
					<div className="flex items-center gap-2.5 mb-4">
						<img
							src={faviconWhite}
							alt=""
							width={40}
							height={40}
							className="h-10 w-10 shrink-0"
							draggable={false}
							aria-hidden
						/>
						<div className="font-extrabold text-lg">Ferreteria Electroluz</div>
					</div>
					<p className="text-sm text-white/70">
						Todo para construcción, electricidad y energía solar en La Dorada, Caldas.
					</p>
				</div>
				<div>
					<h4
						className="font-bold mb-3 text-sm uppercase tracking-wider"
						style={{ color: "var(--brand-yellow)" }}
					>
						Navegación
					</h4>
					<ul className="space-y-2 text-sm text-white/80">
						<li>
							<Link to="/" className="hover:text-white">
								Inicio
							</Link>
						</li>
						<li>
							<Link to="/nosotros" className="hover:text-white">
								Nosotros
							</Link>
						</li>
						<li>
							<Link to="/productos" className="hover:text-white">
								Productos
							</Link>
						</li>
						<li>
							<Link to="/energia-solar" className="hover:text-white">
								Energía Solar
							</Link>
						</li>
						<li>
							<Link to="/contacto" className="hover:text-white">
								Contacto
							</Link>
						</li>
					</ul>
				</div>
				<div>
					<h4
						className="font-bold mb-3 text-sm uppercase tracking-wider"
						style={{ color: "var(--brand-yellow)" }}
					>
						Contacto
					</h4>
					<ul className="space-y-2.5 text-sm text-white/80">
						<li className="flex gap-2">
							<MapPin className="h-4 w-4 mt-0.5 shrink-0" /> {SITE.address}
						</li>
						<li className="flex gap-2">
							<Phone className="h-4 w-4 mt-0.5 shrink-0" /> {SITE.phone}
						</li>
					</ul>
				</div>
				<div>
					<h4
						className="font-bold mb-3 text-sm uppercase tracking-wider"
						style={{ color: "var(--brand-yellow)" }}
					>
						Horarios
					</h4>
					<ul className="space-y-2 text-sm text-white/80">
						{SITE.hours.map((h) => (
							<li key={h.d} className="flex gap-2">
								<Clock className="h-4 w-4 mt-0.5 shrink-0" />
								<span>
									<strong className="text-white">{h.d}:</strong> {h.h}
								</span>
							</li>
						))}
					</ul>
				</div>
			</div>
			<div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
				© {new Date().getFullYear()} Ferretería Electroluz. Todos los derechos reservados.
			</div>
		</footer>
	);
}
