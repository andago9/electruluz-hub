import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const KeystaticAdmin = lazy(() =>
	import("@/components/keystatic-admin").then((m) => ({ default: m.KeystaticAdmin })),
);

export const Route = createFileRoute("/keystatic/")({
	ssr: false,
	component: AdminRoute,
});

function AdminRoute() {
	return (
		<Suspense fallback={null}>
			<KeystaticAdmin />
		</Suspense>
	);
}
