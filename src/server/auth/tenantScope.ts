import { NextRequest } from "next/server";
import { findTenantByHandle, findTenantByApiKey } from "@/src/lib/storage";
import { verifyToken } from "./jwt";
import { logger } from "../../lib/logger";

export interface TenantContext {
  id: string;
  handle: string;
}

export interface AuthenticatedRequest extends NextRequest {
  tenant: TenantContext;
}

export async function resolveTenant(req: NextRequest): Promise<TenantContext> {
  const url = new URL(req.url);
  const host = req.headers.get("host") || "";

  logger.debug("Resolving tenant for request:", {
    host,
    pathname: url.pathname,
  });

  // (a) Host subdomain (acme.sunspire.app → handle "acme")
  if (host.includes(".")) {
    const subdomain = host.split(".")[0];
    if (subdomain && subdomain !== "www" && subdomain !== "api") {
      const tenant = await findTenantByHandle(subdomain);
      if (tenant) {
        logger.debug("Tenant resolved by subdomain:", subdomain);
        return {
          id: tenant.id!,
          handle: (tenant as { "Company Handle": string })["Company Handle"],
        };
      }
    }
  }

  // (b) Path prefix /c/:handle
  const pathMatch = url.pathname.match(/^\/c\/([^\/]+)/);
  if (pathMatch) {
    const handle = pathMatch[1];
    const tenant = await findTenantByHandle(handle);
    if (tenant) {
      logger.debug("Tenant resolved by path prefix:", handle);
      return {
        id: tenant.id!,
        handle: (tenant as { "Company Handle": string })["Company Handle"],
      };
    }
  }

  // (c) Header x-api-key → Tenants.API Key
  const apiKey = req.headers.get("x-api-key");
  if (apiKey) {
    const tenant = await findTenantByApiKey(apiKey);
    if (tenant) {
      logger.debug("Tenant resolved by API key");
      return {
        id: tenant.id!,
        handle: (tenant as { "Company Handle": string })["Company Handle"],
      };
    }
  }

  // (d) Authorization: Bearer <jwt> with { tenantId }
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    try {
      const payload = await verifyToken(token);
      if (payload.tenantId) {
        // For JWT auth, we need to get the tenant details
        // This is a simplified approach - in production you might want to cache this
        const tenant = await findTenantByHandle(payload.tenantId);
        if (tenant) {
          logger.debug("Tenant resolved by JWT");
          return {
            id: tenant.id!,
            handle: (tenant as { "Company Handle": string })["Company Handle"],
          };
        }
      }
    } catch (error) {
      logger.warn("JWT verification failed:", error);
    }
  }

  // No tenant found
  logger.warn("No tenant could be resolved for request");
  throw new Error("Tenant not found");
}

export function withTenantScope<T extends NextRequest>(
  handler: (req: AuthenticatedRequest) => Promise<Response>,
) {
  return async (req: T): Promise<Response> => {
    try {
      const tenant = await resolveTenant(req);
      const authenticatedReq = req as unknown as AuthenticatedRequest;
      authenticatedReq.tenant = tenant;

      return await handler(authenticatedReq);
    } catch (error) {
      logger.error("Tenant resolution failed:", error);
      return new Response(
        JSON.stringify({ error: "Unauthorized - Tenant not found" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  };
}
