import { Link } from "@tanstack/react-router";
import { Menu, Phone, X } from "lucide-react";
import { useState } from "react";
import logoImg from "@/assets/Horizotal-Logo.jpg";
import { SITE, waLink } from "@/lib/site";

const nav = [
	{ to: "/", label: "Inicio" },
	{ to: "/nosotros", label: "Nosotros" },
	{ to: "/productos", label: "Productos" },
	{ to: "/energia-solar", label: "Energía Solar" },
	{ to: "/blog", label: "Blog" },
	{ to: "/contacto", label: "Contacto" },
];

export function Header() {
	const [open, setOpen] = useState(false);
	return (
		<header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-lg">
			<div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
				<Link to="/" className="group shrink-0">
					<img
						src={logoImg}
						alt="Ferretería Electroluz — Más cerca a su obra"
						width={220}
						height={56}
						className="h-10 w-auto transition-transform group-hover:scale-[1.02] sm:h-11"
						draggable={false}
					/>
				</Link>

				<nav className="hidden lg:flex items-center gap-1">
					{nav.map((n) => (
						<Link
							key={n.to}
							to={n.to}
							className="px-4 py-2 text-sm font-semibold text-foreground/80 hover:text-foreground rounded-md hover:bg-secondary transition-colors"
							activeProps={{
								className: "px-4 py-2 text-sm font-semibold rounded-md text-primary bg-secondary",
							}}
							activeOptions={{ exact: true }}
						>
							{n.label}
						</Link>
					))}
				</nav>

				<div className="hidden lg:flex items-center gap-2">
					<a
						href={`tel:${SITE.phoneRaw}`}
						className="inline-flex items-center gap-2 text-sm font-semibold text-foreground/80 hover:text-primary"
					>
						<Phone className="h-4 w-4" /> {SITE.phone}
					</a>
					<a
						href={waLink()}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold text-white shadow-glow hover:opacity-90"
						style={{ backgroundColor: "var(--whatsapp)" }}
					>
						WhatsApp
					</a>
				</div>

				<button
					type="button"
					onClick={() => setOpen(!open)}
					className="lg:hidden p-2"
					aria-label="Menú"
				>
					{open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
				</button>
			</div>
			{open && (
				<div className="lg:hidden border-t border-border bg-background">
					<nav className="flex flex-col p-4 gap-1">
						{nav.map((n) => (
							<Link
								key={n.to}
								to={n.to}
								onClick={() => setOpen(false)}
								className="px-4 py-3 rounded-md font-semibold hover:bg-secondary"
								activeProps={{
									className: "px-4 py-3 rounded-md font-semibold bg-secondary text-primary",
								}}
								activeOptions={{ exact: true }}
							>
								{n.label}
							</Link>
						))}
						<a
							href={waLink()}
							target="_blank"
							rel="noopener noreferrer"
							className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 font-bold text-white"
							style={{ backgroundColor: "var(--whatsapp)" }}
						>
							WhatsApp ahora
						</a>
					</nav>
				</div>
			)}
		</header>
	);
}
