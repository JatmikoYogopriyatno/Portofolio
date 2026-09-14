'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { portfolio } from '@/data/portfolio';
import { useLanguage } from '@/components/LanguageProvider';
import GlassCard from '@/components/GlassCard';
import PostCard from '@/components/PostCard';
import Reveal from '@/components/Reveal';
import Icon from '@/components/Icon';

/**
 * BlogIndex: isi halaman /blog. Menampilkan seluruh tulisan lengkap dengan
 * filter topik yang dibangun otomatis dari field `tags` tiap tulisan.
 *
 * Daftar tulisan dan daftar topiknya dikirim app/blog/page.js sebagai props,
 * karena keduanya dibaca dari folder content/posts/ saat build.
 */
export default function BlogIndex({ posts = [], tags = [] }) {
  const { t } = useLanguage();
  const { sections, ui } = portfolio;
  const [activeTag, setActiveTag] = useState('__all__');

  const visiblePosts = useMemo(
    () =>
      activeTag === '__all__'
        ? posts
        : posts.filter((post) => (post.tags ?? []).includes(activeTag)),
    [posts, activeTag]
  );

  const filterButtonClass = (value) =>
    [
      'rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200',
      activeTag === value
        ? 'border-transparent bg-linear-to-r from-accent-1 to-accent-2 text-white'
        : 'border-line bg-surface text-muted hover:border-line-strong hover:text-fg',
    ].join(' ');

  return (
    <div className="px-4 pt-32 pb-20 sm:px-6 sm:pb-24">
      <div className="mx-auto max-w-6xl">
        {/* Judul halaman */}
        <Reveal className="max-w-2xl">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            <span aria-hidden="true" className="h-px w-6 bg-accent/60" />
            {t(sections.blog.eyebrow)}
          </span>
          <h1 className="mt-3 text-[2.6rem] font-bold leading-[1.08] tracking-[-0.03em] text-fg sm:text-[3.2rem]">
            {t(sections.blog.title)}
          </h1>
          <p className="mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-subtle">{t(sections.blog.subtitle)}</p>
        </Reveal>

        {posts.length === 0 ? (
          <Reveal delay={80} className="mt-10">
            <GlassCard hover={false} className="p-10 text-center">
              <Icon name="pen-line" className="mx-auto h-8 w-8 text-accent opacity-60" />
              <p className="mt-4 text-sm text-muted">{t(ui.blogEmpty)}</p>
            </GlassCard>
          </Reveal>
        ) : (
          <>
            {tags.length > 1 ? (
              <Reveal delay={60}>
                <div role="group" aria-label={t(ui.blogFilterLabel)} className="mt-8 flex flex-wrap gap-2">
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
              {visiblePosts.map((post, index) => (
                <Reveal key={post.slug} delay={Math.min(index * 70, 280)} className="h-full">
                  <PostCard post={post} />
                </Reveal>
              ))}
            </div>
          </>
        )}

        <Reveal delay={120} className="mt-12">
          <Link
            href="/"
            className="inline-flex min-h-6 items-center gap-2 rounded-md py-1 text-sm font-semibold text-subtle transition-colors hover:text-fg"
          >
            <Icon name="arrow-left" className="h-4 w-4" />
            {t(ui.blogHome)}
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
