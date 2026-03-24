import { NextResponse } from "next/server";
import { getLastLeadForTenant } from "@/src/lib/storage";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token =
    req.headers.get("x-test-token") || url.searchParams.get("token");
  if (!process.env.TEST_API_TOKEN || token !== process.env.TEST_API_TOKEN) {
    return NextResponse.json(
      { ok: false, error: "forbidden" },
      { status: 403 },
    );
  }
  const tenant = url.searchParams.get("tenant");
  if (!tenant)
    return NextResponse.json(
      { ok: false, error: "tenant required" },
      { status: 400 },
    );
  try {
    const last = await getLastLeadForTenant(tenant);
    return NextResponse.json({ ok: true, last }, { status: 200 });
  } catch (e: unknown) {
    return NextResponse.json(
      { ok: false, error: String(e instanceof Error ? e.message : e) },
      { status: 500 },
    );
  }
}
