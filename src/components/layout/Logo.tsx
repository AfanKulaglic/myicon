import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      aria-label="MYICON Startseite"
      className={cn("inline-flex items-center group", className)}
    >
      <img
        src="/logo/logo text.png"
        alt="MYiCON – Qualität, die man sieht."
        className="h-10 w-auto object-contain"
      />
    </Link>
  );
}
