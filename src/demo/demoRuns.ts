const KEY = "demo_runs_left";

export function getRuns(): number {
  return Number(localStorage.getItem(KEY) ?? 2);
}

export function decRun(): void {
  localStorage.setItem(KEY, String(Math.max(0, getRuns() - 1)));
}

export function resetRuns(): void {
  localStorage.setItem(KEY, "2");
}
