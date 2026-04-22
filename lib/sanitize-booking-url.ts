/**
 * Some email/CRM tools or manual copy-paste concatenate a second URL onto `booking`
 * (e.g. `https://example.com/schedulehttp://localhost:3000/intake?...`), which breaks
 * navigation and parsing. Keep only the first absolute URL.
 */
export function sanitizeFirstHttpsUrl(raw: string): string | null {
  const s = raw.trim();
  if (!/^https?:\/\//i.test(s)) return null;
  const re = /https?:\/\//gi;
  let first: RegExpExecArray | null = null;
  let secondStart = -1;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s)) !== null) {
    if (!first) {
      first = m;
    } else {
      secondStart = m.index;
      break;
    }
  }
  if (secondStart < 0) return s;
  return s.slice(0, secondStart).replace(/\/+$/, "") || null;
}
