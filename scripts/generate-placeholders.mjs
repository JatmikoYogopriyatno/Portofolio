/**
 * =============================================================================
 *  scripts/generate-placeholders.mjs
 * =============================================================================
 *
 *  Membuat gambar placeholder bergaya seragam untuk bagian Pengalaman,
 *  galeri Tentang Saya, dan sampul Proyek.
 *
 *      npm run placeholders
 *
 *  Semua berkas ditulis sebagai SVG, jadi ukurannya kecil, tetap tajam di
 *  layar apa pun, dan gampang diedit sendiri kalau perlu.
 *
 *  GANTI DENGAN FOTO ASLI KAPAN SAJA. Simpan foto ke folder yang sama, lalu
 *  ubah field `image` pada item terkait di data/portfolio.js. Placeholder ini
 *  hanya bertugas mengisi tempat sampai foto aslinya siap.
 *
 *  Menambah placeholder baru cukup dengan menambah satu baris ke array ITEMS
 *  di bagian bawah berkas ini.
 * =============================================================================
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

/* Palet. Samakan dengan --accent-* di app/globals.css kalau warnanya diganti. */
const PALETTES = {
  indigo: ['#312e81', '#4f46e5', '#818cf8'],
  violet: ['#4c1d95', '#7c3aed', '#c084fc'],
  cyan: ['#0e4f5e', '#0891b2', '#67e8f9'],
  teal: ['#134e4a', '#0d9488', '#5eead4'],
  slate: ['#1e293b', '#475569', '#94a3b8'],
  rose: ['#4c1d3d', '#9d174d', '#f9a8d4'],
};

/**
 * Motif geometris di tengah gambar. Tiap motif memakai bahasa bentuk yang
 * berbeda supaya kartu-kartunya tidak terlihat seragam.
 */
