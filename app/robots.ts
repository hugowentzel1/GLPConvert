import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/demo", "/preview", "/admin", "/api", "/_next", "/private"],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL || "https://sunspire.app"}/sitemap.xml`,
  };
}
