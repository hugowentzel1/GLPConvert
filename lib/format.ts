export function formatDateSafe(d: unknown) {
  if (d instanceof Date) return d.toLocaleDateString();
  if (typeof d === "number") return new Date(d).toLocaleDateString();
  if (typeof d === "string") {
    const dt = new Date(d);
    return isNaN(dt.getTime()) ? String(d) : dt.toLocaleDateString();
  }
  return "";
}

export function cashflowToSeries(cum: number[]) {
  return cum.map((v, i) => ({ year: i, label: `Year ${i}`, value: v }));
}
