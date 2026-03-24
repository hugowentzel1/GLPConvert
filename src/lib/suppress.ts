import { upsertLeadSuppressionByEmail } from "@/src/lib/storage";

export async function suppressByEmail(
  email: string,
  source: "one-click" | "body",
) {
  await upsertLeadSuppressionByEmail(email, source); // sets Status="Suppression", SuppressedAt=now
}

export async function resolveHashToEmail(hash: string): Promise<string | null> {
  // If you store link hashes, resolve here; else return null (sender can post email directly to /api/unsubscribe).
  return null;
}
