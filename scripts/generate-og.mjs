/**
 * =============================================================================
 *  scripts/generate-og.mjs
 * =============================================================================
 *
 *  Membuat kartu preview untuk setiap tulisan blog, yaitu gambar yang muncul
 *  saat kamu membagikan tautannya ke WhatsApp, LinkedIn, atau X.
 *
 *  Berjalan sendiri setiap kali situs dibangun. Tidak ada yang perlu kamu
 *  jalankan manual, dan tulisan baru dari panel otomatis kebagian.
 *
 *  KENAPA PERLU DIBUATKAN KHUSUS
 *  Dulu kartu previewnya memakai berkas sampul apa adanya. Foto dari kamera
 *  bisa berukuran beberapa megabita, dan WhatsApp menyerah sebelum selesai
 *  mengunduhnya. Yang terlihat cuma tautan polos tanpa gambar.
 *
 *  Kartu di sini dibuat sesuai yang diharapkan semua layanan:
 *
 *    ukuran   1200 x 630 piksel, rasio yang dipakai kartu preview besar
 *    format   JPEG, dimengerti semua layanan tanpa kecuali
 *    berat    di bawah 300 KB, jauh di dalam batas WhatsApp
 *
 *  Judul tulisannya ikut ditulis di atas gambar, jadi orang tahu isinya
 *  sebelum mengklik.
 * =============================================================================
 */

import sharp from 'sharp';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const AKAR = process.cwd();
const FOLDER_TULISAN = path.join(AKAR, 'content', 'posts');
const FOLDER_KELUAR = path.join(AKAR, 'public', 'images', 'og');

const LEBAR = 1200;
const TINGGI = 630;
const BATAS_BYTE = 300 * 1024;
const FONT = 'DejaVu Sans, Liberation Sans, sans-serif';

/** Warna aksen, samakan dengan --accent-* di app/globals.css. */
const A1 = '#6366f1';
const A2 = '#a855f7';

