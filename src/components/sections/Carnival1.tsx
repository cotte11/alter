import { FLAVORS } from "@/config/flavors";
import { FlavorCopy } from "./FlavorCopy";
import { SectionShell } from "./SectionShell";

export function Carnival1() {
  return (
    <SectionShell id="carnaval-1" align="left">
      <FlavorCopy flavor={FLAVORS[0]} index={1} note="La anilla se abre con el scroll. Texto placeholder." />
    </SectionShell>
  );
}
