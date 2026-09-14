'use client';

import { portfolio } from '@/data/portfolio';
import { useLanguage } from '@/components/LanguageProvider';
import SectionHeading from '@/components/SectionHeading';
import ExperienceCard from '@/components/ExperienceCard';
import Reveal from '@/components/Reveal';

/** Experience: timeline vertikal. Hilang otomatis kalau array-nya kosong. */
export default function Experience() {
  const { t } = useLanguage();
  const { experience, sections } = portfolio;

  if (experience.length === 0) return null;

  return (
    <section id="experience" className="scroll-mt-28 px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow={t(sections.experience.eyebrow)}
          title={t(sections.experience.title)}
          subtitle={t(sections.experience.subtitle)}
        />

        <ol className="relative mt-10 space-y-5 sm:space-y-6 sm:pl-10">
          {/* Garis vertikal timeline, disembunyikan di layar kecil. */}
          <span
            aria-hidden="true"
            className="absolute left-[13px] top-2 hidden h-[calc(100%-1rem)] w-px bg-linear-to-b from-accent-2 via-line-strong to-transparent sm:block"
          />

          {experience.map((item, index) => (
            <li key={`${t(item.role)}-${t(item.period)}`} className="relative">
              <span
                aria-hidden="true"
                className={`absolute -left-10 top-6 hidden h-3 w-3 rounded-full border-2 sm:block ${
                  item.highlight
                    ? 'border-accent-2 bg-accent-2 shadow-[0_0_16px_2px_var(--accent-2)]'
                    : 'border-line-strong bg-bg'
                }`}
                style={{ marginLeft: '7px' }}
              />
              <Reveal delay={Math.min(index * 60, 240)}>
                <ExperienceCard item={item} />
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
