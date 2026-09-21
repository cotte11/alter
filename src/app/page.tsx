import { Hero } from "@/components/sections/Hero";
import { Carnival1 } from "@/components/sections/Carnival1";
import { Carnival2 } from "@/components/sections/Carnival2";
import { Carnival3 } from "@/components/sections/Carnival3";
import { Carnival4 } from "@/components/sections/Carnival4";
import { FullLine } from "@/components/sections/FullLine";
import { ScrollChoreography } from "@/components/sections/ScrollChoreography";

export default function Home() {
  return (
    <main className="relative z-10">
      <ScrollChoreography />
      <Hero />
      <Carnival1 />
      <Carnival2 />
      <Carnival3 />
      <Carnival4 />
      <FullLine />
    </main>
  );
}
