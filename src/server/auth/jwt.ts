import jwt from "jsonwebtoken";
import { ENV } from "../../config/env";
import { logger } from "../../lib/logger";

export interface JWTPayload {
  tenantId?: string;
  userId?: string;
  role?: string;
  exp?: number;
  iat?: number;
}

function resolveJwtSecret(explicit?: string): string {
  const s = explicit || ENV.JWT_SECRET || ENV.ADMIN_TOKEN;
  if (s) return s;
  if (process.env.NODE_ENV !== "production") {
    return "glpconvert-local-dev-jwt-secret-change-me";
  }
  throw new Error("JWT_SECRET or ADMIN_TOKEN is required in production");
}

export function signToken(payload: Omit<JWTPayload, "exp" | "iat">, secret?: string): string {
  try {
    const jwtSecret = resolveJwtSecret(secret);
    return jwt.sign(payload, jwtSecret, {
      algorithm: "HS256",
      expiresIn: "24h", // Token expires in 24 hours
    });
  } catch (error) {
    logger.error("Error signing JWT token:", error);
    throw new Error("Failed to sign token");
  }
}

export async function verifyToken(token: string, secret?: string): Promise<JWTPayload> {
  try {
    const jwtSecret = resolveJwtSecret(secret);
    const payload = jwt.verify(token, jwtSecret, {
      algorithms: ["HS256"],
    }) as JWTPayload;

    return payload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Token expired");
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid token");
    } else {
      logger.error("Error verifying JWT token:", error);
      throw new Error("Token verification failed");
    }
  }
}

// Magic link token with extended expiration (7 days)
export function signMagicLinkToken(email: string, company: string): string {
  return signToken({ tenantId: company, userId: email }, ENV.JWT_SECRET || ENV.ADMIN_TOKEN);
}

export async function verifyMagicLinkToken(token: string): Promise<{ email: string; company: string } | null> {
  try {
    const payload = await verifyToken(token, ENV.JWT_SECRET || ENV.ADMIN_TOKEN);
    return {
      email: payload.userId || "",
      company: payload.tenantId || "",
    };
  } catch {
    return null;
  }
}

export function createTenantToken(tenantId: string): string {
  return signToken({ tenantId });
}

export function createUserToken(
  userId: string,
  tenantId: string,
  role: string,
): string {
  return signToken({ userId, tenantId, role });
}
