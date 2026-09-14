/**
 * =============================================================================
 *  data/portfolio.js  |  PERAKIT KONTEN
 * =============================================================================
 *
 *  DULU seluruh isi situs ditulis langsung di berkas ini. SEKARANG isinya
 *  tinggal di folder content/ sebagai berkas JSON, supaya bisa diedit lewat
 *  panel CMS di alamat /admin tanpa membuka GitHub sama sekali.
 *
 *  Berkas ini tugasnya hanya satu: menyatukan semua berkas JSON itu menjadi
 *  objek `portfolio` dengan bentuk yang sama persis seperti sebelumnya.
 *  Karena bentuknya tidak berubah, tidak ada komponen yang perlu disesuaikan.
 *
 *  ------------------------------------------------------------------------
 *  MAU MENGUBAH ISI SITUS? Ada dua cara, keduanya sama sahnya.
 *
 *  1. Lewat panel CMS  (paling gampang, tanpa menyentuh kode)
 *     Buka https://jatmikoyogop.vercel.app/admin lalu login dengan GitHub.
 *
 *  2. Lewat berkas JSON di folder content/
 *     Setiap berkas isinya persis seperti daftar di bawah.
 *
 *  Panduan lengkap keduanya ada di data/README.md
 *  ------------------------------------------------------------------------
 *
 *  DUA BAHASA (ID/EN)
 *  Teks yang perlu diterjemahkan disimpan sebagai objek { "id": "...", "en": "..." }.
 *  Teks yang sama di kedua bahasa cukup ditulis sebagai teks biasa.
 *  Helper t() di lib/i18n.js yang memilihkan mana yang dipakai.
 * =============================================================================
 */

import settings from '@/content/settings.json';
import profile from '@/content/profile.json';
import about from '@/content/about.json';
import contact from '@/content/contact.json';
import social from '@/content/social.json';
import stats from '@/content/stats.json';
import experience from '@/content/experience.json';
import education from '@/content/education.json';
import publications from '@/content/publications.json';
import identitas from '@/content/identitas.json';
import mengajar from '@/content/mengajar.json';
import penelitian from '@/content/penelitian.json';
import pengabdian from '@/content/pengabdian.json';
import seminar from '@/content/seminar.json';
import buku from '@/content/buku.json';
import hki from '@/content/hki.json';
import kebijakan from '@/content/kebijakan.json';
import penghargaan from '@/content/penghargaan.json';
import projects from '@/content/projects.json';
import certifications from '@/content/certifications.json';
import skills from '@/content/skills.json';
import volunteering from '@/content/volunteering.json';
import languages from '@/content/languages.json';
import services from '@/content/services.json';
import gallery from '@/content/gallery.json';
import music from '@/content/music.json';
import feedback from '@/content/feedback-settings.json';
import navigation from '@/content/navigation.json';
import sections from '@/content/sections.json';
import labels from '@/content/labels.json';
import { jenisBerkas } from '@/lib/berkas';

/**
 * Daftar di dalam berkas JSON dibungkus objek dengan field `items` atau
 * `groups`, karena panel CMS membutuhkan field bernama, bukan array telanjang.
 * Fungsi ini membuka bungkus itu dan tetap aman kalau berkasnya masih kosong.
 */
const list = (source, key = 'items') => (Array.isArray(source?.[key]) ? source[key] : []);

/**
 * Menyusun isi galeri foto dan video.
 *
 * Panel menyimpan daftar berkasnya sebagai array alamat biasa, bukan array
 * objek. Bentuk itu yang dipakai karena hanya bentuk itu yang mengizinkan kamu
 * memilih banyak berkas sekaligus di perpustakaan media, bukan satu per satu.
 *
 * Keterangan dan sampul videonya ditulis di daftar terpisah dan dijodohkan di
 * sini, jadi komponennya cukup menerima satu daftar yang sudah rapi. Berkas
 * yang tidak punya keterangan tetap tampil, keterangannya saja yang kosong.
 */
function susunGaleri(sumber) {
  const tambahan = new Map(
    (Array.isArray(sumber?.captions) ? sumber.captions : [])
      .filter((baris) => typeof baris?.src === 'string' && baris.src)
      .map((baris) => [baris.src, { caption: baris.text ?? null, poster: baris.poster || null }])
  );

  const daftar = (Array.isArray(sumber?.photos) ? sumber.photos : []).filter(
    (src) => typeof src === 'string' && src.trim()
  );

  // Berkas yang kebetulan terpilih dua kali cukup ditampilkan sekali.
  return [...new Set(daftar)].map((src) => {
    const ekstra = tambahan.get(src) ?? {};
    return {
      src,
      caption: ekstra.caption ?? null,
      poster: ekstra.poster ?? null,
      // Video dikenali dari nama berkasnya, jadi kamu tidak perlu menandainya
      // sendiri di panel. Selain video, semuanya diperlakukan sebagai gambar.
      jenis: jenisBerkas(src) === 'video' ? 'video' : 'gambar',
    };
  });
}

