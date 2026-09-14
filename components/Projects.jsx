'use client';

import { useMemo, useState } from 'react';
import { portfolio } from '@/data/portfolio';
import { useLanguage } from '@/components/LanguageProvider';
import SectionHeading from '@/components/SectionHeading';
import ProjectCard from '@/components/ProjectCard';
import Reveal from '@/components/Reveal';

/**
 * Projects: grid responsif dengan filter tag.
 * Daftar tombol filter dibangun otomatis dari field `tags` setiap proyek,
 * jadi menambah proyek dengan tag baru langsung menambah tombolnya.
 */
export default function Projects() {
  const { t } = useLanguage();
  const { projects, sections, ui } = portfolio;
  const [activeTag, setActiveTag] = useState('__all__');

  const tags = useMemo(() => {
    const unique = [];
    projects.forEach((project) => {
      (project.tags ?? []).forEach((tag) => {
        if (!unique.includes(tag)) unique.push(tag);
      });
    });
    return unique;
  }, [projects]);

  const visibleProjects = useMemo(
    () =>
      activeTag === '__all__'
        ? projects
        : projects.filter((project) => (project.tags ?? []).includes(activeTag)),
    [projects, activeTag]
  );

  if (projects.length === 0) return null;

  const filterButtonClass = (value) =>
    [
      'rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200',
      activeTag === value
        ? 'border-transparent bg-linear-to-r from-accent-1 to-accent-2 text-white'
        : 'border-line bg-surface text-muted hover:border-line-strong hover:text-fg',
    ].join(' ');

  return (
    <section id="projects" className="scroll-mt-28 px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow={t(sections.projects.eyebrow)}
          title={t(sections.projects.title)}
          subtitle={t(sections.projects.subtitle)}
        />

        {tags.length > 1 ? (
          <Reveal delay={60}>
            <div role="group" aria-label={t(ui.filterLabel)} className="mt-8 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveTag('__all__')}
                className={filterButtonClass('__all__')}
                aria-pressed={activeTag === '__all__'}
              >
                {t(ui.allTag)}
              </button>
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveTag(tag)}
                  className={filterButtonClass(tag)}
                  aria-pressed={activeTag === tag}
                >
                  {tag}
                </button>
              ))}
            </div>
          </Reveal>
        ) : null}

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProjects.map((project, index) => (
            <Reveal key={project.name} delay={Math.min(index * 70, 280)} className="h-full">
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
