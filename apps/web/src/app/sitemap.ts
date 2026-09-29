import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.procurechain.online';
  return [
    { url: `${base}/`, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/market-brief`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/knowledge-centre`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/calculators`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/benchmarking`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/health-check`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/assistant`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${base}/book-demo`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/data-sources`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/market-intelligence`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/login`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/register`, changeFrequency: 'monthly', priority: 0.5 },
  ];
}
