/**
 * Menambahkan basePath ke path aset statis di folder public/.
 *
 * Dibutuhkan karena tag <img>, <a href="/file.pdf">, dan sejenisnya TIDAK
 * otomatis diberi prefix oleh Next.js saat `basePath` aktif (berbeda dengan
 * komponen <Link> dan next/font yang sudah otomatis).
 *
 *   withBasePath('/images/avatar.svg')
 *     -> '/images/avatar.svg'            (lokal, NEXT_PUBLIC_BASE_PATH kosong)
 *     -> '/Portofolio/images/avatar.svg' (GitHub Pages project page)
 */

// Dibaca saat build; Next.js meng-inline nilainya ke bundle client.
const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/+$/, '');

/**
 * Menyandikan nama berkas supaya aman dipakai sebagai alamat.
 *
 * Berkas yang diunggah lewat panel memakai nama aslinya, dan nama itu sering
 * mengandung spasi. Peramban biasanya memaafkan spasi, tetapi tidak dengan
 * tanda pagar dan tanda tanya: keduanya dianggap penanda khusus di dalam
 * alamat, sehingga berkasnya jadi tidak ketemu tanpa pesan kesalahan apa pun.
 *
 * Tiap ruas dipisah dulu agar garis miring pemisah folder tidak ikut tersandi.
 */
export function sandikan(path) {
  // Path yang sudah tersandi dibiarkan, supaya tidak tersandi dua kali.
  if (/%[0-9a-f]{2}/i.test(path)) return path;
  return path.split('/').map(encodeURIComponent).join('/');
}

/**
 * @param {string} path Path relatif terhadap folder public/, diawali "/".
 * @returns {string} Path final yang aman dipakai di src/href.
 */
export function withBasePath(path) {
  if (!path) return '';
  // URL absolut, mailto:, tel:, dan data URI dibiarkan apa adanya.
  if (/^([a-z][a-z0-9+.-]*:|\/\/)/i.test(path)) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_PATH}${sandikan(normalized)}`;
}

/** Base path mentah, dipakai untuk membangun URL kanonik. */
export const basePath = BASE_PATH;
