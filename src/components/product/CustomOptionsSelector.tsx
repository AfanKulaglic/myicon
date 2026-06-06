import { cn, formatCurrency } from "@/lib/utils";
import type { ProductOption } from "@/types";

interface Props {
  options: ProductOption[];
  selectedOptions: Record<string, string>; // optionId -> choiceId
  onChange: (optionId: string, choiceId: string) => void;
}

export function CustomOptionsSelector({ options, selectedOptions, onChange }: Props) {
  if (options.length === 0) return null;

  return (
    <div className="space-y-6">
      {options.map((option) => {
        const selected = selectedOptions[option.id];
        const selectedChoice = option.choices.find((c) => c.id === selected);

        return (
          <div key={option.id}>
            <label className="label flex items-center justify-between">
              <span>
                {option.name}
                {option.required && <span className="text-red-500 ml-1">*</span>}
              </span>
              {selectedChoice && selectedChoice.priceModifier > 0 && (
                <span className="text-sm font-normal text-brand">
                  +{formatCurrency(selectedChoice.priceModifier)}
                </span>
              )}
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
              {option.choices.map((choice) => {
                const isSelected = selected === choice.id;
                
                return (
                  <button
                    key={choice.id}
                    type="button"
                    onClick={() => onChange(option.id, choice.id)}
                    className={cn(
                      "relative px-4 py-3 rounded-lg border-2 text-left transition-all",
                      isSelected
                        ? "border-brand bg-brand/5"
                        : "border-line hover:border-brand/50"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className={cn(
                        "text-sm font-medium",
                        isSelected ? "text-brand" : "text-ink"
                      )}>
                        {choice.label}
                      </span>
                      {choice.priceModifier > 0 && (
                        <span className={cn(
                          "text-xs font-medium",
                          isSelected ? "text-brand" : "text-ink-muted"
                        )}>
                          +{formatCurrency(choice.priceModifier)}
                        </span>
                      )}
                    </div>

                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 size-5 rounded-full bg-brand flex items-center justify-center">
                        <svg className="size-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
