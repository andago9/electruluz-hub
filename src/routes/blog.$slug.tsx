import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, LoaderCircle } from "lucide-react";
import { MarkdocContent } from "@/components/MarkdocContent";
import { getPostBySlug, withBase } from "@/lib/blog";
import { buildPageHead } from "@/lib/seo";

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
					{post.publishedAt && (
						<span className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
							<CalendarDays className="h-4 w-4" />
							{formatDate(post.publishedAt)}
						</span>
					)}
					<h1 className="mt-3 text-3xl md:text-5xl font-extrabold leading-tight">{post.title}</h1>
					{post.excerpt && <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>}
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
			</div>
		</article>
	);
}
