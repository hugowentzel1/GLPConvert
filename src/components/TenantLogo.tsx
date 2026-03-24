"use client";
import Image from "next/image";

export default function TenantLogo({
  company,
  logoUrl,
  size = 40,
}: {
  company: string;
  logoUrl?: string;
  size?: number;
}) {
  if (logoUrl) {
    return (
      <Image
        src={logoUrl}
        alt={`${company} logo`}
        width={size}
        height={size}
        unoptimized
        className="inline-block rounded"
      />
    );
  }
  return (
    <div
      aria-label={`${company} logo`}
      className="inline-flex items-center justify-center rounded-full bg-[var(--brand)] text-white"
      style={{ width: size, height: size }}
    >
      <span className="font-semibold">{company.slice(0, 1).toUpperCase()}</span>
    </div>
  );
}
