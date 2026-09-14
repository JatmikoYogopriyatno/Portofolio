/**
 * =============================================================================
 *  lib/markdown.js  |  Mengubah tulisan biasa menjadi halaman yang rapi
 * =============================================================================
 *
 *  Kamu menulis di panel dengan cara biasa saja. Berkas ini yang mengubahnya
 *  jadi halaman jadi. Yang perlu kamu tahu cuma tiga hal:
 *
 *    1. Baris kosong memisahkan paragraf.
 *    2. Awali baris dengan # untuk judul besar, ## untuk subjudul.
 *    3. Untuk menyisipkan berkas, tempel saja tautannya di baris sendiri.
 *
 *  Soal nomor tiga, berkas apa pun yang kamu unggah lewat panel bisa langsung
 *  ditempel tautannya, dan berkas ini yang memilihkan tampilan yang pas:
 *
 *    gambar   jpg png webp gif avif    tampil sebagai gambar
 *    video    mp4 webm mov ogv         tampil sebagai pemutar video
 *    musik    mp3 wav ogg m4a aac      tampil sebagai pemutar musik
 *    dokumen  pdf                      tampil sebagai pembaca PDF
 *    lainnya  zip docx xlsx dan lain   tampil sebagai tombol unduh
 *
 *  KEAMANAN
 *  Kode HTML mentah di dalam tulisan sengaja dibuang, tidak dijalankan. Jadi
 *  kalau suatu hari ada orang lain ikut mengelola panel, dia tidak bisa
 *  menyelipkan skrip berbahaya lewat isi tulisan.
 * =============================================================================
 */

import { Marked } from 'marked';
import { bisaDiperkecil, jenisBerkas, srcsetDiperkecil, alamatDiperkecil, LEBAR_TERBESAR } from '@/lib/berkas';

