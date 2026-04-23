const STORAGE_KEY = "glp-intake:preflight-until";

function session(): Storage | null {
  if (typeof globalThis === "undefined") return null;
  try {
    const s = globalThis.sessionStorage;
    return s && typeof s.getItem === "function" ? s : null;
  } catch {
    return null;
  }
}

/**
 * Pre-consult “building” transition — persisted so React 18 Strict Mode remounts in dev
 * don’t clear the in-flight timeout and leave the user stuck on step 1.
 */
export function setIntakePreflightUntil(untilMs: number): void {
  const s = session();
  if (!s) return;
  try {
    s.setItem(STORAGE_KEY, String(untilMs));
  } catch {
    /* private mode / quota */
  }
}

export function clearIntakePreflight(): void {
  const s = session();
  if (!s) return;
  try {
    s.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function readIntakePreflightUntil(): number | null {
  const s = session();
  if (!s) return null;
  try {
    const raw = s.getItem(STORAGE_KEY);
    if (raw == null) return null;
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : null;
  } catch {
    return null;
  }
}
