/**
 * Test ID utility - only adds data-testid when NEXT_PUBLIC_E2E=1
 * Keeps production DOM clean while enabling reliable E2E testing
 */

export function tid(id: string) {
  if (process.env.NEXT_PUBLIC_E2E === "1")
    return { "data-testid": id } as const;
  return {} as const;
}
