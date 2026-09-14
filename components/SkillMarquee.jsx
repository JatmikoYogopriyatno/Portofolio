'use client';

import { useMemo } from 'react';
import { portfolio } from '@/data/portfolio';

/**
 * SkillMarquee: satu baris keahlian yang bergeser pelan tanpa henti, dengan
 * tepi kiri dan kanan yang memudar.
 *
 * Daftarnya diambil otomatis dari portfolio.skills.groups, jadi tidak ada data
 * baru yang perlu diisi. Menambah keahlian di sana langsung menambahnya di sini.
 *
 * Isinya digandakan dua kali supaya perulangannya mulus. Salinan kedua ditandai
 * aria-hidden agar pembaca layar tidak membacanya dua kali.
 *
 * Matikan lewat appearance.heroMarquee di data/portfolio.js. Animasinya juga
 * berhenti sendiri untuk pengunjung yang mengaktifkan "kurangi gerakan".
 */
export default function SkillMarquee({ speed = 46 }) {
  const enabled = portfolio.appearance?.heroMarquee !== false;

  // Ambil beberapa keahlian dari tiap grup supaya isinya beragam, bukan
  // hanya menumpuk dari satu kategori saja.
  const items = useMemo(() => {
    const groups = portfolio.skills?.groups ?? [];
    const picked = [];
    const perGroup = 4;

    for (let index = 0; index < perGroup; index += 1) {
      groups.forEach((group) => {
        const item = group.items?.[index];
        if (item && !picked.includes(item)) picked.push(item);
      });
    }

    return picked;
  }, []);

  if (!enabled || items.length === 0) return null;

  const row = (hidden) => (
    <ul
      aria-hidden={hidden ? 'true' : undefined}
      className="flex shrink-0 items-center gap-2.5 pr-2.5"
    >
      {items.map((item) => (
        <li key={`${hidden ? 'copy' : 'main'}-${item}`} className="chip whitespace-nowrap">
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    <div
      data-print="hide"
      className="relative w-full overflow-hidden"
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
      }}
    >
      <div
        className="flex w-max"
        style={{ animation: `marquee ${speed}s linear infinite` }}
      >
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
