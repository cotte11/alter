"use client";

import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";
import { useSceneReady } from "@/lib/loadState";

const FADE_MS = 700;
/** Si la escena nunca avisa (WebGL caído, red lenta) no dejamos el sitio tapado para siempre. */
const GIVE_UP_MS = 20000;

/** Pantalla de carga: tapa el sitio hasta que la lata (GLB + texturas) está lista. */
export function LoadingScreen() {
  const ready = useSceneReady();
  const { progress } = useProgress();
  const [timedOut, setTimedOut] = useState(false);
  const [gone, setGone] = useState(false);
  const [shown, setShown] = useState(0);

  const done = ready || timedOut;

  useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), GIVE_UP_MS);
    return () => clearTimeout(t);
  }, []);

  // El % solo sube (el LoadingManager lo reinicia al aparecer assets nuevos).
  useEffect(() => {
    setShown((s) => Math.max(s, Math.round(progress)));
  }, [progress]);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setGone(true), FADE_MS);
    return () => clearTimeout(t);
  }, [done]);

  if (gone) return null;

  const pct = done ? 100 : Math.min(shown, 99);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={done ? "Contenido cargado" : "Cargando"}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black text-white transition-opacity ease-out"
      style={{
        opacity: done ? 0 : 1,
        pointerEvents: done ? "none" : "auto",
        transitionDuration: `${FADE_MS}ms`,
      }}
    >
      <div className="font-display text-[22vw] uppercase leading-none md:text-[12vw]">Alter</div>
      <div className="mt-8 h-[3px] w-[60vw] max-w-xs overflow-hidden rounded-full bg-white/15">
        <div
          className="h-full origin-left bg-white transition-transform duration-300 ease-out"
          style={{ transform: `scaleX(${pct / 100})` }}
        />
      </div>
      <p className="mt-3 text-[11px] uppercase tracking-[0.3em] text-white/60">Cargando {pct}%</p>
    </div>
  );
}
