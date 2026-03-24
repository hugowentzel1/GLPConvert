export type TenantFlags = {
  showCookieBanner?: boolean; // paid: default false
  cpraApplies?: boolean;       // if true, show CPRA link
  showPoweredBy?: boolean;     // default true
  brandColor?: string;         // from query or tenant registry
  logoUrl?: string;            // from query or tenant registry
};

export function getTenantFlags(company?: string, params?: URLSearchParams): TenantFlags {
  return {
    showCookieBanner: params?.get('cookies') === '1' ? true : false, // allow testing via query param
    cpraApplies: false,
    showPoweredBy: true,
    brandColor: params?.get('brandColor') ?? undefined,
    logoUrl: params?.get('logo') ?? undefined,
  };
}
