import { Plus, Trash2, GripVertical } from "lucide-react";
import { uid } from "@/lib/utils";
import type { ProductOption, ProductOptionChoice } from "@/types";

interface Props {
  value: ProductOption[];
  onChange: (options: ProductOption[]) => void;
}

export function CustomOptionsEditor({ value, onChange }: Props) {
  const addOption = () => {
    onChange([
      ...value,
      {
        id: uid("opt"),
        name: "",
        required: false,
        choices: [],
      },
    ]);
  };

  const removeOption = (optionId: string) => {
    onChange(value.filter((opt) => opt.id !== optionId));
  };

  const updateOption = (optionId: string, updates: Partial<ProductOption>) => {
    onChange(
      value.map((opt) =>
        opt.id === optionId ? { ...opt, ...updates } : opt
      )
    );
  };

  const addChoice = (optionId: string) => {
    onChange(
      value.map((opt) =>
        opt.id === optionId
          ? {
              ...opt,
              choices: [
                ...opt.choices,
                {
                  id: uid("choice"),
                  label: "",
                  priceModifier: 0,
                },
              ],
            }
          : opt
      )
    );
  };

  const removeChoice = (optionId: string, choiceId: string) => {
    onChange(
      value.map((opt) =>
        opt.id === optionId
          ? {
              ...opt,
              choices: opt.choices.filter((c) => c.id !== choiceId),
            }
          : opt
      )
    );
  };

  const updateChoice = (
    optionId: string,
    choiceId: string,
    updates: Partial<ProductOptionChoice>
  ) => {
    onChange(
      value.map((opt) =>
        opt.id === optionId
          ? {
              ...opt,
              choices: opt.choices.map((c) =>
                c.id === choiceId ? { ...c, ...updates } : c
              ),
            }
          : opt
      )
    );
  };

  return (
    <div className="space-y-4">
      {value.length === 0 && (
        <p className="text-sm text-ink-muted text-center py-4">
          Keine Custom-Optionen definiert. Klicken Sie auf "Option hinzufügen", um zu beginnen.
        </p>
      )}

      {value.map((option) => (
        <div
          key={option.id}
          className="border border-line rounded-lg p-4 bg-surface-alt space-y-3"
        >
          {/* Option Header */}
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-ink-muted mb-1">
                Name der Option *
              </label>
              <input
                type="text"
                value={option.name}
                onChange={(e) =>
                  updateOption(option.id, { name: e.target.value })
                }
                placeholder="z.B. Papierart, Veredelung, Größe"
                className="input text-sm"
              />
            </div>
            <button
              type="button"
              onClick={() => removeOption(option.id)}
              className="text-ink-muted hover:text-red-500 mt-6"
              title="Option löschen"
            >
              <Trash2 className="size-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`required-${option.id}`}
              checked={option.required}
              onChange={(e) =>
                updateOption(option.id, { required: e.target.checked })
              }
              className="rounded border-line"
            />
            <label
              htmlFor={`required-${option.id}`}
              className="text-sm text-ink-muted"
            >
              Pflichtfeld (Kunde muss auswählen)
            </label>
          </div>

          {/* Choices */}
          <div className="border-t border-line pt-3 mt-3">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-ink-muted">
                Auswahlmöglichkeiten
              </label>
              <button
                type="button"
                onClick={() => addChoice(option.id)}
                className="text-xs text-brand hover:underline flex items-center gap-1"
              >
                <Plus className="size-3" /> Auswahl hinzufügen
              </button>
            </div>

            <div className="space-y-2">
              {option.choices.length === 0 && (
                <p className="text-xs text-ink-muted text-center py-2">
                  Noch keine Auswahlmöglichkeiten definiert
                </p>
              )}

              {option.choices.map((choice) => (
                <div
                  key={choice.id}
                  className="flex items-center gap-2 bg-white p-2 rounded border border-line"
                >
                  <GripVertical className="size-4 text-ink-subtle" />
                  <input
                    type="text"
                    value={choice.label}
                    onChange={(e) =>
                      updateChoice(option.id, choice.id, {
                        label: e.target.value,
                      })
                    }
                    placeholder="Label (z.B. Matt 170g)"
                    className="input text-sm flex-1"
                  />
                  <div className="flex items-center gap-1 w-32">
                    <span className="text-xs text-ink-muted">+</span>
                    <input
                      type="number"
                      step="0.01"
                      value={choice.priceModifier}
                      onChange={(e) =>
                        updateChoice(option.id, choice.id, {
                          priceModifier: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="input text-sm w-full"
                    />
                    <span className="text-xs text-ink-muted">€</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeChoice(option.id, choice.id)}
                    className="text-ink-muted hover:text-red-500"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addOption}
        className="w-full py-3 border-2 border-dashed border-line rounded-lg text-sm text-ink-muted hover:text-brand hover:border-brand transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="size-4" /> Option hinzufügen
      </button>
    </div>
  );
}
