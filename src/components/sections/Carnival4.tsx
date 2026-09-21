import { FLAVORS } from "@/config/flavors";
import { FlavorCopy } from "./FlavorCopy";
import { SectionShell } from "./SectionShell";

export function Carnival4() {
  return (
    <SectionShell id="carnaval-4" align="right">
      <FlavorCopy flavor={FLAVORS[3]} index={4} note="La etiqueta de la botella cambia de sabor. Texto placeholder." />
    </SectionShell>
  );
}
