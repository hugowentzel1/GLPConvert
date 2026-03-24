import { NextRequest, NextResponse } from "next/server";
import { storeLead, storeLeadFallback, getTenantByHandle, TENANT_FIELDS } from "@/src/lib/storage";
import { checkRateLimit } from "@/src/lib/ratelimit";
import { ENV } from "@/src/config/env";

// Helper function to extract client IP
function getClientIP(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(request: NextRequest) {
  // Rate limiting check
  const clientIP = getClientIP(request);
  if (checkRateLimit(clientIP, "submit-lead")) {
    console.warn(`Rate limited: ${clientIP} for submit-lead`);
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429 },
    );
  }

  try {
    const body = await request.json();

    // Validate required fields
    const {
      name,
      email,
      address,
      tenantSlug,
      systemSizeKW,
      netCostAfterITC,
      year1Savings,
      paybackYear,
      npv25Year,
      co2OffsetPerYear,
      token,
    } = body;

    if (!name || !email || !address || !tenantSlug) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Prepare lead data with updated field names
    const leadData = {
      name,
      email,
      phone: body.phone || "",
      address,
      notes: body.notes || "",
      tenantSlug,
      systemSizeKW,
      estimatedCost: netCostAfterITC, // Map new field to storage schema
      estimatedSavings: year1Savings,
      paybackPeriodYears: paybackYear,
      npv25Year,
      co2OffsetPerYear,
      token: token || "", // Add token for attribution
      createdAt: new Date().toISOString(),
    };

    const storeResult = await storeLead(leadData);

    if (!storeResult.success) {
      console.error("Failed to store lead:", storeResult.error);
      return NextResponse.json(
        { error: `Failed to store lead information: ${storeResult.error}` },
        { status: 500 },
      );
    }

    // Instant email to installer (if tenant has Notification Email and Resend is configured)
    if (ENV.RESEND_API_KEY && tenantSlug) {
      try {
        const tenant = await getTenantByHandle(String(tenantSlug));
        const notifyEmail = tenant?.[TENANT_FIELDS.NOTIFICATION_EMAIL as keyof typeof tenant] as string | undefined;
        const toEmail = typeof notifyEmail === "string" && notifyEmail.includes("@") ? notifyEmail.trim() : null;
        if (toEmail) {
          const fromDomain = ENV.NEXT_PUBLIC_APP_URL?.replace("https://", "").replace("http://", "") || "glpconvert.com";
          const fromEmail = `no-reply@${fromDomain}`;
          const dashboardUrl = `${ENV.NEXT_PUBLIC_APP_URL || "https://glpconvert.com"}/c/${tenantSlug}/leads`;
          // Never block the HTTP response on outbound email; Vercel will 504 if this hangs.
          const emailTimeoutMs = Math.min(
            12_000,
            Number(process.env.RESEND_FETCH_TIMEOUT_MS ?? 12_000),
          );
          const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${ENV.RESEND_API_KEY}`,
              "Content-Type": "application/json",
            },
            signal: AbortSignal.timeout(emailTimeoutMs),
            body: JSON.stringify({
              from: fromEmail,
              to: [toEmail],
              subject: `New solar lead: ${name}`,
              html: `<p><strong>New lead from your solar tool</strong></p><p>Name: ${name}</p><p>Email: <a href="mailto:${email}">${email}</a></p><p>Address: ${address}</p><p><a href="${dashboardUrl}">View in dashboard</a></p>`,
              text: `New lead: ${name}, ${email}, ${address}. View: ${dashboardUrl}`,
            }),
          });
          if (res.ok) {
            console.log("Lead notification email sent to", toEmail);
          } else {
            console.warn("Lead notification email failed:", await res.text());
          }
        }
      } catch (e) {
        console.warn("Lead notification email error (non-blocking):", e);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Lead submitted successfully",
    });
  } catch (error) {
    console.error("Error processing lead submission:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
