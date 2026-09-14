'use client';

import Link from 'next/link';
import { portfolio } from '@/data/portfolio';
import { useLanguage } from '@/components/LanguageProvider';
import { formatDate } from '@/lib/format';
import SmartImage from '@/components/SmartImage';
import PostBody from '@/components/PostBody';
import PostAudio from '@/components/PostAudio';
import PostCard from '@/components/PostCard';
import ShareButtons from '@/components/ShareButtons';
import Reveal from '@/components/Reveal';
import Icon from '@/components/Icon';

/**
 * PostArticle: isi halaman /blog/[slug].
 *
 * Tulisannya beserta dua bacaan lanjutan dikirim app/blog/[slug]/page.js
 * sebagai props, karena keduanya dibaca dari folder content/posts/ saat build.
 */
export default function PostArticle({ post, others = [], bodyHtml }) {
  const { lang, t } = useLanguage();
  const { ui, profile } = portfolio;

  if (!post) return null;

  // Waktu baca dihitung otomatis di data/posts.js, satu angka untuk tiap bahasa.
  const minutes = post.readingTime?.[lang] ?? post.readingTime?.id ?? 1;

  return (
    <article className="px-4 pt-32 pb-20 sm:px-6 sm:pb-24">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <Link
            href="/blog/"
            className="inline-flex min-h-6 items-center gap-2 rounded-md py-1 text-sm font-semibold text-subtle transition-colors hover:text-fg"
          >
            <Icon name="arrow-left" className="h-4 w-4" />
            {t(ui.blogBack)}
          </Link>
        </Reveal>

        <Reveal delay={60}>
          <header className="mt-6">
            {post.tags?.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <li key={tag} className="chip">
                    <Icon name="tag" className="h-3 w-3" />
                    {tag}
                  </li>
                ))}
              </ul>
            ) : null}

            <h1 className="mt-4 text-[2.1rem] font-bold leading-[1.14] text-fg sm:text-[2.6rem]">
              {t(post.title)}
            </h1>

            <p className="mt-5 text-[1.0625rem] leading-relaxed text-muted">{t(post.excerpt)}</p>

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-5 text-meta text-subtle">
              <span className="inline-flex items-center gap-1.5 font-semibold text-fg">
                <Icon name="users" className="h-3.5 w-3.5" />
                {profile.name}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Icon name="calendar" className="h-3.5 w-3.5" />
                {formatDate(post.date, lang)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Icon name="clock" className="h-3.5 w-3.5" />
                {minutes} {t(ui.blogMinutes)}
              </span>
            </div>

            {/* Audio pendamping, kalau tulisan ini punya. Ditaruh tepat di
                bawah judul supaya pembaca yang lebih suka mendengarkan tidak
                perlu mencarinya dulu. */}
            <PostAudio audio={post.audio} />
          </header>
        </Reveal>

        {post.cover ? (
          <Reveal delay={90}>
            <SmartImage
              src={post.cover}
              alt={t(post.coverAlt) || t(post.title)}
              width={1200}
              height={630}
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="mt-8 aspect-16/9 w-full rounded-3xl border border-line object-cover"
            />
          </Reveal>
        ) : null}

        {/* Isi artikel diberi permukaan kaca sendiri supaya teks panjang tetap
            nyaman dibaca di atas latar bergradien. */}
        <Reveal delay={120} className="mt-10">
          <div className="glass rounded-3xl p-6 sm:p-9">
            <PostBody html={bodyHtml} />
            <ShareButtons title={t(post.title)} path={`/blog/${post.slug}/`} />
          </div>
        </Reveal>

        {others.length > 0 ? (
          <section className="mt-16 border-t border-line pt-10">
            <h2 className="text-xl font-bold text-fg">{t(ui.blogRelated)}</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {others.map((item, index) => (
                <Reveal key={item.slug} delay={index * 70} className="h-full">
                  <PostCard post={item} compact />
                </Reveal>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </article>
  );
}
