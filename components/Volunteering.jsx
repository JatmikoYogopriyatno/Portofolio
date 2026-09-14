'use client';

import { portfolio } from '@/data/portfolio';
import { useLanguage } from '@/components/LanguageProvider';
import SectionHeading from '@/components/SectionHeading';
import GlassCard from '@/components/GlassCard';
import SmartImage from '@/components/SmartImage';
import Reveal from '@/components/Reveal';
import Icon from '@/components/Icon';

/** Volunteering: kegiatan sukarela, hilang otomatis kalau array kosong. */
export default function Volunteering() {
  const { t } = useLanguage();
  const { volunteering, sections } = portfolio;

  if (volunteering.length === 0) return null;

  return (
    <section id="volunteering" className="scroll-mt-28 px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow={t(sections.volunteering.eyebrow)}
          title={t(sections.volunteering.title)}
          subtitle={t(sections.volunteering.subtitle)}
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {volunteering.map((item, index) => (
            <Reveal key={`${t(item.role)}-${item.period}`} delay={Math.min(index * 80, 240)} className="h-full">
              <GlassCard className="flex h-full flex-col overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-linear-to-br from-accent-2 to-accent-1 text-white">
                      <Icon name="heart" className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-[1.0625rem] font-semibold leading-snug text-fg">{t(item.role)}</h3>
                      <p className="mt-1 text-sm text-accent">{t(item.org)}</p>
                      <span className="chip mt-3">{item.period}</span>
                    </div>
                  </div>

                  {t(item.description) ? (
                    <p className="mt-4 text-body-sm text-muted">{t(item.description)}</p>
                  ) : null}
                </div>

                {item.image ? (
                  <SmartImage
                    src={item.image}
                    alt={t(item.imageAlt) || t(item.role)}
                    width={800}
                    height={450}
                    className="mt-auto aspect-16/9 w-full border-t border-line object-cover"
                  />
                ) : null}
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
