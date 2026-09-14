/**
 * =============================================================================
 *  data/posts.js  |  PEMBACA TULISAN BLOG
 * =============================================================================
 *
 *  Setiap tulisan disimpan sebagai satu berkas JSON di content/posts/.
 *  Berkas ini membaca seluruh isi folder itu saat situs dibangun, jadi menambah
 *  tulisan lewat panel langsung memunculkannya di situs.
 *
 *  YANG DIISI SENDIRI OLEH BERKAS INI
 *  Tiga hal berikut tidak perlu kamu isi di panel, semuanya dihitung di sini:
 *
 *    alamat tulisan   diambil dari nama berkas, jadi tidak ada slug salah ketik
 *    waktu baca       dihitung dari panjang tulisan
 *    ringkasan        diambil dari kalimat pertama kalau kamu mengosongkannya
 *
 *  PENTING UNTUK PENGEMBANG
 *  Berkas ini membaca folder, jadi hanya boleh dipanggil dari server component
 *  atau saat build. Komponen di sisi browser menerima hasilnya lewat props.
 * =============================================================================
 */

import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { ringkasanOtomatis, waktuBaca } from '@/lib/markdown';

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

/** Mengambil satu bahasa dari nilai yang bisa berupa teks atau pasangan ID/EN. */
function ambil(nilai, bahasa = 'id') {
  if (typeof nilai === 'string') return nilai;
  if (nilai && typeof nilai === 'object') return nilai[bahasa] || nilai.id || nilai.en || '';
  return '';
}

/**
 * Melengkapi satu tulisan dengan bagian bagian yang dihitung otomatis.
 *
 * Ringkasan dan waktu baca dibuat per bahasa, supaya versi Inggris yang
 * panjangnya berbeda tetap dapat angka yang masuk akal.
 */
function lengkapi(post, namaBerkas) {
  const isiId = ambil(post.body, 'id');
  const isiEn = ambil(post.body, 'en') || isiId;

  const ringkasId = ambil(post.excerpt, 'id') || ringkasanOtomatis(isiId);
  const ringkasEn = ambil(post.excerpt, 'en') || ringkasanOtomatis(isiEn) || ringkasId;

  return {
    ...post,
    // Nama berkas adalah sumber kebenaran untuk alamat tulisan. Panel membuat
    // nama berkas itu dari judul, jadi kamu tidak perlu mengisinya sendiri.
    slug: namaBerkas.replace(/\.json$/, ''),
    excerpt: { id: ringkasId, en: ringkasEn },
    readingTime: { id: waktuBaca(isiId), en: waktuBaca(isiEn) },
    tags: Array.isArray(post.tags) ? post.tags.filter(Boolean) : [],
  };
}

/**
 * Membaca dan menyaring seluruh tulisan.
 *
 * Tulisan bertanda draft disembunyikan tanpa dihapus, dan berkas yang rusak
 * dilewati agar satu salah ketik tidak menjatuhkan seluruh halaman blog.
 *
 * @returns {Array<object>} tulisan terbit, terurut dari yang paling baru
 */
export function getPublishedPosts() {
  let files = [];

  try {
    files = readdirSync(POSTS_DIR).filter((name) => name.endsWith('.json'));
  } catch {
    // Folder belum ada, misalnya saat semua tulisan dihapus dari panel.
    return [];
  }

  return files
    .map((name) => {
      try {
        return lengkapi(JSON.parse(readFileSync(path.join(POSTS_DIR, name), 'utf8')), name);
      } catch {
        return null;
      }
    })
    .filter((post) => post && !post.draft)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

/** Mencari satu tulisan berdasarkan alamatnya. */
export function getPostBySlug(slug) {
  return getPublishedPosts().find((post) => post.slug === slug) ?? null;
}

/** Seluruh topik unik dari semua tulisan, dipakai untuk tombol penyaring. */
export function getAllTags(posts = getPublishedPosts()) {
  const unique = [];
  posts.forEach((post) => {
    (post.tags ?? []).forEach((tag) => {
      if (!unique.includes(tag)) unique.push(tag);
    });
  });
  return unique;
}
