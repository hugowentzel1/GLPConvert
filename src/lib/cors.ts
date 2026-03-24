import { NextResponse } from "next/server";

const ALLOW = [
  "http://localhost:3000",
  process.env.NEXT_PUBLIC_APP_URL, // e.g., https://sunspire.vercel.app
].filter(Boolean) as string[];

export function corsPreflightOrHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  const headers = new Headers({
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Headers": "Content-Type, x-api-key, Authorization",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Max-Age": "86400",
  });
  if (ALLOW.some((a) => origin.startsWith(a))) {
    headers.set("Access-Control-Allow-Origin", origin);
  }
  if (req.method === "OPTIONS")
    return new NextResponse(null, { status: 204, headers });
  return headers; // attach these to your 200/4xx responses
}
