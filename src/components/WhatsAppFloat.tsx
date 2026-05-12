import { MessageCircle } from "lucide-react";
import { waLink } from "@/lib/site";

export function WhatsAppFloat() {
  return (
    <a
      href={waLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-6 right-6 z-50 inline-flex h-16 w-16 items-center justify-center rounded-full bg-whatsapp text-white shadow-glow animate-float-pulse hover:scale-110 transition-transform"
      style={{ backgroundColor: "var(--whatsapp)" }}
    >
      <MessageCircle className="h-8 w-8" strokeWidth={2.5} />
    </a>
  );
}
