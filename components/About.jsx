'use client';

import { portfolio } from '@/data/portfolio';
import { useLanguage } from '@/components/LanguageProvider';
import GlassCard from '@/components/GlassCard';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';
import CountUp from '@/components/CountUp';
import AboutGallery from '@/components/AboutGallery';
import Icon from '@/components/Icon';

/**
 * About: ringkasan naratif, strip statistik, dan daftar bahasa.
 * Paragrafnya diambil dari profile.summaryId atau summaryEn sesuai bahasa aktif.
 */
export default function About() {
  const { lang, t } = useLanguage();
  const { profile, stats, languages, sections, ui } = portfolio;

  const paragraphs = lang === 'id' ? profile.summaryId : profile.summaryEn;
  if (!paragraphs || paragraphs.length === 0) return null;

  return (
    <section id="about" className="scroll-mt-28 px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow={t(sections.about.eyebrow)}
          title={t(sections.about.title)}
          subtitle={t(sections.about.subtitle)}
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <Reveal>
            <GlassCard className="h-full p-6 sm:p-8">
              <Icon name="quote" className="mb-4 h-7 w-7 text-accent opacity-70" />
              <div className="space-y-4">
                {paragraphs.map((paragraph, index) => (
                  <p key={index} className="text-body text-muted">
                    {paragraph}
                  </p>
                ))}
              </div>
            </GlassCard>
          </Reveal>

          <div className="flex flex-col gap-6">
            {stats.length > 0 ? (
              <Reveal delay={80}>
                <div className="grid grid-cols-2 gap-3">
                  {stats.map((stat) => (
                    <GlassCard key={t(stat.label)} className="p-4 text-center sm:p-5">
                      {stat.icon ? (
                        <Icon name={stat.icon} className="mx-auto mb-2 h-4 w-4 text-accent" />
                      ) : null}
                      <p className="bg-linear-to-br from-accent-1 to-accent-2 bg-clip-text text-2xl font-bold text-transparent tabular-nums sm:text-3xl">
                        <CountUp value={stat.value} />
                      </p>
                      <p className="mt-1 text-xs leading-snug text-subtle">{t(stat.label)}</p>
                    </GlassCard>
                  ))}
                </div>
              </Reveal>
            ) : null}

            {/* Kartu bahasa sengaja tidak dipaksa setinggi kolom kiri. Kartu
                yang menyesuaikan isinya terlihat lebih rapi daripada kartu
                tinggi dengan ruang kosong di bawah. */}
            {languages.length > 0 ? (
              <Reveal delay={140}>
                <GlassCard className="p-6">
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-fg">
                    <Icon name="languages" className="h-4 w-4 text-accent" />
                    {t(ui.languagesTitle)}
                  </h3>
                  <ul className="space-y-3">
                    {languages.map((language) => (
                      <li key={t(language.name)} className="flex items-center justify-between gap-3">
                        <span className="text-sm text-muted">{t(language.name)}</span>
                        <span className="chip shrink-0">{t(language.level)}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </Reveal>
            ) : null}
          </div>
        </div>

        {/* Strip gambar kegiatan, isinya dari profile.gallery. */}
        <AboutGallery />
      </div>
    </section>
  );
}
