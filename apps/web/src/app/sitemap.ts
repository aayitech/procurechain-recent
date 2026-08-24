import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://procurechain.example.com';
  return [
    { url: `${base}/`, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/assistant`, changeFrequency: 'weekly', priority: 0.6 },
  ];
}
