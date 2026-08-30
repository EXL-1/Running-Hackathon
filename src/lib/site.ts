const DEFAULT_DEV_URL = "http://localhost:3000";

/**
 * Canonical site URL for metadata, sitemaps and absolute links. In production
 * set NEXT_PUBLIC_SITE_URL to https://peanutbutter.fitness on Vercel.
 */
export function siteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configured) {
    return configured.replace(/\/$/, "");
  }

  return DEFAULT_DEV_URL;
}
