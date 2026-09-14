/**
 * =============================================================================
 *  lib/rentang.js  |  MENYARING ISI DOKUMEN MENURUT RENTANG WAKTU
 * =============================================================================
 *
 *  Dokumen cetak bisa dipersempit ke lima tahun terakhir, tiga tahun terakhir,
 *  atau ditampilkan seluruhnya. Gunanya praktis: berkas pengajuan penelitian
 *  meminta "dalam 5 tahun terakhir", sebagian undangan pemakalah meminta tiga,
 *  sedangkan untuk kenaikan jabatan yang diminta justru seluruh rekam jejak.
 *
 *  ---------------------------------------------------------------------------
 *  BARIS TANPA TAHUN TIDAK PERNAH DIBUANG
 *  ---------------------------------------------------------------------------
 *  Ini keputusan yang paling menentukan di berkas ini.
 *
 *  Sebagian baris memang belum punya tahun. Dua puluh enam publikasi di
 *  content/publications.json, misalnya, kolom tahunnya masih kosong karena
 *  berkas sumbernya memang tidak mencantumkannya.
 *
 *  Kalau baris tanpa tahun ikut dibuang saat menyaring, akibatnya buruk dan
 *  tidak kelihatan: seseorang memilih "5 tahun terakhir", seluruh daftar
 *  publikasinya lenyap, dan berkas itu dikirim ke penilai tanpa ada yang
 *  menyadari ada bagian yang hilang. Kehilangan diam diam pada berkas yang
 *  dinilai orang lain jauh lebih merugikan daripada menampilkan satu dua baris
 *  yang seharusnya sudah lewat rentangnya.
 *
 *  Jadi aturannya: yang dibuang hanya baris yang tahunnya diketahui DAN
 *  memang di luar rentang. Yang tahunnya kosong selalu ikut tampil.
 *
 *  ---------------------------------------------------------------------------
 *  TAHUN ACUAN BUKAN JAM KOMPUTER PENGUNJUNG
 *  ---------------------------------------------------------------------------
 *  "Lima tahun terakhir" dihitung dari tahun berjalan menurut waktu Indonesia
 *  bagian barat, bukan menurut zona waktu perangkat yang membuka halaman.
 *  Tanpa itu, pengunjung di Los Angeles pada 1 Januari bisa melihat daftar
 *  yang berbeda dari pengunjung di Bengkulu pada jam yang sama.
 * =============================================================================
 */

/** Pilihan rentang yang tersedia. Nilainya dipakai di alamat dan di tombol. */
export const RENTANG = {
  semua: {
    tahun: null,
    label: { id: 'Semua', en: 'All' },
    keterangan: { id: 'Seluruh rekam jejak', en: 'Complete record' },
  },
  '5': {
    tahun: 5,
    label: { id: '5 tahun terakhir', en: 'Last 5 years' },
    keterangan: { id: 'Sesuai format pengajuan penelitian', en: 'Matches research submission format' },
  },
  '3': {
    tahun: 3,
    label: { id: '3 tahun terakhir', en: 'Last 3 years' },
    keterangan: { id: 'Ringkas, untuk undangan pemakalah', en: 'Concise, for speaking invitations' },
  },
};

/**
 * Urutan tampil pilihan rentang, dari yang paling sempit ke paling luas.
 *
 * Ditulis eksplisit, tidak mengandalkan urutan kunci pada RENTANG. JavaScript
 * menaruh kunci yang berupa angka lebih dulu dan mengurutkannya sendiri, jadi
 * "5" dan "3" akan selalu mendahului "semua" tanpa diminta. Kebetulan hasilnya
 * benar, tetapi itu perilaku yang tidak terlihat dari kode dan gampang berubah
 * begitu ada yang menambah pilihan baru, misalnya "10".
 */
export const URUTAN_RENTANG = ['3', '5', 'semua'];

/** Rentang bawaan kalau tidak ada yang dipilih. */
export const RENTANG_BAWAAN = 'semua';

