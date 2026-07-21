import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, LoaderCircle } from "lucide-react";
import { getAllPosts, withBase } from "@/lib/blog";
import {
	BLOG_CATEGORIES,
	countPostsByCategory,
	getCategoryLabel,
	isBlogCategorySlug,
} from "@/lib/blog-taxonomies";
import { buildPageHead } from "@/lib/seo";

type BlogSearch = {
	categoria?: string;
};

export const Route = createFileRoute("/blog/")({
	ssr: false,
	validateSearch: (search: Record<string, unknown>): BlogSearch => {
		const raw = search.categoria;
		if (typeof raw === "string" && isBlogCategorySlug(raw)) {
			return { categoria: raw };
		}
		return {};
	},
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
	const { categoria } = Route.useSearch();
	const navigate = Route.useNavigate();
	const query = useQuery({ queryKey: ["blog-posts"], queryFn: getAllPosts });
	const posts = query.data ?? [];
	const counts = countPostsByCategory(posts);
	const filtered = categoria ? posts.filter((p) => p.category === categoria) : posts;

	const sidebarItems = BLOG_CATEGORIES.filter((c) => (counts[c.slug] ?? 0) > 0).map((c) => ({
		slug: c.slug,
		label: c.label,
		count: counts[c.slug] ?? 0,
	}));

	function setCategoria(next: string | undefined) {
		void navigate({
			to: "/blog",
			search: next ? { categoria: next } : {},
		});
	}

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
						<div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
							<aside className="lg:w-64 shrink-0">
								{/* Móvil: chips horizontales */}
								<div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
									<button
										type="button"
										onClick={() => setCategoria(undefined)}
										className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
											!categoria
												? "bg-primary text-primary-foreground"
												: "bg-secondary text-secondary-foreground hover:bg-secondary/80"
										}`}
									>
										Todos {posts.length}
									</button>
									{sidebarItems.map((item) => (
										<button
											key={item.slug}
											type="button"
											onClick={() => setCategoria(item.slug)}
											className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
												categoria === item.slug
													? "bg-primary text-primary-foreground"
													: "bg-secondary text-secondary-foreground hover:bg-secondary/80"
											}`}
										>
											{item.label} {item.count}
										</button>
									))}
								</div>

								{/* Desktop: lista vertical */}
								<nav className="hidden lg:block" aria-label="Categorías del blog">
									<h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
										Categorías
									</h2>
									<ul className="mt-4 space-y-1">
										<li>
											<button
												type="button"
												onClick={() => setCategoria(undefined)}
												className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
													!categoria
														? "bg-primary text-primary-foreground"
														: "text-foreground hover:bg-secondary"
												}`}
											>
												<span>Todos</span>
												<span className={!categoria ? "opacity-90" : "text-muted-foreground"}>
													{posts.length}
												</span>
											</button>
										</li>
										{sidebarItems.map((item) => (
											<li key={item.slug}>
												<button
													type="button"
													onClick={() => setCategoria(item.slug)}
													className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
														categoria === item.slug
															? "bg-primary text-primary-foreground"
															: "text-foreground hover:bg-secondary"
													}`}
												>
													<span>{item.label}</span>
													<span
														className={
															categoria === item.slug ? "opacity-90" : "text-muted-foreground"
														}
													>
														{item.count}
													</span>
												</button>
											</li>
										))}
									</ul>
								</nav>
							</aside>

							<div className="min-w-0 flex-1">
								{filtered.length === 0 ? (
									<div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
										<h2 className="text-xl font-bold">No hay artículos en esta categoría</h2>
										<p className="mt-2 text-muted-foreground">
											Prueba otra categoría o vuelve a ver todos.
										</p>
									</div>
								) : (
									<div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
										{filtered.map((post) => (
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
													<div className="flex flex-wrap items-center gap-2">
														{post.category && (
															<span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-bold text-secondary-foreground">
																{getCategoryLabel(post.category)}
															</span>
														)}
														{post.publishedAt && (
															<span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
																<CalendarDays className="h-3.5 w-3.5" />
																{formatDate(post.publishedAt)}
															</span>
														)}
													</div>
													<h2 className="mt-2 text-lg font-extrabold leading-snug group-hover:text-primary">
														{post.title}
													</h2>
													{post.excerpt && (
														<p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
															{post.excerpt}
														</p>
													)}
													{post.tags.length > 0 && (
														<div className="mt-3 flex flex-wrap gap-1.5">
															{post.tags.map((tag) => (
																<span
																	key={tag}
																	className="text-xs font-medium text-muted-foreground"
																>
																	#{tag}
																</span>
															))}
														</div>
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
						</div>
					)}
				</div>
			</section>
		</>
	);
}
