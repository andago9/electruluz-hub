import { createFileRoute } from "@tanstack/react-router";

async function handleKeystatic(request: Request): Promise<Response> {
	const { makeGenericAPIRouteHandler } = await import("@keystatic/core/api/generic");
	const { default: config } = await import("@/keystatic.config");

	const handler = makeGenericAPIRouteHandler({ config });
	const result = await handler(request);

	return new Response(result.body, {
		status: result.status,
		headers: result.headers as HeadersInit | undefined,
	});
}

export const Route = createFileRoute("/api/keystatic/$")({
	server: {
		handlers: {
			GET: ({ request }) => handleKeystatic(request),
			POST: ({ request }) => handleKeystatic(request),
		},
	},
});
