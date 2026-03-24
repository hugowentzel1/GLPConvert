/**
 * Single source of truth for platform / product naming (Wellspire LLC product family).
 * Import from UI and emails; update domains after DNS is live.
 */
export const PARENT_COMPANY_LEGAL_NAME = "Wellspire LLC";
export const PRODUCT_NAME = "GLPConvert";
export const PRODUCT_TAGLINE =
  "White-label pre-consult conversion for medical weight-loss programs";

/** Shown when demo mode is on and no clinic brand replaces the platform line */
export const PLATFORM_DISPLAY_NAME = `${PRODUCT_NAME} — a product of ${PARENT_COMPANY_LEGAL_NAME}`;

/** Placeholder until production inbox + DNS are configured */
export const SUPPORT_EMAIL = "support@glpconvert.com";

export const LOCAL_STORAGE_PREFIX = "glpconvert";

export const STORAGE_KEYS = {
  brandTakeover: `${LOCAL_STORAGE_PREFIX}-brand-takeover`,
  lastAddress: `${LOCAL_STORAGE_PREFIX}-last-address`,
  /** Legacy Sunspire keys — read once for migration, then stop writing */
  legacyBrandTakeover: "sunspire-brand-takeover",
  legacyLastAddress: "sunspire-last-address",
} as const;
