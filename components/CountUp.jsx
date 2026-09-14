'use client';

import { useEffect, useRef, useState } from 'react';
import { portfolio } from '@/data/portfolio';

/**
 * CountUp: menghitung angka naik dari nol saat elemennya masuk layar.
 *
 * Nilai di data ditulis apa adanya, misalnya '3.84', '16+', atau '9'. Komponen
 * ini memisahkan sendiri bagian angkanya, menganimasikan angka itu, lalu
 * memasang kembali awalan dan akhiran seperti tanda plus.
 *
 * Angka tetap tampil utuh kalau JavaScript belum jalan, kalau pengunjung
 * mengaktifkan "kurangi gerakan", atau kalau appearance.countUpStats
 * di data/portfolio.js diisi false.
 */
export default function CountUp({ value, duration = 1400, className = '' }) {
  const raw = String(value ?? '');
  // Pisahkan '16+' menjadi awalan '', angka '16', akhiran '+'.
  const match = raw.match(/^(\D*)([\d.,]+)(\D*)$/);
  const enabled = portfolio.appearance?.countUpStats !== false && match !== null;

  const [display, setDisplay] = useState(raw);
  const nodeRef = useRef(null);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const node = nodeRef.current;
    if (!node) return;

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') return;

    const [, prefix, numberText, suffix] = match;
    // Angka Indonesia memakai koma sebagai pemisah desimal.
    const usesComma = numberText.includes(',');
    const target = Number(numberText.replace(',', '.'));
    if (!Number.isFinite(target)) return;

    const decimals = (numberText.split(/[.,]/)[1] ?? '').length;

    const format = (n) => {
      const fixed = n.toFixed(decimals);
      return `${prefix}${usesComma ? fixed.replace('.', ',') : fixed}${suffix}`;
    };

    const run = () => {
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        // Perlambatan di akhir supaya terasa halus, bukan berhenti mendadak.
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(format(target * eased));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !doneRef.current) {
            doneRef.current = true;
            setDisplay(format(0));
            run();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled, match, duration]);

  return (
    <span ref={nodeRef} className={className}>
      {display}
    </span>
  );
}
