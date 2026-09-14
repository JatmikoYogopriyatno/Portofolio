'use client';

import Reveal from '@/components/Reveal';

/**
 * Judul section standar: label kecil di atas, judul besar, lalu subjudul.
 * Semua teksnya diambil dari portfolio.sections di data/portfolio.js.
 */
export default function SectionHeading({ eyebrow, title, subtitle, align = 'left' }) {
  const alignment = align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left';

  return (
    <Reveal className={`flex flex-col gap-3 ${alignment} max-w-2xl`}>
      {eyebrow ? (
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          <span aria-hidden="true" className="h-px w-6 bg-accent/60" />
          {eyebrow}
        </span>
      ) : null}

      <h2 className="text-[2.1rem] font-bold leading-[1.12] text-fg sm:text-[2.6rem]">{title}</h2>

      {subtitle ? <p className="max-w-xl text-[1.0625rem] leading-relaxed text-subtle">{subtitle}</p> : null}
    </Reveal>
  );
}
