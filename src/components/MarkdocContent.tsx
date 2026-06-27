import Markdoc, { type RenderableTreeNode } from "@markdoc/markdoc";
import * as React from "react";
import { withBase } from "@/lib/blog";

function rewriteImageSrc(node: RenderableTreeNode): void {
	if (!Markdoc.Tag.isTag(node)) return;
	if (node.name === "img" && typeof node.attributes?.src === "string") {
		node.attributes.src = withBase(node.attributes.src);
	}
	for (const child of node.children) rewriteImageSrc(child);
}

export function MarkdocContent({ body }: { body: string }) {
	const rendered = React.useMemo(() => {
		const ast = Markdoc.parse(body);
		const transformed = Markdoc.transform(ast);
		rewriteImageSrc(transformed);
		return Markdoc.renderers.react(transformed, React);
	}, [body]);

	return (
		<div
			className={[
				"max-w-none text-foreground/90 leading-relaxed",
				"[&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:text-foreground",
				"[&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-foreground",
				"[&_p]:mt-4 [&_p]:text-base",
				"[&_a]:text-primary [&_a]:font-semibold [&_a]:underline [&_a]:underline-offset-2",
				"[&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6",
				"[&_li]:mt-1",
				"[&_blockquote]:mt-6 [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground",
				"[&_img]:mt-6 [&_img]:rounded-2xl [&_img]:shadow-card",
				"[&_hr]:my-10 [&_hr]:border-border",
				"[&_code]:rounded [&_code]:bg-secondary [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm",
				"[&_strong]:font-bold [&_strong]:text-foreground",
			].join(" ")}
		>
			{rendered}
		</div>
	);
}
