import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, LoaderCircle, MessageCircle } from "lucide-react";
import { MarkdocContent } from "@/components/MarkdocContent";
import { getPostBySlug, withBase } from "@/lib/blog";
import { getCategoryLabel, isBlogCategorySlug } from "@/lib/blog-taxonomies";
import { buildPageHead } from "@/lib/seo";
import { waLink } from "@/lib/site";

export const Route = createFileRoute("/blog/$slug")({
	ssr: false,
	// El SEO real de cada post lo genera blog.php en el servidor (producción).
	// Este head es un respaldo genérico para la navegación en el cliente.
	head: ({ params }) =>
		buildPageHead({
			title: "Artículo — Blog Electroluz",
			description: "Artículo del blog de Ferretería Electroluz, La Dorada, Caldas.",
			path: `/blog/${params.slug}`,
			breadcrumbs: [
				{ name: "Inicio", path: "/" },
				{ name: "Blog", path: "/blog" },
			],
		}),
	component: BlogPost,
});

function formatDate(value: string | null): string {
	if (!value) return "";
	const date = new Date(`${value}T00:00:00`);
	if (Number.isNaN(date.getTime())) return "";
	return date.toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
}

function BlogPost() {
	const { slug } = Route.useParams();
	const query = useQuery({
		queryKey: ["blog-post", slug],
		queryFn: () => getPostBySlug(slug),
	});

	if (query.isLoading) {
		return (
			<section className="grid min-h-[50vh] place-items-center text-muted-foreground">
				<LoaderCircle className="size-6 animate-spin" />
			</section>
		);
	}

	const post = query.data;
	if (!post) {
		return (
			<section className="py-24">
				<div className="mx-auto max-w-2xl px-4 text-center lg:px-8">
					<h1 className="text-3xl font-extrabold">Artículo no encontrado</h1>
					<p className="mt-3 text-muted-foreground">
						El artículo que buscas no existe o fue movido.
					</p>
					<Link
						to="/blog"
						className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90"
					>
						<ArrowLeft className="h-4 w-4" /> Volver al blog
					</Link>
				</div>
			</section>
		);
	}

	return (
		<article className="py-16">
			<div className="mx-auto max-w-3xl px-4 lg:px-8">
				<Link
					to="/blog"
					className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"
				>
					<ArrowLeft className="h-4 w-4" /> Volver al blog
				</Link>

				<header className="mt-6">
					<div className="flex flex-wrap items-center gap-2">
						{post.category && (
							<Link
								to="/blog"
								search={
									isBlogCategorySlug(post.category)
										? { categoria: post.category }
										: {}
								}
								className="rounded-md bg-secondary px-2.5 py-1 text-xs font-bold text-secondary-foreground hover:bg-secondary/80"
							>
								{getCategoryLabel(post.category)}
							</Link>
						)}
						{post.publishedAt && (
							<span className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
								<CalendarDays className="h-4 w-4" />
								{formatDate(post.publishedAt)}
							</span>
						)}
					</div>
					<h1 className="mt-3 text-3xl md:text-5xl font-extrabold leading-tight">{post.title}</h1>
					{post.excerpt && <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>}
					{post.tags.length > 0 && (
						<div className="mt-4 flex flex-wrap gap-2">
							{post.tags.map((tag) => (
								<span
									key={tag}
									className="rounded-md border border-border px-2 py-0.5 text-xs font-medium text-muted-foreground"
								>
									#{tag}
								</span>
							))}
						</div>
					)}
				</header>

				{post.coverImage && (
					<img
						src={withBase(post.coverImage)}
						alt={post.title}
						className="mt-8 aspect-[16/9] w-full rounded-2xl object-cover shadow-card"
					/>
				)}

				<div className="mt-10">
					<MarkdocContent body={post.body} />
				</div>

				<div className="mt-10 flex justify-end border-t border-border pt-8">
					<a
						href={waLink(`Hola, quiero comprar: ${post.title}`)}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-bold text-white shadow-glow hover:opacity-90"
						style={{ backgroundColor: "var(--whatsapp)" }}
					>
						<MessageCircle className="h-5 w-5" /> Comprar por WhatsApp
					</a>
				</div>
			</div>
		</article>
	);
}
