'use client';

import { useEffect, useRef } from 'react';
import { portfolio } from '@/data/portfolio';
import { berlangganGulir } from '@/hooks/useGulir';

/**
 * ScrollProgress: garis tipis bergradien di tepi paling atas layar yang
 * memanjang seiring pengunjung menggulir halaman.
 *
 * Ditulis langsung ke gaya elemen lewat requestAnimationFrame, jadi tidak ada
 * re-render React sama sekali saat menggulir.
 *
 * Matikan lewat appearance.scrollProgress di data/portfolio.js.
 */
export default function ScrollProgress() {
  const barRef = useRef(null);
  const enabled = portfolio.appearance?.scrollProgress !== false;

  useEffect(() => {
    if (!enabled) return;

    // Menumpang pendengar gulir bersama, yang sudah dibatasi satu kali per
    // bingkai gambar. Lihat hooks/useGulir.js
    const update = (y) => {
      const bar = barRef.current;
      if (!bar) return;

      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = scrollable > 0 ? Math.min(1, Math.max(0, y / scrollable)) : 0;

      bar.style.transform = `scaleX(${ratio})`;
      bar.style.opacity = ratio > 0.005 ? '1' : '0';
    };

    update(window.scrollY);
    return berlangganGulir(update);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      className="scroll-progress"
      style={{ transform: 'scaleX(0)', opacity: 0, transition: 'opacity 0.3s ease' }}
    />
  );
}
