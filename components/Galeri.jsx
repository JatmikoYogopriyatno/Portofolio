'use client';

import { useState } from 'react';
import { portfolio } from '@/data/portfolio';
import { useLanguage } from '@/components/LanguageProvider';
import { useLightbox } from '@/components/LightboxProvider';
import SectionHeading from '@/components/SectionHeading';
import SmartImage from '@/components/SmartImage';
import Reveal from '@/components/Reveal';
import Icon from '@/components/Icon';

/**
 * =============================================================================
 *  Galeri: dinding foto yang isinya kamu atur sendiri lewat panel.
 * =============================================================================
 *
 *  CARA MENGISINYA
 *  Panel > Isi Halaman > Galeri. Di kolom "Foto galeri" kamu bisa memilih
 *  banyak foto sekaligus dalam satu kali buka, bukan satu per satu. Urutannya
 *  bisa digeser, dan keterangannya opsional.
 *
 *  Bagian ini hilang sendiri kalau fotonya masih kosong atau sakelarnya
 *  dimatikan, jadi tidak ada bagian kosong yang menganggur di halaman.
 *
 *  KENAPA DIMUAT BERTAHAP
 *  Galeri bisa tumbuh sampai puluhan foto. Kalau semuanya dipasang sekaligus,
 *  peramban di ponsel harus menyiapkan puluhan elemen gambar sebelum halaman
 *  bisa dipakai. Di sini hanya 12 foto pertama yang dipasang, sisanya menyusul
 *  saat tombol ditekan. Tampilannya sama, kerjanya jauh lebih ringan.
 * =============================================================================
 */

/** Banyak foto yang dipasang sekaligus, baik di awal maupun tiap kali dimuat. */
const SATU_TAHAP = 12;

/*
  Kelas Tailwind harus ditulis utuh supaya ikut terbaca saat build. Karena itu
  pilihan dari panel dipetakan lewat tabel di bawah, bukan dirangkai dari
  potongan teks.
*/
const KOLOM = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 sm:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
};

/** Petunjuk lebar gambar untuk peramban, mengikuti banyaknya kolom. */
const UKURAN = {
  2: '(max-width: 640px) 50vw, 570px',
  3: '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 375px',
  4: '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px',
};

const RASIO = {
  '4/3': 'aspect-4/3',
  '1/1': 'aspect-square',
  '16/9': 'aspect-video',
  '3/4': 'aspect-3/4',
};

export default function Galeri() {
  const { t } = useLanguage();
  const { openLightbox, enabled: lightboxEnabled } = useLightbox();
  const { gallery, sections, ui } = portfolio;

  const [tampil, setTampil] = useState(SATU_TAHAP);

  const foto = gallery?.items ?? [];
  if (gallery?.enabled === false || foto.length === 0) return null;

  const kolom = KOLOM[Number(gallery.columns)] ?? KOLOM[3];
  const ukuran = UKURAN[Number(gallery.columns)] ?? UKURAN[3];
  const rasio = RASIO[gallery.ratio] ?? RASIO['4/3'];

  const judul = t(sections.gallery?.title) || 'Galeri';
  const terlihat = foto.slice(0, tampil);
  const sisa = foto.length - terlihat.length;

  /* Daftar untuk lightbox memakai keterangan yang sama dengan yang di halaman,
     supaya tombol maju mundur menampilkan teks yang benar di tiap foto. */
  const rangkaian = foto.map((item, index) => ({
    src: item.src,
    alt: t(item.caption) || `${judul} ${index + 1}`,
    caption: item.caption ?? null,
    jenis: item.jenis,
    poster: item.poster,
  }));

  return (
    <section id="gallery" className="scroll-mt-28 px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow={t(sections.gallery?.eyebrow)}
          title={judul}
          subtitle={t(sections.gallery?.subtitle)}
        />

        {/*
          Seluruh kisi dibungkus satu Reveal, bukan satu Reveal per foto.
          Tiap Reveal memasang pengamat gulirnya sendiri, dan galeri yang terus
          bertambah akan menumpuk puluhan pengamat tanpa perlu.
        */}
        <Reveal className="mt-10">
          <ul className={`grid gap-3 sm:gap-4 ${kolom}`}>
            {terlihat.map((item, index) => {
              const keterangan = t(item.caption);
              const alt = keterangan || `${judul} ${index + 1}`;

              const video = item.jenis === 'video';

              const gambar = (
                <>
                  {video && !item.poster ? (
                    /*
                      Video tanpa sampul.

                      Sengaja TIDAK memasang elemen video di sini. Peramban akan
                      mulai mengunduh tiap video di kisi ini hanya untuk mencari
                      gambar bingkai pertamanya, dan galeri berisi selusin video
                      bisa memakan puluhan megabita kuota sebelum satu pun
                      ditonton. Videonya baru dimuat saat dibuka.

                      Pasang sampulnya di panel kalau kamu ingin kotak ini
                      menampilkan gambar, bukan warna polos.
                    */
                    <div
                      className={`${rasio} grid w-full place-items-center bg-linear-to-br from-accent-1/25 via-surface to-accent-2/20`}
                    >
                      <Icon name="film" className="h-8 w-8 text-fg opacity-30" />
                    </div>
                  ) : (
                    <SmartImage
                      src={video ? item.poster : item.src}
                      alt={alt}
                      width={900}
                      height={675}
                      sizes={ukuran}
                      className={`${rasio} w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]`}
                    />
                  )}

                  {/* Lencana putar, penanda bahwa isinya video bukan foto. */}
                  {video ? (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 grid place-items-center"
                    >
                      <span className="grid h-12 w-12 place-items-center rounded-full border border-white/30 bg-black/45 text-white backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
                        <Icon name="play" className="ml-0.5 h-5 w-5" />
                      </span>
                    </span>
                  ) : null}

                  {/* Peredup hanya dipasang kalau ada keterangan yang perlu
                      dibaca di atasnya, supaya foto tanpa keterangan tetap
                      terlihat apa adanya. */}
                  {keterangan ? (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100"
                    />
                  ) : null}

                  {keterangan ? (
                    <span className="pointer-events-none absolute inset-x-3 bottom-3 block text-center text-xs font-semibold leading-snug text-white drop-shadow sm:text-sm">
                      {keterangan}
                    </span>
                  ) : null}

                  {lightboxEnabled && !video ? (
                    <span className="pointer-events-none absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full border border-white/25 bg-black/40 text-white opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100">
                      <Icon name="image" className="h-4 w-4" />
                    </span>
                  ) : null}
                </>
              );

              return (
                <li key={item.src}>
                  {lightboxEnabled ? (
                    <button
                      type="button"
                      onClick={() => openLightbox({ ...rangkaian[index], group: rangkaian })}
                      aria-label={`${video ? t(ui.videoPlay) : t(ui.imageZoom)}: ${alt}`}
                      className={`group relative block w-full overflow-hidden rounded-2xl border border-line ${
                        video ? 'cursor-pointer' : 'cursor-zoom-in'
                      }`}
                    >
                      {gambar}
                    </button>
                  ) : (
                    <div className="group relative block w-full overflow-hidden rounded-2xl border border-line">
                      {gambar}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          {sisa > 0 ? (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setTampil((jumlah) => jumlah + SATU_TAHAP)}
                className="btn-ghost"
              >
                <Icon name="arrow-down" className="h-4 w-4" />
                {t(ui.galleryMore)}
                <span className="text-subtle tabular-nums">
                  {sisa} {t(ui.galleryCount)}
                </span>
              </button>
            </div>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
