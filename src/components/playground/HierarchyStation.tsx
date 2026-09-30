"use client";

import { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { BoxGeometry, MathUtils, SphereGeometry } from "three";
import { Slider } from "./Slider";
import { ConceptNote } from "./ConceptNote";

const UPPER = 1.2; // largo del brazo superior
const FORE = 1.0; // largo del antebrazo
const HAND = 0.45; // largo de la mano

/** Caja que empieza en el pivote (x=0) y se extiende hacia +X, en vez de quedar centrada en su pivote. */
function segmentGeometry(length: number) {
  return new BoxGeometry(length, 0.22, 0.22).translate(length / 2, 0, 0);
}

const PIVOT_GEOMETRY = new SphereGeometry(0.07, 16, 16);

/** Estación 3: un brazo con hombro → codo → muñeca, para ver cómo se propagan las rotaciones entre grupos anidados. */
export function HierarchyStation() {
  const [shoulder, setShoulder] = useState(20);
  const [elbow, setElbow] = useState(-35);
  const [wrist, setWrist] = useState(15);
  const [showPivots, setShowPivots] = useState(true);

  const geoms = useMemo(
    () => ({ upper: segmentGeometry(UPPER), fore: segmentGeometry(FORE), hand: segmentGeometry(HAND) }),
    [],
  );

  const rad = (deg: number) => MathUtils.degToRad(deg);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <div className="relative h-[65svh] w-full overflow-hidden rounded-2xl border border-white/10 bg-black/30 lg:h-[70svh]">
        <Canvas camera={{ position: [1.2, 1, 5.5], fov: 35 }} dpr={[1, 2]}>
          <color attach="background" args={["#0b0b10"]} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[3, 4, 5]} intensity={1} />

          <gridHelper args={[6, 12, "#4a4a58", "#22222a"]} position={[0, -1.3, 0]} />

          {/* Hombro: pivote en el origen del group. */}
          <group rotation={[0, 0, rad(shoulder)]}>
            <mesh geometry={geoms.upper}>
              <meshStandardMaterial color="#8fe9ff" metalness={0.3} roughness={0.4} />
            </mesh>
            {showPivots && (
              <mesh geometry={PIVOT_GEOMETRY}>
                <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} />
              </mesh>
            )}

            {/* Codo: este group vive en la PUNTA del brazo superior — ahí queda su pivote. */}
            <group position={[UPPER, 0, 0]} rotation={[0, 0, rad(elbow)]}>
              <mesh geometry={geoms.fore}>
                <meshStandardMaterial color="#ff9ad5" metalness={0.3} roughness={0.4} />
              </mesh>
              {showPivots && (
                <mesh geometry={PIVOT_GEOMETRY}>
                  <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} />
                </mesh>
              )}

              {/* Muñeca: mismo truco, en la punta del antebrazo. */}
              <group position={[FORE, 0, 0]} rotation={[0, 0, rad(wrist)]}>
                <mesh geometry={geoms.hand}>
                  <meshStandardMaterial color="#ffd166" metalness={0.3} roughness={0.4} />
                </mesh>
                {showPivots && (
                  <mesh geometry={PIVOT_GEOMETRY}>
                    <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} />
                  </mesh>
                )}
              </group>
            </group>
          </group>

          <OrbitControls enableDamping dampingFactor={0.08} minDistance={2.5} maxDistance={12} />
        </Canvas>
      </div>

      <div className="flex flex-col gap-4">
        <ConceptNote title="Un group ES un pivote">
          Cada <code>&lt;group&gt;</code> tiene su propio origen local. Rotar el group rota TODO lo que está adentro
          alrededor de ese punto — no del centro de la geometría. Por eso cada segmento del brazo es una caja que
          empieza en x=0 (el pivote) y se estira hacia +X, en vez de quedar centrada.
        </ConceptNote>
        <ConceptNote title="Anidar = heredar transformación">
          El group del codo vive DENTRO del group del hombro, en la punta del brazo superior. Girar el hombro mueve
          el codo entero (y la muñeca, adentro de él) aunque sus propios ángulos no cambien: cada hijo hereda la
          transformación de su padre y le suma la propia.
        </ConceptNote>
        <ConceptNote title="Esto es lo que hacen tab/ring/cap">
          En <code>CanPlaceholderModel.tsx</code> el mismo principio se logra distinto: en vez de anidar groups, la
          geometría se traslada y el mesh se deja parado en el pivote (el remache). Dos formas de llegar a lo mismo:
          el pivote de un objeto es lo que importa, no el centro de su forma.
        </ConceptNote>

        <div className="flex flex-col gap-3 rounded-lg border border-white/10 p-3">
          <Slider label="Hombro" value={shoulder} min={-150} max={150} step={1} unit="°" onChange={setShoulder} />
          <Slider label="Codo" value={elbow} min={-150} max={150} step={1} unit="°" onChange={setElbow} />
          <Slider label="Muñeca" value={wrist} min={-150} max={150} step={1} unit="°" onChange={setWrist} />
          <label className="mt-1 flex items-center gap-2 text-sm text-foreground/70">
            <input type="checkbox" checked={showPivots} onChange={(e) => setShowPivots(e.target.checked)} />
            Mostrar pivotes (esferas blancas)
          </label>
        </div>
      </div>
    </div>
  );
}