const MOTIFS = {
  // Tumpukan dokumen, untuk pekerjaan penyusunan berkas.
  documents: (cx, cy, s) => `
    <g transform="translate(${cx} ${cy})" fill="none" stroke="#ffffff" stroke-width="${s * 0.016}" stroke-linejoin="round">
      <rect x="${-s * 0.3}" y="${-s * 0.34}" width="${s * 0.52}" height="${s * 0.66}" rx="${s * 0.04}" opacity="0.28"/>
      <rect x="${-s * 0.22}" y="${-s * 0.28}" width="${s * 0.52}" height="${s * 0.66}" rx="${s * 0.04}" opacity="0.45" fill="#ffffff" fill-opacity="0.05"/>
      <path d="M${-s * 0.12} ${-s * 0.1}h${s * 0.32}M${-s * 0.12} ${0}h${s * 0.32}M${-s * 0.12} ${s * 0.1}h${s * 0.2}" opacity="0.5"/>
    </g>`,

  // Simpul yang saling terhubung, untuk pekerjaan digital dan sistem.
  network: (cx, cy, s) => `
    <g transform="translate(${cx} ${cy})" stroke="#ffffff" fill="none" stroke-width="${s * 0.014}">
      <path d="M${-s * 0.28} ${-s * 0.18}L0 ${s * 0.05}L${s * 0.28} ${-s * 0.22}M0 ${s * 0.05}L${-s * 0.1} ${s * 0.3}M0 ${s * 0.05}L${s * 0.22} ${s * 0.26}" opacity="0.4"/>
      <circle cx="${-s * 0.28}" cy="${-s * 0.18}" r="${s * 0.055}" fill="#ffffff" fill-opacity="0.5" stroke="none"/>
      <circle cx="${s * 0.28}" cy="${-s * 0.22}" r="${s * 0.045}" fill="#ffffff" fill-opacity="0.35" stroke="none"/>
      <circle cx="0" cy="${s * 0.05}" r="${s * 0.075}" fill="#ffffff" fill-opacity="0.65" stroke="none"/>
      <circle cx="${-s * 0.1}" cy="${s * 0.3}" r="${s * 0.045}" fill="#ffffff" fill-opacity="0.35" stroke="none"/>
      <circle cx="${s * 0.22}" cy="${s * 0.26}" r="${s * 0.05}" fill="#ffffff" fill-opacity="0.45" stroke="none"/>
    </g>`,

  // Gelombang suara memancar, untuk presentasi dan konferensi.
  broadcast: (cx, cy, s) => `
    <g transform="translate(${cx} ${cy})" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-width="${s * 0.018}">
      <circle cx="0" cy="0" r="${s * 0.08}" fill="#ffffff" fill-opacity="0.6" stroke="none"/>
      <path d="M${-s * 0.16} ${-s * 0.16}a${s * 0.23} ${s * 0.23} 0 0 0 0 ${s * 0.32}" opacity="0.5"/>
      <path d="M${s * 0.16} ${-s * 0.16}a${s * 0.23} ${s * 0.23} 0 0 1 0 ${s * 0.32}" opacity="0.5"/>
      <path d="M${-s * 0.29} ${-s * 0.29}a${s * 0.41} ${s * 0.41} 0 0 0 0 ${s * 0.58}" opacity="0.28"/>
      <path d="M${s * 0.29} ${-s * 0.29}a${s * 0.41} ${s * 0.41} 0 0 1 0 ${s * 0.58}" opacity="0.28"/>
    </g>`,

  // Peta dengan penanda lokasi, untuk kerja lapangan dan pemerintahan daerah.
  territory: (cx, cy, s) => `
    <g transform="translate(${cx} ${cy})" fill="none" stroke="#ffffff" stroke-width="${s * 0.014}" stroke-linejoin="round">
      <path d="M${-s * 0.34} ${-s * 0.14}l${s * 0.22} ${-s * 0.1} ${s * 0.24} ${s * 0.1} ${s * 0.22} ${-s * 0.1}v${s * 0.44}l${-s * 0.22} ${s * 0.1} -${s * 0.24} -${s * 0.1} -${s * 0.22} ${s * 0.1}Z" opacity="0.35"/>
      <path d="M${-s * 0.12} ${-s * 0.24}v${s * 0.44}M${s * 0.12} ${-s * 0.14}v${s * 0.44}" opacity="0.3"/>
      <path d="M${s * 0.02} ${-s * 0.02}a${s * 0.09} ${s * 0.09} 0 1 1 ${s * 0.001} 0Z" fill="#ffffff" fill-opacity="0.7" stroke="none"/>
      <path d="M${s * 0.025} ${s * 0.04}l${s * 0.055} ${s * 0.12} -${s * 0.11} 0Z" fill="#ffffff" fill-opacity="0.7" stroke="none"/>
    </g>`,

  // Bentuk laboratorium, untuk pekerjaan riset dan praktikum.
  lab: (cx, cy, s) => `
    <g transform="translate(${cx} ${cy})" fill="none" stroke="#ffffff" stroke-width="${s * 0.016}" stroke-linejoin="round">
      <path d="M${-s * 0.09} ${-s * 0.3}v${s * 0.2}L${-s * 0.26} ${s * 0.26}a${s * 0.05} ${s * 0.05} 0 0 0 ${s * 0.045} ${s * 0.075}h${s * 0.43}a${s * 0.05} ${s * 0.05} 0 0 0 ${s * 0.045} -${s * 0.075}L${s * 0.09} ${-s * 0.1}v-${s * 0.2}Z" opacity="0.45" fill="#ffffff" fill-opacity="0.06"/>
      <path d="M${-s * 0.14} ${-s * 0.3}h${s * 0.28}" opacity="0.55"/>
      <circle cx="${-s * 0.05}" cy="${s * 0.16}" r="${s * 0.03}" fill="#ffffff" fill-opacity="0.5" stroke="none"/>
      <circle cx="${s * 0.06}" cy="${s * 0.24}" r="${s * 0.022}" fill="#ffffff" fill-opacity="0.4" stroke="none"/>
    </g>`,

  // Lingkaran yang saling bertaut, untuk kerja sama dan kesukarelawanan.
  community: (cx, cy, s) => `
    <g transform="translate(${cx} ${cy})" fill="none" stroke="#ffffff" stroke-width="${s * 0.016}">
      <circle cx="${-s * 0.13}" cy="${-s * 0.06}" r="${s * 0.2}" opacity="0.45"/>
      <circle cx="${s * 0.13}" cy="${-s * 0.06}" r="${s * 0.2}" opacity="0.45"/>
      <circle cx="0" cy="${s * 0.16}" r="${s * 0.2}" opacity="0.45"/>
      <circle cx="0" cy="${s * 0.015}" r="${s * 0.055}" fill="#ffffff" fill-opacity="0.55" stroke="none"/>
    </g>`,

  // Kurva menanjak, untuk pertumbuhan dan analisis data.
  growth: (cx, cy, s) => `
    <g transform="translate(${cx} ${cy})" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-width="${s * 0.018}">
      <path d="M${-s * 0.32} ${s * 0.26}h${s * 0.64}M${-s * 0.32} ${s * 0.26}v-${s * 0.52}" opacity="0.35"/>
      <path d="M${-s * 0.24} ${s * 0.12}l${s * 0.16} -${s * 0.14} ${s * 0.14} ${s * 0.07} ${s * 0.2} -${s * 0.25}" opacity="0.65"/>
      <g fill="#ffffff" stroke="none">
        <rect x="${-s * 0.2}" y="${s * 0.06}" width="${s * 0.07}" height="${s * 0.2}" rx="${s * 0.015}" fill-opacity="0.3"/>
        <rect x="${-s * 0.06}" y="${-s * 0.06}" width="${s * 0.07}" height="${s * 0.32}" rx="${s * 0.015}" fill-opacity="0.42"/>
        <rect x="${s * 0.08}" y="${-s * 0.18}" width="${s * 0.07}" height="${s * 0.44}" rx="${s * 0.015}" fill-opacity="0.55"/>
      </g>
    </g>`,
};

