import { portfolio } from '@/data/portfolio';
import { getPublishedPosts } from '@/data/posts';

// Wajib ada saat memakai output: 'export' supaya berkas sitemap.xml
// dibuat sekali waktu build, bukan dihitung ulang tiap permintaan.
export const dynamic = 'force-static';

/**
 * Sitemap dibuat otomatis saat build, jadi tidak ada berkas XML yang perlu
 * diperbarui manual. Menambah tulisan blog langsung menambah barisnya di sini.
 */
export default function sitemap() {
  const base = portfolio.meta.baseUrl.replace(/\/+$/, '');
  const today = new Date().toISOString().split('T')[0];

  return [
    { url: `${base}/`, lastModified: today, changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/blog/`, lastModified: today, changeFrequency: 'weekly', priority: 0.8 },
    ...getPublishedPosts().map((post) => ({
      url: `${base}/blog/${post.slug}/`,
      lastModified: post.date,
      changeFrequency: 'yearly',
      priority: 0.6,
    })),
  ];
}
