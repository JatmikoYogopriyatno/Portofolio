/**
 * =============================================================================
 *  lib/kunjungan.js  |  Penghitung kunjungan
 * =============================================================================
 *
 *  Menyimpan dua angka saja: berapa kali situs dibuka sejak awal, dan berapa
 *  kali per hari selama 40 hari terakhir.
 *
 *  YANG TIDAK DISIMPAN
 *  Tidak ada alamat IP, tidak ada identitas, tidak ada jejak siapa membuka apa.
 *  Yang bertambah cuma angka. Jadi tidak ada data pribadi pengunjung yang
 *  tersimpan di mana pun, dan situs ini tidak butuh banner izin cookie.
 *
 *  PERSIAPAN SEKALI SAJA
 *  Penghitung baru menyala setelah ada tempat menyimpan angkanya. Cara
 *  memasangnya ada di data/README.md bagian 23. Selama belum dipasang, seluruh
 *  bagian statistik ini tidak ikut tampil di situs, dan tidak ada yang rusak.
 * =============================================================================
 */

/** Berapa lama angka harian disimpan sebelum dibuang sendiri. */
const UMUR_HARIAN = 60 * 60 * 24 * 40;

/** Jumlah hari yang ditampilkan pada grafik kecil di footer. */
export const HARI_DITAMPILKAN = 7;

/** Membaca alamat dan kunci penyimpanan dari Environment Variables. */
function penyimpanan() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  return url && token ? { url: url.replace(/\/+$/, ''), token } : null;
}

/** Apakah penghitungnya sudah siap dipakai. */
export function siap() {
  return penyimpanan() !== null;
}

/**
 * Tanggal hari ini menurut waktu Indonesia bagian barat.
 *
 * Server bisa berada di benua mana saja, jadi tanggalnya dihitung eksplisit
 * supaya "hari ini" berarti hari ini menurut kamu, bukan menurut server.
 */
export function tanggalHariIni(mundur = 0) {
  const sekarang = new Date(Date.now() - mundur * 86400000);
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(sekarang);
}

/** Menjalankan beberapa perintah penyimpanan sekaligus dalam satu permintaan. */
async function jalankan(perintah) {
  const simpan = penyimpanan();
  if (!simpan) return null;

  try {
    const tanggapan = await fetch(`${simpan.url}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${simpan.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(perintah),
      cache: 'no-store',
    });

    if (!tanggapan.ok) return null;
    const hasil = await tanggapan.json();
    return Array.isArray(hasil) ? hasil.map((h) => h?.result ?? null) : null;
  } catch {
    // Penyimpanan sedang tidak bisa dihubungi. Statistik boleh gagal diam diam,
    // karena ini hiasan tambahan dan bukan isi utama situs.
    return null;
  }
}

const kunciHari = (tanggal) => `kunjungan:h:${tanggal}`;

/** Daftar tanggal beberapa hari terakhir, urut dari yang paling lama. */
function deretTanggal(jumlah = HARI_DITAMPILKAN) {
  return Array.from({ length: jumlah }, (_, i) => tanggalHariIni(jumlah - 1 - i));
}

/**
 * Menambah satu hitungan, lalu mengembalikan angka terbarunya.
 * @returns {Promise<object|null>}
 */
export async function catatKunjungan() {
  const hariIni = tanggalHariIni();

  const hasil = await jalankan([
    ['INCR', 'kunjungan:total'],
    ['INCR', kunciHari(hariIni)],
    // Angka harian dibuang sendiri setelah lewat masa simpannya, jadi tidak
    // ada yang perlu dibersihkan manual.
    ['EXPIRE', kunciHari(hariIni), String(UMUR_HARIAN)],
  ]);

  if (!hasil) return null;
  return bacaKunjungan();
}

/**
 * Membaca angka tanpa menambahnya.
 * @returns {Promise<{total:number, hariIni:number, harian:Array<{tanggal:string,jumlah:number}>}|null>}
 */
export async function bacaKunjungan() {
  const tanggal = deretTanggal();

  const hasil = await jalankan([
    ['GET', 'kunjungan:total'],
    ...tanggal.map((t) => ['GET', kunciHari(t)]),
  ]);

  if (!hasil) return null;

  const angka = (nilai) => {
    const n = Number(nilai);
    return Number.isFinite(n) && n > 0 ? n : 0;
  };

  const harian = tanggal.map((t, i) => ({ tanggal: t, jumlah: angka(hasil[i + 1]) }));

  return {
    total: angka(hasil[0]),
    hariIni: harian[harian.length - 1]?.jumlah ?? 0,
    harian,
  };
}
