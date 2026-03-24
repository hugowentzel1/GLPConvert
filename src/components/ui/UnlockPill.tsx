import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: string;
};

export default function UnlockPill({
  label = "Unlock Full Report",
  className = "",
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      className={[
        // layout
        "inline-flex items-center justify-center gap-2",
        "h-10 min-w-[216px] sm:min-w-[228px] px-5 rounded-full",
        "whitespace-nowrap text-[14px] leading-none font-semibold",
        "text-white text-center shrink-0",
        // color & behavior
        "pill-brand no-blur shadow-[0_6px_22px_rgba(0,0,0,.12)] hover:brightness-95 active:brightness-90",
        "transition-[filter,opacity,transform]",
        className,
      ].join(" ")}
    >
      <span aria-hidden className="leading-none">
        🔒
      </span>
      <span className="leading-none">
        {label}&nbsp;<span aria-hidden>→</span>
      </span>
    </button>
  );
}
