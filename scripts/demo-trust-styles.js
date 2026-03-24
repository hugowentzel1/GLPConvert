const fs = require('fs');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const OPTIONS = {
  option1: {
    name: "Option 1: Subtle Brand-Tinted Gray",
    description: "Gray icons with subtle brand color tint",
    code: `import { SITE_STATS, installersLivePlus } from "@/lib/siteStats";

function UsersIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{color: 'color-mix(in srgb, var(--brand-600) 15%, #6b7280)'}}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{color: 'color-mix(in srgb, var(--brand-600) 15%, #6b7280)'}}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{color: 'color-mix(in srgb, var(--brand-600) 15%, #6b7280)'}}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{color: 'color-mix(in srgb, var(--brand-600) 15%, #6b7280)'}}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{color: 'color-mix(in srgb, var(--brand-600) 15%, #6b7280)'}}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  );
}

export default function TrustRow() {
  return (
    <div
      data-testid="hero-trust-strip"
      aria-label="Trust signals"
      className="mt-3 md:mt-4 flex flex-wrap items-center justify-center gap-3 text-[13px] text-neutral-700"
    >
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-br from-white to-neutral-50 border border-[var(--brand-200)] shadow-sm">
        <UsersIcon />
        <span className="font-medium">{installersLivePlus} installers live</span>
      </span>

      <span className="text-neutral-300">•</span>

      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-br from-white to-neutral-50 border border-[var(--brand-200)] shadow-sm">
        <LockIcon />
        <span className="font-medium">SOC 2 compliant</span>
      </span>

      <span className="text-neutral-300">•</span>

      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-br from-white to-neutral-50 border border-[var(--brand-200)] shadow-sm">
        <ShieldIcon />
        <span className="font-medium">GDPR ready</span>
      </span>

      <span className="text-neutral-300">•</span>

      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-br from-white to-neutral-50 border border-[var(--brand-200)] shadow-sm">
        <SunIcon />
        <span className="font-medium">NREL PVWatts®</span>
      </span>

      <span className="text-neutral-300">•</span>

      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-br from-white to-neutral-50 border border-[var(--brand-200)] shadow-sm">
        <StarIcon />
        <span className="font-medium">{SITE_STATS.rating}/5 rating</span>
      </span>
    </div>
  );
}`
  },
  
  option2: {
    name: "Option 2: Monochrome with Brand Border",
    description: "Pure gray icons with brand-colored left border",
    code: `import { SITE_STATS, installersLivePlus } from "@/lib/siteStats";

function UsersIcon() {
  return (
    <svg className="h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg className="h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg className="h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  );
}

export default function TrustRow() {
  return (
    <div
      data-testid="hero-trust-strip"
      aria-label="Trust signals"
      className="mt-3 md:mt-4 flex flex-wrap items-center justify-center gap-3 text-[13px] text-slate-700"
    >
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white border-l-2 border-l-[var(--brand-600)] border-y border-r border-slate-200 shadow-sm">
        <UsersIcon />
        <span className="font-medium">{installersLivePlus} installers live</span>
      </span>

      <span className="text-slate-300">•</span>

      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white border-l-2 border-l-[var(--brand-600)] border-y border-r border-slate-200 shadow-sm">
        <LockIcon />
        <span className="font-medium">SOC 2 compliant</span>
      </span>

      <span className="text-slate-300">•</span>

      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white border-l-2 border-l-[var(--brand-600)] border-y border-r border-slate-200 shadow-sm">
        <ShieldIcon />
        <span className="font-medium">GDPR ready</span>
      </span>

      <span className="text-slate-300">•</span>

      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white border-l-2 border-l-[var(--brand-600)] border-y border-r border-slate-200 shadow-sm">
        <SunIcon />
        <span className="font-medium">NREL PVWatts®</span>
      </span>

      <span className="text-slate-300">•</span>

      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white border-l-2 border-l-[var(--brand-600)] border-y border-r border-slate-200 shadow-sm">
        <StarIcon />
        <span className="font-medium">{SITE_STATS.rating}/5 rating</span>
      </span>
    </div>
  );
}`
  },

  option3: {
    name: "Option 3: Brand Color Icons Only",
    description: "Icons use brand color, rest stays neutral",
    code: `import { SITE_STATS, installersLivePlus } from "@/lib/siteStats";

function UsersIcon() {
  return (
    <svg className="h-4 w-4 text-[var(--brand-600)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="h-4 w-4 text-[var(--brand-600)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="h-4 w-4 text-[var(--brand-600)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg className="h-4 w-4 text-[var(--brand-600)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg className="h-4 w-4 text-[var(--brand-600)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  );
}

export default function TrustRow() {
  return (
    <div
      data-testid="hero-trust-strip"
      aria-label="Trust signals"
      className="mt-3 md:mt-4 flex flex-wrap items-center justify-center gap-3 text-[13px] text-slate-700"
    >
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-sm">
        <UsersIcon />
        <span className="font-medium">{installersLivePlus} installers live</span>
      </span>

      <span className="text-slate-300">•</span>

      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-sm">
        <LockIcon />
        <span className="font-medium">SOC 2 compliant</span>
      </span>

      <span className="text-slate-300">•</span>

      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-sm">
        <ShieldIcon />
        <span className="font-medium">GDPR ready</span>
      </span>

      <span className="text-slate-300">•</span>

      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-sm">
        <SunIcon />
        <span className="font-medium">NREL PVWatts®</span>
      </span>

      <span className="text-slate-300">•</span>

      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-sm">
        <StarIcon />
        <span className="font-medium">{SITE_STATS.rating}/5 rating</span>
      </span>
    </div>
  );
}`
  },

  option4: {
    name: "Option 4: Glassmorphism Style",
    description: "Frosted glass effect with blur and subtle shadows",
    code: `import { SITE_STATS, installersLivePlus } from "@/lib/siteStats";

function UsersIcon() {
  return (
    <svg className="h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg className="h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg className="h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  );
}

export default function TrustRow() {
  return (
    <div
      data-testid="hero-trust-strip"
      aria-label="Trust signals"
      className="mt-4 md:mt-5 inline-flex flex-wrap items-center justify-center gap-3 px-4 py-2.5 rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]"
    >
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/60 backdrop-blur-sm border border-white/80 shadow-sm">
        <UsersIcon />
        <span className="font-medium text-slate-700">{installersLivePlus} installers live</span>
      </span>

      <span className="text-slate-300">•</span>

      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/60 backdrop-blur-sm border border-white/80 shadow-sm">
        <LockIcon />
        <span className="font-medium text-slate-700">SOC 2 compliant</span>
      </span>

      <span className="text-slate-300">•</span>

      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/60 backdrop-blur-sm border border-white/80 shadow-sm">
        <ShieldIcon />
        <span className="font-medium text-slate-700">GDPR ready</span>
      </span>

      <span className="text-slate-300">•</span>

      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/60 backdrop-blur-sm border border-white/80 shadow-sm">
        <SunIcon />
        <span className="font-medium text-slate-700">NREL PVWatts®</span>
      </span>

      <span className="text-slate-300">•</span>

      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/60 backdrop-blur-sm border border-white/80 shadow-sm">
        <StarIcon />
        <span className="font-medium text-slate-700">{SITE_STATS.rating}/5 rating</span>
      </span>
    </div>
  );
}`
  },

  option5: {
    name: "Option 5: Outlined Brand Pills",
    description: "Brand-colored outlines, clean and airy",
    code: `import { SITE_STATS, installersLivePlus } from "@/lib/siteStats";

function UsersIcon() {
  return (
    <svg className="h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg className="h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg className="h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  );
}

export default function TrustRow() {
  return (
    <div
      data-testid="hero-trust-strip"
      aria-label="Trust signals"
      className="mt-3 md:mt-4 flex flex-wrap items-center justify-center gap-3 text-[13px] text-slate-700"
    >
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-[var(--brand-400)] bg-transparent hover:bg-[var(--brand-50)]  transition-colors">
        <UsersIcon />
        <span className="font-medium">{installersLivePlus} installers live</span>
      </span>

      <span className="text-slate-300">•</span>

      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-[var(--brand-400)] bg-transparent hover:bg-[var(--brand-50)] transition-colors">
        <LockIcon />
        <span className="font-medium">SOC 2 compliant</span>
      </span>

      <span className="text-slate-300">•</span>

      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-[var(--brand-400)] bg-transparent hover:bg-[var(--brand-50)] transition-colors">
        <ShieldIcon />
        <span className="font-medium">GDPR ready</span>
      </span>

      <span className="text-slate-300">•</span>

      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-[var(--brand-400)] bg-transparent hover:bg-[var(--brand-50)] transition-colors">
        <SunIcon />
        <span className="font-medium">NREL PVWatts®</span>
      </span>

      <span className="text-slate-300">•</span>

      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-[var(--brand-400)] bg-transparent hover:bg-[var(--brand-50)] transition-colors">
        <StarIcon />
        <span className="font-medium">{SITE_STATS.rating}/5 rating</span>
      </span>
    </div>
  );
}`
  },
};

async function runDemo() {
  console.log('\n🎬 Starting demo cycle...\n');
  
  const optionKeys = Object.keys(OPTIONS);
  
  for (let i = 0; i < optionKeys.length; i++) {
    const key = optionKeys[i];
    const option = OPTIONS[key];
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`${option.name}`);
    console.log(`${option.description}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // Write the new version
    fs.writeFileSync('components/trust/TrustRow.tsx', option.code);
    
    // Wait 10 seconds
    await sleep(10000);
  }
  
  console.log('\n✅ Demo complete! Keeping the last option displayed.');
  console.log('Which option did you prefer? Let me know and I\'ll apply it permanently!\n');
}

runDemo().catch(console.error);

