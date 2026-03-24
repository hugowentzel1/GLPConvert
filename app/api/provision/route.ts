import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { ENV } from "@/src/config/env";
import {
  upsertTenantByHandle,
  createOrLinkUserOwner,
} from "@/src/lib/storage";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { companyHandle, brandColors, logoURL, crm, payerEmail } = body || {};

  if (!companyHandle || !payerEmail) {
    return NextResponse.json(
      { ok: false, error: "companyHandle and payerEmail required" },
      { status: 400 },
    );
  }

  const apiKey = randomBytes(24).toString("hex");
  const loginUrl = `${ENV.NEXT_PUBLIC_APP_URL}/c/${companyHandle}`;
  const captureUrl = `${ENV.NEXT_PUBLIC_APP_URL}/v1/ingest/lead`;

  const tenant = await upsertTenantByHandle(companyHandle, {
    "Company Handle": companyHandle,
    Plan: "Starter",
    "Brand Colors": brandColors ?? "",
    "Logo URL": logoURL ?? "",
    "CRM Keys": crm ?? "",
    "API Key": apiKey,
    "Domain / Login URL": loginUrl,
    "Capture URL": captureUrl,
  });

  await createOrLinkUserOwner(tenant.id, payerEmail);

  // TODO: send onboarding email with loginUrl/apiKey/captureUrl
  return NextResponse.json({ ok: true, loginUrl, apiKey, captureUrl });
}
