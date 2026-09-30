"use client";

import { useTexture } from "@react-three/drei";
import { LinearFilter, SRGBColorSpace, type Texture } from "three";
import { useQualityTier } from "@/hooks/useQualityTier";

/** Evita subir a la GPU más resolución de la que el tier de calidad permite (`quality.ts`). */
function capTextureSize(texture: Texture, maxSize: number) {
  const image = texture.image as { width: number; height: number } | undefined;
  if (!image || (image.width <= maxSize && image.height <= maxSize)) return;

  const scale = maxSize / Math.max(image.width, image.height);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);
  const ctx = canvas.getContext("2d");
  ctx?.drawImage(image as CanvasImageSource, 0, 0, canvas.width, canvas.height);

  texture.image = canvas;
  texture.needsUpdate = true;
}

/**
 * Carga las dos texturas de etiqueta (sabor A/B) ya preparadas para uso como `map`:
 * espacio de color sRGB y tamaño acotado al tier de calidad activo (`quality.ts`).
 * El crossfade en sí se resuelve con dos mallas superpuestas (ver Can/Bottle), no acá.
 */
export function useLabelTextures(textureAUrl: string, textureBUrl: string) {
  const { maxTextureSize } = useQualityTier();

  return useTexture([textureAUrl, textureBUrl], (loaded) => {
    for (const texture of loaded as Texture[]) {
      texture.colorSpace = SRGBColorSpace;
      capTextureSize(texture, maxTextureSize);
      // Sin mipmaps: la mitad de memoria de textura, y estos envases no se ven
      // nunca lo bastante chicos como para que se note el aliasing.
      texture.generateMipmaps = false;
      texture.minFilter = LinearFilter;
      // Las UV vienen del GLB (convención glTF: origen arriba-izquierda, flipY=false).
      // TextureLoader asume la convención clásica de three (flipY=true) por defecto,
      // así que sin esto la etiqueta queda invertida verticalmente.
      texture.flipY = false;
    }
  }) as [Texture, Texture];
}
