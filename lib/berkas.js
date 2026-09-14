/**
 * =============================================================================
 *  lib/berkas.js  |  Mengenali jenis berkas dan menyiapkan alamat gambar
 * =============================================================================
 *
 *  Dua hal yang dipakai bersama oleh beberapa bagian situs:
 *
 *    1. MENGENALI JENIS BERKAS dari akhiran namanya. Dipakai tulisan blog,
 *       galeri, dan tombol unduh di kartu pengalaman, supaya ketiganya
 *       sepakat soal apa yang disebut gambar dan apa yang disebut video.
 *
 *    2. MENYUSUN ALAMAT GAMBAR YANG SUDAH DIPERKECIL. Komponen React memakai
 *       SmartImage untuk ini. Tetapi isi tulisan blog dirakit sebagai teks HTML
 *       biasa, bukan komponen, jadi alamatnya perlu disusun sendiri di sini.
 *
 *  KENAPA NOMOR DUA PENTING
 *  Gambar yang ditempel di tulisan dulu disajikan apa adanya. Satu foto 1,4 MB
 *  dikirim utuh ke ponsel yang layarnya cuma 390 piksel. Lewat pengoptimal,
 *  foto yang sama turun jadi sekitar 120 KB dengan tampilan yang sama persis.
 * =============================================================================
 */

import { basePath, sandikan } from '@/lib/asset';

/** Daftar jenis berkas yang punya tampilan khusus. */
export const JENIS_BERKAS = {
  gambar: ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.svg'],
  video: ['.mp4', '.webm', '.mov', '.ogv', '.m4v'],
  musik: ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac'],
  dokumen: ['.pdf'],
};

/**
 * Menebak jenis berkas dari akhiran namanya.
 * @returns {'gambar'|'video'|'musik'|'dokumen'|null}
 */
export function jenisBerkas(href = '') {
  const bersih = String(href).split(/[?#]/)[0].toLowerCase();
  for (const [nama, akhiran] of Object.entries(JENIS_BERKAS)) {
    if (akhiran.some((a) => bersih.endsWith(a))) return nama;
  }
  return null;
}

/*
  Lebar yang disiapkan pengoptimal. Angkanya harus ada di daftar bawaan
  Next.js, kalau tidak permintaannya ditolak. Empat langkah ini cukup untuk
  menutup ponsel sampai layar besar tanpa membuat srcset kepanjangan.
*/
const LEBAR = [640, 828, 1080, 1920];

/*
  Mutu 75 adalah satu satunya nilai yang diizinkan pengoptimal, lihat
  images.qualities di next.config.mjs. Nilai lain dijawab dengan galat 400.
*/
const MUTU = 75;

/**
 * Bisakah gambar ini dilewatkan pengoptimal?
 *
 * Hanya berkas milik situs ini. SVG dilewati karena pengoptimal menolaknya
 * demi keamanan, dan GIF dilewati karena hasil olahannya kehilangan animasi.
 */
export function bisaDiperkecil(src = '') {
  if (typeof src !== 'string' || !src.startsWith('/')) return false;
  const bersih = src.split(/[?#]/)[0].toLowerCase();
  return /\.(jpe?g|png|webp|avif)$/.test(bersih);
}

/**
 * Alamat satu gambar pada lebar tertentu.
 *
 * Garis miring sebelum tanda tanya wajib ada. Situs ini memakai alamat
 * berakhiran garis miring, dan tanpa garis miring itu permintaannya dijawab
 * pengalihan 308 lebih dulu, satu perjalanan bolak balik yang sia sia.
 */
export function alamatDiperkecil(src, lebar) {
  return `${basePath}/_next/image/?url=${encodeURIComponent(sandikan(src))}&w=${lebar}&q=${MUTU}`;
}

/** Daftar alamat untuk atribut srcset, dari yang paling sempit. */
export function srcsetDiperkecil(src) {
  return LEBAR.map((w) => `${alamatDiperkecil(src, w)} ${w}w`).join(', ');
}

/** Lebar terbesar yang disiapkan, dipakai sebagai alamat cadangan di src. */
export const LEBAR_TERBESAR = LEBAR[LEBAR.length - 1];
