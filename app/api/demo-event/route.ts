export const runtime = "edge";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("demo-event", body);

    // Optional: forward to webhook/Zapier for follow-up and retargeting
    // Include: brand, domain, variant, utm params, deadline, runsUsed, referrer, userAgent, screen size

    // Return success response so the form confirmation works
    return new Response(
      JSON.stringify({
        success: true,
        message: "Sample report requested successfully",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("demo-event error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to process request" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
