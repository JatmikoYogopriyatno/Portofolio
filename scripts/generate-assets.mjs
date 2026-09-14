/**
 * =============================================================================
 *  scripts/generate-assets.mjs
 * =============================================================================
 *
 *  Membuat ulang kartu preview dari foto profil:
 *
 *    public/images/og-image.png  kartu preview saat link dibagikan (1200x630)
 *
 *  Ikon situs (favicon) dibuat terpisah oleh scripts/generate-favicon.mjs, dan
 *  itu berjalan sendiri tiap kali situs dibangun.
 *
 *  JALANKAN SETIAP KALI KAMU MENGGANTI FOTO PROFIL:
 *
 *    npm run assets
 *
 *  Sumbernya diambil dari profile.avatar di content/profile.json, jadi kalau
 *  kamu mengganti fotonya lewat panel /admin, skrip ini ikut menyesuaikan.
 *
 *  Teks pada kartu preview juga dibaca dari data yang sama. Fontnya memakai
 *  huruf bawaan sistem karena skrip ini berjalan di luar browser.
 * =============================================================================
 */

import sharp from 'sharp';
import { existsSync, readFileSync } from 'node:fs';

/**
 * Konten dibaca langsung dari berkas JSON di folder content/, bukan lewat
 * data/portfolio.js. Berkas itu memakai alias @/ yang hanya dikenali Next.js,
 * sedangkan skrip ini berjalan di Node biasa.
 */
const readJson = (file) => JSON.parse(readFileSync(new URL(`../content/${file}`, import.meta.url), 'utf8'));

const profile = readJson('profile.json');
const contact = readJson('contact.json');
const { meta } = readJson('settings.json');

// Path foto dari data, dihitung ulang menjadi lokasi berkas sungguhan.
const PHOTO = `public${profile.avatar}`;

if (!existsSync(PHOTO)) {
  console.error(`Foto tidak ditemukan di ${PHOTO}`);
  console.error('Periksa profile.avatar di content/profile.json, lalu pastikan berkasnya ada di folder public/.');
  process.exit(1);
}

// Warna aksen. Samakan dengan --accent-1, --accent-2, dan --accent-3
// di app/globals.css kalau kamu mengganti palet warnanya.
const A1 = '#6366f1';
const A2 = '#a855f7';
const A3 = '#06b6d4';

const FONT = 'DejaVu Sans, Liberation Sans, sans-serif';

