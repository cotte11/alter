import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { BackLayer } from "@/components/layout/BackLayer";
import { Navbar } from "@/components/layout/Navbar";
import { SceneLoader } from "@/components/three/SceneLoader";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const shadowHand = localFont({
  src: "../../../public/fonts/ShadowHand.ttf",
  variable: "--font-shadowhand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ALTER — Energía de carnaval",
  description: "ALTER: bebidas energéticas inspiradas en los carnavales latinoamericanos.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} ${shadowHand.variable} antialiased`}>
      <body className="bg-background text-foreground">
        <SmoothScroll>
          <BackLayer />
          <SceneLoader />
          <Navbar />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
