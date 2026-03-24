export type CTAKey = "primary" | "footer" | "inline";

export function getCTA(
  variant: "A" | "B",
  key: CTAKey,
  domain?: string | null,
) {
  const benefit = domain ? `on ${domain}` : "for your site";
  const A = {
    primary: "Launch Your Solar Tool",
    footer: "Get This Live in 24 Hours",
    inline: "Launch Your Branded Version Now",
  };
  const B = {
    primary: `Add to ${benefit}`,
    footer: "Start Generating Leads Today",
    inline: "Unlock Full Report",
  };
  return (variant === "A" ? A : B)[key];
}
