export type AppMode = 'demo' | 'paid';

export function getAppMode(searchParams: URLSearchParams): AppMode {
  return searchParams.get('demo') === '1' ? 'demo' : 'paid';
}
