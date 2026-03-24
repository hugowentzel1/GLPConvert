import { NextRequest, NextResponse } from 'next/server';

const SYNTHETIC_KV_KEY = 'synthetic:results';
const SYNTHETIC_TTL_SEC = 60 * 60 * 24 * 7; // 7 days

export interface SyntheticTestResult {
  testName: string;
  status: 'pass' | 'fail' | 'degraded';
  lastRun: string; // UTC ISO
  durationMs?: number;
  summary?: string;
  failureReason?: string;
  artifactsUrl?: string;
  recentFailureCount?: number;
  environment: string;
}

export type SyntheticResultsPayload = {
  homeowner?: SyntheticTestResult;
  buyer?: SyntheticTestResult;
  lastUpdated?: string;
};

let inMemoryResults: SyntheticResultsPayload | null = null;

function isKVAvailable(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

async function getKV(): Promise<typeof import('@vercel/kv').kv | null> {
  try {
    const { kv } = await import('@vercel/kv');
    return kv;
  } catch {
    return null;
  }
}

/** GET: return latest synthetic results (no auth). */
export async function GET() {
  try {
    if (isKVAvailable()) {
      const kv = await getKV();
      if (kv) {
        const data = await kv.get<SyntheticResultsPayload>(SYNTHETIC_KV_KEY);
        return NextResponse.json(data || {});
      }
    }
    return NextResponse.json(inMemoryResults || {});
  } catch (e) {
    console.error('[synthetic-results] GET error:', e);
    return NextResponse.json({}, { status: 200 });
  }
}

// Rate limit: 12 POSTs per hour per IP (synthetic runs every 30 min)
const SYNTHETIC_POST_WINDOW_MS = 60 * 60 * 1000;
const SYNTHETIC_POST_MAX = 12;
const postCountByIp = new Map<string, { count: number; resetAt: number }>();

function checkSyntheticPostRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = postCountByIp.get(ip);
  if (!entry) {
    postCountByIp.set(ip, { count: 1, resetAt: now + SYNTHETIC_POST_WINDOW_MS });
    return true;
  }
  if (now > entry.resetAt) {
    postCountByIp.set(ip, { count: 1, resetAt: now + SYNTHETIC_POST_WINDOW_MS });
    return true;
  }
  if (entry.count >= SYNTHETIC_POST_MAX) return false;
  entry.count++;
  return true;
}

/** POST: store synthetic results. No auth required; rate-limited per IP so the workflow works without GitHub secrets. */
export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
  if (!checkSyntheticPostRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }
  try {
    const body = (await req.json()) as SyntheticResultsPayload;
    const payload: SyntheticResultsPayload = {
      ...body,
      lastUpdated: new Date().toISOString(),
    };
    if (isKVAvailable()) {
      const kv = await getKV();
      if (kv) await kv.set(SYNTHETIC_KV_KEY, payload, { ex: SYNTHETIC_TTL_SEC });
    }
    inMemoryResults = payload;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[synthetic-results] POST error:', e);
    return NextResponse.json({ error: 'Failed to store results' }, { status: 500 });
  }
}
