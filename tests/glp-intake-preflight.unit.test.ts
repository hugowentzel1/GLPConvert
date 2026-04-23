import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { clearIntakePreflight, readIntakePreflightUntil, setIntakePreflightUntil } from "@/lib/glp-intake-preflight";

describe("glp-intake-preflight", () => {
  const mem = new Map<string, string>();

  beforeEach(() => {
    mem.clear();
    const sessionStorage = {
      getItem: (k: string) => (mem.has(k) ? mem.get(k)! : null),
      setItem: (k: string, v: string) => {
        mem.set(k, v);
      },
      removeItem: (k: string) => {
        mem.delete(k);
      },
    };
    Object.defineProperty(globalThis, "sessionStorage", { value: sessionStorage, configurable: true });
  });

  afterEach(() => {
    clearIntakePreflight();
  });

  it("round-trips until timestamp", () => {
    const t = Date.now() + 5000;
    setIntakePreflightUntil(t);
    expect(readIntakePreflightUntil()).toBe(t);
  });

  it("clear removes key", () => {
    setIntakePreflightUntil(123);
    clearIntakePreflight();
    expect(readIntakePreflightUntil()).toBeNull();
  });
});
