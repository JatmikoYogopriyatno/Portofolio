'use client';

import { useLanguage } from '@/components/LanguageProvider';

/**
 * PostBody: menampilkan isi satu tulisan.
 *
 * Tulisan yang kamu ketik di panel sudah diubah menjadi HTML saat situs
 * dibangun, di app/blog/[slug]/page.js. Komponen ini tinggal memilih versi
 * bahasa yang sedang aktif dan menampilkannya, jadi tidak ada pekerjaan berat
 * yang dibebankan ke peramban pengunjung.
 *
 * Isinya aman ditampilkan langsung karena lib/markdown.js sudah membuang kode
 * HTML mentah dan menolak alamat yang bisa menjalankan skrip.
 */
export default function PostBody({ html }) {
  const { lang } = useLanguage();

  const isi = typeof html === 'string' ? html : (html?.[lang] || html?.id || html?.en || '');

  if (!isi) return null;

  return <div className="prose-post" dangerouslySetInnerHTML={{ __html: isi }} />;
}
