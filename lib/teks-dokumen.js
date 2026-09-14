/**
 * =============================================================================
 *  lib/teks-dokumen.js  |  MEMBERSIHKAN TEKS UNTUK CV DAN PORTOFOLIO
 * =============================================================================
 *
 *  Dipakai bersama oleh components/DokumenCV.jsx dan
 *  components/DokumenPortofolio.jsx. Dulu fungsi ini ditulis dua kali, satu di
 *  tiap berkas, dan itu artinya tiap perbaikan harus diingat dua kali juga.
 * =============================================================================
 */

/**
 * Mengabaikan nilai kosong maupun yang cuma berisi tanda hubung.
 *
 * -----------------------------------------------------------------------------
 * KENAPA FUNGSI INI IKUT MENGURUS ISIAN DUA BAHASA
 * -----------------------------------------------------------------------------
 * Ini jaring pengaman, bukan jalur utama. Jalur utamanya tetap membungkus
 * nilainya dengan t() lebih dulu, supaya isinya ikut berganti saat pengunjung
 * menekan tombol ID/EN.
 *
 * Jaringnya dipasang karena satu kejadian nyata. Kolom Lokasi di menu
 * Pengalaman diubah jadi dua bahasa, jadi isinya bukan lagi teks biasa
 * melainkan objek {id, en}. Di satu baris kode, t() terlewat, dan objek itu
 * dipaksa jadi teks oleh join(). Hasilnya CV yang dicetak memuat tulisan
 * "[object Object]" di setiap entri pengalaman.
 *
 * Yang membuatnya buruk bukan cuma jeleknya, tapi ke mana berkas itu pergi:
 * CV dikirim ke lowongan kerja. Kesalahan seperti itu tidak boleh menunggu
 * dilihat orang lebih dulu.
 *
 * Jadi kalau suatu saat ada kolom lain yang diubah jadi dua bahasa dan t()-nya
 * terlewat lagi, yang tercetak adalah teks Indonesianya, bukan sampah. Salah
 * bahasa masih bisa dimaafkan pembaca, "[object Object]" tidak.
 *
 * @param {unknown} teks nilai dari data, boleh teks, angka, atau objek {id, en}
 * @returns {string} teks yang siap dicetak, atau string kosong
 */
export function terisi(teks) {
  /*
    Dipilih dengan || dan pemeriksaan isi, bukan dengan ??.

    Tanda ?? cuma jatuh ke cadangan saat nilainya null atau undefined, padahal
    bentuk yang paling sering muncul di data ini adalah { id: 'sesuatu',
    en: '' }. Dengan ??, kolom Inggris yang berisi string kosong dianggap
    sudah terisi, dan yang tercetak justru kekosongan.
  */
  const mentah =
    teks && typeof teks === 'object' && !Array.isArray(teks)
      ? [teks.id, teks.en].find((n) => typeof n === 'string' && n.trim() !== '') ?? ''
      : teks;

  const bersih = String(mentah ?? '').trim();
  if (bersih === '' || /^[-–—.]+$/.test(bersih)) return '';
  return bersih;
}

/*
  Nama bulan disingkat tiga huruf, dua duanya sekaligus, Indonesia dan Inggris,
  karena kolom periode berbentuk dua bahasa dan isinya bisa salah satu dari
  keduanya tergantung tombol ID/EN.
*/
const BULAN = {
  januari: 'Jan', februari: 'Feb', maret: 'Mar', april: 'Apr', mei: 'Mei', juni: 'Jun',
  juli: 'Jul', agustus: 'Agu', september: 'Sep', oktober: 'Okt', november: 'Nov', desember: 'Des',
  january: 'Jan', february: 'Feb', march: 'Mar', may: 'May', june: 'Jun',
  july: 'Jul', august: 'Aug', october: 'Oct', december: 'Dec',
};

/**
 * Menyeragamkan penulisan tanggal.
 *
 * Panduan Harvard meminta tanggal ditulis dengan format yang konsisten dan
 * rata kanan. Yang tersimpan di data ini campur aduk, karena tiap entri
 * diketik pada waktu yang berbeda:
 *
 *   "Agu - Sep 2026"                 disingkat
 *   "Agustus 2021 - November 2021"   ditulis penuh
 *   "Februari 2021 - April 2021"     ditulis penuh
 *
 * Di atas kertas ketidakseragaman itu langsung terlihat, dan bagi perekrut
 * yang memindai cepat, itu terbaca sebagai kurang teliti. Semua disingkat
 * tiga huruf supaya seragam sekaligus hemat tempat.
 *
 * Isinya tidak diubah, cuma penulisannya. Kamu tetap boleh mengetik nama
 * bulan lengkap di panel, dan yang dicetak tetap rapi.
 *
 * @param {unknown} teks isi kolom periode
 * @returns {string}
 */
export function rapikanTanggal(teks) {
  const bersih = terisi(teks);
  if (!bersih) return '';

  return bersih
    .replace(/\p{L}+/gu, (kata) => BULAN[kata.toLowerCase()] ?? kata)
    // Spasi di sekitar tanda pisah diseragamkan, termasuk kalau ditulis rapat.
    .replace(/\s*[-–—]\s*/g, ' - ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Menyusun baris pertama entri gaya Harvard: nama instansi diikuti lokasinya.
 *
 * Aturannya, nama instansi dan lokasi berada di kiri baris pertama, tanggal
 * rata kanan, dan jabatan turun ke baris kedua.
 *
 * Lokasi dilewati kalau isinya sudah termuat di dalam nama instansi. Tanpa
 * penjagaan itu, satu entri di data ini akan tercetak sebagai "Laboratorium
 * Administrasi Publik Universitas Bengkulu, Universitas Bengkulu".
 *
 * @param {string} instansi
 * @param {string} lokasi
 * @returns {string}
 */
export function barisInstansi(instansi, lokasi) {
  const nama = terisi(instansi);
  const tempat = terisi(lokasi);

  if (!tempat) return nama;
  if (!nama) return tempat;

  const kecil = nama.toLowerCase();
  if (kecil.includes(tempat.toLowerCase()) || tempat.toLowerCase().includes(kecil)) return nama;

  return `${nama}, ${tempat}`;
}
