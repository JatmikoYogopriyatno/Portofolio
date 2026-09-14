/**
 * =============================================================================
 *  lib/audio-tunggal.js  |  CUMA SATU SUARA DALAM SATU WAKTU
 * =============================================================================
 *
 *  Situs ini punya lebih dari satu sumber suara:
 *
 *    - pemutar musik kecil di pojok kiri bawah, ada di semua halaman
 *    - pemutar audio pendamping di bawah judul tulisan blog
 *    - video yang disisipkan ke dalam tulisan atau galeri
 *
 *  Sejak audio pendamping bisa berbunyi sendiri saat tulisan dibuka, ketiganya
 *  berpeluang berbunyi bersamaan. Dua lagu sekaligus itu bukan cuma berisik,
 *  tapi juga membuat pembaca panik mencari mana yang harus dimatikan.
 *
 *  Aturannya sederhana: yang paling terakhir ditekan yang menang, sisanya
 *  dijeda. Bukan dihentikan, jadi posisinya tetap tersimpan dan pengunjung
 *  bisa melanjutkan dari tempat yang sama.
 * =============================================================================
 */

/**
 * Menjeda semua audio dan video lain yang sedang berbunyi.
 *
 * Dipanggil dari onPlay tiap pemutar, bukan dari tombolnya. Lewat onPlay,
 * suara yang mulai sendiri pun ikut terjaring, bukan cuma yang ditekan orang.
 *
 * @param {HTMLMediaElement|null} yangMenang pemutar yang boleh terus berbunyi
 */
export function jedakanYangLain(yangMenang) {
  if (typeof document === 'undefined') return;

  for (const media of document.querySelectorAll('audio, video')) {
    if (media !== yangMenang && !media.paused) media.pause();
  }
}

/**
 * Memeriksa apakah sudah ada suara lain yang berbunyi.
 *
 * Dipakai sebelum memutar sendiri. Kalau pengunjung sudah sengaja menyalakan
 * musik di pemutar pojok, tulisan yang baru dibuka tidak boleh merebutnya.
 *
 * @param {HTMLMediaElement|null} kecuali pemutar yang sedang bertanya
 * @returns {boolean}
 */
export function adaSuaraLain(kecuali) {
  if (typeof document === 'undefined') return false;

  for (const media of document.querySelectorAll('audio, video')) {
    if (media !== kecuali && !media.paused && media.currentTime > 0) return true;
  }

  return false;
}
