'use client';

import { useState } from 'react';
import { portfolio } from '@/data/portfolio';
import { useLanguage } from '@/components/LanguageProvider';
import { useLightbox } from '@/components/LightboxProvider';
import GlassCard from '@/components/GlassCard';
import SmartImage from '@/components/SmartImage';
import BerkasUnduhan from '@/components/BerkasUnduhan';
import Icon from '@/components/Icon';

/** Panjang teks sebelum deskripsi dipotong dan tombol Selengkapnya muncul. */
const CLAMP_LENGTH = 190;

/**
 * ExperienceCard: satu titik pada timeline pengalaman.
 *
 * Kalau item punya field `image`, gambarnya tampil sebagai dokumentasi kegiatan
 * di bawah deskripsi. Kalau `logo` diisi, logo instansi muncul di samping judul.
 * Keduanya opsional, kartu tetap rapi tanpa keduanya.
 */
export default function ExperienceCard({ item }) {
  const { t } = useLanguage();
  const { openLightbox, enabled: lightboxEnabled } = useLightbox();
  const [expanded, setExpanded] = useState(false);

  const description = t(item.description);
  const isLong = description.length > CLAMP_LENGTH;

  return (
    <GlassCard as="article" featured={item.highlight} className="overflow-hidden">
      {/* Kartu dengan gambar dibagi dua kolom di layar lebar: gambar di kiri
          sebagai pendamping, isi tulisan di kanan. Di layar kecil gambarnya
          turun ke atas sebagai pita pendek. Kartu tanpa gambar tetap satu
          kolom penuh. */}
      <div className={item.image ? 'sm:grid sm:grid-cols-[minmax(0,13.5rem)_1fr] lg:grid-cols-[minmax(0,17rem)_1fr]' : ''}>
        {item.image ? <ExperienceMedia item={item} /> : null}

        <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <div className="flex min-w-0 gap-3">
            {item.logo ? (
              <SmartImage
                src={item.logo}
                alt={`Logo ${t(item.org)}`}
                width={44}
                height={44}
                className="mt-0.5 h-11 w-11 shrink-0 rounded-xl border border-line object-cover"
              />
            ) : null}

            <div className="min-w-0">
              <h3 className="text-[1.0625rem] font-semibold leading-snug text-fg sm:text-lg">{t(item.role)}</h3>
              <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-accent">
                <Icon name="building" className="h-3.5 w-3.5 shrink-0" />
                <span>{t(item.org)}</span>
                {item.type ? (
                  <>
                    <span aria-hidden="true" className="opacity-40">
                      &bull;
                    </span>
                    <span className="text-subtle">{t(item.type)}</span>
                  </>
                ) : null}
              </p>
            </div>
          </div>

          <p className="chip shrink-0">
            <Icon name="calendar" className="h-3.5 w-3.5" />
            {t(item.period)}
          </p>
        </div>

        {item.location ? (
          <p className="mt-2 flex items-center gap-1.5 text-meta text-subtle">
            <Icon name="map-pin" className="h-3.5 w-3.5" />
            {t(item.location)}
          </p>
        ) : null}

        {description ? (
          <div className="mt-3">
            {/*
              Teksnya SELALU ditulis utuh di halaman, lalu dipendekkan secara
              tampilan saja lewat line-clamp. Dulu teksnya benar benar dipotong
              sebelum ditulis, dan akibatnya mesin pencari cuma melihat 190 huruf
              pertama dari setiap pengalaman. Bagian paling bernilai dari
              portofolio ini justru tidak pernah terbaca Google.
            */}
            <p
              className={`text-body-sm text-muted ${
                isLong && !expanded ? 'line-clamp-3' : ''
              } print:line-clamp-none`}
            >
              {description}
            </p>

            {isLong ? (
              <button
                type="button"
                onClick={() => setExpanded((value) => !value)}
                aria-expanded={expanded}
                // py-1 dan align-middle menjaga tinggi tombol tetap nyaman
                // disentuh di layar sentuh, tanpa merusak alirannya di dalam
                // paragraf.
                className="mt-1 inline-flex min-h-6 items-center gap-1 rounded-md py-1 text-xs font-semibold text-accent transition-colors hover:text-fg print:hidden"
              >
                {expanded ? t(portfolio.ui.readLess) : t(portfolio.ui.readMore)}
                <Icon
                  name="chevron-down"
                  className={`h-3.5 w-3.5 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
                />
              </button>
            ) : null}
          </div>
        ) : null}

        {item.skills?.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {item.skills.map((skill) => (
              <li key={skill} className="chip">
                {t(skill)}
              </li>
            ))}
          </ul>
        ) : null}

        {/*
          Lampiran yang bisa diunduh pengunjung: PDF surat keputusan, sertifikat
          hasil pindai, foto kegiatan, apa saja. Diisi lewat panel di menu
          Isi Halaman > Pengalaman > Berkas untuk diunduh. Tidak muncul di
          dokumen cetak karena tautan unduhan tidak ada gunanya di atas kertas.
        */}
        <BerkasUnduhan items={item.files} className="mt-4 print:hidden" />
        </div>
      </div>
    </GlassCard>
  );

  /**
   * Kolom gambar pendamping. Dibuat sebagai fungsi bersarang supaya tetap bisa
   * memakai t(), openLightbox, dan lightboxEnabled dari komponen induknya.
   */
  function ExperienceMedia({ item: media }) {
    const alt = t(media.imageAlt) || t(media.role);

    const picture = (
      <SmartImage
        src={media.image}
        alt={alt}
        width={960}
        height={540}
        className="aspect-16/10 w-full object-cover transition-transform duration-700 group-hover:scale-[1.05] sm:aspect-auto sm:h-full"
      />
    );

    return (
      <figure className="relative border-b border-line sm:border-b-0 sm:border-r">
        {lightboxEnabled ? (
          <button
            type="button"
            onClick={() =>
              openLightbox({ src: media.image, alt: media.imageAlt, caption: media.imageAlt || media.role })
            }
            aria-label={`${t(portfolio.ui.imageZoom)}: ${t(media.role)}`}
            className="group relative block h-full w-full cursor-zoom-in overflow-hidden"
          >
            {picture}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/45 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
            <span className="pointer-events-none absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full border border-white/25 bg-black/45 text-white opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100">
              <Icon name="image" className="h-4 w-4" />
            </span>
          </button>
        ) : (
          <div className="h-full overflow-hidden">{picture}</div>
        )}

        {/* Keterangan gambar hanya dibaca pembaca layar. Teks lengkapnya sudah
            ada di atribut alt, jadi tidak perlu diulang di layar. */}
        <figcaption className="sr-only">{alt}</figcaption>
      </figure>
    );
  }
}
