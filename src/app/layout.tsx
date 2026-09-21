import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { SceneLoader } from "@/components/three/SceneLoader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ALTER — Energía de carnaval",
  description: "ALTER: bebidas energéticas inspiradas en los carnavales latinoamericanos.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="bg-background text-foreground">
        <SmoothScroll>
          <SceneLoader />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
