import { useEffect, useState } from "react";
import logo from "@/assets/limage-6296.png";

const STORAGE_KEY = "electroluz-splash-shown";
const FADE_MS = 700;
const HOLD_MS = 1400;

export function IntroSplash() {
	const [visible, setVisible] = useState(false);
	const [opacity, setOpacity] = useState(0);

	useEffect(() => {
		try {
			if (sessionStorage.getItem(STORAGE_KEY)) return;
		} catch {
			return;
		}

		setVisible(true);

		const fadeInFrame = requestAnimationFrame(() => {
			requestAnimationFrame(() => setOpacity(1));
		});

		const fadeOutTimer = window.setTimeout(() => setOpacity(0), FADE_MS + HOLD_MS);
		const hideTimer = window.setTimeout(
			() => {
				try {
					sessionStorage.setItem(STORAGE_KEY, "1");
				} catch {
					/* ignore */
				}
				setVisible(false);
			},
			FADE_MS * 2 + HOLD_MS,
		);

		return () => {
			cancelAnimationFrame(fadeInFrame);
			window.clearTimeout(fadeOutTimer);
			window.clearTimeout(hideTimer);
		};
	}, []);

	if (!visible) return null;

	return (
		<div
			className="fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity ease-in-out"
			style={{ opacity, transitionDuration: `${FADE_MS}ms` }}
			aria-hidden="true"
		>
			<img
				src={logo}
				alt="Ferretería Electroluz — Más cerca a su obra"
				className="max-h-[min(70vh,320px)] w-auto max-w-[min(90vw,320px)] object-contain"
				draggable={false}
			/>
		</div>
	);
}
