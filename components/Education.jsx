'use client';

import { portfolio } from '@/data/portfolio';
import { useLanguage } from '@/components/LanguageProvider';
import { useLightbox } from '@/components/LightboxProvider';
import SectionHeading from '@/components/SectionHeading';
import GlassCard from '@/components/GlassCard';
import SmartImage from '@/components/SmartImage';
import BerkasUnduhan from '@/components/BerkasUnduhan';
import Reveal from '@/components/Reveal';
import Icon from '@/components/Icon';

/**
 * Education: riwayat pendidikan formal.
 *
 * Selain keterangan jenjang, tiap kartu bisa memuat dua hal tambahan yang
 * kamu isi lewat panel, dan keduanya opsional:
 *
 *   Foto dokumentasi   tampil di atas kartu, bisa diklik untuk diperbesar
 *   Berkas unduhan     ijazah, transkrip, atau dokumen lain
 *
 * Keduanya memakai komponen yang sama persis dengan yang dipakai bagian
 * Pengalaman, yaitu LightboxProvider dan BerkasUnduhan. Itu disengaja: kalau
 * suatu saat cara membuka gambar atau bentuk tombol unduh diperbaiki, kedua
 * bagian ikut berubah tanpa perlu diingat dua kali.
 *
 * Foto di sini TIDAK ikut ke CV. CV gaya Harvard harus bebas gambar supaya
 * terbaca mesin pelacak lamaran, dan components/DokumenCV.jsx memang cuma
 * membaca jenjang, nilai, dan catatannya.
 */
export default function Education() {
  const { t } = useLanguage();
  const { education, sections } = portfolio;
  const { openLightbox, enabled: lightboxEnabled } = useLightbox();

  if (education.length === 0) return null;

  return (
    <section id="education" className="scroll-mt-28 px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow={t(sections.education.eyebrow)}
          title={t(sections.education.title)}
          subtitle={t(sections.education.subtitle)}
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {education.map((item, index) => (
            <Reveal key={`${item.school}-${item.period}`} delay={Math.min(index * 80, 240)} className="h-full">
              <GlassCard className="flex h-full flex-col overflow-hidden">
                {/* Foto dokumentasi, kalau kartu ini punya. Ditaruh paling atas
                    supaya bentuk kartunya tetap sama walau sebagiannya berfoto
                    dan sebagian lagi tidak. */}
                {item.image ? <FotoPendidikan item={item} /> : null}

                <div className="flex flex-1 flex-col p-6">
                {item.logo ? (
                  <SmartImage
                    src={item.logo}
                    alt={`Logo ${item.school}`}
                    width={44}
                    height={44}
                    className="h-11 w-11 rounded-xl border border-line object-cover"
                  />
                ) : (
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-linear-to-br from-accent-1 to-accent-3 text-white">
                    <Icon name="graduation-cap" className="h-5 w-5" />
                  </span>
                )}

                <h3 className="mt-4 text-[1.0625rem] font-semibold leading-snug text-fg">{t(item.degree)}</h3>
                <p className="mt-1 text-sm text-accent">{item.school}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="chip">{item.period}</span>
                  {t(item.gpa) ? <span className="chip">{t(item.gpa)}</span> : null}
                </div>

                {t(item.notes) ? (
                  <p className="mt-4 text-body-sm text-muted">{t(item.notes)}</p>
                ) : null}

                {/* Tombol unduh didorong ke dasar kartu dengan mt-auto, supaya
                    dua kartu bersebelahan yang catatannya beda panjang tetap
                    punya deretan tombol yang sejajar. */}
                <BerkasUnduhan items={item.files} className="mt-auto pt-4 print:hidden" />
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );

  /**
   * Foto dokumentasi satu jenjang pendidikan.
   *
   * Ditulis sebagai fungsi bersarang, sama seperti di ExperienceCard, supaya
   * tetap bisa memakai t(), openLightbox, dan lightboxEnabled dari komponen
   * induknya tanpa mengoper apa apa.
   */
  function FotoPendidikan({ item }) {
    const alt = t(item.imageAlt) || `${t(item.degree)}, ${item.school}`;

    const gambar = (
      <SmartImage
        src={item.image}
        alt={alt}
        width={960}
        height={540}
        className="aspect-16/9 w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
      />
    );

    return (
      <figure className="relative border-b border-line">
        {lightboxEnabled ? (
          <button
            type="button"
            onClick={() =>
              openLightbox({ src: item.image, alt: item.imageAlt, caption: item.imageAlt || item.degree })
            }
            aria-label={`${t(portfolio.ui.imageZoom)}: ${t(item.degree)}`}
            className="group relative block w-full cursor-zoom-in overflow-hidden"
          >
            {gambar}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/45 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
            <span className="pointer-events-none absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full border border-white/25 bg-black/45 text-white opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100">
              <Icon name="image" className="h-4 w-4" />
            </span>
          </button>
        ) : (
          <div className="overflow-hidden">{gambar}</div>
        )}

        {/* Keterangannya sudah ada di atribut alt, jadi di layar tidak perlu
            diulang. Cukup dibaca pembaca layar. */}
        <figcaption className="sr-only">{alt}</figcaption>
      </figure>
    );
  }
}
