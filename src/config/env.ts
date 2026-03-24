import { z } from "zod";

const envSchema = z.object({
  // Supabase: use SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY, or _STAGING / _PROD per environment
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  SUPABASE_URL_STAGING: z.string().url().optional(),
  SUPABASE_SERVICE_ROLE_KEY_STAGING: z.string().min(1).optional(),
  SUPABASE_URL_PROD: z.string().url().optional(),
  SUPABASE_SERVICE_ROLE_KEY_PROD: z.string().min(1).optional(),

  /** Optional for GLPConvert-local dev when solar / maps flows are unused */
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string().optional(),
  NREL_API_KEY: z.string().optional(),
  EIA_API_KEY: z.string().optional(),

  // Non-Stripe app secrets (optional locally; required for admin + some APIs in production)
  ADMIN_TOKEN: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),

  // Optional numeric defaults (strings OK in env)
  DEFAULT_RATE_ESCALATION: z.coerce.number().default(0.025),
  DEFAULT_OANDM_ESCALATION: z.coerce.number().default(0.03),
  DISCOUNT_RATE: z.coerce.number().default(0.08),
  OANDM_PER_KW_YEAR: z.coerce.number().default(15),
  DEFAULT_DEGRADATION_PCT: z.coerce.number().default(0.5),
  DEFAULT_LOSSES_PCT: z.coerce.number().default(14),
  DEFAULT_COST_PER_WATT: z.coerce.number().default(3.5),

  // Stripe keys are validated in the Stripe section; keep optional here so non-Stripe builds still run
  STRIPE_LIVE_SECRET_KEY: z.string().optional(),
  STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PRICE_MONTHLY_99: z.string().optional(),
  STRIPE_PRICE_SETUP_399: z.string().optional(),

  // Vercel domain management
  VERCEL_TOKEN: z.string().optional(),
  VERCEL_PROJECT_ID: z.string().optional(),

  // Email service
  RESEND_API_KEY: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),

  // JWT for magic links
  JWT_SECRET: z.string().optional(),
});

export const ENV = envSchema.parse(process.env);
