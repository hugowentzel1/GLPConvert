import React from "react";

type Props = {
  active: boolean; // pass demoMode === true
  children: React.ReactNode; // the metric card's value area
  label?: string; // default "Unlock Full Report"
  className?: string; // extra classes for sizing
};

export default function LockedBlur({
  active,
  children,
  label = "Unlock Full Report",
  className = "",
}: Props) {
  if (!active) return <>{children}</>;
  return (
    <div className={`locked-blur ${className}`}>
      <div className="locked-blur__content">{children}</div>
      <div className="locked-blur__overlay" aria-hidden="true">
        <span className="locked-blur__text">{label}</span>
      </div>
    </div>
  );
}
