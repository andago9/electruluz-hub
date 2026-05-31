import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Link,
	Outlet,
	Scripts,
	useRouter,
} from "@tanstack/react-router";
import { buildRootHeadLinks, buildRootHeadScripts } from "@/lib/seo";
import { SITE } from "@/lib/site";
import appCss from "../styles.css?url";

function NotFoundComponent() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-background px-4">
			<div className="max-w-md text-center">
				<h1 className="text-7xl font-bold text-foreground">404</h1>
				<h2 className="mt-4 text-xl font-semibold text-foreground">Página no encontrada</h2>
				<p className="mt-2 text-sm text-muted-foreground">
					La página que buscas no existe o fue movida.
				</p>
				<div className="mt-6">
					<Link
						to="/"
						className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
					>
						Volver al inicio
					</Link>
				</div>
			</div>
		</div>
	);
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
	console.error(error);
	const router = useRouter();

	return (
		<div className="flex min-h-screen items-center justify-center bg-background px-4">
			<div className="max-w-md text-center">
				<h1 className="text-xl font-semibold tracking-tight text-foreground">
					No se pudo cargar la página
				</h1>
				<p className="mt-2 text-sm text-muted-foreground">
					Algo salió mal. Puedes intentar de nuevo o volver al inicio.
				</p>
				<div className="mt-6 flex flex-wrap justify-center gap-2">
					<button
						type="button"
						onClick={() => {
							router.invalidate();
							reset();
						}}
						className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
					>
						Reintentar
					</button>
					<a
						href="/"
						className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
					>
						Volver al inicio
					</a>
				</div>
			</div>
		</div>
	);
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ name: "author", content: SITE.name },
			{ name: "theme-color", content: "#0057B8" },
		],
		links: buildRootHeadLinks(appCss, SITE.favicon),
		scripts: buildRootHeadScripts(),
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
	return (
		<html lang="es">
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<Scripts />
			</body>
		</html>
	);
}

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { IntroSplash } from "@/components/IntroSplash";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

function RootComponent() {
	const { queryClient } = Route.useRouteContext();

	return (
		<QueryClientProvider client={queryClient}>
			<IntroSplash />
			<div className="flex min-h-screen flex-col">
				<Header />
				<main className="flex-1">
					<Outlet />
				</main>
				<Footer />
				<WhatsAppFloat />
			</div>
		</QueryClientProvider>
	);
}
