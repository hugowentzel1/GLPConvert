/**
 * XSS Sanitization Utilities
 * Protects against cross-site scripting attacks
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML string to prevent XSS attacks
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'title'],
    ALLOW_DATA_ATTR: false,
  });
}

/**
 * Sanitize plain text (removes HTML tags and dangerous characters)
 */
export function sanitizeText(text: string): string {
  // Remove HTML tags
  const withoutHtml = text.replace(/<[^>]*>/g, '');
  // Remove potentially dangerous characters
  return withoutHtml
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
}

/**
 * Sanitize user input for use in URLs
 */
export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    // Only allow http/https protocols
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      throw new Error('Invalid protocol');
    }
    return parsed.toString();
  } catch {
    // If URL parsing fails, return sanitized version
    return sanitizeText(url);
  }
}

/**
 * Sanitize email address
 */
export function sanitizeEmail(email: string): string {
  // Basic email validation and sanitization
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const sanitized = email.trim().toLowerCase();
  
  if (!emailRegex.test(sanitized)) {
    throw new Error('Invalid email format');
  }
  
  // Remove potentially dangerous characters
  return sanitized.replace(/[<>'"&]/g, '');
}

/**
 * Sanitize JSON input to prevent prototype pollution
 */
export function sanitizeJson<T>(json: string): T {
  try {
    const parsed = JSON.parse(json);
    
    // Remove __proto__ and constructor to prevent prototype pollution
    if (typeof parsed === 'object' && parsed !== null) {
      delete (parsed as any).__proto__;
      delete (parsed as any).constructor;
    }
    
    return parsed as T;
  } catch {
    throw new Error('Invalid JSON');
  }
}

/**
 * Sanitize object recursively to prevent prototype pollution
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized: any = { ...obj };
  
  // Remove dangerous keys
  delete sanitized.__proto__;
  delete sanitized.constructor;
  delete sanitized.prototype;
  
  // Recursively sanitize nested objects
  for (const key in sanitized) {
    const value = sanitized[key];
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value);
    } else if (typeof value === 'string') {
      sanitized[key] = sanitizeText(value);
    }
  }
  
  return sanitized as T;
}
