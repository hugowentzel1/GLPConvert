export function getBrandTheme(companyHandle?: string) {
  // map known brands to a primary hex
  const map: Record<string, string> = {
    meta: "#1877F2",
    facebook: "#1877F2",
    apple: "#0071E3",
    amazon: "#FF9900",
    google: "#4285F4",
    microsoft: "#00A4EF",
    netflix: "#E50914",
    spotify: "#1DB954",
    twitter: "#1DA1F2",
    linkedin: "#0A66C2",
    tesla: "#CC0000",
    zillow: "#006AFF",
    redfin: "#D21F3C",
    chase: "#117ACA",
    wellsfargo: "#D71E28",
    // default blue if none
    default: "#2563EB",
  };
  const key = (companyHandle || "").toLowerCase();
  console.log(
    "getBrandTheme: companyHandle=",
    companyHandle,
    "key=",
    key,
    "result=",
    map[key] || map.default,
  );
  return map[key] || map.default;
}
