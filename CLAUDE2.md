# ALTER — Web de producto

Landing inmersiva para ALTER, bebida energizante inspirada en los carnavales latinoamericanos.
El usuario llega escaneando el QR de la etiqueta, con el producto en la mano y casi siempre desde el celular.

**Objetivo:** mostrar los 4 envases en 3D y generar ganas de probar los otros tres sabores.

## Concepto de marca

* "Alter": la bebida deja salir tu otra versión, la oculta. Tagline: **Tu mejor versión**.
* Cada sabor tiene un **personaje** de carnaval. Te tomás la bebida según el personaje que querés encarnar.
* **Sin jerarquía entre productos:** ningún envase es protagonista sobre otro (salvo el saludo por QR, ver abajo).
* Tono: alegre, dinámico, festivo. Nada de fondos negros ni estética sombría.

## Productos

|Personaje|Color|Sabor|Envase|Textura|
|-|-|-|-|-|
|Lucifer|Verde|Manzana|Lata 275 ml|/textures/lucifer.png|
|Supay|Rojo|Frutilla|Lata 275 ml|/textures/supay.png|
|Pujllay|Celeste|Arándano|Botella aluminio 500 ml, tapa a rosca|/textures/pujllay.png|
|Marimonda|Amarillo|Limón|Botella aluminio 500 ml, tapa a rosca|/textures/marimonda.png|

Mantener la **escala real** entre lata y botella: la diferencia de tamaño comunica el formato.

## Stack

* Next.js 16 (App Router) + React 19 — **decidido y confirmado** (ver `CLAUDE.md`). Este brief mencionaba originalmente Vite, pero el proyecto ya está construido sobre Next.js y se mantiene así.
* React Three Fiber + @react-three/drei
* GSAP + ScrollTrigger (scroll y timelines, siempre con `scrub`)
* Deploy: Vercel

## Reglas técnicas

* **Mobile-first.** Diseñar y probar primero a 390 px de ancho; desktop es la versión ampliada.
* **Un solo `<Canvas>` fijo** detrás de todo el sitio. Los envases no se desmontan entre secciones: cambian posición, rotación y estado.
* Envases generados con **`LatheGeometry`** a partir de un perfil, con la etiqueta como textura. Más adelante se reemplazan por .glb desde Cinema 4D (tapa y anilla como objetos separados) **sin tocar las animaciones**: aislar la geometría en un componente por envase.
* Tapa de botella y anilla de lata: meshes separados, animables.
* Personajes: planos con PNG + alfa (efecto 2.5D), en /characters.
* Colores de fondo: variables CSS animadas por GSAP, no dentro del canvas.
* Performance: `dpr` limitado a \[1, 2]; bajar o pausar el render en secciones sin 3D protagonista. Texturas en webp. Modelos .glb < 2 MB con Draco.
* Respetar `prefers-reduced-motion`: animaciones reducidas y sin shaders de distorsión.

## Parámetro de QR

Cada etiqueta lleva un QR distinto: `/?alter=lucifer|supay|pujllay|marimonda`.
La web es la misma para todos; el parámetro solo hace que el hero frene un momento con ese personaje al frente. Sin parámetro, la ronda gira normal.

## Paleta (aproximada — reemplazar con los hex del archivo de diseño)

* Verde Lucifer: `#009544`
* Rojo Supay: `#e20917`
* Celeste Pujllay: `#33a5de`
* Amarillo Marimonda: `#fcc000`
* Blanco: `#FFFFFF` · Negro de trazo: `#111111`

## Tipografías

* Display (nombres de personajes y sabores): ShadowHand → "C:\\Users\\Usuario\\Downloads\\ShadowHand.ttf"
* Texto: DIN 2014
* El logo "alter" va como SVG, no como fuente.

## Estructura de assets

```
/public
  /textures    etiquetas planas (\~2048 px de ancho)
  /characters  personajes recortados, PNG con alfa
  /photos      fotos de corsos y carnavales
  /fonts       woff2
  /models      .glb (cuando estén)
```

## Plazos

* Entrega: 9 de octubre de 2026. Objetivo interno: 4 de octubre.
* Orden de trabajo: esqueleto con placeholders → hero → manifiesto → personajes → carnaval → cierre → pulido mobile y performance.

## Guion

El guion completo de secciones está en `GUION.md`.

