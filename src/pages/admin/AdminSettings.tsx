import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { setAdminCode } from "@/lib/firestore";
import { Button } from "@/components/ui/Button";
import { toast } from "@/store/toast";
import { useT } from "@/hooks/useT";
import { Eye, EyeOff } from "lucide-react";

type V = { code: string; confirm: string };

export default function AdminSettings() {
  const t = useT();
  const [showNew, setShowNew] = useState(false);

  const schema = z.object({
    code: z.string().min(4, t("admin.settings.placeholder")),
    confirm: z.string(),
  }).refine((d) => d.code === d.confirm, { message: t("admin.settings.confirmPlaceholder"), path: ["confirm"] });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<V>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (v: V) => {
    await setAdminCode(v.code);
    toast({ title: t("admin.settings.codeSaved"), description: t("admin.settings.codeSavedDesc") });
    reset();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-lg">
      <h1 className="text-2xl font-semibold">{t("admin.settings.title")}</h1>

      <div className="card p-5 space-y-4">
        <h2 className="font-semibold">{t("admin.settings.changeCode")}</h2>
        <p className="text-sm text-ink-muted">{t("admin.settings.codeDesc")}</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="relative">
            <label className="label">{t("admin.settings.newCode")}</label>
            <input
              type={showNew ? "text" : "password"}
              className="input pr-10"
              {...register("code")}
              placeholder={t("admin.settings.placeholder")}
            />
            <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-[calc(50%+8px)] text-ink-muted hover:text-ink">
              {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
            {errors.code && <p className="text-xs text-red-500 mt-1">{errors.code.message}</p>}
          </div>
          <div>
            <label className="label">{t("admin.settings.confirmCode")}</label>
            <input type="password" className="input" {...register("confirm")} placeholder={t("admin.settings.confirmPlaceholder")} />
            {errors.confirm && <p className="text-xs text-red-500 mt-1">{errors.confirm.message}</p>}
          </div>
          <Button type="submit" loading={isSubmitting}>{t("admin.settings.saveCode")}</Button>
        </form>
      </div>
    </div>
  );
}
