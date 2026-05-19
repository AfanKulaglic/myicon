import { useRef, useState } from "react";
import { uploadImage, isRemoteUploadEnabled } from "@/lib/storage";
import { Upload, Link as LinkIcon, X } from "lucide-react";

interface Props {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}

export function ImageUploader({ value, onChange, folder, label = "Bild" }: Props) {
  const [tab, setTab] = useState<"url" | "upload">("url");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    setError("");
    setInfo(null);
    try {
      const url = await uploadImage(file, folder);
      if (url.startsWith("http")) {
        setInfo("Hochgeladen");
      } else {
        const bytes = Math.round((url.length * 3) / 4);
        setInfo(`Komprimiert: ${Math.round(bytes / 1024)} KB`);
      }
      onChange(url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload fehlgeschlagen.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="label">{label}</label>

      <div className="flex gap-1 border border-line rounded-lg p-0.5 bg-surface-alt w-fit">
        <button
          type="button"
          onClick={() => setTab("url")}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition-colors ${tab === "url" ? "bg-white shadow-sm font-medium text-ink" : "text-ink-muted"}`}
        >
          <LinkIcon className="size-3.5" /> URL
        </button>
        <button
          type="button"
          onClick={() => setTab("upload")}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition-colors ${tab === "upload" ? "bg-white shadow-sm font-medium text-ink" : "text-ink-muted"}`}
        >
          <Upload className="size-3.5" /> Hochladen
        </button>
      </div>

      {tab === "url" ? (
        <input
          type="text"
          className="input"
          placeholder="https://... oder /mockups/..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <div
          className="border-2 border-dashed border-line rounded-lg p-4 text-center cursor-pointer hover:border-brand transition-colors"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
          {uploading ? (
            <p className="text-sm text-ink-muted animate-pulse">
              {isRemoteUploadEnabled() ? "Wird hochgeladen…" : "Wird komprimiert…"}
            </p>
          ) : (
            <p className="text-sm text-ink-muted">
              Datei hierher ziehen oder <span className="text-brand underline">auswählen</span>
            </p>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
      {info && !error && (
        <p className="text-xs text-ink-muted">{info}</p>
      )}

      {value && (
        <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-line bg-surface-alt">
          <img src={value} alt="preview" className="size-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow text-ink-muted hover:text-red-500"
          >
            <X className="size-3" />
          </button>
        </div>
      )}
    </div>
  );
}
