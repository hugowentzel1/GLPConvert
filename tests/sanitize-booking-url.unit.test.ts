import { describe, expect, it } from "vitest";
import { sanitizeFirstHttpsUrl } from "@/lib/sanitize-booking-url";

describe("sanitizeFirstHttpsUrl", () => {
  it("returns single URL unchanged", () => {
    expect(sanitizeFirstHttpsUrl("https://example.com/schedule")).toBe("https://example.com/schedule");
  });

  it("strips a second URL concatenated without separator", () => {
    const bad =
      "https://example.com/schedulehttp://localhost:3000/intake?demo=1&company=Sunspire+Weight+Clinic";
    expect(sanitizeFirstHttpsUrl(bad)).toBe("https://example.com/schedule");
  });
});
