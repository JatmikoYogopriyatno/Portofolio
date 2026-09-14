import { portfolio } from '@/data/portfolio';

// Wajib ada saat memakai output: 'export' supaya berkas robots.txt
// dibuat sekali waktu build, bukan dihitung ulang tiap permintaan.
export const dynamic = 'force-static';

/** robots.txt dibuat otomatis dari meta.baseUrl di data/portfolio.js. */
export default function robots() {
  const base = portfolio.meta.baseUrl.replace(/\/+$/, '');

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        /*
          Dua alamat ini tidak berguna di hasil pencarian, dan lebih baik tidak
          ikut terdaftar sama sekali:

            /admin   panel kontenmu. Tetap butuh login GitHub, jadi tidak bisa
                     dibuka siapa pun, tapi tidak ada alasan alamatnya muncul
                     di Google dan mengundang orang mencoba.
            /api     alamat kerja, bukan halaman. Kalau dirayapi, penghitung
                     kunjungan bisa ikut bertambah tanpa ada orang membuka.
        */
        disallow: ['/admin', '/api'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
