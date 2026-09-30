interface Props {
  title: string;
  children: React.ReactNode;
}

/** Recuadro corto que explica UN concepto de Three.js/R3F, al lado de los controles que lo demuestran. */
export function ConceptNote({ title, children }: Props) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-sm leading-relaxed text-foreground/70">
      <p className="mb-1 font-medium text-foreground">{title}</p>
      {children}
    </div>
  );
}
