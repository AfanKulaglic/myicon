import { Minus, Plus } from "lucide-react";

interface Props {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function QuantitySelector({ value, onChange, min = 1, max = 9999, step = 1 }: Props) {
  return (
    <div className="inline-flex items-center border border-line rounded-lg overflow-hidden h-10">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - step))}
        className="size-10 inline-flex items-center justify-center hover:bg-surface-alt text-ink-muted"
        aria-label="Weniger"
      >
        <Minus className="size-4" />
      </button>
      <input
        type="number"
        value={value}
        onChange={(e) => {
          const v = Number(e.target.value);
          if (!Number.isNaN(v)) onChange(Math.min(max, Math.max(min, v)));
        }}
        className="w-14 text-center text-sm outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + step))}
        className="size-10 inline-flex items-center justify-center hover:bg-surface-alt text-ink-muted"
        aria-label="Mehr"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
