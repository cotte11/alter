import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Playground 3D — ALTER (dev)",
  description: "Sandbox para aprender React Three Fiber antes de tocar la web real de ALTER.",
};

/**
 * Root layout PROPIO para /playground (route group `(playground)`).
 *
 * Next.js permite varios "root layout" en paralelo con route groups: cada
 * uno define su propio <html>/<body> y solo uno se usa según la URL. Por
 * eso este layout NO monta <SmoothScroll> ni <SceneLoader> (el Canvas fijo
 * del sitio real, ver src/app/(site)/layout.tsx): el playground arma sus
 * propios <Canvas> aislados, sin la coreografía de scroll de la web.
 */
export default function PlaygroundLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="bg-background text-foreground">{children}</body>
    </html>
  );
}
