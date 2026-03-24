import { redirect } from 'next/navigation';

/**
 * Instant URL for paid customers: /{companyHandle} (e.g. /solarcorp, /activate-test).
 * Redirects to the paid calculator page with company param so their logo/name/theme show.
 */
export default function CompanyHandlePage({
  params,
}: {
  params: { companyHandle: string };
}) {
  const companyHandle = params?.companyHandle || '';
  if (!companyHandle) redirect('/');
  redirect(`/paid?company=${encodeURIComponent(companyHandle)}`);
}
