import { NextRequest, NextResponse } from "next/server";
import { storeLead, storeLeadFallback, getTenantByHandle, TENANT_FIELDS } from "@/src/lib/storage";
import { checkRateLimit } from "@/src/lib/ratelimit";
import { ENV } from "@/src/config/env";
import { PRODUCT_NAME } from "@/lib/product-identity";
import { postLeadToTenantCrmWebhook } from "@/lib/crm-lead-webhook";

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

    // Validate required fields (supports legacy solar and GLP simulation flow)
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
      vertical,
      simulationInput,
      simulationOutput,
      costScenario,
      consentTerms,
      consentContact,
      leadSource,
      utmSource,
      utmCampaign,
      utmMedium,
      utmTerm,
      utmContent,
      bookingStatus,
      readiness,
    } = body;

    if (!name || !email || !tenantSlug) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const isGlp = (vertical ?? "solar") === "glp";
    if (!isGlp && !address) {
      return NextResponse.json(
        { error: "Missing required fields for solar lead" },
        { status: 400 },
      );
    }

    // Prepare lead data with updated field names
    const leadData = {
      name,
      email,
      phone: body.phone || "",
      address: address || "Not provided",
      notes: (() => {
        const glpMeta =
          isGlp
            ? {
                vertical: "glp",
                simulationInput: simulationInput || null,
                simulationOutput: simulationOutput || null,
                costScenario: costScenario || null,
                consentTerms: !!consentTerms,
                consentContact: !!consentContact,
                leadSource: leadSource || "glp-simulator",
                utmSource: utmSource || null,
                utmCampaign: utmCampaign || null,
                utmMedium: utmMedium || null,
                utmTerm: utmTerm || null,
                utmContent: utmContent || null,
                bookingStatus: bookingStatus || "not_booked",
                readiness: readiness || null,
              }
            : null;
        const previous = body.notes ? String(body.notes) : "";
        const packed = glpMeta ? `GLP_SIMULATION=${JSON.stringify(glpMeta)}` : "";
        return [previous, packed].filter(Boolean).join("\n");
      })(),
      tenantSlug,
      systemSizeKW,
      estimatedCost: netCostAfterITC, // Map new field to storage schema
      estimatedSavings: year1Savings,
      paybackPeriodYears: paybackYear,
      npv25Year,
      co2OffsetPerYear,
      token: token || "", // Add token for attribution
      vertical: isGlp ? "glp" : "solar",
      simulation_input: isGlp ? simulationInput || null : null,
      simulation_output: isGlp ? simulationOutput || null : null,
      simulation_version: isGlp ? "v1-simulator" : undefined,
      recommended_path:
        isGlp && simulationOutput && typeof simulationOutput.pathLabel === "string"
          ? simulationOutput.pathLabel
          : undefined,
      estimated_timeline_weeks:
        isGlp && simulationOutput && typeof simulationOutput.weeksToGoal === "number"
          ? simulationOutput.weeksToGoal
          : undefined,
      price_range_low:
        isGlp && costScenario && typeof costScenario.monthlyLow === "number"
          ? costScenario.monthlyLow
          : undefined,
      price_range_high:
        isGlp && costScenario && typeof costScenario.monthlyHigh === "number"
          ? costScenario.monthlyHigh
          : undefined,
      budget_band:
        isGlp && simulationInput && typeof simulationInput.budgetBand === "string"
          ? simulationInput.budgetBand
          : undefined,
      consent_terms: !!consentTerms,
      consent_contact: !!consentContact,
      lead_capture_completed: true,
      booking_status: bookingStatus || (isGlp ? "not_booked" : undefined),
      lead_source: leadSource || undefined,
      utm_source: utmSource || undefined,
      utm_campaign: utmCampaign || undefined,
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

    let tenantForNotify: Awaited<ReturnType<typeof getTenantByHandle>> | null = null;
    if (tenantSlug) {
      try {
        tenantForNotify = await getTenantByHandle(String(tenantSlug));
      } catch {
        tenantForNotify = null;
      }
    }

    const crmUrlRaw =
      tenantForNotify?.[TENANT_FIELDS.CAPTURE_URL as keyof typeof tenantForNotify];
    const crmUrl = typeof crmUrlRaw === "string" ? crmUrlRaw.trim() : "";
    if (crmUrl) {
      const webhookPayload: Record<string, unknown> = {
        event: "lead.created",
        vertical: isGlp ? "glp" : "solar",
        tenant_slug: tenantSlug,
        name,
        email,
        phone: body.phone || null,
        address: address || null,
        booking_status: bookingStatus || (isGlp ? "not_booked" : null),
        readiness: readiness || null,
        utm_source: utmSource || null,
        utm_campaign: utmCampaign || null,
        utm_medium: utmMedium || null,
        utm_term: utmTerm || null,
        utm_content: utmContent || null,
        lead_source: leadSource || null,
        simulation_input: isGlp ? simulationInput || null : null,
        simulation_output: isGlp ? simulationOutput || null : null,
        cost_scenario: isGlp ? costScenario || null : null,
        created_at: leadData.createdAt,
      };
      void postLeadToTenantCrmWebhook(crmUrl, webhookPayload);
    }

    // Instant email to installer (if tenant has Notification Email and Resend is configured)
    if (ENV.RESEND_API_KEY && tenantSlug) {
      try {
        const tenant = tenantForNotify ?? (await getTenantByHandle(String(tenantSlug)));
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
              subject: isGlp ? `New GLP simulation lead: ${name}` : `New intake lead: ${name}`,
              html: `<p><strong>New lead from ${PRODUCT_NAME}</strong></p><p>Name: ${name}</p><p>Email: <a href="mailto:${email}">${email}</a></p><p>Address: ${address || "Not provided"}</p><p><a href="${dashboardUrl}">View in dashboard</a></p>`,
              text: `New lead: ${name}, ${email}, ${address || "Not provided"}. View: ${dashboardUrl}`,
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
