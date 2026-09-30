"use client";

interface Props {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  /** Sufijo del valor mostrado, ej. "°" para grados o "x" para escala. */
  unit?: string;
  onChange: (value: number) => void;
}

/** Slider genérico con label + valor numérico, para no repetir el markup en cada control. */
export function Slider({ label, value, min, max, step = 0.01, unit = "", onChange }: Props) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="flex items-baseline justify-between text-foreground/60">
        <span>{label}</span>
        <span className="font-mono text-xs tabular-nums text-foreground">
          {value.toFixed(2)}
          {unit}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="accent-foreground"
      />
    </label>
  );
}
