'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { sandikan } from '@/lib/asset';

/**
 * =============================================================================
 *  SmartImage: satu pintu untuk semua gambar di situs ini.
 * =============================================================================
 *
 *  Tiga hal diurus otomatis di sini:
 *
 *  1. UKURAN MENYESUAIKAN PERANGKAT
 *     Foto dari kamera atau ponsel sering berukuran beberapa megabita. Tanpa
 *     penyesuaian, pengunjung dengan layar 390 piksel tetap mengunduh berkas
 *     aslinya utuh. Di sini Vercel yang memperkecil dan mengubahnya ke format
 *     modern, lalu menyimpan hasilnya untuk dipakai ulang.
 *
 *  2. GAMBAR CADANGAN
 *     Kalau berkasnya belum ada atau gagal dimuat, gambar berpindah ke
 *     fallbackSrc sehingga tampilan tidak pernah rusak.
 *
 *  3. ALAMAT DASAR
 *     Tidak perlu ditambahkan sendiri lagi. Next.js sudah mengurusnya untuk
 *     komponen gambarnya, jadi di data cukup ditulis '/media/foto.jpg'.
 *
 *  CATATAN UNTUK PENGEMBANG
 *  Setiap pemanggilan wajib memberi width dan height. Keduanya dipakai untuk
 *  memesan ruang sebelum gambarnya datang, sehingga halaman tidak melonjak
 *  saat gambar selesai dimuat.
 * =============================================================================
 */

/** Di bawah ukuran ini gambar dianggap ikon kecil, tidak perlu srcset lebar. */
const BATAS_IKON = 96;

export default function SmartImage({
  src,
  fallbackSrc = '',
  alt = '',
  className = '',
  width,
  height,
  loading = 'lazy',
  priority = false,
  sizes,
  // 75, mengikuti images.qualities di next.config.mjs. Angka di luar daftar
  // itu ditolak pengoptimal dengan galat 400 dan gambarnya hilang.
  quality = 75,
  ...rest
}) {
  const [failed, setFailed] = useState(false);

  // Coba lagi dari awal kalau alamatnya diganti lewat panel.
  useEffect(() => {
    setFailed(false);
  }, [src]);

  const active = failed && fallbackSrc ? fallbackSrc : src;
  if (!active) return null;

  /*
    Alamatnya disandikan lebih dulu.

    Berkas yang diunggah lewat panel memakai nama aslinya, dan nama itu sering
    mengandung spasi atau koma, misalnya "Jatmiko Yogopriyatno, S.IP., M.Si.jpg". Pengoptimal
    gambar mengambil berkas sumbernya lewat alamat, dan alamat berspasi membuat
    pengambilan itu gagal dengan galat 400 tanpa penjelasan. Gambarnya lalu
    hilang dari halaman.

    sandikan() melewati alamat yang sudah tersandi, jadi aman dipanggil dua kali.
  */
  const alamat = /^([a-z][a-z0-9+.-]*:|\/\/)/i.test(active) ? active : sandikan(active);

  const kecil = Number(width) > 0 && Number(width) <= BATAS_IKON;

  /*
    Petunjuk ukuran untuk peramban. Tanpa ini, peramban menganggap gambarnya
    selebar layar dan mengambil berkas terbesar yang tersedia. Nilai bawaan di
    bawah cocok untuk gambar kartu: selebar layar di ponsel, setengahnya di
    tablet, sepertiga di layar lebar. Pemanggil boleh menimpanya kalau tata
    letaknya berbeda. Ikon kecil dilewati karena berkasnya memang sudah ringan.
  */
  const petunjukUkuran =
    sizes ?? (kecil ? undefined : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw');

  return (
    <Image
      src={alamat}
      alt={alt}
      width={Number(width)}
      height={Number(height)}
      sizes={petunjukUkuran}
      quality={quality}
      // priority dipakai untuk gambar yang sudah terlihat tanpa menggulir,
      // supaya diunduh lebih dulu. Sisanya menunggu sampai mendekati layar.
      priority={priority}
      loading={priority ? undefined : loading}
      onError={() => setFailed(true)}
      className={className}
      {...rest}
    />
  );
}
