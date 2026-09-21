"use client";

import { useState } from "react";
import { QUALITY, detectQualityTier, type QualitySettings } from "@/config/quality";

/** Solo usar en componentes que se renderizan únicamente en cliente. */
export function useQualityTier(): QualitySettings {
  const [settings] = useState(() => QUALITY[detectQualityTier()]);
  return settings;
}
