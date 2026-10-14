import { useSyncExternalStore } from "react";

/**
 * Señal "la escena 3D ya tiene sus assets (GLB + texturas)". La escribe `<SceneReady>`
 * (dentro del Suspense de la escena) y la lee `<LoadingScreen>`. Es estado de UI, no por frame.
 */
let sceneReady = false;
const listeners = new Set<() => void>();

export function markSceneReady() {
  if (sceneReady) return;
  sceneReady = true;
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useSceneReady() {
  return useSyncExternalStore(
    subscribe,
    () => sceneReady,
    () => false,
  );
}
