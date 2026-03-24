/**
 * Shared types and field-name constants for tenants, leads, users, links.
 * Used by Supabase DAL; kept for API compatibility (e.g. tenant["Company Handle"]).
 */

export const LEAD_FIELDS = {
  NAME: "Name",
  EMAIL: "Email",
  COMPANY: "Company",
  TENANT: "Tenant",
  DEMO_URL: "Demo URL",
  CAMPAIGN_ID: "Campaign ID",
  STATUS: "Status",
  NOTES: "Notes",
  LAST_ACTIVITY: "Last Activity",
  STREET: "Street",
  CITY: "City",
  STATE: "State",
  POSTAL_CODE: "Postal Code",
  COUNTRY: "Country",
  FORMATTED_ADDRESS: "Formatted Address",
  PLACE_ID: "Place ID",
  LATITUDE: "Latitude",
  LONGITUDE: "Longitude",
  UTILITY_RATE: "Utility Rate ($/kWh)",
  TOKEN: "Token",
} as const;

export const TENANT_FIELDS = {
  COMPANY_HANDLE: "Company Handle",
  PLAN: "Plan",
  DOMAIN_LOGIN_URL: "Domain / Login URL",
  BRAND_COLORS: "Brand Colors",
  LOGO_URL: "Logo URL",
  CRM_KEYS: "CRM Keys",
  API_KEY: "API Key",
  CAPTURE_URL: "Capture URL",
  USERS: "Users",
  PAYMENT_STATUS: "Payment Status",
  STRIPE_CUSTOMER_ID: "Stripe Customer ID",
  LAST_PAYMENT: "Last Payment",
  SUBSCRIPTION_ID: "Subscription ID",
  CURRENT_PERIOD_END: "Current Period End",
  REQUESTED_DOMAIN: "Requested Domain",
  DOMAIN_STATUS: "Domain Status",
  DOMAIN: "Domain",
  NOTIFICATION_EMAIL: "Notification Email",
} as const;

export const USER_FIELDS = {
  EMAIL: "Email",
  ROLE: "Role",
  TENANT: "Tenant",
} as const;

export const LINK_FIELDS = {
  TOKEN: "Token",
  TARGET_PARAMS: "TargetParams",
  TENANT: "Tenant",
  CLICKS: "Clicks",
  STATUS: "Status",
  LAST_CLICKED_AT: "LastClickedAt",
  PROSPECT_EMAIL: "ProspectEmail",
} as const;

export interface Lead {
  id?: string;
  [LEAD_FIELDS.NAME]: string;
  [LEAD_FIELDS.EMAIL]: string;
  [LEAD_FIELDS.COMPANY]?: string;
  [LEAD_FIELDS.TENANT]: string[];
  [LEAD_FIELDS.DEMO_URL]?: string;
  [LEAD_FIELDS.CAMPAIGN_ID]?: string;
  [LEAD_FIELDS.STATUS]: string;
  [LEAD_FIELDS.NOTES]?: string;
  [LEAD_FIELDS.LAST_ACTIVITY]: string;
  [LEAD_FIELDS.STREET]?: string;
  [LEAD_FIELDS.CITY]?: string;
  [LEAD_FIELDS.STATE]?: string;
  [LEAD_FIELDS.POSTAL_CODE]?: string;
  [LEAD_FIELDS.COUNTRY]?: string;
  [LEAD_FIELDS.FORMATTED_ADDRESS]?: string;
  [LEAD_FIELDS.PLACE_ID]?: string;
  [LEAD_FIELDS.LATITUDE]?: number;
  [LEAD_FIELDS.LONGITUDE]?: number;
  [LEAD_FIELDS.UTILITY_RATE]?: number;
  [LEAD_FIELDS.TOKEN]?: string;
}

export interface Tenant {
  id?: string;
  [TENANT_FIELDS.COMPANY_HANDLE]: string;
  [TENANT_FIELDS.PLAN]: string;
  [TENANT_FIELDS.DOMAIN_LOGIN_URL]?: string;
  [TENANT_FIELDS.BRAND_COLORS]?: string;
  [TENANT_FIELDS.LOGO_URL]?: string;
  [TENANT_FIELDS.CRM_KEYS]?: string;
  [TENANT_FIELDS.API_KEY]?: string;
  [TENANT_FIELDS.CAPTURE_URL]?: string;
  [TENANT_FIELDS.USERS]?: string[];
  [TENANT_FIELDS.PAYMENT_STATUS]?: string;
  [TENANT_FIELDS.STRIPE_CUSTOMER_ID]?: string;
  [TENANT_FIELDS.LAST_PAYMENT]?: string;
  [TENANT_FIELDS.SUBSCRIPTION_ID]?: string;
  [TENANT_FIELDS.CURRENT_PERIOD_END]?: string;
  [TENANT_FIELDS.REQUESTED_DOMAIN]?: string;
  [TENANT_FIELDS.DOMAIN_STATUS]?: string;
  [TENANT_FIELDS.DOMAIN]?: string;
  [TENANT_FIELDS.NOTIFICATION_EMAIL]?: string;
}

export interface User {
  id?: string;
  [USER_FIELDS.EMAIL]: string;
  [USER_FIELDS.ROLE]: string;
  [USER_FIELDS.TENANT]: string[];
}

export interface Link {
  id?: string;
  [LINK_FIELDS.TOKEN]: string;
  [LINK_FIELDS.TARGET_PARAMS]: string;
  [LINK_FIELDS.TENANT]: string[];
  [LINK_FIELDS.CLICKS]: number;
  [LINK_FIELDS.STATUS]: string;
  [LINK_FIELDS.LAST_CLICKED_AT]?: string;
  [LINK_FIELDS.PROSPECT_EMAIL]?: string;
}
