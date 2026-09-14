'use client';

import Link from 'next/link';
import { portfolio } from '@/data/portfolio';
import { useLanguage } from '@/components/LanguageProvider';
import { formatDate } from '@/lib/format';
import GlassCard from '@/components/GlassCard';
import SmartImage from '@/components/SmartImage';
import Icon from '@/components/Icon';

/**
 * PostCard: satu kartu tulisan di daftar blog dan di ringkasan beranda.
 * Kalau `post.cover` kosong, kartu memakai latar gradien dengan huruf awal judul.
 */
export default function PostCard({ post, compact = false }) {
  const { lang, t } = useLanguage();
  const minutes = post.readingTime?.[lang] ?? post.readingTime?.id ?? 1;
  const title = t(post.title);

  return (
    <GlassCard as="article" featured={post.featured} className="flex h-full flex-col overflow-hidden">
      <Link href={`/blog/${post.slug}/`} className="flex h-full flex-col">
        <div className="relative aspect-16/9 w-full overflow-hidden border-b border-line">
          {post.cover ? (
            <SmartImage
              src={post.cover}
              alt={t(post.coverAlt) || title}
              width={800}
              height={450}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          ) : (
            <div
              aria-hidden="true"
              className="grid h-full w-full place-items-center bg-linear-to-br from-accent-1/35 via-accent-2/25 to-accent-3/30"
            >
              <Icon name="pen-line" className="h-9 w-9 text-fg opacity-40" />
            </div>
          )}
        </div>

        <div className="flex grow flex-col p-5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-meta text-subtle">
            <span className="inline-flex items-center gap-1.5">
              <Icon name="calendar" className="h-3.5 w-3.5" />
              {formatDate(post.date, lang)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="clock" className="h-3.5 w-3.5" />
              {minutes} {t(portfolio.ui.blogMinutes)}
            </span>

            {/* Penanda kecil kalau tulisan ini punya audio pendamping, supaya
                pembaca yang lebih suka mendengarkan bisa langsung mengenalinya
                dari daftar. */}
            {post.audio?.file ? (
              <span className="inline-flex items-center gap-1.5 text-accent">
                <Icon name="headphones" className="h-3.5 w-3.5" />
                Audio
              </span>
            ) : null}
          </div>

          <h3 className="mt-2.5 text-lg font-semibold leading-snug text-fg">{title}</h3>

          {/* Pemotongan teks dibungkus elemen terpisah. Menaruh line-clamp
              langsung pada elemen yang juga memakai grow membuat baris di luar
              batas tetap terlihat, karena tingginya dipaksa memanjang. */}
          <div className="mt-2 grow">
            <p className={`text-body-sm text-muted ${compact ? 'line-clamp-3' : ''}`}>
              {t(post.excerpt)}
            </p>
          </div>

          {post.tags?.length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <li key={tag} className="chip">
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}

          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
            {t(portfolio.ui.blogReadPost)}
            <Icon name="arrow-right" className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </GlassCard>
  );
}
