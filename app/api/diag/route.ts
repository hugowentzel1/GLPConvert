export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json({
    ok: true,
    runtime: process.env.NEXT_RUNTIME ?? 'node',
    node: process.versions.node,
    env: {
      NREL: !!process.env.NREL_API_KEY,
      EIA: !!process.env.EIA_API_KEY,
      OPENEI: !!process.env.OPENEI_API_KEY,
    },
  });
}

