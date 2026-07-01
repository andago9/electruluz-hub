import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, LoaderCircle, Lock, TriangleAlert } from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";
import logoImg from "@/assets/Horizotal-Logo.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login } from "@/lib/admin-api";

export function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
	const [password, setPassword] = useState("");
	const [show, setShow] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	const mutation = useMutation({
		mutationFn: () => login(password),
		onSuccess,
		onError: () => setPassword(""),
	});

	function handleSubmit(e: FormEvent) {
		e.preventDefault();
		if (!mutation.isPending && password) mutation.mutate();
	}

	return (
		<div className="bg-gradient-hero grid min-h-[100dvh] place-items-center px-4 py-12">
			<div className={`w-full max-w-sm ${mutation.isError ? "animate-shake" : ""}`}>
				<div className="overflow-hidden rounded-2xl bg-card shadow-card">
					<div className="bg-gradient-fire h-1.5" />
					<div className="px-7 pt-8 pb-7">
						<img
							src={logoImg}
							alt="Ferretería Electroluz"
							width={200}
							height={52}
							className="mx-auto h-9 w-auto"
							draggable={false}
						/>

						<div className="mt-7 flex flex-col items-center text-center">
							<span className="grid size-12 place-items-center rounded-full bg-secondary text-primary">
								<Lock className="size-5" />
							</span>
							<h1 className="mt-4 text-xl font-extrabold tracking-tight text-foreground text-balance">
								Panel del blog
							</h1>
							<p className="mt-1.5 text-sm text-muted-foreground text-pretty">
								Área privada. Ingresa la contraseña para administrar las publicaciones.
							</p>
						</div>

						<form onSubmit={handleSubmit} className="mt-7 space-y-3">
							<div className="relative">
								<Input
									ref={inputRef}
									id="admin-password"
									type={show ? "text" : "password"}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									autoComplete="current-password"
									placeholder="Contraseña"
									aria-invalid={mutation.isError}
									className={`h-11 pr-11 text-base ${
										mutation.isError ? "border-destructive focus-visible:ring-destructive" : ""
									}`}
								/>
								<button
									type="button"
									onClick={() => setShow((s) => !s)}
									aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
									className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted-foreground transition-colors hover:text-foreground"
								>
									{show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
								</button>
							</div>

							{mutation.isError && (
								<p className="flex items-center gap-2 text-sm font-medium text-destructive">
									<TriangleAlert className="size-4 shrink-0" />
									{mutation.error instanceof Error ? mutation.error.message : "Error al entrar."}
								</p>
							)}

							<Button
								type="submit"
								size="lg"
								disabled={mutation.isPending || password.length === 0}
								className="h-11 w-full text-sm font-bold"
							>
								{mutation.isPending ? (
									<>
										<LoaderCircle className="size-4 animate-spin" />
										Verificando…
									</>
								) : (
									"Ingresar"
								)}
							</Button>
						</form>
					</div>
				</div>
				<p className="mt-5 text-center text-xs text-white/60">
					Ferretería Electroluz · Acceso restringido
				</p>
			</div>
		</div>
	);
}
