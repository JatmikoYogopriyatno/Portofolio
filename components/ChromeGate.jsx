'use client';

import { usePathname } from 'next/navigation';

/**
 * ChromeGate: menyembunyikan perabot situs di halaman dokumen cetak.
 *
 * Halaman di bawah /cetak/ adalah dokumen, bukan halaman jelajah. Navbar,
 * footer, pemutar musik, dan tombol melayang tidak punya tempat di sana, baik
 * di layar maupun di atas kertas.
 *
 * Dipakai membungkus perabot itu di app/layout.js. Isi halamannya sendiri
 * tetap tampil seperti biasa.
 */
export default function ChromeGate({ children }) {
  const pathname = usePathname() ?? '';
  if (pathname.startsWith('/cetak')) return null;
  return children;
}
