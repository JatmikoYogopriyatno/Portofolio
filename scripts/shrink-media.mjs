/**
 * =============================================================================
 *  scripts/shrink-media.mjs
 * =============================================================================
 *
 *  Memperkecil foto yang sudah terlanjur diunggah dalam ukuran raksasa.
 *
 *  KENAPA PERLU
 *  Foto dari kamera ponsel biasanya 12 megapiksel atau lebih. Saat panel
 *  menampilkan daftar media, tiap foto harus dibongkar dulu di memori, dan satu
 *  foto sebesar itu memakan sekitar 48 MB RAM. Dengan puluhan foto sekaligus,
 *  memori Chrome di ponsel habis dan tabnya ditutup paksa.
 *
 *  Unggahan baru sudah diperkecil sendiri oleh panel, lihat transformations di
 *  public/admin/config.yml. Skrip ini untuk membereskan yang terlanjur masuk
 *  sebelum pengaturan itu ada.
 *
 *  CARA MENJALANKANNYA
 *
 *    node scripts/shrink-media.mjs --coba    lihat dulu apa yang akan terjadi
 *    node scripts/shrink-media.mjs           kerjakan sungguhan
 *
 *  YANG DIJAGA
 *
 *    nama berkas    tidak diubah sama sekali, jadi tidak ada rujukan yang putus
 *    format         JPEG tetap JPEG, PNG tetap PNG
 *    berkas kecil   dilewati, tidak disentuh sama sekali
 *    yang asli      tetap tersimpan di riwayat Git dan bisa diambil kembali
 *
 *  Lebar 2000 piksel masih jauh di atas kebutuhan tampilan mana pun di situs
 *  ini. Gambar terbesar yang pernah ditampilkan adalah sampul blog selebar
 *  1200 piksel.
 * =============================================================================
 */

import sharp from 'sharp';
import { readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const FOLDER = path.join(process.cwd(), 'public', 'media');

/** Lebar maksimal setelah diperkecil. */
const LEBAR_MAKS = 2000;

/** Berkas di bawah ukuran ini dianggap sudah ringan dan dilewati. */
const AMBANG_BYTE = 500 * 1024;

/**
 * Berkas yang lebarnya sudah wajar tetapi masih sebesar ini tetap diolah,
 * biasanya karena kualitas simpannya terlalu tinggi.
 */
const AMBANG_BESAR = 1024 * 1024;

/**
 * Kalau penghematannya di bawah angka ini, berkas dibiarkan apa adanya.
 * Menyimpan ulang JPEG selalu mengurangi kualitas sedikit, jadi tidak sepadan
 * kalau yang didapat cuma beberapa kilobyte. Ini juga yang membuat skrip ini
 * aman dijalankan berkali-kali.
 */
const HEMAT_MINIMAL = 0.1;

const JENIS_GAMBAR = ['.jpg', '.jpeg', '.png', '.webp'];

const cobaSaja = process.argv.includes('--coba');

function ukuranRapi(byte) {
  return byte >= 1048576 ? `${(byte / 1048576).toFixed(1)} MB` : `${Math.round(byte / 1024)} KB`;
}

let berkas = [];
try {
  berkas = readdirSync(FOLDER);
} catch {
  console.log('[perkecil] folder public/media belum ada, tidak ada yang dikerjakan');
  process.exit(0);
}

let jumlahDiubah = 0;
let sebelumnya = 0;
let sesudahnya = 0;

for (const nama of berkas) {
  const ekstensi = path.extname(nama).toLowerCase();
  if (!JENIS_GAMBAR.includes(ekstensi)) continue;

  const jalur = path.join(FOLDER, nama);
  const asli = statSync(jalur).size;
  if (asli < AMBANG_BYTE) continue;

  try {
    const info = await sharp(jalur).metadata();
    if (!info.width) continue;

    // Yang lebarnya sudah wajar dan ukurannya tidak berlebihan tidak perlu
    // disentuh lagi. Tanpa saringan ini, tiap kali skrip dijalankan semua
    // berkas disimpan ulang dan kualitasnya turun sedikit demi sedikit.
    if (info.width <= LEBAR_MAKS && asli < AMBANG_BESAR) continue;

    // Format dipertahankan supaya nama berkasnya tidak perlu berubah. Nama
    // yang berubah akan memutus setiap rujukan ke gambar ini di seluruh situs.
    let olahan = sharp(jalur).resize({ width: LEBAR_MAKS, withoutEnlargement: true });
    if (ekstensi === '.png') olahan = olahan.png({ compressionLevel: 9, palette: true });
    else if (ekstensi === '.webp') olahan = olahan.webp({ quality: 82 });
    else olahan = olahan.jpeg({ quality: 82, mozjpeg: true });

    const hasil = await olahan.toBuffer();

    // Kalau hasil olahannya tidak cukup lebih kecil, biarkan yang asli.
    if (hasil.length >= asli * (1 - HEMAT_MINIMAL)) {
      console.log(`  lewati  ${nama.padEnd(46).slice(0, 46)} sudah cukup ringan`);
      continue;
    }

    if (!cobaSaja) writeFileSync(jalur, hasil);

    jumlahDiubah += 1;
    sebelumnya += asli;
    sesudahnya += hasil.length;

    const tanda = cobaSaja ? 'akan' : 'ubah';
    console.log(
      `  ${tanda}    ${nama.padEnd(46).slice(0, 46)} ${info.width}px  ${ukuranRapi(asli)} -> ${ukuranRapi(hasil.length)}`
    );
  } catch (galat) {
    console.warn(`  gagal   ${nama}: ${galat.message}`);
  }
}

console.log('');
if (jumlahDiubah === 0) {
  console.log('[perkecil] tidak ada berkas yang perlu diperkecil');
} else {
  const hemat = sebelumnya - sesudahnya;
  console.log(
    `[perkecil] ${jumlahDiubah} berkas, ${ukuranRapi(sebelumnya)} -> ${ukuranRapi(sesudahnya)}, hemat ${ukuranRapi(hemat)} (${Math.round((hemat / sebelumnya) * 100)}%)`
  );
  if (cobaSaja) console.log('[perkecil] ini baru percobaan, tidak ada berkas yang diubah');
}
