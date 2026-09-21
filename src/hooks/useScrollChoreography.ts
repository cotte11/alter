"use client";

import { SECTIONS, resolveEnd, resolvePose } from "@/config/poses";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { channels } from "@/lib/scrollState";

/**
 * Conecta cada sección HTML (por id) con la pose/estado del envase.
 * Todo el contenido numérico sale de src/config/poses.ts.
 */
export function useScrollChoreography() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(
      // el callback solo corre si alguna condición coincide: por eso existe `desktop`
      { mobile: "(max-width: 767px)", desktop: "(min-width: 768px)", reduce: "(prefers-reduced-motion: reduce)" },
      (ctx) => {
        const { mobile, reduce } = ctx.conditions as { mobile: boolean; reduce: boolean };
        const poses = SECTIONS.map((s) => resolvePose(s, mobile));
        const ends = SECTIONS.map((s) => resolveEnd(s, mobile));

        Object.assign(channels, poses[0]);

        SECTIONS.forEach((s, i) => {
          const el = document.getElementById(s.id);
          if (!el) return;

          // prefers-reduced-motion: sin scrub, salto suave al estado de la sección.
          if (reduce) {
            const apply = () => gsap.to(channels, { ...ends[i], duration: 0.4, overwrite: true });
            ScrollTrigger.create({
              trigger: el,
              start: "top 60%",
              end: "bottom 60%",
              onEnter: apply,
              onEnterBack: apply,
            });
            return;
          }

          // Entrada: estado final de la sección anterior → pose de esta sección.
          if (i > 0) {
            gsap.fromTo(
              channels,
              { ...ends[i - 1] },
              {
                ...poses[i],
                ease: "none",
                immediateRender: false,
                scrollTrigger: { trigger: el, start: "top bottom", end: "top top", scrub: true },
              },
            );
          }

          // Durante: mientras la sección está fija en pantalla.
          if (s.during) {
            gsap.fromTo(
              channels,
              { ...poses[i] },
              {
                ...ends[i],
                ease: "none",
                immediateRender: false,
                scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: true },
              },
            );
          }
        });
      },
    );

    return () => mm.revert();
  }, []);
}