function amanXml(teks) {
  return String(teks)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Memecah judul menjadi beberapa baris supaya muat.
 *
 * Lebar huruf ditaksir kasar dari ukuran fontnya. Ini tidak perlu presisi,
 * cukup mencegah judul panjang keluar dari tepi gambar.
 */
function pecahBaris(teks, ukuranFont, lebarTersedia, maksBaris = 3) {
  const perHuruf = ukuranFont * 0.54;
  const maksHuruf = Math.floor(lebarTersedia / perHuruf);

  const kata = String(teks).split(/\s+/).filter(Boolean);
  const baris = [];
  let sekarang = '';

  for (const k of kata) {
    const calon = sekarang ? `${sekarang} ${k}` : k;
    if (calon.length <= maksHuruf) {
      sekarang = calon;
    } else {
      if (sekarang) baris.push(sekarang);
      sekarang = k;
      if (baris.length === maksBaris) break;
    }
  }
  if (sekarang && baris.length < maksBaris) baris.push(sekarang);

  // Judul yang masih tersisa ditandai dengan titik titik.
  const semuaMuat = baris.join(' ').length >= String(teks).trim().length;
  if (!semuaMuat && baris.length > 0) {
    baris[baris.length - 1] = `${baris[baris.length - 1]}...`;
  }

  return baris;
}

/** Mengambil satu bahasa dari nilai yang bisa berupa teks atau pasangan ID/EN. */
function ambil(nilai) {
  if (typeof nilai === 'string') return nilai;
  if (nilai && typeof nilai === 'object') return nilai.id || nilai.en || '';
  return '';
}

/** Lapisan gelap dan tulisan yang ditumpuk di atas foto. */
function lapisanTeks(judul, alamat) {
  const baris = pecahBaris(judul, 54, LEBAR - 160);
  const tinggiBlok = baris.length * 66;
  const mulaiY = TINGGI - 96 - tinggiBlok + 54;

  return Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${LEBAR}" height="${TINGGI}">
      <defs>
        <linearGradient id="tirai" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#05070f" stop-opacity="0.05"/>
          <stop offset="45%" stop-color="#05070f" stop-opacity="0.62"/>
          <stop offset="100%" stop-color="#05070f" stop-opacity="0.95"/>
        </linearGradient>
        <linearGradient id="garis" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="${A1}"/>
          <stop offset="100%" stop-color="${A2}"/>
        </linearGradient>
      </defs>

      <rect width="${LEBAR}" height="${TINGGI}" fill="url(#tirai)"/>
      <rect x="80" y="${mulaiY - 86}" width="72" height="5" rx="2.5" fill="url(#garis)"/>

      ${baris
        .map(
          (b, i) =>
            `<text x="80" y="${mulaiY + i * 66}" font-family="${FONT}" font-size="54" font-weight="bold" fill="#ffffff">${amanXml(b)}</text>`
        )
        .join('')}

      <text x="80" y="${TINGGI - 52}" font-family="${FONT}" font-size="23" fill="#c7d2fe">${amanXml(alamat)}</text>
    </svg>`);
}

/** Menekan mutu bertahap sampai berkasnya cukup ringan. */
async function jadikanRingan(gambar) {
  for (const mutu of [82, 72, 62, 52]) {
    const hasil = await gambar.clone().jpeg({ quality: mutu, mozjpeg: true }).toBuffer();
    if (hasil.length <= BATAS_BYTE) return { hasil, mutu };
  }
  const hasil = await gambar.clone().jpeg({ quality: 44, mozjpeg: true }).toBuffer();
  return { hasil, mutu: 44 };
}

async function buatKartu(berkas, alamat) {
  const slug = berkas.replace(/\.json$/, '');
  const isi = JSON.parse(readFileSync(path.join(FOLDER_TULISAN, berkas), 'utf8'));

  const sampul = isi.cover;
  if (!sampul) return { slug, status: 'dilewati, tidak punya sampul' };

  const sumber = path.join(AKAR, 'public', sampul.replace(/^\//, ''));
  if (!existsSync(sumber)) return { slug, status: `dilewati, sampul tidak ditemukan (${sampul})` };

  const keluar = path.join(FOLDER_KELUAR, `${slug}.jpg`);

  // Lewati kalau kartunya sudah ada dan lebih baru daripada sumbernya.
  if (existsSync(keluar)) {
    const umurKartu = statSync(keluar).mtimeMs;
    const umurSumber = Math.max(
      statSync(sumber).mtimeMs,
      statSync(path.join(FOLDER_TULISAN, berkas)).mtimeMs
    );
    if (umurKartu >= umurSumber) return { slug, status: 'sudah terbaru' };
  }

  const latar = sharp(sumber)
    .resize(LEBAR, TINGGI, { fit: 'cover', position: 'attention' })
    .composite([{ input: lapisanTeks(ambil(isi.title) || slug, alamat) }]);

  const { hasil, mutu } = await jadikanRingan(latar);
  await sharp(hasil).toFile(keluar);

  return { slug, status: `dibuat, ${Math.round(hasil.length / 1024)} KB, mutu ${mutu}` };
}

// --- Jalan ---

let tulisan = [];
try {
  tulisan = readdirSync(FOLDER_TULISAN).filter((n) => n.endsWith('.json'));
} catch {
  console.log('[kartu preview] belum ada tulisan blog, dilewati');
  process.exit(0);
}

mkdirSync(FOLDER_KELUAR, { recursive: true });

const alamat = (() => {
  try {
    const s = JSON.parse(readFileSync(path.join(AKAR, 'content', 'settings.json'), 'utf8'));
    return String(s.meta?.baseUrl ?? '').replace(/^https?:\/\//, '');
  } catch {
    return '';
  }
})();

for (const berkas of tulisan) {
  try {
    const { slug, status } = await buatKartu(berkas, alamat);
    console.log(`[kartu preview] ${slug}: ${status}`);
  } catch (galat) {
    // Satu kartu gagal tidak boleh menggagalkan pembangunan situs. Tulisan itu
    // cukup memakai kartu preview bawaan situs.
    console.warn(`[kartu preview] ${berkas} gagal: ${galat.message}`);
  }
}
