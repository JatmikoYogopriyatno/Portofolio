/**
 * =============================================================================
 *  lib/waktu-audio.js  |  MENERJEMAHKAN TULISAN WAKTU JADI DETIK
 * =============================================================================
 *
 *  Di panel kamu menulis menit seperti yang biasa kamu baca di YouTube atau
 *  Spotify, misalnya 1:30 untuk satu menit tiga puluh detik. Peramban tidak
 *  mengerti tulisan itu, yang dia mengerti cuma angka detik. Berkas ini yang
 *  menjembatani keduanya.
 *
 *  Bentuk yang diterima:
 *
 *    "1:30"      satu menit tiga puluh detik   ->  90
 *    "0:45"      empat puluh lima detik        ->  45
 *    "45"        angka polos dianggap detik    ->  45
 *    "1:02:03"   satu jam dua menit tiga detik ->  3723
 *    "2:07,5"    boleh pakai koma desimal      ->  127.5
 *
 *  Kalau tulisannya tidak masuk akal, hasilnya null, dan pemutar akan
 *  memperlakukannya seolah kolom itu dikosongkan. Satu salah ketik tidak
 *  boleh membuat pemutarnya mati.
 * =============================================================================
 */

/**
 * Mengubah tulisan waktu menjadi jumlah detik.
 *
 * @param {string|number|null|undefined} nilai isi kolom dari panel
 * @returns {number|null} jumlah detik, atau null kalau kosong atau salah tulis
 */
export function keDetik(nilai) {
  if (nilai === null || nilai === undefined) return null;

  if (typeof nilai === 'number') {
    return Number.isFinite(nilai) && nilai >= 0 ? nilai : null;
  }

  const teks = String(nilai).trim();
  if (teks === '') return null;

  // Paling banyak tiga bagian: jam, menit, detik.
  const bagian = teks.split(':');
  if (bagian.length > 3) return null;

  let detik = 0;
  for (const potongan of bagian) {
    const angka = potongan.trim().replace(',', '.');
    if (!/^\d+(\.\d+)?$/.test(angka)) return null;
    detik = detik * 60 + Number.parseFloat(angka);
  }

  return Number.isFinite(detik) && detik >= 0 ? detik : null;
}

/**
 * Menulis jumlah detik menjadi m:ss, bentuk yang biasa dilihat orang.
 *
 * @param {number} detik
 * @returns {string} misalnya "1:30"
 */
export function jam(detik) {
  if (!Number.isFinite(detik) || detik < 0) return '0:00';
  const m = Math.floor(detik / 60);
  const d = Math.floor(detik % 60);
  return `${m}:${String(d).padStart(2, '0')}`;
}

/**
 * Menghitung potongan lagu yang dipilih lewat panel.
 *
 * Dipisahkan ke sini supaya aturannya cuma ditulis sekali, dan supaya bagian
 * yang paling mudah salah, yaitu "selesai sebelum mulai", tertangani di satu
 * tempat.
 *
 * @param {object} audio isi kolom "Audio pendamping" dari panel
 * @returns {{mulai: number, selesai: number|null}}
 */
export function potongan(audio) {
  const mulai = keDetik(audio?.start) ?? 0;
  const selesai = keDetik(audio?.end);

  // Kolom "berhenti" diabaikan kalau isinya lebih awal daripada kolom "mulai".
  // Menghormatinya berarti memutar potongan sepanjang nol detik, dan pembaca
  // cuma akan mendengar senyap.
  if (selesai === null || selesai <= mulai) return { mulai, selesai: null };

  return { mulai, selesai };
}
