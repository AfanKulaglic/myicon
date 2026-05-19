import { createContext, useContext, useCallback, type ReactNode } from "react";

interface PreviewContextValue {
  focusField: (fieldId: string, section?: string) => void;
}

const PreviewContext = createContext<PreviewContextValue>({ focusField: () => {} });

export function PreviewProvider({
  children,
  onSectionChange,
}: {
  children: ReactNode;
  onSectionChange?: (section: string) => void;
}) {
  const focusField = useCallback(
    (fieldId: string, section?: string) => {
      const doFocus = () => {
        const el = document.querySelector<HTMLElement>(`[data-field-id="${fieldId}"]`);
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        const input = el.querySelector<HTMLElement>("input, textarea, select") ?? el;
        setTimeout(() => {
          input.focus({ preventScroll: true });
          el.classList.add("ring-2", "ring-brand", "ring-offset-2", "rounded-lg");
          setTimeout(() => el.classList.remove("ring-2", "ring-brand", "ring-offset-2", "rounded-lg"), 1500);
        }, 350);
      };

      if (section && onSectionChange) {
        onSectionChange(section);
        setTimeout(doFocus, 200);
      } else {
        doFocus();
      }
    },
    [onSectionChange],
  );

  return (
    <PreviewContext.Provider value={{ focusField }}>
      {children}
    </PreviewContext.Provider>
  );
}

export function usePreview() {
  return useContext(PreviewContext);
}

/** Wraps a preview element — clicking it switches section tab and scrolls to the matching form input */
export function PreviewEl({
  fieldId,
  section,
  children,
  className = "",
  as: Tag = "div",
}: {
  fieldId: string;
  section?: string;
  children: ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}) {
  const { focusField } = usePreview();
  const El = Tag as React.ElementType;
  return (
    <El
      className={`relative cursor-pointer outline outline-2 outline-transparent hover:outline-brand/60 hover:outline-offset-2 rounded transition-[outline-color] group ${className}`}
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        focusField(fieldId, section);
      }}
      title="Click to edit"
    >
      {children}
      <span className="absolute -top-5 left-0 hidden group-hover:flex items-center gap-1 text-[10px] font-medium text-white bg-brand px-1.5 py-0.5 rounded whitespace-nowrap z-50 pointer-events-none">
        ✎ Edit
      </span>
    </El>
  );
}
