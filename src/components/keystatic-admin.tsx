import { Keystatic } from "@keystatic/core/ui";
import keystaticConfig from "@/keystatic.config";

export function KeystaticAdmin() {
	return <Keystatic config={keystaticConfig} />;
}
