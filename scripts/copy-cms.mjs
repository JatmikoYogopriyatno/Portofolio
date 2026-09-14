/**
 * =============================================================================
 *  scripts/copy-cms.mjs
 * =============================================================================
 *
 *  Menyalin berkas panel konten dari node_modules ke public/admin/ supaya
 *  panelnya disajikan dari domain sendiri, bukan dari CDN pihak ketiga.
 *
 *  Dijalankan otomatis sebelum `npm run dev` dan `npm run build` lewat script
 *  predev dan prebuild di package.json, jadi tidak perlu diingat manual.
 *
 *  Hasil salinannya tidak ikut masuk ke Git (lihat .gitignore) karena selalu
 *  bisa dibuat ulang dari dependency yang versinya sudah dikunci.
 * =============================================================================
 */

import { copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const TARGET_DIR = path.join(process.cwd(), 'public', 'admin');
const TARGET_FILE = path.join(TARGET_DIR, 'sveltia-cms.js');

let sourceFile = null;

try {
  // Entry point resmi paketnya mengarah ke dist/sveltia-cms.mjs, yaitu build
  // pustaka yang perlu dinyalakan manual. Yang kita butuhkan build klasik di
  // folder yang sama, karena versi itu menyalakan dirinya sendiri begitu
  // dimuat lewat tag <script> biasa.
  const entry = fileURLToPath(import.meta.resolve('@sveltia/cms'));
  sourceFile = path.join(path.dirname(entry), 'sveltia-cms.js');
} catch {
  // Cadangan untuk versi Node yang belum punya import.meta.resolve.
  const guess = path.join(process.cwd(), 'node_modules', '@sveltia', 'cms', 'dist', 'sveltia-cms.js');
  if (existsSync(guess)) sourceFile = guess;
}

if (!sourceFile || !existsSync(sourceFile)) {
  console.warn(
    '[panel konten] Berkas @sveltia/cms tidak ditemukan. Jalankan npm install lebih dulu.\n' +
      '               Situsnya tetap bisa dibangun, hanya halaman /admin yang belum bisa dibuka.'
  );
  process.exit(0);
}

mkdirSync(TARGET_DIR, { recursive: true });
copyFileSync(sourceFile, TARGET_FILE);

const sizeKb = (statSync(TARGET_FILE).size / 1024).toFixed(0);
console.log(`[panel konten] public/admin/sveltia-cms.js siap (${sizeKb} KB)`);
