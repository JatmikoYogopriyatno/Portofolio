/**
 * Kunci penyimpanan pilihan tema di localStorage.
 *
 * Ditaruh di file netral (bukan komponen client) supaya nilainya bisa dibaca
 * dari dua tempat sekaligus: skrip anti-kedip di app/layout.js yang berjalan
 * di server, dan ThemeProvider yang berjalan di browser.
 */
export const THEME_STORAGE_KEY = 'portfolio-theme';
