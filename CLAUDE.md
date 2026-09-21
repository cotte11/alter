# ALTER — Web inmersiva (React Three Fiber + GSAP)

@AGENTS.md

## Contexto
ALTER es una marca de bebidas energéticas cuyo concepto son los **carnavales latinoamericanos**. La web es una landing inmersiva de 6 secciones donde el **envase 3D** es el protagonista: con el scroll se desplaza, se posiciona, se abre y cambia de estado.

Productos (4 sabores, cada uno = un carnaval; **aún sin definir**, ver `src/config/flavors.ts`):
- 2 sabores en **lata de aluminio 250 ml** (anilla)
- 2 sabores en **botella de aluminio 500 ml** (tapa a rosca)

Solo hay **2 mallas base** (lata y botella). Los sabores se diferencian por **textura de etiqueta**, no por modelo. Los modelos se hacen en Cinema 4D y se exportan en GLB. **Los materiales del aluminio se definen en código** (`src/components/three/materials.tsx`), no vienen en el GLB.

Idioma del sitio: **español**.

## Estructura de la landing
1. **Hero** — logo ALTER + envase girando al centro + invitación a scrollear
2. **Carnaval 1 (lata)** — entra, gira, se abre la anilla, partículas del carnaval
3. **Carnaval 2 (lata)** — la etiqueta cambia de sabor con un shader; nueva paleta y partículas
4. **Carnaval 3 (botella)** — transición lata → botella; la tapa se desenrosca con el scroll
5. **Carnaval 4 (botella)** — cambio de etiqueta de sabor
6. **Línea completa** — los 4 envases juntos + dónde comprar + footer con legales

## Stack (versiones fijadas)
Next.js 16 (App Router) · React **19.2.x** · TypeScript · Tailwind 4 · three 0.186 · @react-three/fiber 9.7 · drei 10.7 · @react-three/postprocessing 3.1 · gsap 3.15 + @gsap/react · lenis 1.3 · @gltf-transform/cli 4.5.

> **No subir React a 19.3+**: `@react-three/fiber@9.7` declara `react/react-dom >=19 <19.3`. Verificar peers antes de actualizar React, Next o R3F.

Next 16 tiene cambios respecto de versiones previas: consultar `node_modules/next/dist/docs/` (ver AGENTS.md).

## Arquitectura
- **Un único `<Canvas>`** (`components/three/SceneCanvas.tsx`) en `position: fixed`, `z-0`, `pointer-events-none`, detrás del contenido (`<main class="z-10">`). Se carga solo en cliente: `SceneLoader.tsx` usa `next/dynamic` con `ssr:false`.
- **Poses y estados centralizados en `src/config/poses.ts`**: por sección, `pose` (al llegar) y `during` (mientras la sección está fija), con override `mobile`. Es lo único que se toca para ajustar la coreografía.
- **`src/hooks/useScrollChoreography.ts`** crea los ScrollTrigger (scrub) leyendo esa config y escribe en un objeto mutable (`src/lib/scrollState.ts` → `channels`). La escena lo lee en `useFrame` (sin re-renders de React). Cada sección HTML se enlaza por su **`id`** (`SectionId`).
  - Entrada de sección: `top bottom → top top` (estado final de la anterior → `pose`). Durante: `top top → bottom bottom` (`pose` → `pose+during`). Las secciones usan `SectionShell` (alto en `svh` + contenido sticky) para dar recorrido de scroll.
  - `gsap.matchMedia`: el callback solo corre si alguna condición coincide, por eso existe la condición `desktop`. Con `prefers-reduced-motion` no hay scrub: se salta al estado de cada sección y se apaga el giro continuo.
- **Lenis ↔ GSAP**: `components/providers/SmoothScroll.tsx` (`autoRaf:false`, `gsap.ticker.add`, `lagSmoothing(0)`, `lenis.on('scroll', ScrollTrigger.update)`). Desactivado con reduced-motion.
- **Calidad**: `src/config/quality.ts` (tiers `high`/`low`: dpr, antialias, postprocesado, nº de partículas, tamaño de textura, resolución de entorno). Mobile/equipos modestos → `low` (menos partículas, texturas 1024, sin postprocesado). Forzable con `?quality=low|high`.
- **Entorno**: procedural (`Lightformer`) para no depender de descargas; cambiar por HDRI en `public/hdri/` cuando exista.
- En dev, `window.__alter = { channels, runtime }` permite inspeccionar el estado del scroll.

