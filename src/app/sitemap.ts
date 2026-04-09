import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://workwings.nl";

  const staticPages = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/login`, lastModified: new Date() },
    { url: `${baseUrl}/signup`, lastModified: new Date() },
    { url: `${baseUrl}/signup/worker`, lastModified: new Date() },
    { url: `${baseUrl}/signup/company`, lastModified: new Date() },
  ];

  // TODO: Add dynamic shift pages from Supabase
  // const shifts = await getPublicShifts()
  // const shiftPages = shifts.map(s => ({ url: `${baseUrl}/shifts/${s.id}`, lastModified: s.created_at }))

  return staticPages;
}
