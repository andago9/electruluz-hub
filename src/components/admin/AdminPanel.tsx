import { useMutation } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { PostEditor } from "@/components/admin/PostEditor";
import { PostList } from "@/components/admin/PostList";
import { Toaster } from "@/components/ui/sonner";
import { logout } from "@/lib/admin-api";

type View = { mode: "list" } | { mode: "editor"; slug: string | null };

export function AdminPanel({ onLoggedOut }: { onLoggedOut: () => void }) {
	const [view, setView] = useState<View>({ mode: "list" });

	const logoutMutation = useMutation({
		mutationFn: logout,
		onSettled: onLoggedOut,
	});

	return (
		<div className="min-h-[100dvh] bg-muted/30">
			<Toaster richColors position="top-center" />
			<header className="border-b border-border bg-background">
				<div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
					<div className="flex items-center gap-2">
						<span className="bg-gradient-fire h-5 w-1.5 rounded-full" />
						<span className="font-extrabold tracking-tight text-foreground">Panel del blog</span>
					</div>
					<button
						type="button"
						onClick={() => logoutMutation.mutate()}
						disabled={logoutMutation.isPending}
						className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
					>
						<LogOut className="size-4" /> Salir
					</button>
				</div>
			</header>

			<main className="mx-auto max-w-5xl px-4 py-8">
				{view.mode === "list" ? (
					<PostList
						onNew={() => setView({ mode: "editor", slug: null })}
						onEdit={(slug) => setView({ mode: "editor", slug })}
					/>
				) : (
					<PostEditor slug={view.slug} onDone={() => setView({ mode: "list" })} />
				)}
			</main>
		</div>
	);
}
