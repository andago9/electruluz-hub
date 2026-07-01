import {
	Bold,
	Heading2,
	Heading3,
	Image as ImageIcon,
	Italic,
	Link as LinkIcon,
	List,
	LoaderCircle,
	Quote,
} from "lucide-react";
import { type RefObject, useRef, useState } from "react";
import { uploadImage } from "@/lib/admin-api";

type Props = {
	textareaRef: RefObject<HTMLTextAreaElement | null>;
	value: string;
	onChange: (next: string) => void;
	onError: (message: string) => void;
};

/** Aplica una transformación al textarea manteniendo el foco y la selección. */
function useTextareaActions(
	textareaRef: RefObject<HTMLTextAreaElement | null>,
	value: string,
	onChange: (next: string) => void,
) {
	function replaceSelection(transform: (selected: string) => string, selectAll = true) {
		const el = textareaRef.current;
		if (!el) return;
		const start = el.selectionStart;
		const end = el.selectionEnd;
		const selected = value.slice(start, end);
		const replacement = transform(selected);
		const next = value.slice(0, start) + replacement + value.slice(end);
		onChange(next);
		requestAnimationFrame(() => {
			el.focus();
			const caret = selectAll ? start + replacement.length : start + replacement.length;
			el.setSelectionRange(caret, caret);
		});
	}

	const wrap = (token: string, placeholder: string) =>
		replaceSelection((s) => `${token}${s || placeholder}${token}`);

	const linePrefix = (prefix: string, placeholder: string) =>
		replaceSelection((s) => {
			const text = s || placeholder;
			return text
				.split("\n")
				.map((line) => `${prefix}${line}`)
				.join("\n");
		});

	const insert = (text: string) => replaceSelection(() => text);

	return { wrap, linePrefix, insert };
}

export function MarkdownToolbar({ textareaRef, value, onChange, onError }: Props) {
	const { wrap, linePrefix, insert } = useTextareaActions(textareaRef, value, onChange);
	const fileRef = useRef<HTMLInputElement>(null);
	const [uploading, setUploading] = useState(false);

	async function handleFile(file: File) {
		setUploading(true);
		try {
			const url = await uploadImage(file);
			insert(`![${file.name.replace(/\.[^.]+$/, "")}](${url})`);
		} catch (err) {
			onError(err instanceof Error ? err.message : "No se pudo subir la imagen.");
		} finally {
			setUploading(false);
			if (fileRef.current) fileRef.current.value = "";
		}
	}

	const btn =
		"inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground";

	return (
		<div className="flex flex-wrap items-center gap-1 rounded-t-lg border border-b-0 border-input bg-muted/40 p-1.5">
			<button type="button" className={btn} title="Negrita" onClick={() => wrap("**", "negrita")}>
				<Bold className="size-4" />
			</button>
			<button type="button" className={btn} title="Cursiva" onClick={() => wrap("*", "cursiva")}>
				<Italic className="size-4" />
			</button>
			<span className="mx-1 h-5 w-px bg-border" />
			<button
				type="button"
				className={btn}
				title="Título 2"
				onClick={() => linePrefix("## ", "Título")}
			>
				<Heading2 className="size-4" />
			</button>
			<button
				type="button"
				className={btn}
				title="Título 3"
				onClick={() => linePrefix("### ", "Subtítulo")}
			>
				<Heading3 className="size-4" />
			</button>
			<button
				type="button"
				className={btn}
				title="Lista"
				onClick={() => linePrefix("- ", "elemento")}
			>
				<List className="size-4" />
			</button>
			<button type="button" className={btn} title="Cita" onClick={() => linePrefix("> ", "cita")}>
				<Quote className="size-4" />
			</button>
			<span className="mx-1 h-5 w-px bg-border" />
			<button
				type="button"
				className={btn}
				title="Enlace"
				onClick={() => insert("[texto](https://)")}
			>
				<LinkIcon className="size-4" />
			</button>
			<button
				type="button"
				className={btn}
				title="Insertar imagen"
				disabled={uploading}
				onClick={() => fileRef.current?.click()}
			>
				{uploading ? (
					<LoaderCircle className="size-4 animate-spin" />
				) : (
					<ImageIcon className="size-4" />
				)}
			</button>
			<input
				ref={fileRef}
				type="file"
				accept="image/*"
				className="hidden"
				onChange={(e) => {
					const file = e.target.files?.[0];
					if (file) handleFile(file);
				}}
			/>
		</div>
	);
}
