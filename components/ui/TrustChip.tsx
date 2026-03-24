import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface TrustChipProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "success" | "warning";
}

export function TrustChip({
  children,
  className,
  variant = "default",
}: TrustChipProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium",
        "bg-white/80 backdrop-blur-sm border border-gray-200/50",
        variant === "success" &&
          "text-green-700 bg-green-50/80 border-green-200/50",
        variant === "warning" &&
          "text-amber-700 bg-amber-50/80 border-amber-200/50",
        variant === "default" && "text-gray-700",
        className,
      )}
    >
      <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60"></div>
      {children}
    </div>
  );
}
