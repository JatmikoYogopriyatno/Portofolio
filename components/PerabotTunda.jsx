'use client';

import dynamic from 'next/dynamic';

/**
 * PerabotTunda: memuat dua perabot yang tidak dibutuhkan saat halaman pertama
 * tampil, yaitu pencarian cepat Ctrl+K dan pemutar musik.
 *
 * Keduanya baru berguna setelah pengunjung melakukan sesuatu, jadi kodenya
 * dipisah ke berkas tersendiri dan diambil setelah halaman selesai dipasang.
 * Pengunjung dengan jaringan lambat jadi tidak perlu menunggu keduanya hanya
 * untuk bisa membaca isi halaman.
 *
 * Pintasan Ctrl+K tetap bekerja. Pendengarnya terpasang beberapa saat setelah
 * halaman siap, dan jeda itu tidak terasa dalam pemakaian sehari hari.
 *
 * ssr: false dipakai karena keduanya murni interaksi di sisi pengunjung dan
 * tidak menyumbang apa pun pada tampilan awal.
 */
const MusicPlayer = dynamic(() => import('@/components/MusicPlayer'), { ssr: false });
const CommandPalette = dynamic(() => import('@/components/CommandPalette'), { ssr: false });

export default function PerabotTunda({ posts = [] }) {
  return (
    <>
      <MusicPlayer />
      <CommandPalette posts={posts} />
    </>
  );
}
