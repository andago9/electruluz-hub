import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ImagePlus, LoaderCircle, Trash2, X } from "lucide-react";
import {
	type FormEvent,
	type KeyboardEvent,
	type ReactNode,
	type RefObject,
	useEffect,
	useRef,
	useState,
} from "react";
import { toast } from "sonner";
import { MarkdownToolbar } from "@/components/admin/MarkdownToolbar";
import { MarkdocContent } from "@/components/MarkdocContent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { getPost, type PostInput, savePost, uploadImage } from "@/lib/admin-api";
import { BLOG_CATEGORIES, normalizeTag } from "@/lib/blog-taxonomies";

type Props = {
	slug: string | null; // null = nuevo
	onDone: () => void;
};

const today = () => new Date().toISOString().slice(0, 10);

export function PostEditor({ slug, onDone }: Props) {
	const queryClient = useQueryClient();
	const isNew = slug === null;

	const [title, setTitle] = useState("");
	const [publishedAt, setPublishedAt] = useState(today());
	const [excerpt, setExcerpt] = useState("");
	const [coverImage, setCoverImage] = useState<string | null>(null);
	const [category, setCategory] = useState("");
	const [tags, setTags] = useState<string[]>([]);
	const [tagDraft, setTagDraft] = useState("");
	const [body, setBody] = useState("");
	const [uploadingCover, setUploadingCover] = useState(false);
	const bodyRef = useRef<HTMLTextAreaElement>(null);
	const coverInputRef = useRef<HTMLInputElement>(null);

	const existing = useQuery({
		queryKey: ["post", slug],
		queryFn: () => getPost(slug as string),
		enabled: !isNew,
	});

	useEffect(() => {
		const p = existing.data;
		if (p) {
			setTitle(p.title);
			setPublishedAt(p.publishedAt ?? today());
			setExcerpt(p.excerpt);
			setCoverImage(p.coverImage);
			setCategory(p.category ?? "");
			setTags(p.tags ?? []);
			setBody(p.body);
		}
	}, [existing.data]);

	const save = useMutation({
		mutationFn: (payload: { tags: string[] }) => {
			const input: PostInput = {
				title,
				publishedAt,
				excerpt,
				coverImage,
				category,
				tags: payload.tags,
				body,
			};
			if (!isNew) input.slug = slug as string;
			return savePost(input);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
			toast.success(isNew ? "Artículo publicado." : "Cambios guardados.");
			onDone();
		},
		onError: (err) => toast.error(err instanceof Error ? err.message : "No se pudo guardar."),
	});

	async function handleCover(file: File) {
		setUploadingCover(true);
		try {
			setCoverImage(await uploadImage(file));
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "No se pudo subir la imagen.");
		} finally {
			setUploadingCover(false);
			if (coverInputRef.current) coverInputRef.current.value = "";
		}
	}

	function mergeTagsFromDraft(current: string[], draft: string): string[] {
		const parts = draft.split(",").map((p) => p.trim()).filter(Boolean);
		if (parts.length === 0) return current;
		const next = [...current];
		for (const part of parts) {
			const normalized = normalizeTag(part);
			if (normalized && !next.includes(normalized)) next.push(normalized);
		}
		return next;
	}

	function addTagFromDraft() {
		if (!tagDraft.trim()) return;
		setTags(mergeTagsFromDraft(tags, tagDraft));
		setTagDraft("");
	}

	function handleTagKeyDown(e: KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter" || e.key === ",") {
			e.preventDefault();
			addTagFromDraft();
		} else if (e.key === "Backspace" && tagDraft === "" && tags.length > 0) {
			setTags((prev) => prev.slice(0, -1));
		}
	}

	function handleSubmit(e: FormEvent) {
		e.preventDefault();
		if (!title.trim()) {
			toast.error("El título es obligatorio.");
			return;
		}
		if (!category) {
			toast.error("Elige una categoría.");
			return;
		}
		const finalTags = mergeTagsFromDraft(tags, tagDraft);
		if (tagDraft.trim()) {
			setTags(finalTags);
			setTagDraft("");
		}
		if (!save.isPending) save.mutate({ tags: finalTags });
	}

	if (!isNew && existing.isLoading) {
		return (
			<div className="grid place-items-center py-20 text-muted-foreground">
				<LoaderCircle className="size-6 animate-spin" />
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="flex items-center justify-between gap-3">
				<button
					type="button"
					onClick={onDone}
					className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
				>
					<ArrowLeft className="size-4" /> Volver
				</button>
				<Button type="submit" disabled={save.isPending} className="font-bold">
					{save.isPending && <LoaderCircle className="size-4 animate-spin" />}
					{isNew ? "Publicar" : "Guardar cambios"}
				</Button>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				{/* Columna de campos */}
				<div className="space-y-4">
					<Field label="Título">
						<Input
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="Título del artículo"
						/>
					</Field>

					<Field label="Fecha de publicación">
						<Input
							type="date"
							value={publishedAt}
							onChange={(e) => setPublishedAt(e.target.value)}
						/>
					</Field>

					<Field label="Categoría">
						<Select value={category || undefined} onValueChange={setCategory}>
							<SelectTrigger>
								<SelectValue placeholder="Elige una categoría" />
							</SelectTrigger>
							<SelectContent>
								{BLOG_CATEGORIES.map((c) => (
									<SelectItem key={c.slug} value={c.slug}>
										{c.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</Field>

					<Field label="Tags">
						<div className="space-y-2">
							{tags.length > 0 && (
								<div className="flex flex-wrap gap-1.5">
									{tags.map((tag) => (
										<span
											key={tag}
											className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground"
										>
											{tag}
											<button
												type="button"
												onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}
												className="rounded-sm opacity-70 hover:opacity-100"
												aria-label={`Quitar ${tag}`}
											>
												<X className="size-3" />
											</button>
										</span>
									))}
								</div>
							)}
							<Input
								value={tagDraft}
								onChange={(e) => setTagDraft(e.target.value)}
								onKeyDown={handleTagKeyDown}
								onBlur={() => {
									if (tagDraft.trim()) addTagFromDraft();
								}}
								placeholder="Escribe y pulsa Enter o coma"
							/>
							<p className="text-xs text-muted-foreground">Opcional. Se guardan en minúsculas con guiones.</p>
						</div>
					</Field>

					<Field label="Resumen">
						<textarea
							value={excerpt}
							onChange={(e) => setExcerpt(e.target.value)}
							rows={2}
							maxLength={280}
							placeholder="Texto corto para el listado y buscadores."
							className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
						/>
					</Field>

					<Field label="Imagen de portada">
						<CoverField
							coverImage={coverImage}
							uploading={uploadingCover}
							inputRef={coverInputRef}
							onPick={() => coverInputRef.current?.click()}
							onFile={handleCover}
							onRemove={() => setCoverImage(null)}
						/>
					</Field>

					<Field label="Contenido">
						<MarkdownToolbar
							textareaRef={bodyRef}
							value={body}
							onChange={setBody}
							onError={(m) => toast.error(m)}
						/>
						<textarea
							ref={bodyRef}
							value={body}
							onChange={(e) => setBody(e.target.value)}
							rows={16}
							placeholder="Escribe el artículo en Markdown…"
							className="w-full rounded-b-lg border border-input bg-transparent px-3 py-2 font-mono text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
						/>
					</Field>
				</div>

				{/* Columna de vista previa */}
				<div className="space-y-2">
					<span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
						Vista previa
					</span>
					<div className="rounded-2xl border border-border bg-card p-6 shadow-card">
						<h1 className="text-2xl font-extrabold tracking-tight text-foreground text-balance">
							{title || "Título del artículo"}
						</h1>
						{coverImage && (
							<img
								src={coverImage}
								alt=""
								className="mt-4 aspect-[16/9] w-full rounded-xl object-cover"
							/>
						)}
						<div className="mt-4">
							{body.trim() ? (
								<MarkdocContent body={body} />
							) : (
								<p className="text-sm text-muted-foreground">La vista previa aparecerá aquí…</p>
							)}
						</div>
					</div>
				</div>
			</div>
		</form>
	);
}

function Field({ label, children }: { label: string; children: ReactNode }) {
	return (
		<label className="block space-y-1.5">
			<span className="text-sm font-semibold text-foreground">{label}</span>
			{children}
		</label>
	);
}

function CoverField({
	coverImage,
	uploading,
	inputRef,
	onPick,
	onFile,
	onRemove,
}: {
	coverImage: string | null;
	uploading: boolean;
	inputRef: RefObject<HTMLInputElement | null>;
	onPick: () => void;
	onFile: (file: File) => void;
	onRemove: () => void;
}) {
	return (
		<div>
			{coverImage ? (
				<div className="relative overflow-hidden rounded-xl border border-border">
					<img src={coverImage} alt="Portada" className="aspect-[16/9] w-full object-cover" />
					<button
						type="button"
						onClick={onRemove}
						className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-md bg-background/90 px-2 py-1 text-xs font-semibold text-destructive shadow hover:bg-background"
					>
						<Trash2 className="size-3.5" /> Quitar
					</button>
				</div>
			) : (
				<button
					type="button"
					onClick={onPick}
					disabled={uploading}
					className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-input text-muted-foreground transition-colors hover:border-primary hover:text-primary"
				>
					{uploading ? (
						<LoaderCircle className="size-5 animate-spin" />
					) : (
						<>
							<ImagePlus className="size-5" />
							<span className="text-sm font-medium">Subir portada</span>
						</>
					)}
				</button>
			)}
			<input
				ref={inputRef}
				type="file"
				accept="image/*"
				className="hidden"
				onChange={(e) => {
					const f = e.target.files?.[0];
					if (f) onFile(f);
				}}
			/>
		</div>
	);
}
