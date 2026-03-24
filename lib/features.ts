interface FeatureFlags {
  trialEnabled: boolean;
  trialCompanies?: string[];
}

// Feature flags configuration
const FEATURE_FLAGS: FeatureFlags = {
  trialEnabled: process.env.TRIAL_ENABLED === "true",
  trialCompanies:
    process.env.TRIAL_COMPANIES?.split(",").map((c) => c.trim()) || [],
};

export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  const value = FEATURE_FLAGS[feature];
  if (feature === "trialEnabled") {
    return typeof value === "boolean" ? value : false;
  }
  return false;
}

export function isTrialEnabledForCompany(companyHandle: string): boolean {
  if (!isFeatureEnabled("trialEnabled")) {
    return false;
  }

  const trialCompanies = FEATURE_FLAGS.trialCompanies || [];

  // If no specific companies listed, enable for all
  if (trialCompanies.length === 0) {
    return true;
  }

  // Check if this specific company is in the trial list
  return trialCompanies.some(
    (company) => company.toLowerCase() === companyHandle.toLowerCase(),
  );
}

export function getTrialBadgeText(): string {
  return "7-day free trial — no credit card";
}

export function getFeatureFlags(): FeatureFlags {
  return { ...FEATURE_FLAGS };
}
