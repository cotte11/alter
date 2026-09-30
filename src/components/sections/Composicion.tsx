"use client";

import { useEffect, useRef, useState } from "react";
import { COMPOSICION } from "@/config/composicion";
import type { Format } from "@/config/flavors";
import { gsap } from "@/lib/gsap";
import { runtime } from "@/lib/scrollState";
import { SectionShell } from "./SectionShell";

/** Número que cuenta de 0 a `value` (crescendo) cada vez que entra en pantalla o cambia el formato. */
function CountUp({ value, unit, label, run }: { value: number; unit: string; label: string; run: boolean }) {
  const num = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = num.current;
    if (!el) return;
    if (!run) {
      el.textContent = "0";
      return;
    }
    const counter = { v: 0 };
    const tween = gsap.to(counter, {
      v: value,
      duration: 1.8,
      ease: "power3.in", // arranca lento y crece: crescendo
      onUpdate: () => {
        el.textContent = String(Math.round(counter.v));
      },
    });
    return () => {
      tween.kill();
    };
  }, [value, run]);

  return (
    <div className="border-t border-white/15 py-2 pr-3 md:py-4">
      <p className="flex items-baseline gap-2 text-[#ff7a00]">
        <span ref={num} className="font-black leading-none" style={{ fontSize: "clamp(2rem, 7vh, 4.5rem)" }}>
          0
        </span>
        <span className="text-xl font-black text-white md:text-3xl">{unit}</span>
      </p>
      <p className="mt-2 max-w-[16rem] text-xs text-white/80 md:mt-3 md:text-base">{label}</p>
    </div>
  );
}

/** Qué hay adentro: números que suben + switch Lata/Botella que cambia datos y modelo 3D. */
export function Composicion() {
  const [format, setFormat] = useState<Format>("bottle");
  const [inView, setInView] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const data = COMPOSICION[format];

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const choose = (f: Format) => {
    setFormat(f);
    gsap.to(runtime, { compFormat: f === "bottle" ? 1 : 0, duration: 0.9, ease: "power2.inOut", overwrite: true });
  };

  return (
    <SectionShell id="composicion" align="right">
      <div ref={box} className="max-w-xl text-left md:max-w-2xl">
        <p className="hidden text-xs font-bold uppercase tracking-[0.3em] text-[#ff7a00] md:block">Qué hay adentro</p>
        <h2 className="mt-2 font-black uppercase leading-[0.95]" style={{ fontSize: "clamp(1.5rem, 5vh, 3rem)" }}>
          Lista corta.
          <br />
          Cero misterio.
        </h2>

        <div
          role="group"
          aria-label="Formato"
          className="pointer-events-auto mt-4 inline-flex rounded-full border border-white/25 p-1"
        >
          {(["can", "bottle"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => choose(f)}
              aria-pressed={format === f}
              className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-colors md:text-sm ${
                format === f ? "bg-white text-black" : "text-white/70 hover:text-white"
              }`}
            >
              {f === "can" ? "Lata" : "Botella"}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-white/60">{data.title}</p>

        <div className="mt-2 grid grid-cols-2 gap-x-4">
          {data.stats.map((s) => (
            <CountUp key={`${format}-${s.unit}`} {...s} run={inView} />
          ))}
        </div>
        <p className="mt-4 hidden max-w-md text-xs text-white/50 md:block">{data.legal}</p>
      </div>
    </SectionShell>
  );
}
