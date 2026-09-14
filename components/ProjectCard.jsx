'use client';

import { portfolio } from '@/data/portfolio';
import { useLanguage } from '@/components/LanguageProvider';
import GlassCard from '@/components/GlassCard';
import SmartImage from '@/components/SmartImage';
import Icon from '@/components/Icon';

/**
 * ProjectCard: satu kartu proyek.
 *  - `project.image` diisi, gambar dari public/ dipakai sebagai sampul.
 *  - `project.image` null, kartu memakai latar gradien plus inisial nama proyek.
 *  - `project.links` kosong, baris tombol tidak dirender sama sekali.
 */
export default function ProjectCard({ project }) {
  const { t } = useLanguage();

  const initials = project.name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();

  return (
    <GlassCard as="article" featured={project.featured} className="flex h-full flex-col overflow-hidden">
      {/* Sampul */}
      <div className="relative aspect-16/10 w-full overflow-hidden border-b border-line">
        {project.image ? (
          <SmartImage
            src={project.image}
            alt={t(project.imageAlt) || `${project.name}, ${t(project.org)}`}
            width={800}
            height={500}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div
            aria-hidden="true"
            className="grid h-full w-full place-items-center bg-linear-to-br from-accent-1/40 via-accent-2/25 to-accent-3/30"
          >
            <span className="text-4xl font-bold tracking-tight text-fg opacity-80">{initials}</span>
          </div>
        )}
        <span className="glass absolute right-3 top-3 rounded-full px-2.5 py-1 text-[0.7rem] font-medium text-muted">
          {project.period}
        </span>
      </div>

      {/* Isi kartu */}
      <div className="flex grow flex-col p-5">
        <h3 className="text-lg font-semibold leading-snug text-fg">{project.name}</h3>
        {project.org ? <p className="mt-1 text-meta text-accent">{t(project.org)}</p> : null}

        <p className="mt-3 grow text-body-sm text-muted">{t(project.description)}</p>

        {project.tags?.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li key={tag} className="chip">
                {tag}
              </li>
            ))}
          </ul>
        ) : null}

        {project.links?.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-4">
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-line-strong hover:text-fg"
              >
                <Icon name={link.icon || 'external-link'} className="h-3.5 w-3.5" />
                {t(link.label) || t(portfolio.ui.viewCredential)}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </GlassCard>
  );
}
