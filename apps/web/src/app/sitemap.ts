import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://procurechain.example.com';
  return [
    { url: `${base}/`, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/assistant`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${base}/book-demo`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/data-sources`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/market-intelligence`, changeFrequency: 'daily', priority: 0.9 },
  ];
}