/** Membersihkan nilai dari alamat atau tombol menjadi kunci yang sah. */
export function bacaRentang(nilai) {
  const kunci = String(nilai ?? '').trim();
  return Object.prototype.hasOwnProperty.call(RENTANG, kunci) ? kunci : RENTANG_BAWAAN;
}

/**
 * Tahun berjalan menurut waktu Indonesia bagian barat.
 *
 * Dihitung dari selisih tetap UTC+7, bukan lewat Intl dengan nama zona waktu.
 * Alasannya: fungsi ini juga dipanggil saat membangun berkas .docx di sisi
 * server, dan basis data zona waktu tidak selalu tersedia di sana.
 */
export function tahunSekarang() {
  const wib = new Date(Date.now() + 7 * 60 * 60 * 1000);
  return wib.getUTCFullYear();
}

/**
 * Mengambil angka tahun dari sebuah baris.
 *
 * Dicari berurutan: kolom `tahun` lebih dulu, lalu kolom teks yang biasanya
 * memuat tanggal. Kolom tersendiri didahulukan karena itu yang bisa kamu
 * perbaiki lewat panel; pembacaan dari teks cuma jaring pengaman untuk baris
 * lama yang kolom tahunnya belum diisi.
 *
 * @returns {number|null} null berarti tahunnya tidak diketahui
 */
export function tahunBaris(baris) {
  if (!baris || typeof baris !== 'object') return null;

  const langsung = String(baris.tahun ?? '').match(/(19|20)\d{2}/);
  if (langsung) return Number(langsung[0]);

  // Cadangan: cari empat angka tahun di kolom yang mungkin memuat tanggal.
  for (const kolom of ['waktu', 'date', 'periode', 'period']) {
    const isi = baris[kolom];
    const teks = typeof isi === 'string' ? isi : (isi?.id ?? isi?.en ?? '');
    const cocok = String(teks).match(/(19|20)\d{2}/g);
    // Yang diambil kecocokan terakhir, karena nama forum sering memuat tahun
    // penyelenggaraan di depan, sedangkan tanggal aslinya ada di belakang.
    if (cocok?.length) return Number(cocok[cocok.length - 1]);
  }

  return null;
}

/**
 * Menyaring satu daftar menurut rentang yang dipilih.
 *
 * @param {Array} daftar baris yang akan disaring
 * @param {string} kunci salah satu kunci RENTANG
 * @returns {Array} daftar baru, urutannya tidak diubah
 */
export function saring(daftar, kunci) {
  const isi = Array.isArray(daftar) ? daftar : [];
  const pilihan = RENTANG[bacaRentang(kunci)];
  if (!pilihan?.tahun) return isi;

  const batas = tahunSekarang() - pilihan.tahun + 1;

  return isi.filter((baris) => {
    const tahun = tahunBaris(baris);
    // Tahun tidak diketahui: selalu ikut. Lihat catatan di kepala berkas.
    if (tahun === null) return true;
    return tahun >= batas;
  });
}

/**
 * Kalimat yang menerangkan rentang, dipakai pada judul bagian dokumen.
 *
 * Contoh hasilnya: "dalam 5 Tahun Terakhir". Untuk rentang "semua" hasilnya
 * string kosong, jadi judulnya cukup berbunyi "Pengalaman Penelitian" saja
 * tanpa keterangan rentang yang keliru.
 */
export function keteranganRentang(kunci, lang = 'id') {
  const pilihan = RENTANG[bacaRentang(kunci)];
  if (!pilihan?.tahun) return '';
  return lang === 'id'
    ? `dalam ${pilihan.tahun} Tahun Terakhir`
    : `in the Last ${pilihan.tahun} Years`;
}

/**
 * Berapa baris yang tersembunyi karena penyaringan.
 *
 * Dipakai memberi tahu pembaca bahwa dokumen yang sedang dilihatnya tidak
 * memuat seluruh rekam jejak. Tanpa keterangan itu, dokumen yang dipersempit
 * dan dokumen yang memang pendek terlihat sama persis.
 */
export function jumlahTersembunyi(daftarAsli, kunci) {
  const isi = Array.isArray(daftarAsli) ? daftarAsli : [];
  return isi.length - saring(isi, kunci).length;
}
