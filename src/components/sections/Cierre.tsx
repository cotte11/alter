import { Footer } from "./Footer";

/**
 * Familia completa: los 4 envases de frente en columnas (ver LineUp.tsx + BackLayer.tsx) y el CTA.
 * No usa SectionShell: el alto lo da el contenido.
 */
export function Cierre() {
  return (
    <section id="familia" className="relative">
      {/* Pantalla de los 4 envases (3D + columnas en <BackLayer>): más recorrido para que respire.
          El CTA va abajo, en el aire que dejan los envases sobre el margen inferior. */}
      <div className="relative h-[140svh]">
        <div className="sticky top-0 flex h-svh flex-col items-center justify-end px-6 pb-[2.5svh] text-center">
          <h2 className="sr-only">Conocé a toda la familia</h2>
          <a
            href="#" // TODO: destino por definir (tienda / dónde comprar)
            className="inline-block rounded-md bg-[#ff7a00] px-10 py-4 text-base font-bold uppercase tracking-wide text-white md:text-lg"
          >
            Llevate el pack
          </a>
        </div>
      </div>

      <Footer />
    </section>
  );
}
