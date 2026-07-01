import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { LoaderCircle } from "lucide-react";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { getAuthStatus } from "@/lib/admin-api";

export const Route = createFileRoute("/admin")({
	ssr: false,
	component: AdminRoute,
});

function AdminRoute() {
	const queryClient = useQueryClient();
	const auth = useQuery({
		queryKey: ["auth-status"],
		queryFn: getAuthStatus,
		retry: false,
		staleTime: 0,
	});

	const refreshAuth = () => queryClient.invalidateQueries({ queryKey: ["auth-status"] });

	if (auth.isLoading) {
		return (
			<div className="bg-gradient-hero grid min-h-[100dvh] place-items-center text-white/70">
				<LoaderCircle className="size-6 animate-spin" />
			</div>
		);
	}

	if (!auth.data) {
		return <AdminLogin onSuccess={refreshAuth} />;
	}

	return <AdminPanel onLoggedOut={refreshAuth} />;
}
