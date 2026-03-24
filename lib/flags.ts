export const isDemo = (
  sp: URLSearchParams | Record<string, string | undefined>,
) => (sp instanceof URLSearchParams ? sp.get("demo") : sp?.demo) === "1";

export const isEmbed = (
  sp: URLSearchParams | Record<string, string | undefined>,
) => (sp instanceof URLSearchParams ? sp.get("embed") : sp?.embed) === "1";
