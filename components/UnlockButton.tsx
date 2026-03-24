import { Lock } from "lucide-react";

type Props = {
  label?: string; // e.g., "Unlock Full Report" / "See exact cost"
  onClick?: () => void;
  className?: string; // for positioning (absolute bottom-center on cards)
  ariaLabel?: string;
};

export default function UnlockButton({
  label = "Unlock Full Report",
  onClick,
  className = "",
  ariaLabel,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel ?? label}
      className={[
        // layout - match c548b88 exactly
        "unlock-pill",
        "inline-flex items-center justify-center gap-2",
        "h-11 px-5 min-w-[220px] whitespace-nowrap rounded-full",
        // solid company color + depth - match c548b88 exactly
        "bg-[var(--brand)] text-white shadow-[0_6px_18px_rgba(0,0,0,.18)]",
        // interaction - match c548b88 exactly
        "transition-transform duration-150 will-change-transform",
        "hover:scale-[1.01] hover:shadow-[0_10px_24px_rgba(0,0,0,.22)]",
        "active:translate-y-[1px] active:brightness-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2",
        className,
      ].join(" ")}
    >
      <Lock size={16} aria-hidden className="shrink-0" />
      <span className="font-semibold tracking-[-0.01em]">{label}</span>
    </button>
  );
}
