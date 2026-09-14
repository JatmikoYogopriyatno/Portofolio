/** Fungsi pembantu untuk memformat tanggal dan menghitung lama baca. */

/**
 * Ubah '2026-07-14' menjadi '14 Juli 2026' atau '14 July 2026'.
 * Memakai locale tetap supaya hasil di server dan browser selalu sama.
 */
export function formatDate(value, lang = 'id') {
  if (!value) return '';
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat(lang === 'id' ? 'id-ID' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

// Perkiraan lama baca sekarang dihitung di lib/markdown.js lewat waktuBaca(),
// dan sudah tersedia di setiap tulisan sebagai post.readingTime.
