import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

function getBasepath() {
	const base = import.meta.env.BASE_URL;
	if (!base || base === "/") return undefined;
	return base.replace(/\/$/, "");
}

export const getRouter = () => {
	const queryClient = new QueryClient();

	const router = createRouter({
		routeTree,
		context: { queryClient },
		basepath: getBasepath(),
		scrollRestoration: true,
		defaultPreloadStaleTime: 0,
	});

	return router;
};
