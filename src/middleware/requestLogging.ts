import { NextRequest, NextResponse } from "next/server";
import { logger } from "../lib/logger";

export function requestLoggingMiddleware(
  request: NextRequest,
  next: () => Promise<NextResponse>,
): Promise<NextResponse> {
  const startTime = Date.now();
  const method = request.method;
  const path = request.nextUrl.pathname;
  const host = request.headers.get("host") || "";

  // Extract tenant handle from host or path for logging
  let tenantHandle = "unknown";
  if (host.includes(".")) {
    const subdomain = host.split(".")[0];
    if (subdomain && subdomain !== "www" && subdomain !== "api") {
      tenantHandle = subdomain;
    }
  } else {
    const pathMatch = path.match(/^\/c\/([^\/]+)/);
    if (pathMatch) {
      tenantHandle = pathMatch[1];
    }
  }

  logger.info("Request started", {
    method,
    path,
    tenant: tenantHandle,
    userAgent: request.headers.get("user-agent"),
    ip: request.ip || request.headers.get("x-forwarded-for"),
  });

  return next()
    .then((response) => {
      const duration = Date.now() - startTime;

      logger.info("Request completed", {
        method,
        path,
        tenant: tenantHandle,
        status: response.status,
        duration: `${duration}ms`,
      });

      return response;
    })
    .catch((error) => {
      const duration = Date.now() - startTime;

      logger.error("Request failed", {
        method,
        path,
        tenant: tenantHandle,
        error: error.message,
        duration: `${duration}ms`,
      });

      throw error;
    });
}
