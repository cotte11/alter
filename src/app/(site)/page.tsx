import { Hero } from "@/components/sections/Hero";
import { Sabores } from "@/components/sections/Sabores";
import { Composicion } from "@/components/sections/Composicion";
import { Cierre } from "@/components/sections/Cierre";
import { ScrollChoreography } from "@/components/sections/ScrollChoreography";

export default function Home() {
  return (
    <main className="relative z-10">
      <ScrollChoreography />
      <Hero />
      <Sabores />
      <Composicion />
      <Cierre />
    </main>
  );
}
