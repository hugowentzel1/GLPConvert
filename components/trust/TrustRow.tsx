import { SITE_STATS, installersLivePlus } from "@/lib/siteStats";

// Elevated Trust Badges: Matches site's gradient-heavy, warm design
// Individual pill badges with gradient backgrounds (like feature cards)
// Filled circular icons for prominence
// Research: Figma, Notion, HubSpot (gradient-heavy, sales-focused SaaS)

function UsersIcon() {
  return (
    <svg 
      className="h-5 w-5" 
      fill="currentColor" 
      viewBox="0 0 24 24"
    >
      <path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg 
      className="h-5 w-5" 
      fill="currentColor" 
      viewBox="0 0 24 24"
    >
      <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg 
      className="h-5 w-5" 
      fill="currentColor" 
      viewBox="0 0 24 24"
    >
      <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg 
      className="h-5 w-5" 
      fill="currentColor" 
      viewBox="0 0 24 24"
    >
      <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg 
      className="h-5 w-5" 
      fill="currentColor" 
      viewBox="0 0 24 24"
    >
      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
    </svg>
  );
}

function TrustBadge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <div 
        className="flex items-center justify-center w-8 h-8 rounded-full"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--brand-primary, #ea580c) 15%, white 85%)',
          color: 'var(--brand-600, #ea580c)',
        }}
      >
        {icon}
      </div>
      <span className="text-[13px] font-semibold text-slate-800 tracking-tight">
        {text}
      </span>
    </span>
  );
}

export default function TrustRow() {
  return (
    <>
      {/* Desktop layout - single row with bullets */}
      <div
        data-testid="hero-trust-strip"
        aria-label="Trust signals"
        className="mt-4 md:mt-5 hidden md:inline-flex flex-wrap items-center justify-center gap-3 md:gap-4 px-6 py-3 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.04)] mx-auto"
      >
        <TrustBadge icon={<UsersIcon />} text={`${installersLivePlus} installers live`} />
        <span className="text-slate-300">•</span>
        <TrustBadge icon={<LockIcon />} text="SOC 2 compliant" />
        <span className="text-slate-300">•</span>
        <TrustBadge icon={<ShieldIcon />} text="GDPR ready" />
        <span className="text-slate-300">•</span>
        <TrustBadge icon={<SunIcon />} text="NREL PVWatts®" />
        <span className="text-slate-300">•</span>
        <TrustBadge icon={<StarIcon />} text={`${SITE_STATS.rating}/5 rating`} />
      </div>

      {/* Mobile layout - reorganized with NREL and rating under SOC 2 */}
      <div
        data-testid="hero-trust-strip"
        aria-label="Trust signals"
        className="mt-4 md:hidden flex flex-col items-center gap-2 px-6 py-3 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.04)] mx-auto"
      >
        {/* First row */}
        <div className="flex items-center gap-3">
          <TrustBadge icon={<UsersIcon />} text={`${installersLivePlus} installers live`} />
          <span className="text-slate-300">•</span>
          <TrustBadge icon={<ShieldIcon />} text="GDPR ready" />
        </div>
        {/* Second row - NREL, rating under SOC 2 */}
        <div className="flex items-center gap-3">
          <TrustBadge icon={<LockIcon />} text="SOC 2 compliant" />
        </div>
        <div className="flex items-center gap-3">
          <TrustBadge icon={<SunIcon />} text="NREL PVWatts®" />
          <span className="text-slate-300">•</span>
          <TrustBadge icon={<StarIcon />} text={`${SITE_STATS.rating}/5 rating`} />
        </div>
      </div>
    </>
  );
}