const galeri = susunGaleri(gallery);
const galeriTampil = gallery?.enabled !== false && galeri.length > 0;

export const portfolio = {
  // content/settings.json  judul situs, SEO, bahasa awal, tema awal
  meta: settings.meta,

  // content/settings.json  sakelar hidup dan mati untuk sentuhan interaktif
  appearance: settings.appearance ?? {},

  /*
    content/profile.json  isi halaman depan: foto, nama, status, lokasi
    content/about.json    isi bagian Tentang Saya: ringkasan dan strip foto

    Dua berkas, satu objek.

    Dulu keduanya jadi satu berkas, dan di panel isinya muncul sebagai satu
    formulir sepanjang empat belas kolom. Kolom Lokasi terkubur di tengahnya
    dan susah ditemukan. Sekarang berkasnya dipisah mengikuti apa yang dilihat
    pengunjung: satu untuk layar pertama, satu untuk bagian Tentang Saya.

    Di sini keduanya disatukan kembali menjadi objek `profile` dengan bentuk
    yang sama persis seperti sebelumnya, jadi tidak ada komponen yang perlu
    ikut berubah.
  */
  profile: { ...profile, ...about },

  // content/social.json  deretan tautan media sosial
  social: list(social),

  // content/stats.json  angka sorotan di section Tentang Saya
  stats: list(stats),

  // content/experience.json  timeline pengalaman, urut dari yang terbaru
  experience: list(experience),

  // content/education.json  riwayat pendidikan formal
  education: list(education),

  // content/publications.json  karya ilmiah
  publications: list(publications),

  /*
    BERKAS KHUSUS DAFTAR RIWAYAT HIDUP PENELITI

    Tujuh berkas di bawah ini tidak ada di templat aslinya. Isinya bagian
    bagian Daftar Riwayat Hidup yang dipakai pengajuan penelitian, dan
    masing masing punya bentuk tabelnya sendiri. Dipisah per berkas, bukan
    disatukan, supaya tiap bagian jadi satu menu tersendiri di panel dan
    barisnya bisa ditambah tanpa menyentuh bagian lain.
  */

  // content/identitas.json  NIP, NIDN, jabatan fungsional, alamat kantor
  identitas,

  // content/mengajar.json  mata kuliah yang diampu
  mengajar: list(mengajar),

  // content/penelitian.json  pengalaman penelitian lima tahun terakhir
  penelitian: list(penelitian),

  // content/pengabdian.json  pengabdian kepada masyarakat lima tahun terakhir
  pengabdian: list(pengabdian),

  // content/seminar.json  pemakalah seminar ilmiah (oral presentation)
  seminar: list(seminar),

  // content/buku.json  karya buku lima tahun terakhir
  buku: list(buku),

  // content/hki.json  perolehan hak kekayaan intelektual
  hki: list(hki),

  // content/kebijakan.json  naskah akademik, raperda, dan policy brief
  kebijakan: list(kebijakan),

  // content/penghargaan.json  penghargaan sepuluh tahun terakhir
  penghargaan: list(penghargaan),

  // content/projects.json  kartu proyek beserta tag penyaringnya
  projects: list(projects),

  // content/certifications.json  sertifikasi profesional
  certifications: list(certifications),

  // content/skills.json  kelompok keahlian
  skills: { groups: list(skills, 'groups') },

  // content/volunteering.json  kegiatan sukarela
  volunteering: list(volunteering),

  // content/languages.json  bahasa yang dikuasai
  languages: list(languages),

  // content/services.json  layanan yang ditawarkan di bagian Kontak
  services: list(services),

  // content/contact.json  email, telepon, catatan
  contact,

  // content/gallery.json  bagian Galeri, foto ditambah banyak sekaligus
  gallery: { ...gallery, items: galeri },

  // content/music.json  pemutar musik kecil di pojok kiri bawah
  music: { ...music, tracks: list(music, 'tracks') },

  // content/feedback-settings.json  formulir masukan dan saran dari tamu
  feedback,

  /*
    content/navigation.json  isi menu navigasi

    Bagian Galeri menyembunyikan dirinya sendiri selama fotonya masih kosong,
    jadi item menunya ikut dilepas di sini. Kalau tidak, ada tombol di navbar
    yang menunjuk ke bagian yang tidak ada di halaman dan diklik pun tidak
    terjadi apa apa. Begitu foto pertama masuk lewat panel, menunya muncul
    kembali sendiri tanpa perlu diatur.
  */
  nav: list(navigation).filter((item) => item.id !== 'gallery' || galeriTampil),

  // content/sections.json  judul dan subjudul tiap bagian halaman
  sections,

  // content/labels.json  label tombol dan teks antarmuka
  ui: labels,
};

export default portfolio;
