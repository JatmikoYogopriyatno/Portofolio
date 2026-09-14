/**
 * =============================================================================
 *  lib/ukuran-gambar.js  |  Mengukur gambar sekali saat situs dibangun
 * =============================================================================
 *
 *  KENAPA PERLU
 *  Gambar di dalam tulisan tidak punya ukuran yang tertulis. Peramban baru tahu
 *  setinggi apa gambarnya setelah berkasnya selesai diunduh, jadi sebelum itu
 *  tingginya dianggap nol dan seluruh tulisan di bawahnya melompat begitu
 *  gambarnya muncul. Di jaringan ponsel yang lambat, lompatannya terasa persis
 *  seperti halaman yang tersendat.
 *
 *  Di sini tiap gambar diukur sekali saat situs dibangun, lalu ukurannya
 *  dituliskan ke atribut width dan height. Peramban jadi bisa memesan tempatnya
 *  lebih dulu dan tidak ada yang melompat.
 *
 *  HANYA BERJALAN DI SISI SERVER, saat build. Berkas ini membaca folder
 *  public/ langsung, jadi jangan diimpor dari komponen yang berjalan di
 *  peramban.
 * =============================================================================
 */

import path from 'node:path';
import sharp from 'sharp';
import { daftarGambar } from '@/lib/markdown';

/** Hasil pengukuran disimpan supaya berkas yang sama tidak diukur dua kali. */
const simpanan = new Map();

async function ukurSatu(src) {
  if (simpanan.has(src)) return simpanan.get(src);

  let hasil = null;
  try {
    const jalur = path.join(process.cwd(), 'public', decodeURIComponent(src));
    const info = await sharp(jalur).metadata();
    if (info?.width && info?.height) hasil = { w: info.width, h: info.height };
  } catch {
    // Berkasnya tidak ada atau tidak terbaca. Gambarnya tetap tampil, hanya
    // saja tempatnya tidak dipesan lebih dulu. Bukan alasan menggagalkan build.
    hasil = null;
  }

  simpanan.set(src, hasil);
  return hasil;
}

/**
 * Mengukur semua gambar yang dipakai di dalam satu atau beberapa tulisan.
 *
 * @param {string[]} tulisan isi tulisan apa adanya
 * @returns {Promise<Record<string, {w:number,h:number}>>} siap diserahkan ke renderMarkdown
 */
export async function ukurGambarTulisan(...tulisan) {
  const alamat = [...new Set(tulisan.flatMap((teks) => daftarGambar(teks)))];
  const terukur = await Promise.all(alamat.map(async (src) => [src, await ukurSatu(src)]));
  return Object.fromEntries(terukur.filter(([, ukuran]) => ukuran));
}
