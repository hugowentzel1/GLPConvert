import * as React from "react";

// Consistent, trust-building avatar with brand-colored ring
// Research: consistent styling increases trust; white center ensures WCAG AA contrast
export default function AvatarInitials({
  name,
  size = 40,
  variant = "duo",
  className = "",
}: {
  name: string;
  size?: number;
  variant?: "duo";
  className?: string;
}) {
  const initials = React.useMemo(() => {
    if (!name?.trim()) return "??";
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + last).toUpperCase();
  }, [name]);

  // OPTION 3: Glassmorphism ⭐ with MORE VISIBLE company-colored ring - frosted glass with backdrop blur
  const skin = `text-gray-800 relative`;
  
  // Multi-layered shadow + MORE VISIBLE brand ring (35% opacity instead of 20%)
  const shadowStyle = {
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)', // Safari support
    boxShadow: '0 8px 24px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9), 0 0 0 2.5px color-mix(in srgb, var(--brand-primary, #e11d48) 35%, transparent)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
  };

  const style: React.CSSProperties = { 
    width: size, 
    height: size,
    fontSize: Math.round(size * 0.38), // 38% for slightly smaller text
    lineHeight: 1, // Reset line height for perfect centering
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadowStyle // Apply 3D depth shadow
  };
  
  return (
    <div
      className={`rounded-full font-semibold tracking-tight ${skin} ${className}`}
      style={style}
      aria-label={`Avatar for ${name}`}
      data-testid="avatar-initials"
    >
      {initials}
    </div>
  );
}
