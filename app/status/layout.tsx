/**
 * Status page layout: no nav, no footer, no branding.
 * Root layout still wraps this; ConditionalSharedNav returns null for /status.
 */
export default function StatusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
