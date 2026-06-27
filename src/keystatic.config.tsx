import { collection, config, fields } from "@keystatic/core";

export default config({
	storage: { kind: "local" },
	ui: {
		brand: { name: "Electroluz · Blog" },
	},
	collections: {
		posts: collection({
			label: "Blog",
			path: "src/content/posts/*",
			slugField: "title",
			format: { contentField: "content" },
			entryLayout: "content",
			columns: ["title", "publishedAt"],
			schema: {
				title: fields.slug({
					name: { label: "Título", validation: { isRequired: true } },
				}),
				publishedAt: fields.date({
					label: "Fecha de publicación",
					defaultValue: { kind: "today" },
					validation: { isRequired: true },
				}),
				excerpt: fields.text({
					label: "Resumen",
					description: "Texto corto que aparece en el listado y en buscadores.",
					multiline: true,
					validation: { length: { min: 0, max: 280 } },
				}),
				coverImage: fields.image({
					label: "Imagen de portada",
					directory: "public/blog",
					publicPath: "/blog/",
				}),
				content: fields.document({
					label: "Contenido",
					formatting: true,
					dividers: true,
					links: true,
					images: { directory: "public/blog", publicPath: "/blog/" },
				}),
			},
		}),
	},
});
