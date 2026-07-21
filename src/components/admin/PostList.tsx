import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, LoaderCircle, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deletePost, listPosts } from "@/lib/admin-api";
import { getCategoryLabel } from "@/lib/blog-taxonomies";

type Props = {
	onNew: () => void;
	onEdit: (slug: string) => void;
};

function formatDate(value: string | null): string {
	if (!value) return "";
	const d = new Date(`${value}T00:00:00`);
	return Number.isNaN(d.getTime())
		? ""
		: d.toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });
}

export function PostList({ onNew, onEdit }: Props) {
	const queryClient = useQueryClient();
	const posts = useQuery({ queryKey: ["posts"], queryFn: listPosts });

	const remove = useMutation({
		mutationFn: (slug: string) => deletePost(slug),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
			toast.success("Artículo borrado.");
		},
		onError: (err) => toast.error(err instanceof Error ? err.message : "No se pudo borrar."),
	});

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between gap-3">
				<h2 className="text-lg font-extrabold tracking-tight text-foreground">Artículos</h2>
				<Button onClick={onNew} className="font-bold">
					<Plus className="size-4" /> Nuevo artículo
				</Button>
			</div>

			{posts.isLoading ? (
				<div className="grid place-items-center py-16 text-muted-foreground">
					<LoaderCircle className="size-6 animate-spin" />
				</div>
			) : posts.isError ? (
				<p className="rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
					No se pudieron cargar los artículos. ¿Está corriendo el backend PHP?
				</p>
			) : posts.data && posts.data.length > 0 ? (
				<ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-card">
					{posts.data.map((post) => (
						<li key={post.slug} className="flex items-center gap-4 p-4">
							<div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-secondary">
								{post.coverImage ? (
									<img src={post.coverImage} alt="" className="h-full w-full object-cover" />
								) : (
									<div className="h-full w-full bg-gradient-hero" />
								)}
							</div>
							<div className="min-w-0 flex-1">
								<p className="truncate font-bold text-foreground">{post.title}</p>
								<span className="mt-0.5 inline-flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
									<span className="inline-flex items-center gap-1.5">
										<CalendarDays className="size-3.5" />
										{formatDate(post.publishedAt)}
									</span>
									{post.category && (
										<span className="rounded-md bg-secondary px-1.5 py-0.5 font-semibold text-secondary-foreground">
											{getCategoryLabel(post.category)}
										</span>
									)}
								</span>
							</div>
							<div className="flex shrink-0 items-center gap-1">
								<button
									type="button"
									onClick={() => onEdit(post.slug)}
									title="Editar"
									className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
								>
									<Pencil className="size-4" />
								</button>
								<button
									type="button"
									title="Borrar"
									disabled={remove.isPending}
									onClick={() => {
										if (window.confirm(`¿Borrar "${post.title}"? No se puede deshacer.`)) {
											remove.mutate(post.slug);
										}
									}}
									className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
								>
									<Trash2 className="size-4" />
								</button>
							</div>
						</li>
					))}
				</ul>
			) : (
				<div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
					<h3 className="text-lg font-bold text-foreground">Aún no hay artículos</h3>
					<p className="mt-1 text-sm text-muted-foreground">
						Crea el primero con “Nuevo artículo”.
					</p>
				</div>
			)}
		</div>
	);
}
