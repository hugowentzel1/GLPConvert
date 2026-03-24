import { NextResponse } from "next/server";
import { setRequestedDomain, setTenantDomainStatus } from "@/src/lib/storage";

export async function POST(req: Request) {
  try {
    const { tenantHandle, fqdn } = await req.json();

    if (!tenantHandle || !fqdn) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    await setRequestedDomain(tenantHandle, fqdn);
    await setTenantDomainStatus(tenantHandle, "proposed");

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error prefilling domain:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
