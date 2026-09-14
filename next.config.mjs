/**
 * Konfigurasi Next.js.
 *
 * SITUS INI DI-DEPLOY DI VERCEL
 * Seluruh halaman tetap dibuat sekali saat build (pre-render), jadi kecepatannya
 * sama dengan situs statis murni. Bedanya, proyek ini juga menyediakan dua
 * endpoint kecil di app/api/ yang dipakai CMS untuk login lewat GitHub.
 * Endpoint itulah alasan `output: 'export'` tidak dipakai lagi.
 *
 * Vercel mengenali proyek Next.js sendiri, jadi tidak ada pengaturan yang perlu
 * diisi manual di dashboard-nya.
 *
 * NEXT_PUBLIC_BASE_PATH
 * Biarkan kosong di Vercel. Variabel ini hanya berguna kalau suatu saat situs
 * dipindah ke hosting yang menyajikannya dari sub-folder.
 */

// Normalisasi: buang garis miring di akhir, pastikan diawali "/" bila tidak kosong.
const rawBasePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').trim().replace(/\/+$/, '');
const basePath = rawBasePath && !rawBasePath.startsWith('/') ? `/${rawBasePath}` : rawBasePath;

/** @type {import('next').NextConfig} */
const nextConfig = {
  /*
    PENGOPTIMAL GAMBAR

    Dulu ini dimatikan karena situsnya disajikan sebagai berkas statis di
    GitHub Pages, dan di sana tidak ada yang bisa memproses gambar. Setelah
    pindah ke Vercel, pengoptimalnya tersedia penuh dan sangat berguna:

      ukuran menyesuaikan   ponsel menerima gambar seukuran layarnya, bukan
                            berkas asli 5 MB dari kamera
      format modern         AVIF dan WebP, jauh lebih kecil dari JPEG
      disimpan di tepi      hasil olahannya dipakai ulang selama 31 hari

    Tampilan gambarnya sama persis. Yang berubah cuma berapa banyak data yang
    perlu diunduh pengunjung.
  */
  images: {
    formats: ['image/avif', 'image/webp'],
    /*
      Mutu yang diizinkan. Daftar ini wajib ditulis: permintaan dengan angka
      mutu di luar daftar dijawab galat 400 dan gambarnya tidak muncul sama
      sekali. Isi tulisan blog menyusun alamat gambarnya sendiri di
      lib/berkas.js, jadi keduanya harus memakai angka yang sama.
    */
    qualities: [75],
    // Gambar hasil olahan disimpan lama karena berkas sumbernya jarang
    // berubah. Kalau kamu mengganti gambar, namanya biasanya ikut berganti.
    minimumCacheTTL: 2678400,
  },

  // Setiap halaman punya alamat berakhiran garis miring, misalnya /blog/.
  trailingSlash: true,

  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,

  // Diteruskan ke sisi browser agar helper withBasePath() di lib/asset.js
  // bisa menyusun alamat gambar dengan benar.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },

  /*
    HEADER KEAMANAN

    Situs ini tidak menyimpan data pribadi pengunjung dan tidak punya halaman
    login sendiri, jadi risikonya kecil. Tetapi ada satu hal yang benar benar
    berharga di dalamnya: panel di /admin memegang token GitHub milikmu selama
    kamu login, dan token itu bisa menulis ke seluruh repositori.

    Header di bawah menutup jalan yang paling umum dipakai untuk mencuri hal
    seperti itu, dan tidak satu pun mengubah tampilan situs.

    Sengaja TANPA Content-Security-Policy penuh. CSP yang ketat butuh nonce
    pada tiap skrip, dan nonce hanya bisa dibuat saat halaman diminta, bukan
    saat dibangun. Memakainya berarti seluruh halaman berhenti dibuat sekali
    di awal dan harus dihitung ulang tiap kunjungan, dan situsnya jadi lebih
    lambat demi perlindungan yang tidak seberapa untuk situs tanpa masukan
    pengguna seperti ini. Bagian CSP yang berguna tanpa nonce, yaitu
    frame-ancestors, tetap dipasang di bawah.
  */
  async headers() {
    const keamanan = [
      // Menutup pembajakan klik: situs ini tidak boleh dipasang di dalam
      // bingkai situs lain. Penting untuk /admin, yang memegang token GitHub.
      { key: 'Content-Security-Policy', value: "frame-ancestors 'self'" },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },

      // Peramban tidak boleh menebak nebak jenis berkas. Tanpa ini, berkas
      // yang diunggah lewat panel bisa saja diperlakukan sebagai halaman web.
      { key: 'X-Content-Type-Options', value: 'nosniff' },

      // Alamat halaman yang sedang dibuka tidak ikut dikirim ke situs lain
      // saat pengunjung mengeklik tautan keluar.
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },

      // Situs ini tidak butuh kamera, mikrofon, maupun lokasi. Ditutup semua
      // supaya tidak ada yang bisa memintanya diam diam.
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
      },

      // Peramban wajib memakai sambungan terenkripsi untuk situs ini.
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
    ];

    return [
      { source: '/:path*', headers: keamanan },
      {
        // Jawaban endpoint tidak boleh disimpan perantara mana pun.
        source: '/api/:path*',
        headers: [...keamanan, { key: 'Cache-Control', value: 'no-store, max-age=0' }],
      },
    ];
  },

  async rewrites() {
    return [
      // Panel konten berupa halaman HTML biasa di public/admin/index.html.
      // Next.js tidak otomatis membuka berkas index di dalam folder, jadi
      // alamat /admin diarahkan ke berkasnya secara eksplisit.
      { source: '/admin', destination: '/admin/index.html' },
      { source: '/admin/', destination: '/admin/index.html' },
    ];
  },
};

export default nextConfig;
