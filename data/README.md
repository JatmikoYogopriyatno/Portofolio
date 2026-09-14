# Panduan Mengubah Isi Portofolio

## Ada dua cara, pilih yang paling nyaman

### Cara 1: lewat panel konten, tanpa membuka GitHub

Buka **https://jatmikoyogop.vercel.app/admin** lalu login dengan GitHub. Semua
isi situs bisa diubah dari form biasa di sana, termasuk menambah tulisan blog
dan mengunggah foto langsung dari ponsel.

Kalau panelnya belum bisa login, berarti pemasangan awalnya belum selesai.
Langkahnya ada di [bagian 17](#17-panel-konten-di-admin), cukup sekali saja.

### Cara 2: lewat berkas di folder `content/`

Semua isi situs tersimpan sebagai berkas JSON biasa. Bisa diedit di komputer,
atau langsung lewat tampilan web GitHub.

| Berkas | Isinya |
| --- | --- |
| `content/profile.json` | Isi halaman depan: foto, nama, status, headline, lokasi |
| `content/about.json` | Bagian Tentang Saya: paragraf ringkasan dan strip foto |
| `content/settings.json` | Judul situs, SEO, bahasa awal, tema awal, sakelar tampilan |
| `content/contact.json` | Email, telepon, catatan kontak |
| `content/social.json` | Tautan media sosial |
| `content/experience.json` | Daftar pengalaman |
| `content/projects.json` | Daftar proyek |
| `content/certifications.json` | Daftar sertifikasi |
| `content/education.json` | Riwayat pendidikan |
| `content/publications.json` | Karya ilmiah |
| `content/skills.json` | Kelompok keahlian |
| `content/volunteering.json` | Kegiatan sukarela |
| `content/languages.json` | Bahasa yang dikuasai |
| `content/services.json` | Layanan yang ditawarkan |
| `content/stats.json` | Angka sorotan di section Tentang |
| `content/gallery.json` | Bagian Galeri: daftar foto dan video |
| `content/navigation.json` | Isi menu navigasi |
| `content/sections.json` | Judul dan subjudul tiap bagian |
| `content/labels.json` | Label tombol dan teks antarmuka |
| `content/posts/*.json` | Satu berkas per tulisan blog |

Berkas `data/portfolio.js` dan `data/posts.js` sekarang hanya bertugas
menyatukan berkas-berkas di atas. Isinya tidak perlu disentuh.

Kamu juga tidak perlu menyentuh folder `components/` sama sekali.

> **Tiga aturan yang berlaku di mana-mana**
> 1. Menambah item cukup dengan menambah satu objek ke daftar. Tampilan menyesuaikan sendiri.
> 2. Daftar kosong (`[]`) membuat section-nya hilang otomatis dari halaman.
> 3. Urutan daftar sama dengan urutan tampil di layar, paling atas paling baru.

Kalau mengedit lewat berkas, jalankan `npm run dev` dan buka
`http://localhost:3000` untuk melihat hasilnya. Setelah cocok, `git commit` dan
`git push`. Vercel akan membangun ulang situsnya sendiri dalam satu sampai dua
menit. Kalau mengedit lewat panel, semua itu terjadi otomatis begitu kamu
menekan Publish.

Cuplikan kode di panduan ini ditulis dalam gaya JavaScript agar mudah dibaca.
Isi berkas JSON yang sebenarnya sama persis strukturnya, hanya perlu tanda kutip
ganda pada setiap nama field.

---

## Daftar isi

1. [Mengganti foto profil](#1-mengganti-foto-profil)
2. [Menulis teks dua bahasa](#2-menulis-teks-dua-bahasa)
3. [Menambah pengalaman kerja](#3-menambah-pengalaman-kerja)
4. [Menambahkan foto ke pengalaman dan proyek](#4-menambahkan-foto-ke-pengalaman-dan-proyek)
5. [Menambah proyek](#5-menambah-proyek)
6. [Menulis tulisan blog baru](#6-menulis-tulisan-blog-baru)
7. [Menambah sertifikasi](#7-menambah-sertifikasi)
8. [Menambah media sosial](#8-menambah-media-sosial)
9. [Mengganti warna aksen](#9-mengganti-warna-aksen)
10. [Mengatur mode terang dan gelap](#10-mengatur-mode-terang-dan-gelap)
11. [Menyetel intensitas latar belakang](#11-menyetel-intensitas-latar-belakang)
12. [Menambah atau menghapus item menu](#12-menambah-atau-menghapus-item-menu)
13. [Memasang tombol Unduh CV](#13-memasang-tombol-unduh-cv)
14. [Menyembunyikan satu section](#14-menyembunyikan-satu-section)
15. [Daftar nama ikon yang tersedia](#15-daftar-nama-ikon-yang-tersedia)
16. [Menyalakan dan mematikan sentuhan interaktif](#16-menyalakan-dan-mematikan-sentuhan-interaktif)
17. [Panel konten di /admin](#17-panel-konten-di-admin)
18. [Menyalakan pemutar musik](#18-menyalakan-pemutar-musik)
19. [Menerima masukan dan saran dari tamu](#19-menerima-masukan-dan-saran-dari-tamu)
20. [Tempat berkas yang kamu unggah](#20-tempat-berkas-yang-kamu-unggah)
21. [Dua berkas unduhan: portofolio dan CV](#21-dua-berkas-unduhan-portofolio-dan-cv)
22. [Supaya muncul di Google](#22-supaya-muncul-di-google)
23. [Statistik pengunjung di footer](#23-statistik-pengunjung-di-footer)
24. [Kalau unggahan sering gagal](#24-kalau-unggahan-sering-gagal)
25. [Gambar preview saat tautan dibagikan](#25-gambar-preview-saat-tautan-dibagikan)
26. [Mengubah status di halaman depan](#26-mengubah-status-di-halaman-depan)
27. [Kalau panel berat atau Chrome menutup sendiri di ponsel](#27-kalau-panel-berat-atau-chrome-menutup-sendiri-di-ponsel)
28. [Bagian Galeri](#28-bagian-galeri)
29. [Melampirkan foto dan berkas ke pengalaman dan pendidikan](#29-melampirkan-foto-dan-berkas-ke-pengalaman-dan-pendidikan)
30. [Supaya situs tetap ringan di perangkat pengunjung](#30-supaya-situs-tetap-ringan-di-perangkat-pengunjung)
31. [Setiap bagian halaman depan diubah di mana](#31-setiap-bagian-halaman-depan-diubah-di-mana)
32. [Keamanan situs](#32-keamanan-situs)
33. [Mengganti ikon situs](#33-mengganti-ikon-situs)

---

## 1. Mengganti foto profil

Foto kamu dipakai di **lima tempat sekaligus**: kartu besar di Hero, logo
bundar di navbar, favicon di tab browser, ikon layar utama iOS, dan kartu
preview saat tautan situs dibagikan.

**Kalau kamu mengganti fotonya, ikuti dua langkah ini.**

**Langkah 1. Ganti berkasnya.**
Siapkan foto **persegi**, minimal 640 x 640 piksel. Timpa berkas
`public/images/profile.jpg` dengan foto baru itu.

Cara lewat browser tanpa perlu Git: buka repo di GitHub, masuk ke folder
`public/images`, klik **Add file**, pilih **Upload files**, seret fotomu ke
sana, lalu **Commit changes**.

**Langkah 2. Buat ulang aset turunannya.**

```bash
npm run assets
```

Perintah itu membaca `profile.avatar` di `content/profile.json`, lalu menulis
ulang tiga berkas sekaligus:

| Berkas | Isi |
| --- | --- |
| `app/icon.png` | Favicon bundar berbingkai gradien, 512 x 512 |
| `app/apple-icon.png` | Ikon layar utama iOS, 180 x 180 |
|  `public/images/og-image.jpg` | Kartu preview 1200 x 630 berisi foto, nama, dan status |

Setelah itu `git commit` dan `git push`. Vercel akan membangun ulang sendiri.

> Kalau kamu melewatkan langkah 2, foto di Hero dan navbar tetap berganti,
> hanya favicon dan kartu preview yang masih memakai foto lama.

**Kalau foto barumu berformat PNG atau WebP**, ubah dua baris di
`content/profile.json` supaya cocok, atau ganti lewat panel di menu **Isi Halaman > Halaman Depan**:

```js
profile: {
  avatar: '/images/profile.png',         // foto utama
  avatarFallback: '/images/profile.png', // cadangan kalau yang utama gagal dimuat
}
```

`avatarFallback` adalah gambar pengganti kalau berkas utamanya tidak ditemukan.
Arahkan ke berkas lain kalau kamu ingin ada cadangan yang berbeda, misalnya
`'/images/avatar.svg'` yang berisi kartu monogram.

---

## 2. Menulis teks dua bahasa

Setiap teks boleh ditulis dengan dua cara:

```js
// A. Sama di kedua bahasa. Cocok untuk nama orang, kampus, teknologi, URL.
org: 'Universitas Bengkulu',

// B. Beda per bahasa.
role: { id: 'Asisten Laboratorium', en: 'Laboratory Assistant' },
```

Kalau kamu hanya sempat menulis satu bahasa, tulis string biasa. Teks itu
dipakai untuk ID maupun EN, dan tidak akan menimbulkan error.

---

## 3. Menambah pengalaman kerja

Lewat panel: menu **Isi Halaman**, lalu **Pengalaman**, lalu tombol tambah.

Lewat berkas: buka `content/experience.json`, lalu sisipkan objek baru di
posisi paling atas array `items` karena urutannya dari yang terbaru.

```js
experience: [
  // ---- TEMPEL BLOK BARU DI SINI ----
  {
    role: { id: 'Staf Teknologi Informasi', en: 'IT Staff' },
    org: 'PT Contoh Nusantara',
    type: { id: 'Penuh Waktu', en: 'Full-time' },
    period: { id: 'Jan 2027 - sekarang', en: 'Jan 2027 - present' },
    location: 'Bengkulu, Indonesia',
    description: {
      id: 'Mengelola server internal dan mendampingi digitalisasi arsip perusahaan.',
      en: 'Managing internal servers and supporting the company archive digitalisation.',
    },
    skills: ['Linux', 'Jaringan', 'Technical Support'], // boleh []
    image: null,      // isi path gambar kalau punya dokumentasi, lihat bagian 4
    imageAlt: '',
    logo: null,       // logo instansi berbentuk persegi, opsional
    highlight: true,  // true memberi kartu border gradien beranimasi
  },
  // ---- akhir blok baru ----

  { /* item lama ... */ },
]
```

| Field | Wajib | Keterangan |
| --- | --- | --- |
| `role` | ya | Nama posisi |
| `org` | ya | Nama instansi atau perusahaan |
| `type` | tidak | Paruh Waktu, Magang, Sukarelawan, dan sejenisnya |
| `period` | ya | Rentang waktu |
| `location` | tidak | Kota dan negara |
| `description` | ya | Otomatis dipotong dengan tombol Selengkapnya kalau panjang |
| `skills` | tidak | Array chip keahlian, isi `[]` kalau tidak perlu |
| `image` | tidak | Foto dokumentasi kegiatan |
| `logo` | tidak | Logo instansi |
| `highlight` | tidak | `true` untuk menyorot kartu |

---

## 4. Menambahkan foto ke pengalaman dan proyek

Semua kartu bisa menampilkan gambar, dan semuanya opsional.

**Langkah umum**

1. Simpan gambar ke `public/images/`. Buat sub folder kalau perlu, misalnya
   `public/images/pengalaman/` atau `public/images/projects/`.
2. Tulis path-nya di berkas terkait, selalu diawali `/` dan dihitung dari
   folder `public`. Kalau mengunggah lewat panel, path-nya diisi otomatis.

**Pengalaman**

```js
{
  role: { id: 'Magang', en: 'Intern' },
  org: 'Dinas Pemberdayaan Masyarakat dan Desa Provinsi Bengkulu',
  image: '/images/pengalaman/magang-dpmd.jpg',   // rasio 16:9 paling pas
  imageAlt: {
    id: 'Kegiatan pendampingan desa bersama tim DPMD',
    en: 'Village mentoring activity with the DPMD team',
  },
  logo: '/images/logo/dpmd.png',                 // persegi, opsional
}
```

Gambarnya muncul di bagian bawah kartu, lengkap dengan keterangan kecil dari
`imageAlt`. Logo muncul di samping judul posisi.

**Proyek**

```js
{
  name: 'SobatKoding',
  image: '/images/projects/sobatkoding.jpg',  // rasio 16:10 paling pas
  imageAlt: 'Tampilan halaman utama SobatKoding',
}
```

Isi `image: null` kalau belum ada gambarnya. Kartu otomatis memakai latar
gradien dengan inisial nama proyek, dan tetap terlihat rapi.

**Kesukarelawanan** juga mendukung `image` dan `imageAlt` dengan cara yang sama.

> Semua gambar dimuat lewat komponen `SmartImage`. Kalau berkasnya belum ada
> atau salah nama, komponen itu berpindah ke gambar cadangan atau menyembunyikan
> dirinya. Situs tidak pernah menampilkan ikon gambar rusak.

### Galeri di section Tentang Saya

Strip tiga gambar di bawah ringkasan diatur lewat field `gallery` di
`content/about.json`, atau lewat panel di menu **Isi Halaman > Tentang Saya**,
bagian **Sekilas Kegiatan**:

```js
profile: {
  gallery: [
    {
      src: '/images/about/riset.jpg',
      alt: { id: 'Kegiatan riset lapangan', en: 'Field research activity' },
      caption: { id: 'Riset lapangan dan data', en: 'Field research and data' },
    },
    // tambah objek lain di sini, gridnya menyesuaikan sendiri
  ],
}
```

Kosongkan `gallery: []` untuk menyembunyikan seluruh strip-nya. Gambar bisa
diklik untuk dibuka besar, dan `caption` tampil di atas gambarnya.

### Gambar placeholder bawaan

Gambar yang sekarang terpasang di bagian Pengalaman dan galeri Tentang Saya
masih **placeholder**, bukan foto asli. Bentuknya SVG abstrak bergradien dengan
motif geometris, dibuat oleh:

```bash
npm run placeholders
```

Placeholder ini sengaja **tidak memuat teks apa pun** supaya tetap utuh saat
dipotong ke rasio mana pun oleh kartu yang menampilkannya.

Ganti dengan foto asli kapan saja: unggah lewat panel, atau simpan foto ke
folder yang sama lalu ubah field `image` atau `src` di berkas terkait. Ingin menambah placeholder baru
dengan gaya yang sama? Tambahkan satu baris ke array `ITEMS` di
`scripts/generate-placeholders.mjs`, pilih palet warna dan motifnya, lalu
jalankan perintah di atas.

| Palet tersedia | Motif tersedia |
| --- | --- |
| `indigo`, `violet`, `cyan`, `teal`, `slate`, `rose` | `documents`, `network`, `broadcast`, `territory`, `lab`, `community`, `growth` |

---

## 5. Menambah proyek

Tambahkan objek ke `items` di `content/projects.json`, atau lewat panel di menu
**Isi Halaman**, lalu **Proyek**. **Tag baru otomatis menjadi tombol filter**
di atas grid, tidak perlu didaftarkan di mana pun.

```js
projects: [
  {
    name: 'Nama Proyek',
    period: '2027',
    org: 'Nama Organisasi atau Klien',
    description: {
      id: 'Penjelasan singkat proyek dalam satu sampai tiga kalimat.',
      en: 'A short one to three sentence description of the project.',
    },
    tags: ['Web Development', 'Laravel'],  // tag baru sama dengan tombol filter baru
    image: '/images/projects/nama-proyek.jpg',
    imageAlt: 'Tangkapan layar halaman utama',
    links: [
      { label: { id: 'Lihat situs', en: 'Visit site' }, href: 'https://contoh.com', icon: 'external-link' },
      { label: { id: 'Kode sumber', en: 'Source code' }, href: 'https://github.com/user/repo', icon: 'github' },
    ],
    featured: false,  // true memberi border gradien beranimasi
  },
]
```

---

## 6. Menulis tulisan blog baru

Menulis blog sekarang seperti menulis di aplikasi catatan biasa. Tidak ada blok
yang perlu disusun satu per satu lagi.

### Lewat panel, cara yang disarankan

Buka `/admin`, menu **Tulisan Blog**, klik tombol tambah. Yang wajib diisi cuma
tiga:

| Kolom | Keterangan |
|---|---|
| Judul | Alamat tulisannya dibuat otomatis dari sini |
| Tanggal terbit | Pilih dari kalender |
| Isi tulisan | Ketik biasa, ada tombol tebal, miring, daftar, dan kutipan |

Sisanya boleh dilewati. Tiga hal ini dihitung sendiri oleh situs:

- **Alamat tulisan** dibuat dari judul, jadi tidak ada lagi slug salah ketik
- **Waktu baca** dihitung dari panjang tulisan
- **Ringkasan** diambil dari kalimat pertama kalau kamu mengosongkannya

Kolom **English** di setiap bagian boleh dibiarkan kosong. Kalau kosong, versi
Inggris situs akan memakai teks Indonesianya.

### Audio pendamping, seperti tombol dengarkan di Substack

Setiap tulisan boleh punya satu pemutar audio yang menempel tepat di bawah
judulnya. Pembaca yang lebih suka mendengarkan tinggal menekan tombol putar,
tanpa harus mencari cari.

Panel, buka tulisannya, lalu bagian **Audio pendamping**:

| Kolom | Keterangan |
|---|---|
| Berkas audio | Unggah `mp3` atau `wav`. Kosongkan untuk menyembunyikan pemutarnya. |
| Jenis audio | Menentukan ikon dan tulisan bawaannya |
| Judul pemutar | Kosongkan untuk memakai tulisan bawaan sesuai jenis |
| Putar sendiri saat tulisan dibuka | Menyala secara bawaan. Baca bagian di bawah ini dulu. |
| Mulai dari menit | Misalnya `1:30`. Kosongkan untuk memutar dari awal lagu. |
| Berhenti di menit | Misalnya `3:05`. Kosongkan untuk memutar sampai habis. |
| Ulangi terus potongan ini | Kembali ke menit mulai begitu sampai menit berhenti |

Tiga pilihan jenis, masing masing punya tulisan bawaan sendiri:

| Jenis | Tulisan bawaannya | Dipakai untuk |
|---|---|---|
| Narasi | "Dengarkan tulisan ini" | Rekaman kamu membacakan tulisannya |
| Podcast | "Dengarkan podcastnya" | Obrolan atau wawancara yang jadi dasar tulisan |
| Lagu | "Musik penemani" | Musik yang cocok menemani membaca |

Pemutarnya punya tombol mundur 15 detik dan pengatur kecepatan 1x sampai 2x,
seperti aplikasi podcast pada umumnya. Tulisan yang punya audio juga diberi
penanda kecil di kartu daftar blog, jadi pembaca tahu sebelum membukanya.

### Memilih potongan lagunya

Dua kolom menit itu memotong lagu tanpa mengubah berkasnya. Kamu tidak perlu
mengedit mp3 di aplikasi lain, cukup tulis menitnya.

Tulis seperti yang biasa kamu baca di YouTube:

| Kamu tulis | Artinya |
|---|---|
| `1:30` | menit satu lewat tiga puluh detik |
| `0:45` | empat puluh lima detik |
| `45` | juga empat puluh lima detik |
| `1:02:03` | satu jam dua menit tiga detik |

Yang perlu diketahui:

- Garis waktu di halaman memperlihatkan panjang **potongannya**, bukan panjang
  lagu aslinya. Kalau kamu pilih `1:00` sampai `2:30`, pembaca melihat
  `0:00` sampai `1:30`, karena memang segitu yang akan dia dengar.
- Kolom berhenti diabaikan kalau isinya lebih awal daripada kolom mulai.
  Menurutinya berarti memutar potongan sepanjang nol detik.
- Salah ketik di kolom menit tidak merusak apa apa. Kolomnya cuma dianggap
  kosong, dan lagunya diputar utuh.
- Kalau potongannya pendek sedangkan tulisannya panjang, nyalakan
  **Ulangi terus potongan ini** supaya musiknya tidak habis di tengah bacaan.

### Kenapa kadang tidak langsung berbunyi

Ada satu aturan peramban yang tidak bisa dilawan oleh situs mana pun:

> Suara tidak boleh keluar sebelum pengunjung menyentuh halaman.

Chrome, Safari, dan Firefox sama sama memakainya untuk menghentikan iklan yang
tiba tiba berteriak. Jadi hasilnya berbeda tergantung bagaimana pembaca sampai
ke tulisanmu:

| Pembaca datang dari | Yang terjadi |
|---|---|
| Mengeklik tulisan di halaman blog | Langsung berbunyi. Kliknya tadi sudah dihitung sebagai sentuhan. |
| Membuka alamatnya langsung dari Google, WhatsApp, atau tautan yang dibagikan | Belum berbunyi. Pemutar menunggu diam diam, lalu mulai pada sentuhan pertama, entah klik, ketikan, atau ketukan di layar. Pembaca tidak perlu mencari tombol putar. |

Menggulir halaman tidak dihitung sebagai sentuhan oleh Chrome, jadi menggulir
saja belum cukup untuk memicunya.

Tiga hal lain yang sudah dijaga:

- Suaranya naik pelan selama satu detik, tidak langsung keras.
- Kalau pembaca menekan jeda, pemutarnya tidak akan menyalakan dirinya lagi di
  halaman itu. Sekali orang bilang tidak, jawabannya dihormati.
- Kalau pengunjung sudah menyalakan pemutar musik di pojok kiri bawah, tulisan
  yang baru dibuka tidak merebutnya. Sebaliknya juga: yang paling terakhir
  dinyalakan akan menjeda yang lain, jadi tidak pernah ada dua lagu sekaligus.

Pemutar musik di pojok kiri bawah tetap **tidak pernah** berbunyi sendiri. Yang
boleh memutar sendiri cuma audio pendamping di halaman tulisan, dan itu pun
kamu yang menyalakannya per tulisan.

### Menyisipkan foto, video, musik, atau PDF ke tengah tulisan

Di bilah alat editor ada empat tombol sisip: **gambar**, **Audio**, **Video**,
dan **Dokumen**. Klik salah satunya, pilih atau unggah berkasnya, selesai.

Kalau tombolnya tidak kamu temukan, ada cara cadangan yang hasilnya sama persis:
tempel saja tautan berkasnya di baris sendiri. Situs otomatis memilihkan tampilan
yang pas berdasarkan jenis berkasnya:

| Jenis berkas | Tampil sebagai |
|---|---|
| `jpg` `png` `webp` `gif` `avif` | gambar dengan keterangan di bawahnya |
| `mp4` `webm` `mov` | pemutar video lengkap dengan tombol putar |
| `mp3` `wav` `ogg` `m4a` | pemutar musik ramping |
| `pdf` | pembaca dokumen, plus tombol buka di tab baru |
| lainnya | tombol unduh |

Kamu tidak perlu memilih jenisnya sendiri. Tempel saja tautan berkasnya.

**Untuk video panjang, pakai YouTube.** Semua berkas yang diunggah lewat panel
ikut tersimpan di repositori, dan repositori yang gemuk membuat situs makin lama
dibangun setiap kali kamu menyimpan. Batas satu berkas dipasang di 40 MB. Video
di atas satu dua menit sebaiknya diunggah ke YouTube, lalu tempel tautannya
sebagai tautan biasa di dalam tulisan.

### Lewat berkas, kalau kamu memang ingin

Salin salah satu berkas di `content/posts/`, beri nama baru. **Nama berkas itu
yang menjadi alamat tulisan**, jadi pakai huruf kecil dan tanda hubung.

```json
{
  "title": {
    "id": "Judul Tulisan Baru",
    "en": ""
  },
  "date": "2027-01-15",
  "cover": "/media/sampul.jpg",
  "coverAlt": { "id": "Keterangan singkat gambar sampul", "en": "" },
  "excerpt": { "id": "", "en": "" },
  "tags": ["Kebijakan Publik", "AI"],
  "featured": false,
  "draft": false,
  "body": {
    "id": "Paragraf pertama.\n\n## Subjudul\n\nParagraf berikutnya.\n\n- poin pertama\n- poin kedua\n\n> Ini kutipan.\n\n![Keterangan gambar](/media/diagram.png)",
    "en": ""
  }
}
```

### Cara menata tulisan

Kalau kamu memakai mode teks biasa di editor, atau menulis langsung di berkas,
ini semua aturannya. Cuma segini.

```
# Judul besar
## Subjudul
### Subjudul kecil

Baris kosong memisahkan paragraf.

**tebal**  dan  *miring*

- daftar bertitik
- baris kedua

1. daftar bernomor
2. baris kedua

> kutipan

[teks tautan](https://alamat-tujuan.com)
![keterangan gambar](/media/gambar.jpg)
```

**Kode HTML tidak akan dijalankan.** Kalau kamu menempel potongan HTML ke dalam
tulisan, isinya dibuang, bukan dijalankan. Ini disengaja supaya tidak ada skrip
berbahaya yang bisa masuk lewat isi tulisan.

**Menyimpan draf.** Centang "Simpan sebagai draf" untuk menyembunyikan tulisan
dari situs tanpa menghapusnya. Draf juga tidak masuk ke sitemap.

**Topik.** Tombol penyaring di halaman `/blog` dibangun otomatis dari kolom
Topik seluruh tulisan, tidak ada daftar terpisah yang perlu diurus.

---

## 7. Menambah sertifikasi

```js
certifications: [
  {
    name: 'Nama Sertifikasi',      // boleh { id, en }
    issuer: 'Nama Penerbit',
    year: '2027',
    group: 'AI & Cloud',           // pengelompokan bebas, opsional
    credentialUrl: 'https://...',  // '' menyembunyikan tombol Lihat kredensial
  },
]
```

Jangan lupa memperbarui angka di `stats` kalau kamu menampilkan jumlah
sertifikasi di section Tentang.

---

## 8. Menambah media sosial

```js
social: [
  { label: 'LinkedIn',  handle: 'nama-akun',  href: 'https://www.linkedin.com/in/nama-akun/', icon: 'linkedin',  featured: true },
  { label: 'Instagram', handle: '@namaakun',  href: 'https://www.instagram.com/namaakun/',    icon: 'instagram', featured: true },
  { label: 'WhatsApp',  handle: 'Chat langsung',  href: 'https://wa.me/6281234567890',                icon: 'whatsapp',  featured: true },

  // Tambahan yang tinggal disalin:
  { label: 'X',              handle: '@namaakun', href: 'https://x.com/namaakun',          icon: 'x',        featured: false },
  { label: 'YouTube',        handle: 'Jatmiko Yogopriyatno', href: 'https://youtube.com/@namaakun',   icon: 'youtube',  featured: false },
  { label: 'TikTok',         handle: '@namaakun', href: 'https://tiktok.com/@namaakun',    icon: 'tiktok',   featured: false },
  { label: 'Facebook',       handle: 'Jatmiko Yogopriyatno', href: 'https://facebook.com/namaakun',   icon: 'facebook', featured: false },
  { label: 'Telegram',       handle: '@namaakun', href: 'https://t.me/namaakun',           icon: 'telegram', featured: false },
  { label: 'Google Scholar', handle: 'Profil riset',  href: 'https://scholar.google.com/',         icon: 'scholar',  featured: false },
  { label: 'Medium',         handle: '@namaakun', href: 'https://medium.com/@namaakun',    icon: 'medium',   featured: false },
]
```

| Field | Keterangan |
| --- | --- |
| `label` | Nama platform, dipakai juga sebagai label untuk pembaca layar |
| `handle` | Nama akun yang tampil di bawah label pada bagian Kontak |
| `href` | Alamat lengkap. WhatsApp memakai format `https://wa.me/62...` tanpa tanda plus dan spasi |
| `icon` | Nama ikon, lihat daftar di bagian 15 |
| `featured` | `true` menampilkannya juga di Hero. Yang `false` tetap muncul di Kontak dan Footer |

Sebaiknya tandai `featured: true` untuk empat sampai lima akun saja supaya
bagian Hero tidak terlalu ramai.

---

## 9. Mengganti warna aksen

Buka `app/globals.css`, cari blok `:root` di bagian paling atas, lalu ubah
tiga baris ini:

```css
:root {
  --accent-1: #6366f1; /* indigo */
  --accent-2: #a855f7; /* violet */
  --accent-3: #06b6d4; /* cyan   */
}
```

Ketiganya otomatis dipakai oleh gradien nama, blob latar, border kartu unggulan,
chip, tombol, dan seluruh efek glow, di kedua mode.

Contoh palet lain yang tinggal ditempel:

```css
/* Hijau tosca */
--accent-1: #10b981;
--accent-2: #14b8a6;
--accent-3: #a3e635;

/* Merah muda hangat */
--accent-1: #f43f5e;
--accent-2: #d946ef;
--accent-3: #fb923c;

/* Biru laut */
--accent-1: #3b82f6;
--accent-2: #0ea5e9;
--accent-3: #2dd4bf;
```

Satu hal lagi. Warna teks beraksen diatur terpisah agar tetap terbaca di kedua
mode, yaitu `--accent-fg`. Di mode terang nilainya gelap, di mode gelap nilainya
cerah. Kalau kamu mengganti palet, sesuaikan juga dua baris ini:

```css
:root                { --accent-fg: #6d28d9; }  /* mode terang, harus gelap */
[data-theme='dark']  { --accent-fg: #22d3ee; }  /* mode gelap, harus cerah  */
```

---

## 10. Mengatur mode terang dan gelap

Pengunjung bisa berpindah mode lewat tombol bulan dan matahari di navbar, dan
pilihannya diingat browser mereka.

Mode yang dipakai saat pengunjung baru pertama kali datang diatur di
`content/settings.json`:

```js
meta: {
  defaultTheme: 'system',  // 'system', 'light', atau 'dark'
}
```

| Nilai | Artinya |
| --- | --- |
| `'system'` | Mengikuti pengaturan perangkat pengunjung. Ini pilihan paling ramah. |
| `'light'` | Selalu mulai dari mode terang |
| `'dark'` | Selalu mulai dari mode gelap |

Warna address bar di ponsel diatur di baris berikutnya:

```js
themeColorLight: '#f5f7fc',
themeColorDark: '#05070f',
```

---

## 11. Menyetel intensitas latar belakang

Latar belakang terdiri dari beberapa lapisan: blob warna, garis grid, titik
tekstur, dan butiran noise. Kepekatannya diatur di `app/globals.css` dan
nilainya berbeda antara mode terang dan gelap.

```css
:root {                     /* mode terang */
  --blob-opacity: 0.17;     /* warna blob, naikkan agar lebih berwarna */
  --grid-opacity: 0.045;    /* garis grid */
  --dot-opacity: 0.05;      /* titik tekstur */
  --noise-opacity: 0.03;    /* butiran halus */
}

[data-theme='dark'] {       /* mode gelap */
  --blob-opacity: 0.22;
  --grid-opacity: 0.05;
  --dot-opacity: 0.06;
  --noise-opacity: 0.05;
}
```

Isi `0` untuk mematikan satu lapisan sepenuhnya. Ingin latar benar-benar polos?
Set keempatnya ke `0`.

Kecepatan gerak blob diatur oleh `--blob-speed: 30s`. Perbesar angkanya agar
geraknya lebih tenang. Semua animasi ini otomatis berhenti untuk pengunjung yang
mengaktifkan pengaturan "kurangi gerakan" di perangkatnya.

---

## 12. Menambah atau menghapus item menu

Menu navigasi dibangun dari `content/navigation.json`.

```js
nav: [
  // Melompat ke anchor di halaman utama. `id` harus sama dengan id <section>.
  { id: 'about', type: 'section', label: { id: 'Tentang', en: 'About' } },

  // Pindah ke halaman lain.
  { id: 'blog', type: 'page', href: '/blog/', label: { id: 'Blog', en: 'Blog' } },
]
```

Hapus satu baris dan item itu langsung hilang dari navbar dan footer, tanpa
menghilangkan section-nya dari halaman.

Ingin menampilkan section Kesukarelawanan di menu? Tambahkan:

```js
{ id: 'volunteering', type: 'section', label: { id: 'Relawan', en: 'Volunteering' } },
```

### Tambah menu sebanyak apa pun, navbar tidak akan rusak

Navbar mengukur sendiri apakah deretan menunya masih muat. Kalau tidak, dia
berpindah ke menu laci, berapa pun lebar layarnya.

Ini bukan hiasan. Sebelumnya navbar cuma menebak lewat satu ambang lebar layar,
dan tebakan itu meleset begitu menu Galeri dan Masukan ditambahkan. Isinya jadi
28 piksel lebih lebar daripada kotak kacanya, dan tombol tema, sebagai kendali
paling kanan, terdorong setengah keluar. Sekarang lebarnya benar benar diukur,
termasuk diukur ulang setelah huruf selesai dimuat, karena huruf cadangan yang
dipakai sesaat di awal lebarnya berbeda.

Jadi silakan tambah menu sesukamu. Yang berubah cuma bentuk menunya, bukan
kerapiannya.

### Di ponsel, navbar menciut saat digulir

Pill navbar selebar layar itu menutupi bagian atas tulisan yang sedang dibaca.
Karena itu di layar kecil dia berubah bentuk mengikuti posisi gulir:

| Kapan | Bentuknya |
|---|---|
| Di puncak halaman | Pill utuh, ada logo, pencarian, bahasa, tema, dan tombol menu |
| Setelah digulir | Menciut jadi satu tombol bundar berisi ikon menu, menempel di pojok kanan atas |
| Tombol itu ditekan | Memanjang lagi jadi pill utuh beserta laci menunya |
| Digulir balik ke puncak | Memanjang sendiri lagi |

Hanya berlaku di bawah lebar 1280 piksel. Di desktop tampilannya tidak berubah
sama sekali.

Ukuran tombol ciutnya 50 kali 50 piksel, di atas ambang sentuh yang nyaman
untuk jempol.

### Kepekatan navbar saat digulir

Angkanya sengaja berbeda antara mode terang dan gelap, dan ini bukan
kelalaian. Yang dicampur adalah warna `--bg`, dan nilainya jauh berbeda:

| Mode | `--bg` | Kepekatan | Hasilnya |
|---|---|---|---|
| Terang | `#f5f7fc`, hampir putih | 92 persen | Terasa lapang |
| Gelap | `#05070f`, hampir hitam | 64 persen | Terasa kaca, bukan papan hitam |

Dulu keduanya 94 persen. Di mode gelap itu membuat navbar terlihat seperti
balok gelap yang menempel di atas halaman.

Kenapa mode terang tidak ikut dibeningkan sejauh itu: tulisan menu di mode
terang memakai warna tipis, dan saat navbar lewat di atas foto, kontrasnya
diukur cuma 3,0 banding 1 pada kepekatan 64 persen. Itu di bawah ambang yang
bisa dibaca. Di mode gelap pada kepekatan yang sama, kontrasnya 4,9 sampai
7,5 banding 1, aman.

Kalau kamu ingin mengubahnya, cari `.glass-nav-solid` di `app/globals.css`.
Turunkan angkanya kalau ingin lebih bening, tapi periksa dulu apakah menunya
masih terbaca saat navbar lewat di atas foto galeri.

---

## 13. Memasang tombol Unduh CV

1. Simpan berkas PDF ke folder `public/`, misalnya `public/cv-nama-lengkap.pdf`.
2. Ubah satu baris:

```js
profile: {
  resumeUrl: '/cv-nama-lengkap.pdf',
}
```

Isi `resumeUrl: ''` untuk menyembunyikan tombolnya sama sekali.

---

## 14. Menyembunyikan satu section

Kosongkan array-nya. Section beserta judulnya hilang sepenuhnya.

```js
publications: [],   // section Publikasi hilang
volunteering: [],   // section Kesukarelawanan hilang
projects: [],       // section Proyek hilang
```

Untuk menyembunyikan blog, isi `draft: true` pada semua tulisan di
`data/posts.js`, lalu hapus baris blog dari array `nav`.

Jangan lupa menghapus barisnya juga dari `nav` agar menu tidak menunjuk ke
section yang sudah tidak ada.

---

## 15. Daftar nama ikon yang tersedia

Dipakai pada field `icon` di `social`, `stats`, `skills.groups`,
`projects[].links`, dan blok `callout` di tulisan blog.

**Media sosial dan kontak**

```
linkedin   github     instagram  whatsapp   mail
x          youtube    facebook   tiktok     telegram
scholar    medium     phone      globe
```

**Antarmuka dan navigasi**

```
sun            moon          menu          close
arrow-left     arrow-right   arrow-up      arrow-down
arrow-up-right chevron-down  external-link download
copy           check         send
```

**Konten**

```
briefcase      graduation-cap  book        newspaper
pen-line       folder          award       calendar
clock          tag             image       map-pin
building       users           heart       star
sparkles       shield          code        palette
languages      layers          quote       compass
rocket
```

**Menambah ikon baru:** buka `components/Icon.jsx`, lalu tambahkan satu entri
pada objek `strokeIcons` untuk ikon bergaya garis, atau `fillIcons` untuk logo
solid.

```jsx
const strokeIcons = {
  // ...
  dribbble: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M8.5 2.9c3 4 4.9 8.5 5.6 13.6M2.6 9.5c6 0 11-1.4 15-4.6M4.5 18.7c3.4-4.4 8.4-6.7 15-6.6" />
    </>
  ),
};
```

Setelah itu langsung bisa dipakai dengan menulis `{ icon: 'dribbble' }`.

---

## 16. Menyalakan dan mematikan sentuhan interaktif

Semua gerakan halus di situs ini punya sakelar sendiri di blok `appearance`
pada `content/settings.json`, atau lewat panel di menu **Pengaturan Situs**. Ubah jadi `false` kalau ada yang terasa terlalu ramai.
Tidak ada yang rusak kalau dimatikan, halamannya hanya jadi lebih tenang.

```js
appearance: {
  spotlight: true,       // sorotan lembut mengikuti kursor di dalam kartu
  scrollProgress: true,  // garis bergradien di tepi atas layar
  countUpStats: true,    // angka statistik menghitung naik dari nol
  backToTop: true,       // tombol bundar di sudut kanan bawah
  photoAsLogo: true,     // foto profil sebagai logo navbar
  shareButtons: true,    // tombol berbagi di bawah tulisan blog
  heroMarquee: true,     // strip keahlian berjalan di bawah Hero
  printLink: true,       // tautan simpan sebagai PDF di footer
  lightbox: true,        // gambar bisa diklik untuk dibuka besar
  commandPalette: true,  // pencarian cepat Ctrl+K atau Cmd+K
}
```

| Sakelar | Kalau diisi `false` |
| --- | --- |
| `spotlight` | Kartu tetap punya efek angkat saat disentuh kursor, hanya sorotan cahayanya yang hilang |
| `scrollProgress` | Garis tipis di tepi atas layar tidak dirender sama sekali |
| `countUpStats` | Angka statistik langsung tampil utuh tanpa animasi |
| `backToTop` | Tombol melayang hilang. Pengunjung tetap bisa menggulir sendiri |
| `photoAsLogo` | Logo navbar kembali memakai inisial dari `profile.name` |
| `shareButtons` | Baris tombol berbagi di bawah artikel tidak muncul |
| `heroMarquee` | Strip keahlian berjalan di bawah Hero dilepas |
| `printLink` | Tautan "Simpan sebagai PDF" di footer disembunyikan |
| `lightbox` | Gambar tetap tampil, hanya tidak bisa diklik untuk diperbesar |
| `commandPalette` | Tombol Ctrl+K di navbar dan pintasan keyboardnya dimatikan |

### Pencarian cepat Ctrl+K

Pengunjung bisa menekan **Ctrl+K** (atau **Cmd+K** di Mac) untuk membuka
pencarian yang melompat ke bagian mana pun. Isinya dirakit otomatis dari data
yang sudah ada, jadi menambah proyek, tulisan blog, atau tautan sosial langsung
menambahnya ke pencarian tanpa pekerjaan tambahan.

| Tombol | Fungsi |
| --- | --- |
| `Ctrl+K` atau `Cmd+K` | Buka dan tutup |
| Panah atas dan bawah | Pindah pilihan |
| `Enter` | Buka pilihan yang sedang disorot |
| `Esc` | Tutup |

Selain bagian halaman, proyek, tulisan, dan tautan sosial, pencarian ini juga
memuat tindakan cepat: ganti tema, ganti bahasa, kirim email, buka CV, dan
simpan halaman sebagai PDF.

### Mode cetak dan simpan PDF

Tautan **Simpan sebagai PDF** di footer membuka dialog cetak browser. Tata
letak khususnya sudah disiapkan di blok `@media print` pada `app/globals.css`:
latar bergradien dilepas, warna dipaksa terang supaya hemat tinta, navigasi dan
tombol melayang disembunyikan, dan kartu tidak terbelah dua halaman.

Ingin menyembunyikan elemen tertentu saat dicetak? Tambahkan atribut
`data-print="hide"` pada elemen itu.

```jsx
<div data-print="hide">Ini tidak ikut tercetak</div>
```

### Menghormati pengaturan perangkat

Semua animasi di situs ini otomatis berhenti untuk pengunjung yang menyalakan
"kurangi gerakan" di perangkat mereka. Tidak ada pengaturan tambahan yang perlu
kamu urus, dan tidak ada konten yang hilang, hanya geraknya yang tidak dijalankan.

---

## 17. Panel konten di /admin

Panel ini memungkinkan kamu mengubah seluruh isi situs lewat form biasa, tanpa
membuka GitHub sama sekali. Bisa dipakai dari laptop maupun ponsel.

### Halaman masuknya memakai fotomu

Halaman masuk panel dan judul tab peramban tidak lagi bertuliskan "Sveltia CMS"
dengan gambar bawaannya. Sekarang yang tampil foto kamu dan tulisan
**Panel Jatmiko Yogopriyatno**.

Fotonya **tidak perlu diurus terpisah**. Dia menunjuk ke `/icon.png`, berkas
yang sudah dibuat ulang otomatis tiap kali situs dibangun dari gambar yang kamu
pilih di panel, menu **Pengaturan Situs** lalu **Nama Situs dan SEO** lalu
**Ikon situs**. Jadi ganti ikon situsnya sekali, dan empat tempat ini ikut
berganti sendiri:

- ikon di tab peramban saat orang membuka situsmu
- ikon di hasil pencarian Google
- gambar di halaman masuk panel
- gambar di layar tunggu sebelum panelnya menyala

Untuk mengganti tulisannya, ubah satu baris `app_title` di bagian atas
`public/admin/config.yml`. Boleh diisi apa saja, misalnya `Masuk Panel Admin`.

Satu hal yang tidak bisa diubah: ada kedipan singkat di awal, sekitar setengah
detik, saat panel menampilkan logo bawaannya sendiri sambil membaca
konfigurasi. Layar itu digambar sebelum berkas konfigurasi sempat dibaca, jadi
tidak ada pengaturan yang bisa menjangkaunya. Tulisan kecil
"Powered by Sveltia CMS" di dasar halaman masuk juga tetap ada, itu keterangan
pustaka yang dipakai.

### Peta menunya

Menu di sisi kiri disusun **mengikuti urutan bagian di halaman, dari atas ke
bawah**. Jadi kalau kamu ingin mengubah sesuatu, cari saja menu yang namanya
sama dengan bagian yang kamu lihat di situs.

| Menu | Isinya | Muncul di mana |
|---|---|---|
| **Tulisan Blog** | tulisan blog | halaman /blog |
| **Isi Halaman** | | |
| Halaman Depan | foto, nama, status, headline, **lokasi**, tombol Unduh CV | layar pertama |
| Tentang Saya | paragraf ringkasan dan strip Sekilas Kegiatan | bagian Tentang Saya |
| Angka Sorotan | kotak angka | di dalam Tentang Saya |
| Bahasa yang Dikuasai | kartu bahasa | di dalam Tentang Saya |
| Pengalaman, Proyek, Publikasi, Keahlian, Sertifikasi, Pendidikan, Kesukarelawanan, Galeri | isi tiap bagian | bagian bernama sama |
| Kontak | surel, telepon, catatan | bagian Kontak |
| Layanan yang Ditawarkan | daftar layanan | di dalam Kontak |
| **Pengaturan Situs** | | |
| Judul Tiap Bagian | judul dan subjudul kepala tiap bagian | semua bagian |
| Menu Navigasi | isi navbar | navbar |
| Media Sosial | tautan sosial | halaman depan dan footer |
| Pemutar Musik | daftar lagu | tombol di pojok kiri bawah |
| Formulir Masukan | pengaturan formulirnya | bagian Masukan |
| Nama Situs dan SEO | judul situs, kata kunci, tema awal | seluruh situs |
| **Masukan Masuk** | kiriman dari tamu | tidak ditampilkan di situs |

Dua hal yang dulu paling sering tertukar:

**Sekilas Kegiatan bukan Galeri.** Sekilas Kegiatan adalah strip tiga foto di
dalam Tentang Saya, isinya sedikit dan tiap foto wajib berketerangan. Galeri
adalah bagian tersendiri untuk kumpulan foto dan video yang banyak.

**Formulir Masukan bukan Masukan Masuk.** Yang pertama mengatur tampilan
formulirnya, yang kedua berisi kiriman yang sudah masuk dari pengunjung.

### Cara kerjanya

```
Kamu tekan Publish  ->  panel menulis commit ke repo  ->  Vercel membangun ulang  ->  situs terbarui
```

Jedanya sekitar satu sampai dua menit. Kamu tidak perlu melakukan apa pun
selama proses itu berjalan.

Perubahan tersimpan sebagai commit biasa di repositori, atas nama akun GitHub
kamu. Artinya seluruh riwayat perubahan tercatat, dan apa pun bisa dikembalikan
kalau ada yang salah.

### Pemasangan awal, cukup sekali seumur hidup

Panelnya sudah terpasang di kode. Yang belum ada hanya izin login, karena itu
menyangkut akun GitHub kamu sendiri. Dua langkah, sekitar lima menit.

#### Langkah 1. Daftarkan aplikasi OAuth di GitHub

1. Buka **https://github.com/settings/developers**
2. Pilih tab **OAuth Apps**, lalu klik **New OAuth App**
3. Isi seperti ini:

   | Kolom | Isi |
   | --- | --- |
   | Application name | `Panel Konten Portofolio` (bebas) |
   | Homepage URL | `https://jatmikoyogop.vercel.app` |
   | Authorization callback URL | `https://jatmikoyogop.vercel.app/api/callback/` |

   > **Perhatikan garis miring di akhir callback URL.** Alamat itu harus sama
   > persis, termasuk garis miringnya. Kalau berbeda, GitHub akan menolak login
   > dengan pesan `redirect_uri_mismatch`.

4. Klik **Register application**
5. Salin **Client ID** yang muncul
6. Klik **Generate a new client secret**, lalu salin nilainya.
   Rahasia ini hanya ditampilkan sekali, jadi simpan dulu di tempat aman.

#### Langkah 2. Masukkan kredensialnya ke Vercel

1. Buka dashboard Vercel, pilih proyek portofolio ini
2. Masuk ke **Settings**, lalu **Environment Variables**
3. Tambahkan dua variabel:

   | Name | Value |
   | --- | --- |
   | `GITHUB_CLIENT_ID` | Client ID dari langkah 1 |
   | `GITHUB_CLIENT_SECRET` | Client secret dari langkah 1 |

4. Pastikan keduanya berlaku untuk environment **Production**
5. Masuk ke tab **Deployments**, buka deployment terakhir, klik menu tiga titik,
   lalu **Redeploy**. Variabel baru hanya terbaca oleh deployment baru.

Selesai. Buka `https://jatmikoyogop.vercel.app/admin`, klik **Sign In with
GitHub**, beri izin sekali, dan panelnya siap dipakai.

### Isi panelnya

| Menu | Untuk mengubah |
| --- | --- |
| **Tulisan Blog** | Menambah, mengedit, dan menghapus tulisan |
| **Isi Halaman** | Pengalaman, proyek, sertifikasi, pendidikan, publikasi, keahlian, kesukarelawanan, angka sorotan, bahasa, layanan |
| **Pengaturan** | Profil diri, kontak, media sosial, pengaturan situs, menu navigasi, judul tiap bagian |

Gambar yang kamu unggah lewat panel otomatis tersimpan di
`public/images/uploads/` dan ikut masuk ke repositori.

### Menulis tulisan blog di panel

Isi tulisan disusun dari blok. Klik tombol tambah di bagian **Isi tulisan**,
lalu pilih jenis bloknya: Paragraf, Subjudul besar, Subjudul kecil, Daftar
bertitik, Daftar bernomor, Kutipan, Kotak sorotan, atau Gambar.

Setiap blok teks punya dua kolom, Bahasa Indonesia dan English. Kolom English
boleh dikosongkan, nanti teks Indonesia yang dipakai untuk keduanya.

Isi **Simpan sebagai draf** dengan aktif kalau tulisannya belum siap terbit.
Draf tersimpan di repositori tapi tidak muncul di situs dan tidak masuk sitemap.

### Siapa saja yang bisa masuk

Hanya akun GitHub yang punya akses tulis ke repositori `JatmikoYogopriyatno/Portofolio`.
Orang lain bisa membuka halaman `/admin`, tapi tidak akan bisa menyimpan apa pun.
Halaman panel juga ditandai `noindex` sehingga tidak muncul di hasil pencarian.

Client secret hanya dipakai di sisi server, di berkas `app/api/callback/route.js`,
dan tidak pernah ikut terkirim ke browser.

### Yang belum ada di panel

Dua hal sengaja tidak dimasukkan karena hampir tidak pernah diubah:

| Yang ingin diubah | Tempatnya |
| --- | --- |
| Label tombol dan teks antarmuka | `content/labels.json` |
| Warna aksen dan kepekatan latar | `app/globals.css`, lihat bagian 9 dan 11 |

### Kalau ada yang tidak beres

| Gejala | Penyebab dan perbaikannya |
| --- | --- |
| Halaman `/admin` kosong terus | Berkas panelnya gagal disalin saat build. Jalankan `npm install` lalu `npm run build` lagi. |
| Tombol Sign In tidak melakukan apa-apa | Popup diblokir browser. Izinkan popup untuk domain ini. |
| `redirect_uri_mismatch` | Authorization callback URL di GitHub tidak sama persis. Periksa garis miring di akhirnya. |
| `Konfigurasi OAuth belum lengkap` | `GITHUB_CLIENT_ID` atau `GITHUB_CLIENT_SECRET` belum terisi di Vercel, atau belum di-redeploy setelah diisi. |
| `Kode keamanan tidak cocok` | Proses login memakan waktu lebih dari sepuluh menit, atau cookie diblokir. Tutup jendela login lalu ulangi. |
| Sudah Publish tapi situs belum berubah | Vercel masih membangun. Tunggu satu sampai dua menit, lalu muat ulang halaman. |

---

## 18. Menyalakan pemutar musik

Pemutar kecil di pojok kiri bawah situs. Isinya kamu atur sendiri.

**Cara memasangnya:** panel, menu **Pengaturan**, lalu **Musik**.

1. Centang **Tampilkan pemutar musik**
2. Di **Daftar lagu**, klik tambah
3. Unggah berkas lagunya, isi judulnya, selesai

Pemutar baru muncul kalau sakelarnya menyala **dan** ada minimal satu lagu.
Kalau salah satu tidak terpenuhi, seluruh pemutar tidak ikut tampil.

**Musik tidak pernah berbunyi sendiri.** Ini disengaja dan sebaiknya jangan
diubah. Suara yang tiba tiba muncul saat halaman dibuka itu mengagetkan, memakan
kuota pengunjung, dan mengganggu orang yang sedang mendengarkan hal lain. Semua
peramban modern juga memblokirnya. Pengunjung yang memutuskan untuk memutar.

Pilihan terakhir pengunjung, lagu yang sedang diputar dan besar suaranya,
diingat di perangkat mereka sendiri dan tidak dikirim ke mana pun.

**Soal hak cipta.** Pakai lagu yang memang boleh kamu sebarkan: karya sendiri,
musik berlisensi bebas, atau yang sudah kamu beli izinnya. Situs portofolio itu
etalase profesional, dan lagu bajakan di dalamnya bisa merugikan kesan yang
justru ingin kamu bangun.

Format `mp3` paling aman karena bisa diputar di semua perangkat.

---

## 19. Menerima masukan dan saran dari tamu

Formulir di halaman depan tempat pengunjung menulis masukan, boleh dengan nama
atau tanpa nama sama sekali. Kirimannya muncul di panel pada menu
**Masukan Masuk**.

### PENTING: jadikan repositori privat dulu

Masukan yang masuk tersimpan sebagai berkas di dalam repositori ini. Selama
repositorinya masih publik, **siapa pun bisa membaca masukan yang dikirim orang
ke kamu**, termasuk nama dan kontak yang mereka tulis. Itu melanggar janji
privasi yang tertulis di formulirnya sendiri.

Jadi lakukan ini lebih dulu:

1. Buka `https://github.com/JatmikoYogopriyatno/Portofolio/settings`
2. Gulir ke bawah sampai **Danger Zone**
3. Klik **Change visibility**, pilih **Make private**

Situsmu tetap bisa diakses publik seperti biasa. Yang berubah cuma kode dan
isinya jadi tidak bisa diintip orang lain. Vercel dan panel `/admin` tetap
bekerja normal dengan repositori privat.

### Menyiapkan izin menulis

Formulirnya belum bisa menyimpan apa pun sampai langkah ini selesai. Jadi tidak
ada data yang bisa bocor sebelum kamu siap.

1. Buka `https://github.com/settings/personal-access-tokens/new`
2. **Token name**: `Masukan Portofolio`
3. **Expiration**: pilih yang panjang, misalnya satu tahun
4. **Repository access**: pilih **Only select repositories**, lalu pilih
   `JatmikoYogopriyatno/Portofolio`
5. **Permissions**, bagian Repository permissions: cari **Contents**, ubah jadi
   **Read and write**. Biarkan yang lain apa adanya.
6. Klik **Generate token**, lalu salin hasilnya

Lalu di Vercel, Settings, Environment Variables, tambahkan:

| Key | Value | Type |
|---|---|---|
| `GITHUB_CONTENT_TOKEN` | token yang baru disalin | Secret |

Deploy ulang, dan formulirnya langsung aktif.

Token ini sengaja dibuat sesempit mungkin. Dia hanya bisa membaca dan menulis
berkas di satu repositori ini, tidak bisa menghapus repositori, tidak bisa
mengubah pengaturan, dan tidak bisa menyentuh repositori lain.

### Membaca masukan yang masuk

Panel, menu **Masukan Masuk**. Ada penyaring **Belum dibaca** dan
**Sudah dibaca** di atas daftarnya.

Tiap kiriman punya dua kolom yang bisa kamu ubah:

- **Sudah dibaca**, centang setelah kamu baca supaya yang baru gampang dikenali
- **Catatan pribadi**, untuk dirimu sendiri, tidak pernah tampil di situs

Kolom nama, kontak, dan isi masukan sengaja dikunci supaya kamu tidak sengaja
mengubah kiriman orang. Kalau ada kiriman sampah, hapus saja berkasnya.

Isi masukan **tidak pernah ditampilkan di situs**. Ini disengaja: teks dari orang
asing tidak boleh langsung tampil di halaman yang kamu tanggung namanya.

### Penyaring robot

Formulir di internet selalu didatangi robot pengirim iklan. Ada empat lapis
penyaring yang bekerja diam diam, tanpa merepotkan tamu dengan teka teki gambar:

| Lapis | Cara kerjanya |
|---|---|
| Kolom umpan | Kolom tersembunyi yang cuma diisi robot |
| Jeda mengetik | Kiriman yang datang kurang dari 2,5 detik ditolak |
| Batas panjang | Pesan dibatasi 3000 huruf, nama 80, kontak 120 |
| Jeda antar kirim | Satu pengirim dibatasi lima kiriman per jam |

Robot yang tertangkap tetap dijawab "berhasil" supaya tidak belajar dari
penolakan dan mencoba cara lain.

### Mematikan fiturnya

Panel, menu **Pengaturan**, lalu **Masukan, Pengaturan**, hilangkan centang
**Tampilkan formulir masukan**. Seluruh bagian itu langsung hilang dari situs.

---

## 20. Tempat berkas yang kamu unggah

Semua berkas yang diunggah lewat panel masuk ke satu folder: `public/media/`.
Di dalam tulisan dan isian, alamatnya ditulis `/media/nama-berkas.jpg`.

Dulu namanya `public/images/uploads/`. Diganti karena isinya sekarang bukan cuma
gambar, tapi juga video, musik, dan PDF. Berkas lama sudah dipindahkan dan semua
rujukannya ikut diperbarui, jadi tidak ada yang perlu kamu kerjakan.

Foto profil dan gambar bawaan situs tetap di `public/images/`. Itu berkas yang
jarang berubah dan bukan hasil unggahan panel.

| Batas | Nilai |
|---|---|
| Ukuran satu berkas | 40 MB |
| Jenis berkas | bebas, tapi gambar, video, musik, dan PDF punya tampilan khusus |

Berkas di `public/media/` sengaja ikut masuk ke Git supaya jadi bagian dari
repositori dan tidak bergantung pada layanan lain.

---

## 21. Dua berkas unduhan: portofolio dan CV

Situs ini menyediakan dua berkas yang berbeda tujuan. Keduanya halaman
tersendiri, bukan hasil mencetak halaman utama apa adanya.

| Berkas | Alamat | Untuk apa |
|---|---|---|
| Portofolio | `/cetak/portofolio/` | Dikirim ke orang, dilampirkan di email, dicetak |
| CV | `/cetak/cv/` | Dilamarkan ke lowongan kerja |

Buka salah satunya, lalu klik **Simpan sebagai PDF** di bilah atas. Di dialog
cetak, pilih tujuan **Save as PDF**. Ukuran kertas dan marginnya sudah diatur
dari dalam, jadi tidak perlu kamu ubah.

Tautan ke keduanya ada di footer situs, dan juga lewat pencarian cepat Ctrl+K.

### Kenapa CV-nya polos

CV itu sengaja dibuat sesederhana mungkin, dan itu bukan kemalasan desain.

Sebagian besar lamaran kerja tidak langsung dibaca manusia. Berkasnya lebih
dulu melewati mesin pelacak lamaran, yang membaca teksnya lalu memilah mana
pendidikan, mana pengalaman, mana keahlian. Mesin seperti itu gampang
tersandung, dan CV yang cantik di mata sering justru tidak terbaca olehnya.

Yang dipatuhi CV ini:

| Aturan | Alasannya |
|---|---|
| Satu kolom | Mesin membaca atas ke bawah, kolom mengacaukan urutannya |
| Tanpa tabel | Isi tabel sering terbaca berantakan atau terlewat sama sekali |
| Tanpa foto dan ikon | Gambar tidak terbaca, hanya menyita ruang |
| Huruf Arial | Ada di semua sistem, tidak perlu disulih |
| Judul baku | PENDIDIKAN, PENGALAMAN, dan seterusnya, mudah dikenali |
| Teks sungguhan | Bisa disalin dan dicari, bukan gambar teks |

Susunannya mengikuti pola Harvard: identitas ringkas di atas, lalu pendidikan,
pengalaman, publikasi, kegiatan, sertifikasi, dan keahlian, masing masing dari
yang terbaru.

### Susunan tiap entri, dan kenapa begitu

Panduan resmi Harvard menentukan satu bentuk entri yang dipakai di seluruh CV:

```
Nama Instansi, Kota                                    Mar 2026 - sekarang
Jabatan, Jenis Kerja
  • butir, diawali kata kerja
```

Nama instansi dan **kotanya** di kiri baris pertama, **tanggal rata kanan**,
**jabatan turun ke baris kedua**. Bukan selera, itu yang diminta panduannya.

Tiga hal berjalan sendiri, jadi kamu tidak perlu memikirkannya:

| Yang dijaga | Caranya |
|---|---|
| Kota tidak ditulis dua kali | Dilewati kalau isinya sudah termuat di nama instansi |
| Jenis kerja tidak diulang | Dilewati kalau isinya sama dengan jabatan, dulu tercetak "Magang, Magang" |
| Nama bulan seragam | Ditulis lengkap di panel pun, dicetak disingkat tiga huruf |

Sertifikasi juga diurutkan sendiri dari tahun terbaru, berapa pun urutan yang
kamu pakai di panel.

### Kolom Kota, bukan alamat jalan

Kolom **Lokasi** di Pengalaman dan Pendidikan diisi **kota saja**, misalnya
`Bengkulu, Indonesia`. Bukan alamat jalan.

Alasannya dua. Pertama, CV memang tidak pernah mencantumkan alamat jalan
tempat kerja. Kedua, alamat panjang membuat baris pertama patah ke baris
berikutnya, dan tanggal yang harusnya rata kanan jadi terlihat menggantung.

### Memeriksa sendiri apakah masih sesuai standar

Aturan yang bisa diperiksa mesin sudah dibuatkan pemeriksanya. Dua puluh
pemeriksaan, mulai dari bentuk dokumen, susunan bagian, susunan tiap entri,
penulisan tanggal, urutan terbalik menurut waktu, sampai ada tidaknya kata
ganti orang pertama, dan apakah PDF-nya benar benar terbaca mesin pelacak.

Jalankan setelah kamu banyak mengubah isi lewat panel.

Dokumen portofolio sebaliknya. Di sana foto, warna aksen, dan tata letak dua
kolom untuk sertifikasi justru membantu, karena yang membacanya manusia.

### Isinya diambil dari mana

Dari sumber yang sama dengan situs. Perbarui lewat panel, dan kedua berkas ikut
berubah sendiri. Tidak ada berkas terpisah yang perlu kamu urus.

Kolom yang kamu kosongkan akan dilewati, bukan dicetak sebagai baris kosong.
Nilai yang cuma berisi tanda hubung juga diperlakukan sebagai kosong.

### Bagaimana tautan ditulis di CV

Alamat web di CV itu dilema. Ditulis utuh, sebagian panjang sekali dan merusak
kerapian. Alamat bukti sertifikat LinkedIn misalnya, panjangnya lebih dari dua
ratus huruf, dan kalau dicetak apa adanya dia menghabiskan empat baris
sendirian. Tapi kalau semua diganti kata seperti "LinkedIn" saja, mesin pelacak
lamaran yang cuma membaca teks kehilangan alamatnya.

Jalan tengah yang dipakai:

| Yang mana | Bagaimana ditulis |
|---|---|
| Alamat pendek dan terbaca | Ditulis apa adanya, misalnya `linkedin.com/in/nama-akun`, dan sekaligus jadi tautan |
| Alamat panjang atau penuh tanda tanya | Diganti namanya, misalnya `Google Scholar`, alamat aslinya tetap menempel sebagai tautan |
| Sertifikat | Nama sertifikatnya yang jadi tautan ke bukti kreditnya, alamatnya tidak dicetak |
| Publikasi | Judulnya yang jadi tautan, alamatnya tidak dicetak |

Semua tautan **berwarna hitam tanpa garis bawah**, sesuai kebiasaan CV Harvard.
CV yang tautannya biru bergaris bawah terlihat seperti tangkapan layar halaman
web, bukan dokumen lamaran. Di dalam PDF tautannya tetap bisa diklik, dan
saat ini ada sembilan belas tautan yang tertanam di sana.

Alamatnya juga tidak akan pernah patah di tengah lagi. Dulu
`scholar.google.com/citations?user=...` terbelah jadi dua baris sehingga tidak
bisa disalin maupun diklik.

Identitas di atas dipecah jadi dua baris: tempat tinggal, telepon, dan surel di
baris pertama, lalu alamat web di baris kedua. Kalau kamu ingin baris kedua
lebih pendek, kurangi jumlah media sosial di panel, menu
**Pengaturan Situs** lalu **Media Sosial**. Instagram dan WhatsApp misalnya,
keduanya jarang membantu di CV lamaran kerja, sedangkan WhatsApp isinya sama
dengan nomor telepon yang sudah ada di baris pertama.

### Nama instansi dan lokasi

Keduanya penting untuk CV. Bagi perekrut maupun mesin pelacak, nama instansi
adalah bagian yang paling dicari, dan tanpa itu pengalaman kamu sulit dinilai.

**Nama instansi** sudah terisi di seluruh dua belas entri, jadi bagian ini
beres. **Lokasi** masih kosong di lima entri. Kalau sempat, isi lewat panel,
menu **Isi Halaman** lalu **Pengalaman**, misalnya `Bengkulu, Indonesia`.

### Kalau tiba-tiba muncul tulisan "[object Object]"

Artinya ada kolom dua bahasa yang dicetak tanpa lewat penerjemah bahasa lebih
dulu. Ini pernah terjadi sungguhan: kolom **Lokasi** diubah jadi dua bahasa,
isinya berubah dari teks biasa menjadi pasangan `{id, en}`, dan di satu baris
kode penerjemahnya terlewat. Hasilnya CV yang dicetak memuat
`[object Object]` di setiap entri pengalaman.

Sekarang ada dua lapis penjagaan:

1. Semua tempat yang mencetak kolom itu sudah diperbaiki.
2. Fungsi pembersih teks di `lib/teks-dokumen.js` diberi jaring pengaman. Kalau
   suatu saat ada kolom lain yang diubah jadi dua bahasa dan penerjemahnya
   terlewat lagi, yang tercetak adalah teks Indonesianya, bukan sampah. Salah
   bahasa masih bisa dimaafkan pembaca, `[object Object]` tidak, apalagi di
   berkas yang dikirim melamar kerja.

Kalau kamu tetap melihatnya di suatu tempat, laporkan halaman mana, karena
berarti ada jalur ketiga yang belum tertutup.

---

## 22. Supaya muncul di Google

Sisi teknisnya sudah beres dan tidak ada yang perlu kamu kerjakan:

| Bagian | Keadaan |
|---|---|
| `robots.txt` | Mengizinkan semua mesin pencari, menunjuk ke sitemap |
| `sitemap.xml` | Dibuat otomatis, ikut bertambah setiap kamu menulis blog |
| Judul dan deskripsi | Ada di setiap halaman |
| Alamat kanonik | Ada, mencegah satu halaman terhitung dua kali |
| Data terstruktur | Tipe `Person` lengkap dengan pendidikan, keahlian, dan media sosial |
| Kartu berbagi | Gambar preview saat tautan dibagikan |

Yang tersisa cuma memberi tahu Google bahwa situs ini ada. Google memang
menemukan situs baru sendiri, tapi bisa makan waktu berminggu minggu. Mendaftar
langsung memangkas itu jadi beberapa hari.

### Mendaftar ke Google Search Console

1. Buka `https://search.google.com/search-console`
2. Klik **Add property**, pilih **URL prefix**
3. Isi `https://jatmikoyogop.vercel.app` lalu **Continue**
4. Pada pilihan verifikasi, buka **HTML tag**. Akan muncul baris seperti:
   `<meta name="google-site-verification" content="AbC123..." />`
5. Salin **hanya bagian di dalam tanda kutip** setelah `content=`, jadi cuma
   `AbC123...` saja
6. Buka panel situsmu, menu **Pengaturan**, lalu **Pengaturan Situs**, isi kolom
   **Kode verifikasi Google** dengan kode tadi, lalu simpan
7. Tunggu Vercel selesai membangun, sekitar satu sampai dua menit
8. Kembali ke Search Console, klik **Verify**

Setelah terverifikasi, buka menu **Sitemaps** di sisi kiri, isi `sitemap.xml`,
lalu **Submit**. Itu memberi tahu Google seluruh halaman yang kamu punya
sekaligus.

Kode verifikasinya cukup diisi sekali dan boleh dibiarkan terisi selamanya.

### Yang membuat situs cepat naik

Beberapa hal ini pengaruhnya nyata, dan semuanya ada di tanganmu:

**Tulis blog secara berkala.** Halaman yang isinya bertambah dikunjungi ulang
lebih sering oleh Google. Satu tulisan sebulan sudah cukup mengubah keadaan.

**Pasang tautan situsmu di tempat lain.** Di profil LinkedIn, Instagram, GitHub,
dan Google Scholar. Google menemukan situs baru dengan menyusuri tautan, jadi
setiap tautan dari tempat yang sudah dikenalnya adalah jalan masuk.

**Isi kolom Ringkasan tiap tulisan seperlunya.** Kalau dikosongkan memang
diambil otomatis dari kalimat pertama, dan itu tidak selalu kalimat yang paling
menjual di hasil pencarian.

### Berapa lama menunggu

Situs ini baru dibuat. Wajar kalau namamu belum muncul di Google sekarang.
Biasanya beberapa hari setelah didaftarkan halaman utama sudah terindeks, dan
beberapa minggu untuk mulai muncul di pencarian nama.

Cara memeriksanya: ketik `site:jatmikoyogop.vercel.app` di Google. Kalau sudah
ada hasilnya, berarti situsmu sudah terindeks.

### Halaman yang sengaja tidak diindeks

Tiga halaman ini sengaja disembunyikan dari mesin pencari:

| Halaman | Alasan |
|---|---|
| `/admin` | Panel konten, tidak ada gunanya di hasil pencarian |
| `/cetak/portofolio/` | Isinya mengulang halaman utama |
| `/cetak/cv/` | Sama, dan halaman kembar membuat Google bingung memilih |

---

## 23. Statistik pengunjung di footer

Kotak kecil di footer berisi total kunjungan, kunjungan hari ini, dan grafik
tujuh hari terakhir.

### Yang disimpan dan yang tidak

Yang disimpan cuma **angka**. Tidak ada alamat IP, tidak ada identitas, tidak
ada catatan siapa membuka halaman apa. Karena itu situs ini tidak butuh banner
izin cookie, dan tidak ada data pribadi pengunjung yang tersimpan di mana pun.

Satu kunjungan dihitung sekali per sesi peramban. Pengunjung yang berpindah
dari halaman utama ke blog lalu kembali tetap terhitung satu.

### Memasangnya, sekitar tiga menit

Angkanya perlu tempat disimpan. Vercel menyediakannya gratis:

1. Buka dashboard Vercel, pilih proyek ini, masuk ke tab **Storage**
2. Klik **Create Database**, pilih **Upstash** lalu **Redis**
3. Beri nama bebas, misalnya `portofolio-statistik`, pilih region terdekat
   seperti Singapore, lalu buat
4. Saat ditanya mau dihubungkan ke proyek mana, pilih proyek ini dan
   **Connect**
5. Deploy ulang lewat tab Deployments

Vercel mengisi sendiri dua environment variable yang dibutuhkan
(`KV_REST_API_URL` dan `KV_REST_API_TOKEN`), jadi tidak ada yang perlu kamu
salin tempel.

Paket gratisnya jauh lebih dari cukup untuk situs portofolio.

### Kalau belum dipasang

Seluruh kotak statistik tidak ikut tampil, dan tidak ada yang rusak. Situs
berjalan normal seperti biasa. Jadi kamu boleh memasangnya kapan saja, atau
tidak sama sekali.

---

## 24. Kalau unggahan sering gagal

Ini keluhan yang wajar, dan sebabnya bisa ditebak dari isi folder medianya.

### Kenapa gagal

Setiap berkas yang kamu unggah dikirim ke GitHub lewat sambungan internetmu
sebagai satu paket utuh. Berkas besar di jaringan ponsel sering putus di tengah
jalan, dan yang terlihat cuma pesan gagal tanpa penjelasan.

Batas ukuran satu berkas sekarang **10 MB**, diturunkan dari 40 MB. Dengan batas
ini, berkas yang jelas terlalu besar ditolak lebih awal dengan pesan yang jelas,
bukan gagal setelah kamu menunggu lama.

### Tiga hal yang membuatnya lancar

**Unggah satu per satu.** Tunggu satu selesai, baru mulai berikutnya. Beberapa
unggahan sekaligus bisa saling berebut, dan salah satunya gagal.

**Foto tidak perlu ukuran asli kamera.** Situs memperkecilnya sendiri sebelum
dikirim ke pengunjung, jadi mengunggah foto 5 MB dari kamera cuma membebani
proses unggah tanpa membuat tampilannya lebih bagus. Lebar 1600 piksel sudah
lebih dari cukup.

**Video panjang unggah ke YouTube.** Lalu tempel tautannya di dalam tulisan.

### Rapikan berkas yang menganggur

Folder `public/media/` ikut dikirim ulang setiap kali situs dibangun. Makin
banyak isinya, makin lambat semuanya, termasuk panel itu sendiri.

Buka panel, klik ikon gambar di pojok kiri atas untuk membuka pustaka media,
lalu hapus berkas yang sudah tidak dipakai. Yang paling berpengaruh adalah
berkas lagu, karena ukurannya jauh lebih besar daripada foto.

Berhati hatilah menghapus, karena berkas yang masih dipakai akan membuat
gambarnya hilang dari situs.

---

## 25. Gambar preview saat tautan dibagikan

Saat kamu membagikan tautan tulisan ke WhatsApp, LinkedIn, atau X, yang muncul
adalah kartu berisi gambar, judul, dan ringkasan. Kartu itu dibuat otomatis,
satu untuk setiap tulisan, dan tidak ada yang perlu kamu kerjakan.

### Kenapa dibuatkan khusus

Dulu kartunya memakai berkas sampul apa adanya. Masalahnya, foto dari kamera
bisa berukuran beberapa megabita, dan WhatsApp menyerah sebelum selesai
mengunduhnya. Yang terlihat cuma tautan polos tanpa gambar.

Sekarang setiap tulisan punya kartu sendiri yang dibuat saat situs dibangun:

| Sifat | Nilai | Kenapa begitu |
|---|---|---|
| Ukuran | 1200 x 630 piksel | Rasio yang dipakai kartu preview besar |
| Format | JPEG | Dimengerti semua layanan tanpa kecuali |
| Berat | di bawah 300 KB | Jauh di dalam batas WhatsApp |

Isinya foto sampulmu dengan lapisan gelap di bagian bawah, judul tulisan, dan
alamat situs. Jadi orang tahu isinya sebelum mengklik.

### Kalau tulisan belum punya sampul

Kartunya memakai gambar preview bawaan situs, yaitu foto profilmu beserta nama
dan status. Tetap tampil, cuma tidak spesifik ke tulisannya.

### Kalau previewnya masih yang lama

Semua layanan menyimpan hasil pemeriksaan tautan selama beberapa hari. Kalau
kamu mengganti sampul lalu membagikan lagi, yang muncul bisa saja masih yang
lama. Cara memaksanya menyegarkan:

| Layanan | Caranya |
|---|---|
| WhatsApp | Tambahkan `?v=2` di akhir tautan, misalnya `.../blog/judul/?v=2` |
| Facebook dan Instagram | Buka `developers.facebook.com/tools/debug`, tempel tautannya, klik **Scrape Again** |
| LinkedIn | Buka `linkedin.com/post-inspector`, tempel tautannya |
| X | Biasanya menyegarkan sendiri dalam beberapa jam |

Cara memeriksa cepat sebelum membagikan: buka
`developers.facebook.com/tools/debug`, tempel tautannya, dan lihat apakah
gambarnya muncul di sana.

---

## 26. Mengubah status di halaman depan

Kapsul kecil di atas namamu, yang sekarang bertuliskan `Terbuka untuk peluang
kerja` dengan titik hijau berkedip. Semuanya bisa kamu atur.

Panel > **Isi Halaman** > **Halaman Depan** > bagian **Status ketersediaan**.

| Isian | Fungsinya |
|---|---|
| Tampilkan titik berkedip | Hilangkan centangnya kalau ingin teksnya saja |
| Teks status | Bebas kamu tulis apa saja |
| Warna titik | Pemilih warna, bebas |

### Teksnya bebas

Tidak harus soal pekerjaan. Beberapa contoh yang masuk akal:

- `Sedang menyelesaikan skripsi`
- `Terbuka untuk kolaborasi riset`
- `Sibuk sampai Desember`
- `Menerima proyek freelance`

Kosongkan kedua kolom teksnya, dan seluruh kapsul status hilang dari halaman.

### Warna yang lazim dipakai

| Warna | Kode | Biasanya untuk |
|---|---|---|
| Hijau | `#10b981` | Terbuka, tersedia |
| Kuning | `#f59e0b` | Sedang sibuk, terbatas |
| Merah | `#ef4444` | Tidak tersedia |
| Biru | `#3b82f6` | Kabar netral, bukan soal ketersediaan |
| Ungu | `#a855f7` | Mengikuti warna aksen situs |

Pilih warna yang cukup terang. Warna yang terlalu gelap akan tenggelam di mode
gelap, dan yang terlalu pucat hilang di mode terang. Lima warna di atas sudah
saya periksa terbaca jelas di keduanya.

Kalau kolom warnanya dikosongkan, dipakai hijau seperti semula.

---

## 27. Kalau panel berat atau Chrome menutup sendiri di ponsel

Chrome menutup sendiri bukan karena panelnya lambat, tapi karena **memori
ponselnya habis**. Penyebabnya hampir selalu satu: foto yang terlalu besar.

### Kenapa foto besar membuat memori habis

Foto dari kamera ponsel biasanya 12 megapiksel atau lebih. Saat panel
menampilkan daftar media, tiap foto harus dibongkar dulu di memori untuk
dijadikan gambar kecil, dan satu foto sebesar itu memakan sekitar **48 MB RAM**.

Dengan puluhan foto ditampilkan sekaligus, memori Chrome habis dalam hitungan
detik dan tabnya ditutup paksa oleh sistem.

### Yang sudah diperbaiki, tanpa perlu kamu kerjakan

**Foto diperkecil otomatis saat diunggah.** Panel memperkecilnya di ponselmu
sendiri sebelum dikirim, ke lebar maksimal 2000 piksel. Foto 5 MB dari kamera
biasanya menyusut jadi sekitar 300 KB. Unggahannya juga jadi jauh lebih cepat
dan lebih jarang gagal.

**Daftar panjang kini tampil terlipat.** Membuka menu Pengalaman dulu memuat
sembilan entri sekaligus beserta seluruh kolomnya, ratusan isian dalam satu
layar. Sekarang tiap entri tampil sebagai satu baris ringkas, dan hanya terbuka
saat kamu mengetuknya.

**Foto lama yang terlanjur besar sudah diperkecil.** 31 berkas, dari 47,7 MB
menjadi 11,8 MB. Nama berkasnya tidak diubah sama sekali, jadi tidak ada rujukan
yang putus, dan yang asli tetap tersimpan di riwayat Git.

### Kalau suatu saat berat lagi

Jalankan ini di komputer:

```bash
npm run kecilkan-media
```

Tambahkan `--coba` di belakangnya untuk melihat dulu apa yang akan terjadi tanpa
mengubah apa pun. Berkas yang sudah ringan dilewati, dan formatnya dipertahankan
supaya nama berkasnya tetap sama.

### Tiga kebiasaan yang membantu

**Hapus berkas yang tidak dipakai.** Buka pustaka media lewat ikon gambar di
pojok kiri atas panel, lalu hapus yang menganggur. Berkas lagu paling
berpengaruh karena ukurannya jauh lebih besar daripada foto.

**Tutup tab lain saat mengedit.** Chrome membagi memori antar tab, dan panel ini
memang butuh cukup banyak.

**Untuk pekerjaan besar, pakai komputer.** Menambah satu tulisan atau mengganti
satu foto nyaman dari ponsel. Merapikan sepuluh entri pengalaman sekaligus lebih
baik dari layar besar.

---

## 28. Bagian Galeri

Dinding foto tersendiri, terpisah dari strip **Sekilas Kegiatan** yang ada di
bawah Tentang Saya. Bedanya begini:

| | Sekilas Kegiatan | Galeri |
|---|---|---|
| Letak | di dalam Tentang Saya | bagian sendiri, setelah Kesukarelawanan |
| Isinya | foto saja | foto dan video |
| Jumlah | sedikit, pilihan terbaik | sebanyak yang kamu mau |
| Menambahnya | satu per satu, tiap foto wajib berketerangan | banyak sekaligus, keterangan opsional |

### Menambah foto dan video, banyak sekaligus

Panel > **Isi Halaman** > **Galeri** > kolom **Foto dan video galeri**.

Buka pustaka media, centang sebanyak apa pun, lalu simpan. Ini satu satunya
kolom di seluruh panel yang menerima banyak berkas dalam sekali pilih. Urutan
tampilnya sama dengan urutan di daftar, dan barisnya bisa diseret.

Foto dan video boleh dicampur dalam daftar yang sama. Mana yang video dikenali
sendiri dari nama berkasnya, jadi tidak ada yang perlu kamu tandai.

### Soal video

Kotak video di kisi galeri **tidak memuat videonya sendiri**. Kalau dimuat,
peramban akan mengunduh tiap video di halaman itu hanya untuk mencari gambar
bingkai pertamanya, dan galeri berisi selusin video bisa memakan puluhan
megabita kuota pengunjung sebelum satu pun ditonton.

Jadi yang tampil di kisi cuma kotak berwarna dengan ikon film dan tombol putar.
Videonya baru diunduh saat pengunjung menekannya.

Kalau kamu ingin kotaknya menampilkan gambar, isi kolom **Sampul video** di
daftar keterangan. Ambil satu foto dari videonya, unggah, lalu pilih di situ.

### Mengatur tampilannya

| Kolom | Isinya |
|---|---|
| Tampilkan bagian Galeri | matikan untuk menyembunyikan seluruh bagian tanpa menghapus fotonya |
| Jumlah kolom | 2, 3, atau 4. Di ponsel selalu dua, berapa pun pilihanmu |
| Bentuk foto | mendatar 4:3, persegi 1:1, lebar 16:9, atau tegak 3:4 |

Judul, label kecil di atasnya, dan subjudulnya diatur di
**Pengaturan** > **Judul Tiap Bagian** > **Galeri**.

### Keterangan

Opsional, dan sengaja dipisah ke kolom **Keterangan dan sampul video** di
bawahnya. Sebagian besar foto galeri memang tidak butuh keterangan, dan kalau
tiap foto wajib diberi teks, keuntungan memilih banyak berkas sekaligus jadi
hilang.

Cara mengisinya: tambah satu baris, pilih berkasnya yang mana, lalu tulis
keterangannya. Berkas yang tidak ada di daftar ini tetap tampil, hanya tanpa
teks.

### Yang berjalan sendiri

**Bagian ini hilang selama isinya kosong**, beserta item menunya di navbar.
Begitu berkas pertama masuk, keduanya muncul kembali.

**Isinya dimuat bertahap.** Dua belas berkas pertama dipasang lebih dulu,
sisanya menyusul lewat tombol **Muat lebih banyak**. Galeri berisi lima puluh
foto pun tidak membuat halaman berat dibuka di ponsel.

**Isinya bisa disusuri tanpa menutup.** Diklik satu, lalu maju mundur dengan
tombol panah di layar atau tombol panah kiri kanan di papan ketik. Ada tombol
unduh juga di pojok kanan atas, berlaku untuk semua gambar dan video di situs
ini, bukan cuma galeri.

---

## 29. Melampirkan foto dan berkas ke pengalaman dan pendidikan

Tiap entri di bagian **Pengalaman** dan **Pendidikan** bisa membawa dua hal
tambahan, dan keduanya opsional:

| Yang bisa ditambahkan | Contoh isinya |
|---|---|
| Foto dokumentasi | Foto wisuda, suasana kampus, foto kegiatan |
| Berkas untuk diunduh | Ijazah, transkrip nilai, SK Rektor, sertifikat hasil pindai |

Panel > **Isi Halaman** > **Pengalaman** atau **Pendidikan** > buka entrinya >
**Foto dokumentasi** untuk fotonya, atau **Berkas untuk diunduh** >
**Add Berkas** untuk dokumennya.

| Kolom | Isinya |
|---|---|
| Nama tombol | Contoh: SK Rektor, Sertifikat, Foto kegiatan. Boleh dikosongkan, nanti dipakai nama berkasnya |
| Berkas | berkas yang diunggah. Bebas jenis apa saja |

Hasilnya muncul sebagai deretan tombol kecil di bagian bawah kartu itu, lengkap
dengan ikon dan label jenis berkasnya. Ikon dan labelnya dikenali sendiri dari
nama berkas, jadi tidak ada yang perlu kamu atur.

Fotonya tampil di atas kartu dan bisa diklik untuk diperbesar.

Kalau berkasnya milik situs ini, tombolnya langsung menyimpan berkas itu ke
perangkat pengunjung. Kalau yang kamu isi adalah alamat ke situs lain, tombolnya
membuka tab baru.

Entri tanpa lampiran tidak menampilkan apa apa, jadi kolom ini aman dibiarkan
kosong. Kartu yang tidak berfoto tetap sama tingginya dengan kartu yang berfoto
di sebelahnya, jadi kamu boleh mengisi sebagian saja.

### Foto pendidikan TIDAK ikut ke CV

Ini disengaja dan penting. CV gaya Harvard harus bebas gambar supaya terbaca
mesin pelacak lamaran, dan itu salah satu hal yang diperiksa otomatis. Jadi
silakan pasang foto sebanyak yang kamu mau: yang berubah cuma tampilan situs,
CV-nya tetap bersih.

Berkas unduhan juga tidak ikut tercetak. Di halaman cetak, tombol tombolnya
disembunyikan lewat `print:hidden`.

### Satu jalur, bukan dua

Pendidikan memakai komponen yang sama persis dengan Pengalaman, yaitu
`LightboxProvider` untuk memperbesar foto dan `BerkasUnduhan` untuk tombol
unduhnya. Itu disengaja: kalau suatu saat cara membuka gambar atau bentuk
tombol unduh diperbaiki, kedua bagian ikut berubah tanpa perlu diingat dua
kali.

---

## 30. Supaya situs tetap ringan di perangkat pengunjung

Bagian ini bukan sesuatu yang perlu kamu kerjakan. Ini catatan tentang apa yang
sudah dipasang supaya situsnya tidak berat dibuka, terutama di ponsel dengan
kuota terbatas, dan apa yang perlu kamu hindari supaya tetap begitu.

### Yang sudah berjalan sendiri

**Gambar di dalam tulisan diperkecil otomatis.** Foto 1,4 MB yang kamu tempel di
tulisan dikirim ke ponsel pengunjung sebagai berkas sekitar 120 KB, seukuran
layarnya. Tampilannya sama, dan kamu tetap menempel foto seperti biasa.

**Ukuran tiap gambar dihitung saat situs dibangun.** Peramban jadi tahu setinggi
apa tempat yang harus dipesan sebelum gambarnya datang, sehingga tulisan di
bawahnya tidak melompat saat gambarnya muncul.

**Lagu dan video tidak diunduh sebelum ditekan.** Ini yang paling besar
pengaruhnya. Dulu satu tulisan berlagu memakan 8,6 MB kuota pembaca hanya untuk
membuka halamannya, padahal tombol putarnya belum tentu disentuh.

**Foto di luar layar belum diunduh.** Beranda memuat 45 gambar, tapi yang
diambil saat pertama dibuka cuma enam yang benar benar terlihat.

### Angka sebelum dan sesudah

Diukur di ponsel dengan prosesor diperlambat empat kali:

| Halaman | Sebelum | Sesudah |
|---|---|---|
| Tulisan "Someday" | 8,63 MB | 0,13 MB |
| Tulisan "Akhirnya Sidang" | 7,53 MB | 0,42 MB |
| Tulisan "Perjalanan ke DPRD" | 1,21 MB | 0,20 MB |
| Beranda, sebelum digulir | 0,41 MB | 0,41 MB |
| Menekan tombol ID/EN | 961 ms | 481 ms |

### Tiga kebiasaan yang menjaganya tetap ringan

**Unggah lagu seperlunya saja.** Satu lagu MP3 berdurasi empat menit besarnya
sekitar 5 sampai 9 MB, jauh lebih besar daripada foto mana pun di situs ini.
Sekarang lagu itu tidak diunduh sampai ditekan, tapi tetap saja pembaca yang
menekannya harus menunggu.

**Video panjang lebih baik diunggah ke YouTube,** lalu tempel tautannya di
tulisan. Video 30 MB di folder media tetap 30 MB saat ditonton pengunjung.

**Foto tidak perlu ukuran asli kamera.** Panel sudah memperkecilnya sendiri ke
lebar 2000 piksel saat diunggah, dan itu sudah lebih dari cukup.

### Dua hal yang sengaja tidak dipakai

Dicoba, diukur, lalu dibatalkan. Ditulis di sini supaya tidak dicoba lagi tanpa
alasan baru. Keterangan lengkapnya ada sebagai catatan di `app/globals.css`.

**Melewatkan bagian halaman yang belum terlihat** (`content-visibility`). Tinggi
halaman jadi ditebak dari satu angka, padahal tiap bagian tingginya berbeda jauh.
Akibatnya batang gulir meloncat loncat.

**Membatasi perhitungan tata letak per bagian** (`contain`). Waktu tata letaknya
memang cuma 5 sampai 9 milidetik, jadi tidak ada yang bisa dihemat, sementara
posisi teksnya bergeser satu piksel.


---

## 31. Setiap bagian halaman depan diubah di mana

Semuanya ada di satu tempat: panel > **Isi Halaman** > **Halaman Depan**.
Urutan kolom di sana sengaja dibuat sama dengan urutan tampilnya di layar.

| Yang kamu lihat di layar | Nama kolomnya di panel |
|---|---|
| Kapsul kecil paling atas, misalnya "Terbuka untuk peluang kerja" | Status ketersediaan > Teks status |
| Titik berkedip di sebelahnya, beserta warnanya | Status ketersediaan > Warna titik |
| "Halo, saya" lalu nama besar bergradien | Nama lengkap |
| Nama pendek di navbar sebelah foto kecil | Nama panggilan |
| Kalimat besar di bawah nama | Headline |
| Kalimat miring bergaris di sebelah kiri | Kalimat pembuka |
| Baris berikon peta, misalnya "Bengkulu, Indonesia" | **Lokasi** |
| Tombol "Unduh CV" | Tautan tombol Unduh CV |
| Foto besar di sebelah kanan | Foto profil |
| Kotak kecil menempel di bawah foto | Kartu pada foto |
| Motto di dalam kotak itu | Kartu pada foto > Motto |

Yang **tidak** ada di menu itu:

| Yang kamu lihat | Menunya |
|---|---|
| Deretan ikon media sosial di bawah tombol | Pengaturan Situs > Media Sosial |
| Strip keahlian berjalan di bagian bawah | Isi Halaman > Keahlian |
| Tombol "Gulir ke bawah" | tidak bisa diubah, teksnya bawaan situs |


---

## 32. Keamanan situs

Bagian ini bukan sesuatu yang perlu kamu kerjakan. Ini catatan tentang apa yang
sudah dijaga, supaya kalau suatu saat ada yang mengubah kode, penjagaannya tidak
ikut terlepas tanpa sengaja.

### Apa yang sebenarnya berharga di sini

Situs ini tidak menyimpan data pribadi pengunjung dan tidak punya halaman login
sendiri. Yang benar benar berharga cuma satu: **panel di /admin memegang token
GitHub milikmu selama kamu login**, dan token itu bisa menulis ke seluruh
repositori. Hampir semua penjagaan di bawah berpusat pada satu hal itu.

### Yang dijaga

**Token login tidak bisa dialihkan ke situs lain.** Halaman perantara setelah
login GitHub hanya membalas ke situs ini sendiri. Sebelumnya ia membalas ke
alamat mana pun yang menyapanya lebih dulu, dan itu berarti jendela dari situs
lain bisa memancing tokennya keluar.

**Isi tulisan tidak bisa menyisipkan kode.** Kode HTML mentah di dalam tulisan
dibuang, bukan dijalankan, dan alamat yang bisa menjalankan kode seperti
`javascript:` dan `data:` ditolak. Diuji dengan empat belas bentuk serangan
yang lazim, semuanya tertahan.

**Formulir masukan dibatasi berlapis.** Kolom umpan tersembunyi, jeda mengetik
minimal, batas panjang, lima kiriman per jam per alamat, dan empat puluh per jam
secara menyeluruh. Yang terakhir itu penting karena tiap kiriman menjadi commit
permanen: riwayat Git tidak bisa dihapus sebagian, jadi banjir kiriman
meninggalkan bekas selamanya.

**Penghitung kunjungan dibatasi.** Tanpa itu siapa pun bisa menggelembungkan
angkanya dengan memanggil alamatnya berulang, sekaligus menghabiskan jatah
permintaan penyimpanan.

**Header keamanan dipasang di semua halaman.** Situs tidak bisa dipasang di
dalam bingkai situs lain, peramban tidak menebak nebak jenis berkas, alamat
halaman tidak bocor ke situs luar, dan kamera, mikrofon, serta lokasi ditutup.

**Rahasia tidak pernah sampai ke peramban.** Client Secret GitHub dan token
penyimpan masukan hanya dipakai di sisi server. Folder `content/` tidak
disajikan sebagai berkas publik, jadi kiriman masukan tidak bisa dibuka
sembarang orang lewat alamat.

**/admin dan /api tidak diindeks mesin pencari.** Panel tetap butuh login, tapi
tidak ada gunanya alamatnya muncul di Google.

### Yang perlu kamu jaga sendiri

| Hal | Kenapa |
|---|---|
| **Jangan pernah bagikan Client Secret** | Satu satunya kunci yang bisa memalsukan login panelmu. Kalau pernah terlihat orang lain, buat ulang di halaman OAuth App GitHub |
| **Token penyimpan masukan dibatasi izinnya** | Cukup Contents Read and write untuk satu repositori ini saja. Jangan diberi izin lebih |
| **Repositori sebaiknya tetap privat** | Kiriman masukan berisi nama dan kontak orang. Kalau repositorinya publik, semua orang bisa membacanya |
| **Jangan tempel berkas rahasia ke folder media** | Apa pun di `public/` bisa dibuka siapa saja yang tahu alamatnya, meski tidak ada tautan ke sana |

### Yang sengaja tidak dipasang

**Content-Security-Policy penuh.** CSP yang ketat butuh nonce pada tiap skrip,
dan nonce hanya bisa dibuat saat halaman diminta, bukan saat dibangun.
Memakainya berarti seluruh halaman berhenti dibuat sekali di awal dan harus
dihitung ulang tiap kunjungan. Situsnya jadi lebih lambat demi perlindungan yang
tidak seberapa untuk situs yang tidak menerima masukan pengguna di halamannya.
Bagian CSP yang tetap berguna tanpa nonce, yaitu `frame-ancestors`, sudah
dipasang.

**Layanan pembatas permintaan tersendiri.** Pembatas yang ada sekarang disimpan
di memori server, jadi catatannya hilang tiap kali server berganti. Itu bukan
penjaga mutlak, melainkan lapis yang menaikkan biaya penyalahgunaan sampai tidak
sepadan. Untuk situs portofolio itu sudah cukup.


---

## 33. Mengganti ikon situs

Ikon situs adalah gambar kecil yang muncul di tab peramban, di daftar bookmark,
dan di sebelah alamat situsmu pada hasil pencarian Google.

### Cara menggantinya

Panel > **Pengaturan Situs** > **Nama Situs dan SEO** > kolom **Ikon situs**.

Unggah satu gambar, simpan, selesai. Ikonnya dibuat ulang otomatis tiap kali
situs dibangun, jadi tidak ada perintah yang perlu kamu jalankan.

Kosongkan kolom itu kalau kamu ingin memakai foto profilmu, dan itu yang dipakai
sekarang.

### Yang perlu diperhatikan pada gambarnya

| | |
|---|---|
| Bentuk | persegi, minimal 192x192 piksel |
| Bagian penting | taruh di tengah, karena gambarnya dipotong bulat |
| Gaya | dipotong bulat lalu diberi bingkai gradien, sama seperti logo di navbar |

Ikon dilihat orang dalam ukuran sangat kecil, sekitar 16 piksel di tab peramban.
Gambar dengan banyak detail atau tulisan kecil akan jadi bubur. Yang paling
terbaca biasanya satu bentuk sederhana, satu huruf, atau wajah.

### Kalau ikonnya belum berubah di Google

Google menyimpan ikon situs secara terpisah dari halamannya, dan pembaruannya
bisa memakan waktu berhari hari sampai berminggu minggu. Yang bisa kamu lakukan:

1. Pastikan dulu ikonnya sudah benar di tab peramban. Kalau di situ sudah
   berganti, berarti situsnya sudah beres dan tinggal menunggu Google.
2. Minta Google memeriksa ulang halaman depan lewat Search Console, menu
   **Inspeksi URL**, lalu **Minta Pengindeksan**.
3. Tunggu. Tidak ada cara mempercepatnya lebih dari itu.

### Tiga berkas yang dibuat

Kamu tidak perlu menyentuh ini, cuma supaya tahu kalau suatu saat penasaran:

| Berkas | Ukuran | Untuk apa |
|---|---|---|
| `public/favicon.ico` | 48x48 | yang pertama dicari Google dan kebanyakan layanan lain |
| `app/icon.png` | 192x192 | dipakai peramban modern |
| `app/apple-icon.png` | 180x180 | pintasan di layar utama iPhone |

Ukuran 48 dan 192 bukan angka sembarangan. Google meminta ikon situs berbentuk
persegi dengan sisi kelipatan 48 piksel. Ikon lama berukuran 512x512, dan 512
bukan kelipatan 48.
