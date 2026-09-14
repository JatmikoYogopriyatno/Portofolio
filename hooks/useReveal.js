'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Scroll-reveal ringan dengan IntersectionObserver (tanpa library animasi).
 *
 * Pemakaian:
 *   const { ref, revealed } = useReveal();
 *   <div ref={ref} className={revealed ? 'reveal is-visible' : 'reveal'}>...</div>
 *
 * SATU PENGAMAT UNTUK SELURUH HALAMAN
 * Beranda memakai hook ini di puluhan tempat. Dulu tiap pemakaian membuat
 * IntersectionObserver-nya sendiri, jadi ada puluhan pengamat yang semuanya
 * dibangunkan peramban pada gulir yang sama. Sekarang semuanya menumpang satu
 * pengamat bersama: elemen yang mendaftar dimasukkan ke pengamat itu, dan
 * dilepas lagi begitu sudah tampil. Perilakunya sama persis, kerjanya jauh
 * lebih sedikit.
 *
 * Catatan aksesibilitas: kalau pengguna mengaktifkan "reduce motion", elemen
 * langsung ditandai terlihat sehingga tidak ada animasi sama sekali.
 *
 * @param {{ threshold?: number, rootMargin?: string, once?: boolean }} options
 */

/**
 * Pengamat bersama, satu per kombinasi pengaturan. Hampir semua pemakaian
 * memakai pengaturan bawaan, jadi pada praktiknya cuma ada satu pengamat.
 */
const pengamat = new Map();

/** Elemen yang sedang diamati beserta fungsi yang harus dipanggil. */
const pendaftar = new WeakMap();

function ambilPengamat(kunci, threshold, rootMargin) {
  const ada = pengamat.get(kunci);
  if (ada) return ada;

  const baru = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const catat = pendaftar.get(entry.target);
        if (catat) catat(entry.isIntersecting);
      }
    },
    { threshold, rootMargin }
  );

  pengamat.set(kunci, baru);
  return baru;
}

export function useReveal({ threshold = 0.15, rootMargin = '0px 0px -10% 0px', once = true } = {}) {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Hormati preferensi sistem: tanpa animasi, langsung tampil.
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      setRevealed(true);
      return;
    }

    const kunci = `${threshold}|${rootMargin}`;
    const observer = ambilPengamat(kunci, threshold, rootMargin);

    pendaftar.set(node, (terlihat) => {
      if (terlihat) {
        setRevealed(true);
        if (once) {
          observer.unobserve(node);
          pendaftar.delete(node);
        }
      } else if (!once) {
        setRevealed(false);
      }
    });

    observer.observe(node);

    return () => {
      observer.unobserve(node);
      pendaftar.delete(node);
    };
  }, [threshold, rootMargin, once]);

  return { ref, revealed };
}

export default useReveal;
