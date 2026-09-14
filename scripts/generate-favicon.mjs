/**
 * =============================================================================
 *  scripts/generate-favicon.mjs
 * =============================================================================
 *
 *  Membuat ikon situs, yaitu gambar kecil yang muncul di tab peramban, di
 *  daftar bookmark, dan di sebelah alamat situsmu pada hasil pencarian Google.
 *
 *  Tiga berkas dibuat sekaligus:
 *
 *    public/favicon.ico    48x48, yang dicari Google dan kebanyakan layanan
 *    app/icon.png          192x192, dipakai peramban modern
 *    app/apple-icon.png    180x180, untuk pintasan di layar utama iOS
 *
 *  BERJALAN OTOMATIS setiap kali situs dibangun, lihat prebuild di package.json.
 *  Artinya kamu cukup mengganti gambarnya lewat panel, dan ikonnya ikut berganti
 *  sendiri tanpa perlu menjalankan perintah apa pun.
 *
 *  SUMBER GAMBARNYA
 *  Diambil dari meta.favicon di content/settings.json, yang kamu isi lewat panel
 *  di menu Pengaturan Situs > Nama Situs dan SEO. Kalau dikosongkan, dipakai foto
 *  profilmu, sama seperti sebelumnya.
 *
 *  KENAPA UKURANNYA SEGITU
 *  Google meminta ikon situs berbentuk persegi dengan sisi kelipatan 48 piksel.
 *  Ikon lama berukuran 512x512, dan 512 bukan kelipatan 48. Itu salah satu sebab
 *  Google menampilkan ikon bola dunia polos, bukan ikon situsmu.
 * =============================================================================
 */

import sharp from 'sharp';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const akar = new URL('..', import.meta.url);
const bacaJson = (berkas) => JSON.parse(readFileSync(new URL(`content/${berkas}`, akar), 'utf8'));

const profile = bacaJson('profile.json');
const { meta } = bacaJson('settings.json');

/*
  Warna bingkai. Samakan dengan --accent-1, --accent-2, dan --accent-3 di
  app/globals.css kalau kamu mengganti palet warnanya.
*/
const A1 = '#6366f1';
const A2 = '#a855f7';
const A3 = '#06b6d4';

/** Gambar sumber: pilihan dari panel lebih dulu, foto profil sebagai cadangan. */
function berkasSumber() {
  const pilihan = [meta.favicon, profile.avatar].filter(
    (nilai) => typeof nilai === 'string' && nilai.trim() !== ''
  );

  for (const alamat of pilihan) {
    // Alamat di data ditulis seperti yang dilihat peramban, misalnya
    // /media/foto.jpg, sedangkan berkasnya ada di dalam folder public/.
    const jalur = path.join('public', decodeURIComponent(alamat));
    if (existsSync(jalur)) return jalur;
    console.warn(`[ikon] ${alamat} tidak ditemukan, mencoba pilihan berikutnya`);
  }

  return null;
}

/** Memotong gambar menjadi lingkaran dengan ukuran tertentu. */
async function fotoBulat(sumber, ukuran) {
  const topeng = Buffer.from(
    `<svg width="${ukuran}" height="${ukuran}"><circle cx="${ukuran / 2}" cy="${ukuran / 2}" r="${ukuran / 2}" fill="#fff"/></svg>`
  );
  return sharp(sumber)
    .resize(ukuran, ukuran, { fit: 'cover', position: 'top' })
    .composite([{ input: topeng, blend: 'dest-in' }])
    .png()
    .toBuffer();
}

/**
 * Satu ikon: foto lingkaran di dalam bingkai gradien.
 * Bentuknya sengaja sama persis dengan ikon sebelumnya.
 */
async function buatIkon(sumber, ukuran) {
  const bingkai = ukuran * 0.055;
  const dalam = Math.round(ukuran - bingkai * 4);

  const latar = Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${ukuran}" height="${ukuran}">
      <defs>
        <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${A1}"/>
          <stop offset="55%" stop-color="${A2}"/>
          <stop offset="100%" stop-color="${A3}"/>
        </linearGradient>
      </defs>
      <circle cx="${ukuran / 2}" cy="${ukuran / 2}" r="${ukuran / 2}" fill="url(#ring)"/>
      <circle cx="${ukuran / 2}" cy="${ukuran / 2}" r="${ukuran / 2 - bingkai}" fill="${meta.themeColorDark}"/>
    </svg>`);

  const foto = await fotoBulat(sumber, dalam);
  const geser = Math.round((ukuran - dalam) / 2);

  return sharp(latar)
    .composite([{ input: foto, top: geser, left: geser }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/**
 * Membungkus satu gambar PNG menjadi berkas .ico yang sah.
 *
 * Format ICO sejak Windows Vista boleh berisi PNG apa adanya, jadi tidak perlu
 * mengubahnya menjadi bitmap kuno. Yang dibutuhkan cuma dua puluh dua bita
 * keterangan di depannya.
 */
function bungkusIco(png, ukuran) {
  const kepala = Buffer.alloc(6);
  kepala.writeUInt16LE(0, 0); // cadangan, selalu nol
  kepala.writeUInt16LE(1, 2); // jenis: 1 berarti ikon
  kepala.writeUInt16LE(1, 4); // jumlah gambar di dalamnya

  const daftar = Buffer.alloc(16);
  daftar.writeUInt8(ukuran >= 256 ? 0 : ukuran, 0); // lebar, 0 berarti 256
  daftar.writeUInt8(ukuran >= 256 ? 0 : ukuran, 1); // tinggi
  daftar.writeUInt8(0, 2); // jumlah warna palet, 0 untuk gambar penuh warna
  daftar.writeUInt8(0, 3); // cadangan
  daftar.writeUInt16LE(1, 4); // bidang warna
  daftar.writeUInt16LE(32, 6); // bita per piksel
  daftar.writeUInt32LE(png.length, 8); // besar data gambarnya
  daftar.writeUInt32LE(22, 12); // letak data gambarnya, tepat setelah bagian ini

  return Buffer.concat([kepala, daftar, png]);
}

const sumber = berkasSumber();

if (!sumber) {
  console.warn('[ikon] tidak ada gambar sumber yang bisa dipakai, ikon lama dibiarkan');
  process.exit(0);
}

/*
  Ukurannya kelipatan 48, mengikuti syarat yang ditulis Google untuk ikon
  situs. 180 untuk iOS adalah pengecualian, karena Apple yang menentukan
  angka itu dan Google tidak membaca berkas tersebut.
*/
const hasil = [
  { ukuran: 192, tujuan: 'app/icon.png' },
  { ukuran: 180, tujuan: 'app/apple-icon.png' },
];

for (const { ukuran, tujuan } of hasil) {
  const png = await buatIkon(sumber, ukuran);
  writeFileSync(tujuan, png);
  console.log(`[ikon] ${tujuan.padEnd(22)} ${ukuran}x${ukuran}  ${Math.round(png.length / 1024)} KB`);
}

const ico = await buatIkon(sumber, 48);
mkdirSync('public', { recursive: true });
writeFileSync('public/favicon.ico', bungkusIco(ico, 48));
console.log(`[ikon] public/favicon.ico     48x48    ${Math.round(ico.length / 1024)} KB`);

console.log(`[ikon] sumbernya: ${sumber}`);
