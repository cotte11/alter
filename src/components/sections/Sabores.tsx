import { flavorById } from "@/config/flavors";
import type { SectionId } from "@/config/poses";
import { PersonajeCopy } from "./PersonajeCopy";
import { SectionShell } from "./SectionShell";

// Un SectionId por sabor (ver poses.ts). `align` = lado del texto; el envase va al opuesto.
const STEPS: { id: SectionId; flavorId: string; align: "left" | "right" }[] = [
  { id: "sabor-lucifer", flavorId: "lucifer", align: "left" },
  { id: "sabor-supay", flavorId: "supay", align: "right" },
  { id: "sabor-pujllay", flavorId: "pujllay", align: "left" },
  { id: "sabor-marimonda", flavorId: "marimonda", align: "right" },
];

export function Sabores() {
  return (
    <>
      {STEPS.map(({ id, flavorId, align }) => {
        const flavor = flavorById(flavorId);
        if (!flavor) return null;
        return (
          <SectionShell key={id} id={id} align={align}>
            <PersonajeCopy flavor={flavor} />
          </SectionShell>
        );
      })}
    </>
  );
}
