export type BrandKey =
  | "apple"
  | "amazon"
  | "meta"
  | "google"
  | "tesla"
  | "default";

export const REPORT_BRAND: Record<
  BrandKey,
  {
    primary: string;
    accent: string;
    mutedBg: string;
    unlockBlack: string;
  }
> = {
  apple: {
    primary: "#0071e3",
    accent: "#1d4ed8",
    mutedBg: "#f1f5ff",
    unlockBlack: "#0a0a0a",
  },
  amazon: {
    primary: "#ff9900",
    accent: "#cc7a00",
    mutedBg: "#fff7ed",
    unlockBlack: "#0a0a0a",
  },
  meta: {
    primary: "#0866ff",
    accent: "#1d4ed8",
    mutedBg: "#eef3ff",
    unlockBlack: "#0a0a0a",
  },
  google: {
    primary: "#1a73e8",
    accent: "#1558d6",
    mutedBg: "#eef3ff",
    unlockBlack: "#0a0a0a",
  },
  tesla: {
    primary: "#e82127",
    accent: "#b3181d",
    mutedBg: "#fff1f2",
    unlockBlack: "#0a0a0a",
  },
  default: {
    primary: "#0866ff",
    accent: "#1d4ed8",
    mutedBg: "#eef3ff",
    unlockBlack: "#0a0a0a",
  },
};

export function resolveReportBrand(
  host?: string,
  searchParams?: URLSearchParams,
): BrandKey {
  const q = searchParams?.get("company")?.toLowerCase();
  const sub = host?.split(".")[0]?.toLowerCase();
  const k = (q || sub) as BrandKey;
  return k && REPORT_BRAND[k] ? k : "default";
}
