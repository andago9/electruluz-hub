import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Star, Truck, Wrench, BadgeCheck, Headphones, Zap, Sun, Lightbulb, Hammer, Cable, PaintBucket, Shield, Fan, Droplets, Layers, MessageCircle } from "lucide-react";
import heroImg from "@/assets/hero-industrial.jpg";
import storeImg from "@/assets/store-interior.jpg";
import { waLink } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ferretería Electroluz | La Dorada, Caldas — Eléctricos, construcción y solar" },
      { name: "description", content: "Materiales eléctricos, construcción, herramientas y energía solar en La Dorada. Cotización rápida por WhatsApp." },
    ],
  }),
  component: Home,
});

const categories = [
  { icon: Cable, name: "Materiales eléctricos", desc: "Cables, breakers, contadores y más" },
  { icon: Lightbulb, name: "Bombillería LED", desc: "Iluminación moderna y eficiente" },
  { icon: Hammer, name: "Herramientas", desc: "Eléctricas y manuales de marcas top" },
  { icon: Layers, name: "Drywall y Superboard", desc: "Para acabados y divisiones" },
  { icon: PaintBucket, name: "Pinturas y acabados", desc: "Variedad para interior y exterior" },
  { icon: Droplets, name: "PVC y grifería", desc: "Tubería, accesorios y baños" },
  { icon: Sun, name: "Energía solar", desc: "Paneles e instalación llave en mano" },
  { icon: Shield, name: "Seguridad industrial", desc: "EPP y dotación profesional" },
];

const benefits = [
  { icon: Headphones, t: "Excelente atención", d: "Asesoría personalizada todos los días" },
  { icon: Wrench, t: "Amplia variedad", d: "Miles de productos en un solo lugar" },
  { icon: BadgeCheck, t: "Precios competitivos", d: "Mejor relación calidad-precio" },
  { icon: Truck, t: "Entrega rápida", d: "Despacho local en La Dorada" },
];

const testimonials = [
  { n: "Andrés M.", r: "Constructor", t: "Excelente surtido y precios. Siempre encuentro lo que necesito para mis obras." },
  { n: "Luisa P.", r: "Cliente residencial", t: "Me asesoraron muy bien con la instalación solar. Súper recomendados." },
  { n: "Carlos R.", r: "Electricista", t: "Mi ferretería de confianza en La Dorada. Atención de primera." },
];

const brands = ["Schneider", "Legrand", "Bosch", "Stanley", "Truper", "Pavco", "Sika", "Eveready"];

