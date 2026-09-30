"use client";

import { useEffect, useRef } from "react";
import { Color } from "three";
import { FLAVORS } from "@/config/flavors";
import { BACKGROUND_STOPS } from "@/config/poses";
import { gsap } from "@/lib/gsap";
import { channels, runtime } from "@/lib/scrollState";

const stops = BACKGROUND_STOPS.map((c) => new Color(c));
const tmp = new Color();

const NAV_ZONE = 0.12; // fracción superior (navbar) donde el hover no cuenta
const EASE = 0.12; // suavizado por tick

/**
 * Capa FIJA detrás del Canvas: color de fondo por sabor (canal `bg`) y la frase del hero.
 * Vive detrás del Canvas (z-0 vs z-[1]) para que la lata pase por delante de las letras.
 * Se actualiza con el ticker de GSAP leyendo `channels` (sin re-renders de React).
 */
export function BackLayer() {
  const root = useRef<HTMLDivElement>(null);
  const phrase = useRef<HTMLDivElement>(null);
  const columns = useRef<HTMLDivElement>(null);
  const cols = useRef<(HTMLDivElement | null)[]>([]);
  const names = useRef<(HTMLSpanElement | null)[]>([]);
  const glows = useRef<(HTMLDivElement | null)[]>([]);
  const tags = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const update = () => {
      const r = root.current;
      if (!r) return;
      const max = stops.length - 1;
      const b = Math.min(max, Math.max(0, channels.bg));
      const i = Math.min(max - 1, Math.floor(b));
      tmp.copy(stops[i]).lerp(stops[i + 1], b - i);
      r.style.backgroundColor = `#${tmp.getHexString()}`;

      const c = columns.current;
      if (c) {
        c.style.opacity = String(channels.line);
        c.style.visibility = channels.line > 0.001 ? "visible" : "hidden";
      }

      // Hover de la pantalla final: brillo suave detrás del envase (el levantado lo hace LineUp).
      const active = channels.line > 0.5 && runtime.hover >= 0;
      FLAVORS.forEach((f, i) => {
        const hot = active && runtime.hover === i ? 1 : 0;
        runtime.hoverK[i] += (hot - runtime.hoverK[i]) * EASE;
        const hk = runtime.hoverK[i];
        const glow = glows.current[i];
        if (glow) glow.style.opacity = String(hk);
        const tag = tags.current[i];
        if (tag) {
          tag.style.opacity = String(0.75 + 0.25 * hk);
          tag.style.transform = `translateY(${hk * -0.8}svh)`;
        }
        const name = names.current[i];
        if (name) name.style.color = hk > 0.5 ? f.palette.accent : "rgba(255,255,255,0.9)";
      });

      const p = phrase.current;
      if (p) {
        p.style.opacity = String(channels.heroText);
        p.style.transform = `translateY(${(1 - channels.heroText) * -6}vh) scale(${1 + (1 - channels.heroText) * 0.06})`;
        p.style.visibility = channels.heroText > 0.001 ? "visible" : "hidden";
      }
    };
    // Columna bajo el mouse (4 columnas iguales).
    const onMove = (e: PointerEvent) => {
      if (e.clientY < window.innerHeight * NAV_ZONE) {
        runtime.hover = -1;
        return;
      }
      runtime.hover = Math.min(FLAVORS.length - 1, Math.floor((e.clientX / window.innerWidth) * FLAVORS.length));
    };
    const onLeave = () => {
      runtime.hover = -1;
    };
    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeave);

    update();
    gsap.ticker.add(update);
    return () => {
      gsap.ticker.remove(update);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={root} className="fixed inset-0 z-0 flex items-center justify-center overflow-hidden bg-black" aria-hidden>
      <div
        ref={phrase}
        className="font-display w-full select-none px-[2vw] text-center text-[19vw] uppercase leading-[0.92] text-white md:text-[15.5vw]"
      >
        Tu mejor
        <br />
        version
      </div>

      {/* Cierre: una columna por personaje, con su nombre en vertical (detrás de los envases). */}
      <div ref={columns} className="absolute inset-0 flex" style={{ visibility: "hidden" }}>
        {FLAVORS.map((f, i) => (
          <div
            key={f.id}
            ref={(el) => {
              cols.current[i] = el;
            }}
            className="relative flex flex-1 items-start justify-center overflow-hidden pt-[14vh]"
            style={{ backgroundColor: f.palette.secondary }}
          >
            {/* brillo suave que aparece en hover, detrás del envase */}
            <div
              ref={(el) => {
                glows.current[i] = el;
              }}
              className="absolute inset-0 opacity-0"
              style={{
                background: `radial-gradient(ellipse 70% 45% at 50% 62%, ${f.palette.accent}66, transparent 70%)`,
              }}
            />
            <span
              ref={(el) => {
                names.current[i] = el;
              }}
              className="font-display uppercase leading-none transition-colors duration-300"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontSize: "min(9vh, 11vw)" }}
            >
              {f.name}
            </span>
            {/* sabor y formato, justo debajo del envase */}
            <div
              ref={(el) => {
                tags.current[i] = el;
              }}
              className="absolute inset-x-0 top-[82svh] text-center"
            >
              <p className="text-[11px] font-black uppercase tracking-wide text-white md:text-2xl md:tracking-[0.2em]">{f.taste}</p>
              <p className="mt-1 text-[9px] uppercase leading-tight tracking-wide text-white/70 md:text-xs md:tracking-widest">
                {f.format === "can" ? "Lata" : "Botella"}
                <br className="md:hidden" />
                <span className="hidden md:inline"> · </span>
                {f.volumeMl} ml
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