/** Memotong foto menjadi lingkaran dengan ukuran tertentu. */
async function circlePhoto(size) {
  const mask = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`
  );
  return sharp(PHOTO)
    .resize(size, size, { fit: 'cover', position: 'top' })
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();
}

/** Kartu preview yang muncul saat tautan situs dibagikan. */
async function buildOgImage(outPath) {
  const W = 1200;
  const H = 630;

  // Nama dipecah menjadi dua baris supaya muat dan seimbang.
  const words = profile.name.split(' ');
  const half = Math.ceil(words.length / 2);
  const line1 = words.slice(0, half).join(' ');
  const line2 = words.slice(half).join(' ');

  const availability = profile.availability?.available
    ? (profile.availability.label?.id ?? '')
    : '';

  const escapeXml = (text) =>
    String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  // Lebar kapsul status disesuaikan kasar dengan panjang teksnya.
  const badgeWidth = Math.min(430, 70 + availability.length * 11);

  const background = Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
      <defs>
        <linearGradient id="base" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0b1024"/>
          <stop offset="100%" stop-color="${meta.themeColorDark}"/>
        </linearGradient>
        <radialGradient id="b1" cx="12%" cy="8%" r="62%">
          <stop offset="0%" stop-color="${A1}" stop-opacity="0.75"/>
          <stop offset="100%" stop-color="${A1}" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="b2" cx="88%" cy="20%" r="60%">
          <stop offset="0%" stop-color="${A2}" stop-opacity="0.62"/>
          <stop offset="100%" stop-color="${A2}" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="b3" cx="55%" cy="112%" r="65%">
          <stop offset="0%" stop-color="${A3}" stop-opacity="0.5"/>
          <stop offset="100%" stop-color="${A3}" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="${A1}"/>
          <stop offset="50%" stop-color="${A2}"/>
          <stop offset="100%" stop-color="${A3}"/>
        </linearGradient>
      </defs>

      <rect width="${W}" height="${H}" fill="url(#base)"/>
      <rect width="${W}" height="${H}" fill="url(#b1)"/>
      <rect width="${W}" height="${H}" fill="url(#b2)"/>
      <rect width="${W}" height="${H}" fill="url(#b3)"/>

      <g stroke="#ffffff" stroke-opacity="0.05" stroke-width="1">
        <path d="M0 158h1200M0 315h1200M0 472h1200M300 0v630M600 0v630M900 0v630"/>
      </g>

      <rect x="56" y="56" width="1088" height="518" rx="34"
            fill="#ffffff" fill-opacity="0.05"
            stroke="#ffffff" stroke-opacity="0.14" stroke-width="1.5"/>

      <rect x="104" y="132" width="74" height="5" rx="2.5" fill="url(#bar)"/>

      <text x="104" y="205" font-family="${FONT}" font-size="62" font-weight="bold" fill="#ffffff">${escapeXml(line1)}</text>
      <text x="104" y="278" font-family="${FONT}" font-size="62" font-weight="bold" fill="#ffffff">${escapeXml(line2)}</text>

      <text x="104" y="345" font-family="${FONT}" font-size="25" fill="#c7d2fe">Teknologi Informasi &#183; Tata Kelola Sektor Publik</text>

      ${
        availability
          ? `<rect x="104" y="392" width="${badgeWidth}" height="52" rx="26" fill="#ffffff" fill-opacity="0.08" stroke="#ffffff" stroke-opacity="0.16"/>
             <circle cx="132" cy="418" r="7" fill="#34d399"/>
             <text x="150" y="427" font-family="${FONT}" font-size="21" fill="#e2e8f0">${escapeXml(availability)}</text>`
          : ''
      }

      <text x="104" y="512" font-family="${FONT}" font-size="20" fill="#94a3b8">${escapeXml(profile.location)}</text>
    </svg>`);

  const size = 330;
  const ring = 7;

  const frame = Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${size + ring * 2}" height="${size + ring * 2}">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${A1}"/>
          <stop offset="55%" stop-color="${A2}"/>
          <stop offset="100%" stop-color="${A3}"/>
        </linearGradient>
      </defs>
      <circle cx="${size / 2 + ring}" cy="${size / 2 + ring}" r="${size / 2 + ring}" fill="url(#g)"/>
    </svg>`);

  const photo = await circlePhoto(size);
  const photoX = 760;
  const photoY = Math.round((H - size) / 2);

  // Disimpan sebagai JPEG, bukan PNG. Isinya foto beserta gradien, dan untuk
  // gambar semacam itu PNG menghasilkan berkas berkali lipat lebih besar tanpa
  // beda tampilan yang terlihat. Ukuran berkas penting di sini karena WhatsApp
  // menyerah mengunduh kartu preview yang terlalu berat.
  await sharp(background)
    .composite([
      { input: frame, top: photoY - ring, left: photoX - ring },
      { input: photo, top: photoY, left: photoX },
    ])
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(outPath);

  console.log(`  ${outPath}  ${W}x${H}`);
}

console.log(`Membuat aset dari ${PHOTO} untuk ${contact.email}`);

/*
  Ikon situs TIDAK dibuat di sini lagi.

  Sekarang pembuatannya ada di scripts/generate-favicon.mjs, yang berjalan
  sendiri tiap kali situs dibangun dan membaca pilihan gambar dari panel.
  Kalau ikutan dibuat di sini juga, keduanya akan saling menimpa dengan
  ukuran yang berbeda, dan yang menang tergantung mana yang dijalankan
  terakhir.
*/
await buildOgImage(`public${meta.ogImage}`);
console.log('Selesai. Ikon situs dibuat terpisah dan otomatis, lihat npm run ikon.');
