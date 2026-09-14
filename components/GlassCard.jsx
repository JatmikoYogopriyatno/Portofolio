'use client';

import { useCallback } from 'react';
import { portfolio } from '@/data/portfolio';

/**
 * GlassCard: satu-satunya primitif permukaan kaca yang dipakai semua kartu.
 *
 * Props:
 *  - as        elemen HTML pembungkus (default 'div'), misalnya 'article' atau 'li'
 *  - hover     efek angkat dan glow saat kursor di atas kartu
 *  - featured  border gradien beranimasi untuk kartu unggulan
 *  - spotlight sorotan lembut yang mengikuti kursor di dalam kartu
 *  - className utility Tailwind tambahan untuk padding dan layout
 *
 * Sorotan kursor bisa dimatikan seluruh situs lewat appearance.spotlight
 * di data/portfolio.js.
 */
export default function GlassCard({
  as: Tag = 'div',
  hover = true,
  featured = false,
  spotlight = true,
  className = '',
  children,
  ...rest
}) {
  const spotlightOn = spotlight && portfolio.appearance?.spotlight !== false;

  // Kirim posisi kursor ke CSS lewat dua variabel. Murah, tanpa re-render React.
  const handlePointerMove = useCallback(
    (event) => {
      if (!spotlightOn) return;
      const rect = event.currentTarget.getBoundingClientRect();
      event.currentTarget.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
      event.currentTarget.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
    },
    [spotlightOn]
  );

  const classes = [
    'glass',
    hover ? 'glass-hover' : '',
    featured ? 'glass-featured' : '',
    spotlightOn ? 'glass-spotlight' : '',
    'rounded-2xl',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag className={classes} onPointerMove={spotlightOn ? handlePointerMove : undefined} {...rest}>
      {children}
    </Tag>
  );
}