function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Ferretería Electroluz" width={1920} height={1080} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8 py-24 md:py-36">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
              <Zap className="h-3.5 w-3.5" style={{ color: "var(--brand-yellow)" }} fill="currentColor" />
              La Dorada, Caldas
            </span>
            <h1 className="mt-5 text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05]">
              Todo para <span className="text-gradient-fire">construcción, electricidad</span> y energía solar en un solo lugar
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl">
              Calidad, respaldo y atención personalizada. Cotiza al instante por WhatsApp y recibe los mejores precios.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={waLink("Hola, me gustaría hacer una cotización")} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl px-7 py-4 text-base font-bold text-white shadow-glow hover:scale-[1.02] transition-transform"
                style={{ backgroundColor: "var(--whatsapp)" }}>
                <MessageCircle className="h-5 w-5" /> Cotizar por WhatsApp
              </a>
              <Link to="/productos"
                className="inline-flex items-center gap-2 rounded-xl px-7 py-4 text-base font-bold text-brand-dark bg-gradient-fire hover:opacity-90"
                style={{ color: "var(--brand-dark)" }}>
                Ver productos <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-6 text-white">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5" style={{ color: "var(--brand-yellow)" }} fill="currentColor" />
                ))}
              </div>
              <div className="text-sm">
                <strong className="text-2xl font-extrabold">4.6</strong>
                <span className="ml-2 text-white/70">Reputación de nuestros clientes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-16 bg-secondary">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(b => (
            <div key={b.t} className="rounded-2xl bg-card p-6 shadow-card hover:-translate-y-1 transition-transform">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-fire">
                <b.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-4 text-lg font-extrabold">{b.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{b.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-sm font-bold uppercase tracking-widest" style={{ color: "var(--brand-orange)" }}>Categorías</span>
            <h2 className="mt-2 text-3xl md:text-5xl font-extrabold">Expertos en materiales <span className="text-gradient-fire">eléctricos y construcción</span></h2>
            <p className="mt-4 text-muted-foreground">Encuentra todo lo que tu proyecto necesita con la mejor asesoría profesional.</p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map(c => (
              <Link key={c.name} to="/productos" className="group rounded-2xl border border-border bg-card p-6 shadow-card hover:border-transparent hover:shadow-glow transition-all">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary group-hover:bg-gradient-fire transition-colors">
                  <c.icon className="h-7 w-7 text-primary group-hover:text-white" />
                </div>
                <h3 className="mt-5 font-extrabold text-lg">{c.name}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{c.desc}</p>
                <div className="mt-4 inline-flex items-center text-sm font-bold text-primary group-hover:gap-2 gap-1 transition-all">
                  Ver más <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SOLAR BANNER */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 py-20 grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
              <Sun className="h-3.5 w-3.5" style={{ color: "var(--brand-yellow)" }} /> Tecnología sostenible
            </span>
            <h2 className="mt-4 text-3xl md:text-5xl font-extrabold text-white">
              Soluciones en <span className="text-gradient-fire">energía solar</span> para hogar y empresa
            </h2>
            <p className="mt-4 text-white/75 text-lg">Reduce tu factura eléctrica hasta un 95% con paneles solares de última generación, instalados por expertos.</p>
            <Link to="/energia-solar" className="mt-8 inline-flex items-center gap-2 rounded-xl px-7 py-4 font-bold text-brand-dark bg-gradient-solar hover:opacity-90"
              style={{ color: "var(--brand-dark)" }}>
              Conocer más <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-fire opacity-30 blur-3xl rounded-full" />
            <img src={storeImg} alt="Energía solar" loading="lazy" width={1600} height={900} className="relative rounded-2xl shadow-glow" />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-sm font-bold uppercase tracking-widest" style={{ color: "var(--brand-orange)" }}>Testimonios</span>
            <h2 className="mt-2 text-3xl md:text-5xl font-extrabold">Lo que dicen nuestros clientes</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map(t => (
              <div key={t.n} className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4" style={{ color: "var(--brand-yellow)" }} fill="currentColor" />)}
                </div>
                <p className="mt-4 text-foreground/85">"{t.t}"</p>
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="font-bold">{t.n}</div>
                  <div className="text-sm text-muted-foreground">{t.r}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BRANDS */}
      <section className="py-12 bg-secondary">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">Marcas que distribuimos</p>
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4">
            {brands.map(b => (
              <span key={b} className="text-xl md:text-2xl font-extrabold text-foreground/40 hover:text-foreground transition-colors">{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="rounded-3xl bg-gradient-hero p-10 md:p-14 text-center shadow-glow">
            <Fan className="mx-auto h-12 w-12 text-white opacity-80" />
            <h2 className="mt-4 text-3xl md:text-5xl font-extrabold text-white">Todo para tus proyectos en un solo lugar</h2>
            <p className="mt-4 text-white/75 max-w-xl mx-auto">Contáctanos ahora y recibe una cotización rápida sin compromiso.</p>
            <a href={waLink()} target="_blank" rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-xl px-8 py-4 font-bold text-white shadow-glow hover:scale-[1.02] transition-transform"
              style={{ backgroundColor: "var(--whatsapp)" }}>
              <MessageCircle className="h-5 w-5" /> Cotizar ahora
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
