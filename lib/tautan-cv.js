/**
 * =============================================================================
 *  lib/tautan-cv.js  |  MENULIS TAUTAN DI DALAM CV
 * =============================================================================
 *
 *  MASALAHNYA
 *  Alamat web di CV itu dilema. Ditulis utuh, sebagian di antaranya panjang
 *  sekali dan merusak kerapian, misalnya:
 *
 *    scholar.google.com/citations?user=XXXXXXXXXXXX&hl=en
 *    sinta.kemdikbud.go.id/authors/profile/XXXXXX?view=googlescholar
 *
 *  Yang kedua itu 230 huruf, dan kalau dicetak apa adanya dia menghabiskan
 *  empat baris sendirian. Tapi kalau semua alamat diganti kata seperti
 *  "LinkedIn" saja, mesin pelacak lamaran yang cuma membaca teks kehilangan
 *  alamatnya, padahal alamat itu yang dicari perekrut.
 *
 *  JALAN TENGAHNYA
 *  Alamat yang pendek dan terbaca ditulis apa adanya, jadi tetap terbaca
 *  mesin. Alamat yang panjang atau penuh tanda tanya diganti namanya, dan
 *  alamat aslinya tetap menempel sebagai tautan sungguhan di dalam PDF.
 *
 *  Untuk sertifikat dan publikasi, yang jadi tautan adalah NAMANYA, bukan
 *  alamatnya. Perekrut tinggal mengeklik judulnya, dan halamannya tetap
 *  bersih.
 *
 *  Warnanya sengaja tidak diubah. CV gaya Harvard memakai tinta hitam saja,
 *  dan tautan biru bergaris bawah membuatnya terlihat seperti halaman web.
 *  Lihat .cv-tautan di app/cetak.css.
 * =============================================================================
 */

/** Batas panjang alamat yang masih enak dibaca dalam satu baris CV. */
const BATAS_PANJANG = 34;

/**
 * Membuang bagian alamat yang tidak menambah keterangan apa pun.
 *
 * @param {string} href alamat lengkap
 * @returns {string} misalnya "scholar.google.com/citations"
 */
export function alamatPendek(href) {
  return String(href ?? '')
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/\/+$/, '');
}

/**
 * Memilih teks yang akan terlihat untuk sebuah tautan.
 *
 * @param {string} href alamat lengkap
 * @param {string} cadangan nama yang dipakai kalau alamatnya kepanjangan,
 *   biasanya label yang sudah kamu isi di panel, misalnya "Google Scholar"
 * @returns {string} teks yang ditampilkan
 */
export function labelTautan(href, cadangan = '') {
  const alamat = String(href ?? '').trim();
  if (alamat === '') return String(cadangan ?? '').trim();

  // Surat dan telepon ditulis sebagai isinya, bukan sebagai alamat.
  if (/^mailto:/i.test(alamat)) return alamat.replace(/^mailto:/i, '').trim();
  if (/^tel:/i.test(alamat)) return alamat.replace(/^tel:/i, '').trim();

  const pendek = alamatPendek(alamat);
  const nama = String(cadangan ?? '').trim();

  /*
    Tanda tanya berarti ada parameter kueri, dan parameter kueri tidak pernah
    enak dibaca manusia. Kalau kita punya nama cadangan, itu yang dipakai.
  */
  const berat = pendek.includes('?') || pendek.includes('#') || pendek.length > BATAS_PANJANG;
  if (berat && nama !== '') return nama;

  return pendek;
}