/**
 * Membangun satu berkas SVG.
 *
 * @param {object} options
 * @param {number} options.width   lebar gambar
 * @param {number} options.height  tinggi gambar
 * @param {string} options.palette nama palet dari PALETTES
 * @param {string} options.motif   nama motif dari MOTIFS
 * @param {string} options.title   dipakai untuk aria-label, tidak digambar
 * @param {string} options.caption pelengkap aria-label, tidak digambar
 */
function buildSvg({ width, height, palette, motif, title, caption, id }) {
  const [deep, mid, bright] = PALETTES[palette] ?? PALETTES.indigo;
  const short = Math.min(width, height);
  const seed = palette.length + motif.length;

  // Awalan unik untuk setiap id di dalam berkas. Tanpa ini, dua SVG yang
  // ditempel di satu halaman akan saling merebut definisi gradiennya.
  const uid = (name) => `${id}-${name}`;

  const escape = (text) =>
    String(text ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  // Jarak tepi untuk garis aksen di sudut bawah.
  const pad = Math.round(width * 0.062);

  return `<?xml version="1.0" encoding="UTF-8"?>
<!--
  Gambar placeholder, dibuat oleh scripts/generate-placeholders.mjs
  GANTI DENGAN FOTO ASLI: simpan foto ke folder ini, lalu ubah field "image"
  pada item terkait di data/portfolio.js
-->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${escape(title)}, ${escape(caption)}">
  <defs>
    <linearGradient id="${uid('base')}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${deep}"/>
      <stop offset="100%" stop-color="#080b16"/>
    </linearGradient>
    <radialGradient id="${uid('glow1')}" cx="20%" cy="14%" r="76%">
      <stop offset="0%" stop-color="${mid}" stop-opacity="0.9"/>
      <stop offset="55%" stop-color="${mid}" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="${mid}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="${uid('glow2')}" cx="88%" cy="82%" r="66%">
      <stop offset="0%" stop-color="${bright}" stop-opacity="0.42"/>
      <stop offset="100%" stop-color="${bright}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="${uid('veil')}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="45%" stop-color="#05070f" stop-opacity="0"/>
      <stop offset="100%" stop-color="#05070f" stop-opacity="0.78"/>
    </linearGradient>
    <linearGradient id="${uid('rule')}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${bright}"/>
      <stop offset="100%" stop-color="${bright}" stop-opacity="0"/>
    </linearGradient>
    <pattern id="${uid('grid')}" width="${short * 0.09}" height="${short * 0.09}" patternUnits="userSpaceOnUse">
      <path d="M${short * 0.09} 0H0V${short * 0.09}" fill="none" stroke="#ffffff" stroke-opacity="0.06" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#${uid('base')})"/>
  <rect width="${width}" height="${height}" fill="url(#${uid('glow1')})"/>
  <rect width="${width}" height="${height}" fill="url(#${uid('glow2')})"/>
  <rect width="${width}" height="${height}" fill="url(#${uid('grid')})"/>

  <!-- Lingkaran samar sebagai kedalaman tambahan -->
  <circle cx="${width * 0.82}" cy="${height * 0.2}" r="${short * (0.3 + (seed % 4) * 0.03)}" fill="none" stroke="#ffffff" stroke-opacity="0.07" stroke-width="1.5"/>
  <circle cx="${width * 0.12}" cy="${height * 0.86}" r="${short * 0.24}" fill="none" stroke="#ffffff" stroke-opacity="0.05" stroke-width="1.5"/>

  ${(MOTIFS[motif] ?? MOTIFS.documents)(width * 0.5, height * 0.5, short)}

  <!-- Peredup lembut di bagian bawah, memberi kedalaman -->
  <rect width="${width}" height="${height}" fill="url(#${uid('veil')})"/>

  <!-- Garis aksen kecil di sudut sebagai penanda.
       Gambar ini sengaja tidak memuat teks apa pun supaya tetap utuh ketika
       dipotong ke rasio mana pun oleh kartu yang menampilkannya. Judul dan
       keterangannya sudah ditulis oleh komponen di sebelah gambar. -->
  <rect x="${pad}" y="${height - pad}" width="${Math.round(short * 0.15)}" height="3" rx="1.5" fill="url(#${uid('rule')})"/>
</svg>
`;
}

/* ==========================================================================
 * Daftar berkas yang dibuat.
 * Menambah placeholder baru cukup dengan menambah satu baris di sini.
 * ========================================================================== */
const WIDE = { width: 960, height: 540 }; // rasio 16:9, untuk kartu Pengalaman
const SQUARE = { width: 640, height: 640 }; // rasio 1:1, untuk galeri Tentang

const ITEMS = [
  // ---- Pengalaman ----
  {
    file: 'public/images/experience/audit-mutu-internal.svg',
    ...WIDE,
    palette: 'indigo',
    motif: 'documents',
    title: 'Audit Mutu Internal',
    caption: 'UNIVERSITAS BENGKULU',
  },
  {
    file: 'public/images/experience/website-jurusan.svg',
    ...WIDE,
    palette: 'cyan',
    motif: 'network',
    title: 'Website Jurusan',
    caption: 'FISIP UNIVERSITAS BENGKULU',
  },
  {
    file: 'public/images/experience/konferensi-sdgs.svg',
    ...WIDE,
    palette: 'violet',
    motif: 'broadcast',
    title: 'Konferensi SDGs 2030',
    caption: 'DENPASAR, BALI',
  },
  {
    file: 'public/images/experience/magang-dpmd.svg',
    ...WIDE,
    palette: 'teal',
    motif: 'territory',
    title: 'Magang DPMD',
    caption: 'PROVINSI BENGKULU',
  },
  {
    file: 'public/images/experience/tracer-study.svg',
    ...WIDE,
    palette: 'rose',
    motif: 'growth',
    title: 'Tracer Study Alumni',
    caption: 'ADMINISTRASI PUBLIK',
  },
  {
    file: 'public/images/experience/laboratorium.svg',
    ...WIDE,
    palette: 'slate',
    motif: 'lab',
    title: 'Laboratorium',
    caption: 'ADMINISTRASI PUBLIK UNIB',
  },

  // ---- Galeri Tentang Saya ----
  {
    file: 'public/images/about/riset.svg',
    ...SQUARE,
    palette: 'indigo',
    motif: 'lab',
    title: 'Riset',
    caption: 'LAPANGAN & DATA',
  },
  {
    file: 'public/images/about/kolaborasi.svg',
    ...SQUARE,
    palette: 'violet',
    motif: 'community',
    title: 'Kolaborasi',
    caption: 'TIM & KOMUNITAS',
  },
  {
    file: 'public/images/about/sistem.svg',
    ...SQUARE,
    palette: 'cyan',
    motif: 'network',
    title: 'Sistem',
    caption: 'WEB & INFRASTRUKTUR',
  },
];

let count = 0;
for (const item of ITEMS) {
  const { file, ...options } = item;
  // Nama berkas dipakai sebagai awalan id di dalam SVG-nya.
  const id = file.split('/').pop().replace(/\.svg$/, '');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, buildSvg({ ...options, id }), 'utf8');
  console.log(`  ${file}  ${options.width}x${options.height}`);
  count += 1;
}

console.log(`\nSelesai. ${count} gambar placeholder dibuat.`);
console.log('Ganti dengan foto asli kapan saja, lalu perbarui field image di data/portfolio.js.');