/** Membuat teks aman dipakai di dalam atribut HTML. */
function aman(teks = '') {
  return String(teks)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Menolak alamat yang bisa menjalankan kode, misalnya javascript: dan data:.
 * Yang lolos hanya alamat biasa dan berkas di dalam situs ini sendiri.
 */
function alamatAman(href = '') {
  const bersih = String(href).trim();
  if (!/^(https?:|mailto:|tel:|\/|#|\.)/i.test(bersih)) return '#';

  // Berkas di dalam situs ini disandikan supaya nama yang mengandung spasi,
  // tanda pagar, atau tanda tanya tetap ketemu. Alamat luar dibiarkan utuh
  // karena bentuknya sudah ditentukan pemiliknya.
  if (bersih.startsWith('/') && !/%[0-9a-f]{2}/i.test(bersih)) {
    return bersih.split('/').map(encodeURIComponent).join('/');
  }

  return bersih;
}

/**
 * Menyusun tag gambar untuk isi tulisan.
 *
 * Gambar milik situs ini dilewatkan pengoptimal, jadi ponsel menerima berkas
 * seukuran layarnya, bukan berkas asli yang bisa lebih dari satu megabita.
 * Ukuran aslinya dipasang di width dan height kalau diketahui, supaya tempatnya
 * sudah dipesan sebelum gambarnya datang dan tulisan di bawahnya tidak melompat.
 *
 * @param {string} href alamat asli seperti yang ditulis di panel
 * @param {string} url  alamat yang sudah disandikan dan aman
 * @param {string} teks keterangan gambar, sudah aman
 * @param {{w:number,h:number}|null} ukuran ukuran asli gambar kalau terukur
 */
function sisipkanGambar(href, url, teks, ukuran) {
  const dimensi = ukuran ? ` width="${ukuran.w}" height="${ukuran.h}"` : '';

  const sumber = bisaDiperkecil(href)
    ? ` src="${aman(alamatDiperkecil(href, LEBAR_TERBESAR))}" srcset="${aman(srcsetDiperkecil(href))}" sizes="(max-width: 768px) 100vw, 720px"`
    : ` src="${url}"`;

  return `<figure class="media-blok"><img${sumber} alt="${teks}"${dimensi} loading="lazy" decoding="async" />${
    teks ? `<figcaption>${teks}</figcaption>` : ''
  }</figure>`;
}

/**
 * Potongan HTML untuk tiap jenis berkas.
 *
 * @param {Record<string, {w:number,h:number}>} ukuran daftar ukuran asli gambar
 */
function sisipkanBerkas(href, label = '', ukuran = {}) {
  const url = aman(alamatAman(href));
  const teks = aman(label);

  switch (jenisBerkas(href)) {
    case 'gambar':
      return sisipkanGambar(href, url, teks, ukuran[href] ?? null);

    case 'video':
      /*
        preload="none", bukan "metadata".

        Dengan "metadata" sebagian peramban mengunduh berkasnya jauh lebih
        banyak daripada sekadar keterangan, kadang seluruhnya, padahal
        pembacanya belum tentu menekan putar. Untuk video puluhan megabita di
        jaringan ponsel, itu kuota yang terbuang percuma.
      */
      return `<figure class="media-blok"><video controls preload="none" playsinline>${
        `<source src="${url}" />`
      }Peramban kamu belum bisa memutar video ini.</video>${
        teks ? `<figcaption>${teks}</figcaption>` : ''
      }</figure>`;

    case 'musik':
      // Diberi baris judul beserta ikon supaya terbaca sebagai satu blok utuh,
      // bukan kendali pemutar telanjang yang melayang di tengah tulisan.
      return `<figure class="media-blok media-musik"><div class="media-musik-kepala"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg><span>${
        teks || 'Audio'
      }</span></div><audio controls preload="none" src="${url}">Peramban kamu belum bisa memutar audio ini.</audio></figure>`;

    case 'dokumen':
      // Sebagian ponsel tidak bisa menampilkan PDF di dalam halaman, jadi
      // tombol buka di tab baru selalu disediakan sebagai jalan keluar.
      return `<figure class="media-blok media-dokumen"><object data="${url}" type="application/pdf"><p>Dokumen tidak bisa ditampilkan di sini.</p></object><a class="media-unduh" href="${url}" target="_blank" rel="noopener noreferrer">${
        teks || 'Buka dokumen'
      }</a></figure>`;

    default:
      return null;
  }
}

/**
 * Aturan tampilan khusus untuk tulisan.
 *
 * Dibuat sebagai fungsi supaya tiap pemanggilan dapat salinan sendiri dan
 * tidak saling mengganggu saat beberapa halaman dibangun bersamaan.
 */
function aturan(ukuran) {
  return {
    // Kode HTML mentah dibuang, tidak ikut ditampilkan.
    html: () => '',

    /**
     * Blok media tidak boleh terbungkus paragraf. Gambar, video, dan pemutar
     * musik adalah blok utuh, dan menaruhnya di dalam paragraf menghasilkan
     * HTML yang tidak sah sehingga jaraknya jadi kacau di sebagian peramban.
     * Jadi paragraf yang memuat media dipecah dulu di sini.
     */
    paragraph({ tokens }) {
      const isi = this.parser.parseInline(tokens ?? []);
      if (!isi.includes('<figure')) return `<p>${isi}</p>\n`;

      return isi
        .split(/(<figure[\s\S]*?<\/figure>)/g)
        .map((bagian) => (bagian.startsWith('<figure') ? bagian : bagian.trim() && `<p>${bagian.trim()}</p>`))
        .filter(Boolean)
        .join('\n');
    },

    image({ href, title, text }) {
      /*
        Keterangan gambar boleh ditulis di dua tempat, dan keduanya dipakai:

          ![Keterangannya](/media/foto.jpg)
          ![](/media/foto.jpg "Keterangannya")

        Bentuk kedua yang paling sering keluar dari panel, dan dulu judulnya
        diabaikan begitu saja. Gambarnya jadi tampil tanpa keterangan sama
        sekali dan tanpa teks alternatif untuk pembaca layar.
      */
      return sisipkanBerkas(href, text || title || '', ukuran) ?? '';
    },

    link({ href, text, tokens }) {
      const isi = text || this.parser.parseInline(tokens ?? []);

      // Tautan yang berdiri sendiri dan menunjuk ke berkas media diubah
      // menjadi pemutar. Tautan di tengah kalimat dibiarkan jadi tautan biasa.
      const berkas = sisipkanBerkas(href, typeof isi === 'string' ? isi : '', ukuran);
      if (berkas && jenisBerkas(href) !== null) return berkas;

      const url = alamatAman(href);
      const keluar = /^https?:/i.test(url);
      return `<a href="${aman(url)}"${
        keluar ? ' target="_blank" rel="noopener noreferrer"' : ''
      }>${isi}</a>`;
    },
  };
}

/**
 * Membetulkan tautan yang alamatnya mengandung spasi.
 *
 * Berkas yang diunggah lewat panel memakai nama aslinya, dan nama berkas orang
 * Indonesia hampir selalu berspasi. Aturan penulisan tautan tidak mengizinkan
 * spasi di dalam alamat, jadi tautan seperti
 *
 *   ![Kota Mati](/media/NOAH - Kota Mati.mp3)
 *
 * tidak terbaca sama sekali dan malah tampil sebagai tulisan mentah. Di sini
 * alamat seperti itu dibungkus tanda kurung sudut, bentuk resmi untuk alamat
 * berspasi, sehingga tetap terbaca sebagai media.
 */
function rapikanTautan(teks) {
  return teks.replace(/(!?\[[^\]\n]*\]\()([^)\n<][^)\n]*)(\))/g, (utuh, awal, tujuan, tutup) => {
    const bersih = tujuan.trim();
    if (!bersih.includes(' ')) return utuh;
    // Bentuk (alamat "judul") sudah sah, biarkan apa adanya.
    if (/^\S+\s+["'(]/.test(bersih)) return utuh;
    return `${awal}<${bersih}>${tutup}`;
  });
}

/**
 * Mengubah tulisan menjadi HTML siap tampil.
 *
 * @param {string} teks isi tulisan apa adanya dari panel
 * @param {Record<string, {w:number,h:number}>} ukuran ukuran asli tiap gambar,
 *   dikumpulkan lebih dulu oleh lib/ukuran-gambar.js. Boleh dikosongkan, hanya
 *   saja tempat gambarnya jadi tidak dipesan lebih dulu.
 * @returns {string} HTML yang sudah aman dipakai
 */
export function renderMarkdown(teks, ukuran = {}) {
  if (typeof teks !== 'string' || teks.trim() === '') return '';

  const mesin = new Marked({ gfm: true, breaks: true });
  mesin.use({ renderer: aturan(ukuran) });

  return mesin.parse(rapikanTautan(teks));
}

/**
 * Mengumpulkan alamat semua gambar yang dipakai di dalam satu tulisan.
 * Dipakai lib/ukuran-gambar.js untuk tahu berkas mana saja yang perlu diukur.
 */
export function daftarGambar(teks) {
  if (typeof teks !== 'string') return [];
  const hasil = new Set();
  const rapi = rapikanTautan(teks);

  /*
    Dua bentuk penulisan alamat yang keduanya sah, dan judul di belakangnya
    yang boleh ada boleh tidak:

      ![](/media/foto.jpg)
      ![](</media/nama berspasi.jpg> "Judulnya")

    Judul itu bukan bagian dari alamat. Dulu ikut terbawa, akibatnya alamatnya
    tidak dikenali sebagai gambar dan ukurannya tidak pernah terukur.
  */
  const pola = /!?\[[^\]\n]*\]\(\s*(?:<([^>\n]*)>|([^)\s]+))(?:\s+["'(][^)\n]*)?\s*\)/g;

  for (const cocok of rapi.matchAll(pola)) {
    const alamat = (cocok[1] ?? cocok[2] ?? '').trim();
    if (bisaDiperkecil(alamat)) hasil.add(alamat);
  }
  return [...hasil];
}

/**
 * Membuang semua tanda baca penata supaya tersisa teksnya saja.
 * Dipakai untuk ringkasan otomatis dan hitungan waktu baca.
 */
export function teksPolos(teks) {
  if (typeof teks !== 'string') return '';
  return teks
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1') // tautan dan gambar
    .replace(/^\s{0,3}#{1,6}\s+/gm, '') // tanda judul
    .replace(/^\s{0,3}>\s?/gm, '') // tanda kutipan
    .replace(/^\s{0,3}[-*+]\s+/gm, '') // tanda daftar
    .replace(/[*_`~]/g, '') // penebalan dan sejenisnya
    .replace(/\s+/g, ' ')
    .trim();
}

/** Perkiraan waktu baca dalam menit, minimal satu menit. */
export function waktuBaca(teks) {
  const jumlahKata = teksPolos(teks).split(' ').filter(Boolean).length;
  return Math.max(1, Math.round(jumlahKata / 200));
}

/** Ringkasan otomatis dari kalimat kalimat pertama tulisan. */
export function ringkasanOtomatis(teks, panjang = 160) {
  const polos = teksPolos(teks);
  if (polos.length <= panjang) return polos;
  const potong = polos.slice(0, panjang);
  const spasi = potong.lastIndexOf(' ');
  return `${potong.slice(0, spasi > 40 ? spasi : panjang).trimEnd()}...`;
}
