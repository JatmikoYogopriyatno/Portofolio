import { existsSync } from 'node:fs';
import path from 'node:path';
import { notFound } from 'next/navigation';
import { portfolio } from '@/data/portfolio';
import { getPublishedPosts, getPostBySlug } from '@/data/posts';
import { t } from '@/lib/i18n';
import { renderMarkdown } from '@/lib/markdown';
import { ukurGambarTulisan } from '@/lib/ukuran-gambar';
import PostArticle from '@/components/PostArticle';

const { meta, profile } = portfolio;

/**
 * Daftar alamat yang perlu dibuatkan halaman saat build.
 * Menambah tulisan di data/posts.js otomatis menambah halamannya di sini.
 */
export function generateStaticParams() {
  return getPublishedPosts().map((post) => ({ slug: post.slug }));
}

/** Metadata SEO per tulisan, termasuk kartu OpenGraph bertipe article. */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const title = t(post.title, meta.locale);
  const description = t(post.excerpt, meta.locale);

  /*
    KARTU PREVIEW SAAT TAUTAN DIBAGIKAN

    Yang dipakai bukan berkas sampulnya langsung, melainkan kartu khusus yang
    dibuat scripts/generate-og.mjs setiap kali situs dibangun.

    Alasannya: sampul yang kamu unggah bisa berukuran beberapa megabita, dan
    WhatsApp menyerah sebelum selesai mengunduhnya, sehingga yang muncul cuma
    tautan polos tanpa gambar. Kartu khusus itu 1200 x 630 piksel dan di bawah
    300 KB, ukuran yang diterima semua layanan.

    Ukuran dan tipenya ikut disebutkan. Tanpa itu sebagian layanan menampilkan
    gambar kecil di samping tautan, bukan kartu besar.
  */
  const kartu = path.join(process.cwd(), 'public', 'images', 'og', `${post.slug}.jpg`);
  const gambar = existsSync(kartu)
    ? { url: `/images/og/${post.slug}.jpg`, width: 1200, height: 630, type: 'image/jpeg' }
    : { url: meta.ogImage, width: 1200, height: 630, type: 'image/jpeg' };

  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}/` },
    openGraph: {
      type: 'article',
      url: `/blog/${post.slug}/`,
      title,
      description,
      publishedTime: post.date,
      authors: [profile.name],
      tags: post.tags,
      images: [{ ...gambar, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [gambar.url] },
  };
}

/** Halaman detail satu tulisan. */
export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const all = getPublishedPosts();
  const post = all.find((item) => item.slug === slug);
  if (!post) notFound();

  // Dua tulisan lain sebagai bacaan lanjutan di bawah artikel.
  const others = all.filter((item) => item.slug !== slug).slice(0, 2);

  // Tulisan diubah jadi HTML di sini, saat situs dibangun. Keduanya dikirim
  // sekaligus supaya tombol ID dan EN bisa berpindah seketika tanpa memuat
  // ulang halaman.
  const isiId = typeof post.body === 'string' ? post.body : (post.body?.id ?? '');
  const isiEn = typeof post.body === 'string' ? post.body : (post.body?.en || isiId);

  // Tiap gambar diukur lebih dulu supaya tempatnya bisa dipesan sebelum
  // gambarnya datang, dan tulisan di bawahnya tidak melompat saat memuat.
  const ukuran = await ukurGambarTulisan(isiId, isiEn);

  const bodyHtml = { id: renderMarkdown(isiId, ukuran), en: renderMarkdown(isiEn, ukuran) };

  // Data terstruktur agar tulisan bisa muncul sebagai artikel di mesin pencari.
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: t(post.title, meta.locale),
    description: t(post.excerpt, meta.locale),
    datePublished: post.date,
    author: { '@type': 'Person', name: profile.name, url: meta.baseUrl },
    image: `${meta.baseUrl}${post.cover || meta.ogImage}`,
    mainEntityOfPage: `${meta.baseUrl}/blog/${post.slug}/`,
    keywords: (post.tags ?? []).join(', '),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <PostArticle post={post} others={others} bodyHtml={bodyHtml} />
    </>
  );
}
