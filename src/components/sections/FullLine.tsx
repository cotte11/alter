import { FLAVORS } from "@/config/flavors";
import { Footer } from "./Footer";

const STORES = ["Punto de venta 1", "Punto de venta 2", "Punto de venta 3", "Tienda online"];

/** Sección 6: línea completa + dónde comprar + footer. Alto según contenido. */
export function FullLine() {
  return (
    <section id="linea" className="relative">
      {/* Primer pantallazo: los 4 envases (3D) quedan detrás */}
      <div className="flex h-svh flex-col items-center justify-between px-6 py-12 text-center md:py-16">
        <h2 className="text-4xl font-black uppercase md:text-6xl">La línea completa</h2>
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm uppercase tracking-widest">
          {FLAVORS.map((f) => (
            <li key={f.id} style={{ color: f.palette.primary }}>
              {f.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative bg-[#0b0b10]/85 px-6 py-24 text-center backdrop-blur-md md:px-16">
        <h3 className="text-3xl font-black uppercase md:text-5xl">Dónde comprar</h3>
        <ul className="mx-auto mt-8 grid max-w-2xl gap-3 md:grid-cols-2">
          {STORES.map((s) => (
            <li key={s} className="rounded-lg border border-white/15 px-4 py-3 text-white/80">
              {s}
            </li>
          ))}
        </ul>
      </div>

      <Footer />
    </section>
  );
}
