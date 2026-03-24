export const isDemoFromSearch = (searchParams: URLSearchParams) =>
  searchParams.get("demo") === "1" || searchParams.get("demo") === "true";
