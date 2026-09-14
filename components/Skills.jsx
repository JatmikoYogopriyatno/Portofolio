'use client';

import { portfolio } from '@/data/portfolio';
import { useLanguage } from '@/components/LanguageProvider';
import SectionHeading from '@/components/SectionHeading';
import GlassCard from '@/components/GlassCard';
import Reveal from '@/components/Reveal';
import Icon from '@/components/Icon';

/** Skills: kelompok keahlian dalam kartu kaca, tiap item jadi chip. */
export default function Skills() {
  const { t } = useLanguage();
  const { skills, sections } = portfolio;
  const groups = skills?.groups ?? [];

  if (groups.length === 0) return null;

  return (
    <section id="skills" className="scroll-mt-28 px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow={t(sections.skills.eyebrow)}
          title={t(sections.skills.title)}
          subtitle={t(sections.skills.subtitle)}
        />

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {groups.map((group, index) => (
            <Reveal key={t(group.title)} delay={Math.min(index * 70, 280)} className="h-full">
              <GlassCard className="h-full p-6">
                <h3 className="flex items-center gap-2.5 text-sm font-semibold text-fg">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-linear-to-br from-accent-1 to-accent-2 text-white">
                    <Icon name={group.icon} className="h-4 w-4" />
                  </span>
                  {t(group.title)}
                </h3>

                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li key={item} className="chip">
                      {item}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
