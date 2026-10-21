import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/studio/", "/api/"] }, sitemap: `${env.SITE_URL.replace(/\/$/, "")}/sitemap.xml` };
}
