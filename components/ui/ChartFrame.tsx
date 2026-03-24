import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ChartFrameProps {
  title?: string;
  children: ReactNode;
  zeroLine?: boolean;
  paybackYear?: number | null;
  className?: string;
}

export default function ChartFrame({
  title,
  children,
  zeroLine,
  paybackYear,
  className,
}: ChartFrameProps) {
  return (
    <div className={cn("card p-6 relative", className)}>
      {title && (
        <h3 className="text-xl font-bold text-[var(--ink)] mb-6">{title}</h3>
      )}

      <div className="relative">
        {zeroLine && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-full h-px bg-[var(--border)] opacity-50"></div>
          </div>
        )}

        {paybackYear && (
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-0 bottom-0 w-px bg-[var(--warn)] opacity-30"
              style={{ left: `${(paybackYear / 25) * 100}%` }}
            ></div>
            <div
              className="absolute bottom-0 text-xs text-[var(--warn)] font-medium"
              style={{
                left: `${(paybackYear / 25) * 100}%`,
                transform: "translateX(-50%)",
              }}
            >
              {paybackYear}y
            </div>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
