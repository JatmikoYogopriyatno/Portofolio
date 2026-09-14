'use client';

import { portfolio } from '@/data/portfolio';
import { useLanguage } from '@/components/LanguageProvider';
import SectionHeading from '@/components/SectionHeading';
import GlassCard from '@/components/GlassCard';
import Reveal from '@/components/Reveal';
import Icon from '@/components/Icon';

/**
 * Mata kuliah yang diampu.
 *
 * Bentuknya kisi kartu kecil, bukan tabel, karena tiap butirnya cuma satu
 * nama tanpa kolom pendamping. Ditabelkan, isinya jadi satu kolom panjang
 * dengan ruang kosong di sebelah kanannya.
 */
export default function Mengajar() {
  const { t } = useLanguage();
  const { mengajar, sections, identitas } = portfolio;

  if (mengajar.length === 0) return null;

  const lulusan = identitas?.lulusan ?? {};
  const angka = [
    lulusan.d3 && lulusan.d3 !== '-' ? `D3: ${lulusan.d3}` : null,
    lulusan.s1 && lulusan.s1 !== '-' ? `S1: ${lulusan.s1}` : null,
    lulusan.s2 && lulusan.s2 !== '-' ? `S2: ${lulusan.s2}` : null,
  ].filter(Boolean);

  return (
    <section id="mengajar" className="scroll-mt-28 px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow={t(sections.mengajar.eyebrow)}
          title={t(sections.mengajar.title)}
          subtitle={t(sections.mengajar.subtitle)}
        />

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {mengajar.map((item, i) => (
            <Reveal key={item.nama} delay={Math.min(i * 40, 240)} className="h-full">
              <GlassCard className="flex h-full items-start gap-3 p-4">
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-accent/10 text-[0.7rem] font-semibold tabular-nums text-accent">
                  {i + 1}
                </span>
                <span className="text-sm font-medium leading-snug text-fg">{item.nama}</span>
              </GlassCard>
            </Reveal>
          ))}
        </div>

        {/* Jumlah lulusan yang dibimbing. Angkanya diisi di panel, menu
            Identitas Akademik, dan baris ini hilang sendiri kalau dikosongkan. */}
        {angka.length > 0 ? (
          <Reveal className="mt-6">
            <p className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-line bg-surface px-4 py-3 text-sm text-muted">
              <Icon name="graduation-cap" className="h-4 w-4 shrink-0 text-accent" />
              <span className="font-medium text-fg">
                {t({ id: 'Lulusan yang telah dihasilkan', en: 'Graduates supervised' })}:
              </span>
              <span className="tabular-nums">{angka.join(' · ')}</span>
            </p>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
