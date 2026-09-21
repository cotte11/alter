import { SECTIONS, type SectionId } from "@/config/poses";

interface Props {
  id: SectionId;
  /** Lado del texto. El envase se posiciona en el lado opuesto (ver config/poses.ts). */
  align?: "left" | "right" | "center";
  children: React.ReactNode;
}

const ALIGN = {
  left: "md:justify-start md:text-left",
  right: "md:justify-end md:text-right",
  center: "md:justify-center md:text-center",
} as const;

/**
 * Sección con alto según config (para dar recorrido de scroll) y contenido
 * "sticky" a pantalla completa. El id conecta con ScrollTrigger.
 */
export function SectionShell({ id, align = "left", children }: Props) {
  const cfg = SECTIONS.find((s) => s.id === id);
  return (
    <section id={id} className="relative" style={{ height: cfg?.heightVh ? `${cfg.heightVh}svh` : undefined }}>
      <div
        className={`sticky top-0 flex h-svh items-end justify-center px-6 pb-12 text-center md:items-center md:px-16 md:pb-0 ${ALIGN[align]}`}
      >
        <div className="max-w-md">{children}</div>
      </div>
    </section>
  );
}
