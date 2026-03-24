"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getRootDomain, buildQuoteFQDN } from "@/src/lib/domainRoot";

export default function OnboardDomainPage() {
  const qp = useSearchParams();
  const tenant = qp?.get("tenant") || "";
  const companyWebsite = qp?.get("companyWebsite") || "";
  const root = useMemo(
    () => getRootDomain(companyWebsite) || "",
    [companyWebsite],
  );
  const fqdn = useMemo(() => (root ? buildQuoteFQDN(root) : ""), [root]);
  const [status, setStatus] = useState<
    "idle" | "attaching" | "verifying" | "waiting" | "live" | "error"
  >("idle");
  const [msg, setMsg] = useState<string>("");

  useEffect(() => {
    if (tenant && fqdn) {
      fetch("/api/domains/prefill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantHandle: tenant, fqdn }),
      });
    }
  }, [tenant, fqdn]);

  async function go() {
    if (!tenant) return;
    try {
      setStatus("attaching");
      const a = await fetch("/api/domains/attach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantHandle: tenant }),
      });
      if (!a.ok) {
        setStatus("waiting");
        setMsg("Waiting for DNS (CNAME) to be visible…");
      }
      setStatus("verifying");
      await fetch("/api/domains/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantHandle: tenant }),
      });
      poll();
    } catch {
      setStatus("error");
      setMsg("Could not attach/verify yet. Check DNS and try again.");
    }
  }

  async function poll() {
    const iv = setInterval(async () => {
      const r = await fetch(
        `/api/domains/status?tenant=${encodeURIComponent(tenant)}`,
      );
      const j = await r.json();
      if (j.verified) {
        clearInterval(iv);
        setStatus("live");
        setMsg("Verified! Your site is live.");
      }
    }, 10000);
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h2 className="text-2xl font-semibold mb-4">
        Connect your custom domain
      </h2>
      <p className="mb-2">We&apos;ll use a subdomain on your site:</p>
      <p className="font-mono mb-6">{fqdn || "quote.yourdomain.com"}</p>
      <ol className="list-decimal ml-6 space-y-2 mb-6">
        <li>
          In your domain&apos;s DNS, add a <b>CNAME</b> record:
        </li>
      </ol>
      <div className="rounded border p-4 mb-6 font-mono text-sm">
        Host/Name: <b>quote</b>
        <br />
        Type: <b>CNAME</b>
        <br />
        Target/Value: <b>cname.vercel-dns.com</b>
        <br />
        (If Cloudflare: set &quot;DNS-only / gray cloud&quot;)
      </div>
      <button onClick={go} className="rounded bg-black text-white px-4 py-2">
        I added the record → Verify
      </button>
      <div className="mt-4 text-sm text-neutral-600">
        Status: {status}. {msg}
      </div>
    </main>
  );
}
