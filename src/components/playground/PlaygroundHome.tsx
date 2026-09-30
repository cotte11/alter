import Link from "next/link";
import { STATIONS } from "@/config/playgroundStations";

/** Home del playground: una tarjeta por estación. Server component, sin Canvas. */
export function PlaygroundHome() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 md:px-10">
      <Link href="/" className="text-sm text-foreground/50 hover:text-foreground">
        ← Volver al sitio
      </Link>
      <h1 className="mt-2 text-2xl font-semibold md:text-3xl">Playground 3D</h1>
      <p className="mt-2 max-w-xl text-sm text-foreground/60 md:text-base">
        Cuatro escenas aisladas para aprender los fundamentos de Three.js / React Three Fiber antes de tocar la
        escena real del sitio. Elegí una estación.
      </p>

      <ol className="mt-10 flex flex-col gap-3">
        {STATIONS.map((s) => (
          <li key={s.id}>
            <Link
              href={`/playground/${s.id}`}
              className="group flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-white/25 hover:bg-white/[0.06]"
            >
              <span>
                <span className="block text-xs font-medium tracking-wide text-foreground/40 uppercase">
                  Estación {s.order}
                </span>
                <span className="mt-1 block font-medium text-foreground">{s.title}</span>
                <span className="mt-1 block text-sm text-foreground/60">{s.tagline}</span>
              </span>
              <span className="shrink-0 text-foreground/30 transition-transform group-hover:translate-x-1 group-hover:text-foreground/60">
                →
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </main>
  );
}
