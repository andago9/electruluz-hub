import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, LoaderCircle } from "lucide-react";
import { getAllPosts, withBase } from "@/lib/blog";
import { buildPageHead } from "@/lib/seo";

export const Route = createFileRoute("/blog/")({
	ssr: false,
	head: () =>
		buildPageHead({
			title: "Blog — Ferretería Electroluz",
			description:
				"Guías, novedades y consejos sobre energía solar, iluminación, construcción y ferretería en La Dorada, Caldas.",
			path: "/blog",
			breadcrumbs: [
				{ name: "Inicio", path: "/" },
				{ name: "Blog", path: "/blog" },
			],
		}),
	component: BlogIndex,
});

function formatDate(value: string | null): string {
	if (!value) return "";
	const date = new Date(`${value}T00:00:00`);
	if (Number.isNaN(date.getTime())) return "";
	return date.toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
}

function BlogIndex() {
	const query = useQuery({ queryKey: ["blog-posts"], queryFn: getAllPosts });
	const posts = query.data ?? [];

	return (
		<>
			<section className="bg-gradient-hero text-white py-20">
				<div className="mx-auto max-w-7xl px-4 lg:px-8">
					<span
						className="text-sm font-bold uppercase tracking-widest"
						style={{ color: "var(--brand-yellow)" }}
					>
						Blog
					</span>
					<h1 className="mt-2 text-4xl md:text-6xl font-extrabold">
						Novedades y <span className="text-gradient-fire">consejos</span>
					</h1>
					<p className="mt-6 max-w-2xl text-lg text-white/80">
						Aprende sobre energía solar, iluminación, construcción y mantén tus proyectos al día.
					</p>
				</div>
			</section>

			<section className="py-20">
				<div className="mx-auto max-w-7xl px-4 lg:px-8">
					{query.isLoading ? (
						<div className="grid place-items-center py-16 text-muted-foreground">
							<LoaderCircle className="size-6 animate-spin" />
						</div>
					) : posts.length === 0 ? (
						<div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
							<h2 className="text-xl font-bold">Todavía no hay artículos</h2>
							<p className="mt-2 text-muted-foreground">
								Pronto publicaremos contenido. Vuelve más tarde.
							</p>
						</div>
					) : (
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{posts.map((post) => (
								<Link
									key={post.slug}
									to="/blog/$slug"
									params={{ slug: post.slug }}
									className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card hover:shadow-glow hover:-translate-y-1 transition-all"
								>
									{post.coverImage ? (
										<img
											src={withBase(post.coverImage)}
											alt={post.title}
											loading="lazy"
											className="aspect-[16/9] w-full object-cover"
										/>
									) : (
										<div className="aspect-[16/9] w-full bg-gradient-hero" />
									)}
									<div className="flex flex-1 flex-col p-6">
										{post.publishedAt && (
											<span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
												<CalendarDays className="h-3.5 w-3.5" />
												{formatDate(post.publishedAt)}
											</span>
										)}
										<h2 className="mt-2 text-lg font-extrabold leading-snug group-hover:text-primary">
											{post.title}
										</h2>
										{post.excerpt && (
											<p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
												{post.excerpt}
											</p>
										)}
										<span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
											Leer más <ArrowRight className="h-4 w-4" />
										</span>
									</div>
								</Link>
							))}
						</div>
					)}
				</div>
			</section>
		</>
	);
}
