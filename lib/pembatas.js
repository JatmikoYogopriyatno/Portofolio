/**
 * =============================================================================
 *  lib/pembatas.js  |  Pembatas jumlah permintaan
 * =============================================================================
 *
 *  Dipakai endpoint yang terbuka untuk umum, yaitu formulir masukan dan
 *  penghitung kunjungan. Tugasnya menahan satu pengirim yang mengirim terlalu
 *  sering, dan menahan lonjakan dari banyak alamat sekaligus.
 *
 *  DISIMPAN DI MEMORI, dan itu memang disengaja.
 *
 *  Situs ini berjalan tanpa server yang menyala terus, jadi catatannya ikut
 *  hilang setiap kali servernya berganti. Artinya pembatas ini bukan penjaga
 *  yang mutlak, melainkan lapis yang menaikkan biaya penyalahgunaan sampai
 *  tidak sepadan. Untuk situs portofolio, itu sudah cukup, dan jauh lebih
 *  ringan daripada memasang layanan pembatas tersendiri.
 * =============================================================================
 */

/** Satu catatan per pembatas, supaya endpoint tidak saling mempengaruhi. */
const catatan = new Map();

/** Jumlah kunci terbanyak yang disimpan sebelum yang kedaluwarsa dibersihkan. */
const BATAS_KUNCI = 2000;

function ambilCatatan(nama) {
  let isi = catatan.get(nama);
  if (!isi) {
    isi = new Map();
    catatan.set(nama, isi);
  }
  return isi;
}

/**
 * Apakah permintaan ini melewati batas?
 *
 * Memanggil fungsi ini sekaligus mencatat permintaannya, jadi cukup dipanggil
 * satu kali per permintaan.
 *
 * @param {string} nama    nama pembatas, misalnya 'masukan' atau 'kunjungan'
 * @param {string} kunci   pembeda pengirim, biasanya alamat IP
 * @param {number} maks    berapa kali boleh dalam satu jendela waktu
 * @param {number} jendela panjang jendela waktu dalam milidetik
 * @returns {boolean} true kalau permintaannya harus ditolak
 */
export function terlaluSering(nama, kunci, maks, jendela) {
  const isi = ambilCatatan(nama);
  const sekarang = Date.now();

  const sebelumnya = (isi.get(kunci) ?? []).filter((waktu) => sekarang - waktu < jendela);
  if (sebelumnya.length >= maks) {
    isi.set(kunci, sebelumnya);
    return true;
  }

  sebelumnya.push(sekarang);
  isi.set(kunci, sebelumnya);

  // Buang catatan yang seluruh isinya sudah kedaluwarsa, supaya memorinya
  // tidak menumpuk terus di server yang berumur panjang.
  if (isi.size > BATAS_KUNCI) {
    for (const [k, v] of isi) {
      if (v.every((waktu) => sekarang - waktu >= jendela)) isi.delete(k);
    }
  }

  return false;
}

/**
 * Menentukan pengirim sebuah permintaan.
 *
 * Urutannya disengaja. x-vercel-forwarded-for diisi oleh Vercel sendiri dan
 * tidak bisa dipalsukan pengirim, jadi itu yang dipercaya lebih dulu.
 * x-forwarded-for dipakai terakhir karena isinya bisa berupa rantai alamat
 * yang sebagian dititipkan pengirimnya sendiri.
 */
export function pengirimPermintaan(request) {
  const h = request.headers;
  return (
    h.get('x-vercel-forwarded-for') ||
    h.get('x-real-ip') ||
    h.get('x-forwarded-for')?.split(',')[0].trim() ||
    'tak-dikenal'
  );
}
