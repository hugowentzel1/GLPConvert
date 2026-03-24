import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatTileProps {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  hint?: string;
  className?: string;
}

export default function StatTile({
  label,
  value,
  icon,
  hint,
  className,
}: StatTileProps) {
  return (
    <div className={cn("card p-6", className)}>
      <div className="space-y-3">
        {icon && (
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 text-[var(--brand-2)]">
            {icon}
          </div>
        )}

        <div className="text-center">
          <div className="text-3xl md:text-4xl font-black text-[var(--ink)] leading-none">
            {value}
          </div>
          <div className="text-sm text-[var(--muted)] font-medium mt-1">
            {label}
          </div>
          {hint && (
            <div className="text-xs text-[var(--muted)] mt-1">{hint}</div>
          )}
        </div>
      </div>
    </div>
  );
}
