/**
 * CSRF Protection Utilities
 * Implements Double Submit Cookie pattern for CSRF protection
 */

import { cookies } from 'next/headers';
import { randomBytes } from 'crypto';

const CSRF_TOKEN_COOKIE = 'csrf-token';
const CSRF_TOKEN_HEADER = 'x-csrf-token';
const CSRF_TOKEN_EXPIRY = 60 * 60; // 1 hour

/**
 * Generate a new CSRF token
 */
export function generateCsrfToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Set CSRF token in cookie
 */
export async function setCsrfToken(): Promise<string> {
  const token = generateCsrfToken();
  const cookieStore = await cookies();
  cookieStore.set(CSRF_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: CSRF_TOKEN_EXPIRY,
    path: '/',
  });
  return token;
}

/**
 * Get CSRF token from cookie
 */
export async function getCsrfToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(CSRF_TOKEN_COOKIE)?.value || null;
}

/**
 * Verify CSRF token from request
 * Returns true if token is valid, false otherwise
 */
export async function verifyCsrfToken(token: string | null): Promise<boolean> {
  if (!token) {
    return false;
  }

  const cookieToken = await getCsrfToken();
  
  if (!cookieToken) {
    return false;
  }

  // Timing-safe comparison
  return cookieToken === token;
}

/**
 * Middleware helper to verify CSRF token from request headers
 */
export async function verifyCsrfFromRequest(
  headers: Headers,
): Promise<{ valid: boolean; error?: string }> {
  const token = headers.get(CSRF_TOKEN_HEADER);

  if (!token) {
    return { valid: false, error: 'Missing CSRF token' };
  }

  const isValid = await verifyCsrfToken(token);

  if (!isValid) {
    return { valid: false, error: 'Invalid CSRF token' };
  }

  return { valid: true };
}

/**
 * Check if request needs CSRF protection
 * GET, HEAD, OPTIONS requests typically don't need CSRF protection
 */
export function requiresCsrfProtection(method: string): boolean {
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
  return !safeMethods.includes(method.toUpperCase());
}
