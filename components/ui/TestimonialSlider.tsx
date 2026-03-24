"use client";

import { useEffect, useState } from "react";

const TESTIMONIALS = [
  {
    quote:
      "We were losing deals to faster competitors, now we respond in 60 seconds and win instead.",
    name: "Brian Martin",
    role: "Owner, 25-employee solar firm, CA",
  },
  {
    quote:
      "Close rate doubled in month one with instant quotes, and prospects are sold before we even call.",
    name: "Dalyn Helms",
    role: "Ops Manager, Texas solar installer",
  },
  {
    quote: "Our lead conversion jumped from 18% to 31% in the first month with professional, instant quotes.",
    name: "Lensa Yohan",
    role: "Sales Manager, Florida solar dealer",
  },
  {
    quote:
      "Best $99/mo we've spent. Customers think we built this ourselves — completely white-labeled and professional.",
    name: "Noah Jones",
    role: "Founder, Arizona EPC",
  },
];

export default function TestimonialSlider() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(
      () => setIdx((i) => (i + 1) % TESTIMONIALS.length),
      4500,
    );
    return () => clearInterval(t);
  }, []);
  const t = TESTIMONIALS[idx];
  return (
    <div className="card p-6 text-center">
      <div className="text-2xl font-semibold text-[var(--ink)] mb-3">
        “{t.quote}”
      </div>
      <div className="p">
        {t.name} • {t.role}
      </div>
      <div className="mt-4 flex items-center justify-center gap-2">
        {TESTIMONIALS.map((_, i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full ${i === idx ? "bg-[var(--sun-2)]" : "bg-[var(--border)]"}`}
          />
        ))}
      </div>
    </div>
  );
}
