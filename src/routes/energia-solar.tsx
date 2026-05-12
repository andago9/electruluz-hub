import { createFileRoute } from "@tanstack/react-router";
import { Sun, Leaf, TrendingDown, Home, Building2, Battery, MessageCircle } from "lucide-react";
import solarImg from "@/assets/solar-panels.jpg";
import { waLink } from "@/lib/site";

export const Route = createFileRoute("/energia-solar")({
  head: () => ({
    meta: [
      { title: "Energía Solar en La Dorada — Ferretería Electroluz" },
      { name: "description", content: "Paneles solares, inversores y baterías. Soluciones de energía solar para hogar y empresa con instalación profesional." },
      { property: "og:image", content: "/src/assets/solar-panels.jpg" },
    ],
  }),
  component: Solar,
});

function Solar() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-hero text-white py-24">
        <div className="absolute inset-0 opacity-30">
          <img src={solarImg} alt="" width={1600} height={900} className="h-full w-full object-cover" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
            <Sun className="h-3.5 w-3.5" style={{ color: "var(--brand-yellow)" }} /> Tecnología sostenible
          </span>
          <h1 className="mt-4 text-4xl md:text-6xl font-extrabold max-w-3xl">
            Energía <span className="text-gradient-fire">solar premium</span> para hogar y empresa
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/80">Paneles, inversores y baterías de última generación. Instalación profesional, ahorro garantizado y respaldo total.</p>
          <a href={waLink("Hola, me interesa cotizar un sistema de energía solar")} target="_blank" rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-xl px-7 py-4 font-bold text-brand-dark bg-gradient-solar hover:opacity-90"
            style={{ color: "var(--brand-dark)" }}>
            <MessageCircle className="h-5 w-5" /> Cotizar mi sistema solar
          </a>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold">Beneficios de la <span className="text-gradient-fire">energía solar</span></h2>
            <p className="mt-4 text-muted-foreground text-lg">Una inversión inteligente que se paga sola.</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { i: TrendingDown, t: "Ahorro real", d: "Reduce tu factura eléctrica hasta en un 95% desde el primer mes." },
              { i: Leaf, t: "Energía renovable", d: "Aporta al planeta usando energía limpia e inagotable del sol." },
              { i: Battery, t: "Respaldo confiable", d: "Sistemas con baterías para tener energía incluso en cortes." },
              { i: Home, t: "Hogares", d: "Soluciones a la medida para casas y conjuntos residenciales." },
              { i: Building2, t: "Empresas", d: "Sistemas industriales y comerciales escalables." },
              { i: Sun, t: "Mantenimiento mínimo", d: "Sistemas duraderos con vida útil de más de 25 años." },
            ].map(x => (
              <div key={x.t} className="rounded-2xl border border-border bg-card p-6 shadow-card hover:shadow-glow transition-all">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-solar">
                  <x.i className="h-7 w-7" style={{ color: "var(--brand-dark)" }} />
                </div>
                <h3 className="mt-5 font-extrabold text-lg">{x.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary">
        <div className="mx-auto max-w-5xl px-4 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold">¿Listo para dar el paso al sol?</h2>
          <p className="mt-3 text-muted-foreground">Solicita un estudio gratuito y descubre cuánto puedes ahorrar.</p>
          <a href={waLink("Hola, quiero un estudio gratuito de energía solar")} target="_blank" rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-xl px-7 py-4 font-bold text-white shadow-glow"
            style={{ backgroundColor: "var(--whatsapp)" }}>
            <MessageCircle className="h-5 w-5" /> Solicitar estudio gratis
          </a>
        </div>
      </section>
    </>
  );
}