## Convención de nombres en los GLB (contrato con Cinema 4D)
Cada GLB tiene sus piezas como **objetos hijos separados con nombre exacto y pivote correcto** (el código las busca con `getObjectByName`):
- **Lata** (`can.glb`): `body`, `tab`, `ring`. Pivote de `tab` y `ring` en el remache. *Provisorio*: `ring` = anilla que se levanta (rotación X), `tab` = pestaña/panel que se hunde. Confirmar con quien modela.
- **Botella** (`bottle.glb`): `body`, `cap`. Pivote de `cap` en el centro de su base, eje Y = eje del roscado (la tapa gira en Y y sube).
- Un mesh por nombre; sin transformaciones aplicadas de forma que rompan el pivote.

Hoy hay **placeholders** con esa misma estructura: `components/three/products/CanPlaceholderModel.tsx` y `BottlePlaceholderModel.tsx`. Para integrar los GLB reales: reemplazar el contenido de esos componentes por `useGLTF("/models/can.glb")` / `bottle.glb` (drei soporta meshopt por defecto) y aplicar `AluminiumMaterial`; la lógica de animación (`Can.tsx`, `Bottle.tsx`) no cambia. Escala de referencia del placeholder: lata alto 2, botella alto ≈ 2.66.

## Dónde van los assets
- `assets-source/` — fuentes (Cinema 4D, Illustrator, Photoshop, GLB sin optimizar en `assets-source/glb-raw/`). **Excluida de git.**
- `public/models/` — GLB **optimizados** (`can.glb`, `bottle.glb`)
- `public/textures/labels/` — etiquetas por sabor (`<id-sabor>.webp`, ver `labelTexture` en `flavors.ts`)
- `public/hdri/` — mapas de entorno

### Optimizar modelos
`npm run optimize:models` (opciones: `-- --draco`, `-- --texture-size 1024`) toma `assets-source/glb-raw/*.glb` → `public/models/`. Usa meshopt + KTX2 (si `toktx` está instalado; si no, WebP). **Desactiva flatten/join/instance/palette/simplify a propósito**: destruirían los objetos con nombre y sus pivotes. Draco requeriría configurar el decoder (por defecto drei lo baja de un CDN); por eso el default es meshopt.

## Estructura de carpetas
```
src/app/                       layout, page, globals.css
src/components/sections/       Hero, Carnival1-4, FullLine, Footer, SectionShell, ScrollChoreography
src/components/three/          SceneLoader, SceneCanvas, Scene, materials
src/components/three/products/ Can, Bottle (comportamiento), *PlaceholderModel, MainProduct, LineUp
src/components/three/particles/ (vacío: pendiente)
src/components/providers/      SmoothScroll (Lenis)
src/config/                    flavors.ts, poses.ts, quality.ts
src/hooks/                     useScrollChoreography, useQualityTier, useReducedMotion
src/lib/                       gsap.ts (registro de plugins), scrollState.ts
src/shaders/                   (vacío: shader de transición de etiquetas, pendiente)
scripts/optimize-models.mjs
```

## Convenciones
- Contenido y UI en español. Componentes de sección = server components; solo lo interactivo/3D lleva `"use client"`.
- Nunca hacer `setState` por frame ni animar el envase con estado de React: escribir/leer `channels` (mutable) y usar `useFrame`.
- Toda constante de coreografía va en `config/poses.ts`; datos de sabores en `config/flavors.ts`; ajustes de calidad en `config/quality.ts`.
- Usar `import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap"` (plugins ya registrados).
- Placeholders marcados como tales (textos "por definir", `*PlaceholderModel`).

## Estado
Hecho: base del proyecto, 6 secciones maquetadas, Canvas fijo, Lenis+ScrollTrigger validados con placeholders (cada sección cambia la pose/estado del envase), script de optimización.
Pendiente: modelos GLB reales, definir los 4 carnavales/sabores, texturas de etiqueta, shader de cambio de etiqueta (`src/shaders/`), partículas por carnaval (`three/particles/`), animaciones finales según storyboard, contenido/copy final, "dónde comprar" real, legales, HDRI, deploy en Vercel.
