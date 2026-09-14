'use client';

import { useEffect, useState } from 'react';

/**
 * =============================================================================
 *  useGulir: satu pendengar gulir untuk seluruh situs
 * =============================================================================
 *
 *  Tiga bagian halaman perlu tahu posisi gulir: navbar yang memendek, tombol
 *  kembali ke atas, dan garis kemajuan di tepi layar. Dulu ketiganya memasang
 *  pendengar sendiri sendiri, dan peramban memanggil ketiganya berkali kali
 *  dalam satu kali sentuhan gulir.
 *
 *  Sekarang hanya ada satu pendengar untuk seluruh halaman, dan isinya dijalankan
 *  paling banyak sekali per bingkai gambar lewat requestAnimationFrame. Menggulir
 *  jadi tidak lagi menumpuk pekerjaan yang hasilnya toh dibuang.
 * =============================================================================
 */

const pelanggan = new Set();
let terpasang = false;
let bingkai = 0;

function jalankan() {
  bingkai = 0;
  const y = window.scrollY;
  for (const beritahu of pelanggan) beritahu(y);
}

function minta() {
  if (bingkai) return;
  bingkai = requestAnimationFrame(jalankan);
}

/**
 * Mendaftarkan satu fungsi untuk dipanggil tiap kali halaman digulir.
 * @param {(y: number) => void} beritahu
 * @returns {() => void} panggil untuk berhenti berlangganan
 */
export function berlangganGulir(beritahu) {
  pelanggan.add(beritahu);

  if (!terpasang) {
    terpasang = true;
    window.addEventListener('scroll', minta, { passive: true });
    window.addEventListener('resize', minta, { passive: true });
  }

  return () => {
    pelanggan.delete(beritahu);
    if (pelanggan.size === 0) {
      terpasang = false;
      window.removeEventListener('scroll', minta);
      window.removeEventListener('resize', minta);
      if (bingkai) cancelAnimationFrame(bingkai);
      bingkai = 0;
    }
  };
}

/**
 * true kalau halaman sudah digulir melewati ambang tertentu.
 *
 * @param {number} piksel ambang dalam piksel, dihitung dari puncak halaman
 * @param {number} rasioLayar tambahan ambang sebagai kelipatan tinggi layar,
 *   misalnya 0.9 berarti hampir satu layar penuh
 */
export function useAmbangGulir(piksel = 0, rasioLayar = 0) {
  const [lewat, setLewat] = useState(false);

  useEffect(() => {
    const periksa = (y) => setLewat(y > piksel + window.innerHeight * rasioLayar);
    periksa(window.scrollY);
    return berlangganGulir(periksa);
  }, [piksel, rasioLayar]);

  return lewat;
}

export default useAmbangGulir;
