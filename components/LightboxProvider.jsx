'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { portfolio } from '@/data/portfolio';
import { useLanguage } from '@/components/LanguageProvider';
import { withBasePath } from '@/lib/asset';
import Icon from '@/components/Icon';

/**
 * LightboxProvider: satu lapisan tampilan gambar besar untuk seluruh situs.
 *
 * Komponen mana pun bisa memanggilnya:
 *
 *   const { openLightbox } = useLightbox();
 *   openLightbox({ src: '/images/foto.jpg', alt: 'Keterangan', caption: 'Judul' });
 *
 * SATU GAMBAR ATAU SATU RANGKAIAN
 * Kalau pemanggilnya menyertakan `group`, yaitu daftar gambar yang berada di
 * satu kumpulan, lightbox menampilkan tombol maju mundur dan nomor urut. Ini
 * yang dipakai galeri: pengunjung membuka satu foto lalu bisa terus menggeser
 * tanpa menutup dan membuka lagi.
 *
 *   openLightbox({ src: foto.src, group: semuaFoto });
 *
 * Tanpa `group`, tampilannya persis seperti semula: satu gambar saja.
 *
 * Ditutup dengan tombol Escape, klik di luar gambar, atau tombol silang.
 * Panah kiri dan kanan berpindah gambar. Fokus keyboard dikembalikan ke elemen
 * yang membukanya, dan halaman di belakangnya dikunci selama lightbox terbuka.
 *
 * Matikan seluruh fiturnya lewat appearance.lightbox di data/portfolio.js.
 */
const LightboxContext = createContext(null);

export function LightboxProvider({ children }) {
  const { t } = useLanguage();
  // Isinya { daftar, posisi }. Gambar tunggal disimpan sebagai daftar berisi satu.
  const [tampilan, setTampilan] = useState(null);
  const closeButtonRef = useRef(null);
  const openerRef = useRef(null);

  const enabled = portfolio.appearance?.lightbox !== false;

  const openLightbox = useCallback(
    (next) => {
      if (!enabled || !next?.src) return;

      const rangkaian = Array.isArray(next.group) ? next.group.filter((foto) => foto?.src) : [];
      const daftar = rangkaian.length > 0 ? rangkaian : [next];

      // Cari posisi gambar yang diklik di dalam rangkaiannya. Kalau tidak
      // ketemu, mulai dari gambar pertama supaya tetap ada yang tampil.
      const ditemukan = daftar.findIndex((foto) => foto.src === next.src);

      openerRef.current = document.activeElement;
      setTampilan({ daftar, posisi: ditemukan >= 0 ? ditemukan : 0 });
    },
    [enabled]
  );

  const closeLightbox = useCallback(() => {
    setTampilan(null);
    // Kembalikan fokus ke gambar yang tadi diklik supaya alur keyboard tidak putus.
    if (openerRef.current instanceof HTMLElement) openerRef.current.focus();
  }, []);

  /** Maju atau mundur satu gambar, berputar saat sampai di ujung. */
  const geser = useCallback((langkah) => {
    setTampilan((kini) => {
      if (!kini || kini.daftar.length < 2) return kini;
      const jumlah = kini.daftar.length;
      return { ...kini, posisi: (kini.posisi + langkah + jumlah) % jumlah };
    });
  }, []);

  const terbuka = Boolean(tampilan);

  /*
    Kunci gulir halaman, pasang pintasan papan ketik, dan pindahkan fokus ke
    tombol tutup. Sengaja bergantung pada `terbuka`, bukan pada gambar yang
    sedang tampil, supaya berpindah gambar tidak mengulang semua persiapan ini
    dan tidak merebut fokus dari tombol panah yang baru saja ditekan.
  */
  useEffect(() => {
    if (!terbuka) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeLightbox();
      else if (event.key === 'ArrowLeft') geser(-1);
      else if (event.key === 'ArrowRight') geser(1);
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [terbuka, closeLightbox, geser]);

  const value = useMemo(() => ({ openLightbox, closeLightbox, enabled }), [openLightbox, closeLightbox, enabled]);

  const item = tampilan ? tampilan.daftar[tampilan.posisi] : null;
  const banyak = tampilan ? tampilan.daftar.length > 1 : false;

  return (
    <LightboxContext.Provider value={value}>
      {children}

      {item ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t(item.caption) || t(item.alt) || 'Gambar'}
          data-print="hide"
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-8"
          style={{ animation: 'fade-in 0.25s ease-out' }}
        >
          {/* Latar peredup. Diklik untuk menutup. */}
          <button
            type="button"
            aria-label={t(portfolio.ui.lightboxClose)}
            onClick={closeLightbox}
            className="absolute inset-0 cursor-zoom-out bg-black/80 backdrop-blur-md"
          />

          <figure
            className="relative z-10 flex max-h-full w-full max-w-4xl flex-col"
            style={{ animation: 'lightbox-in 0.35s cubic-bezier(0.22, 1, 0.36, 1)' }}
          >
            {/* Tanpa w-full supaya bingkainya memeluk isinya, bukan memeluk
                kotak kosong di kiri dan kanannya.

                key memaksa peramban mengganti berkasnya, bukan menampilkan
                yang lama sambil menunggu yang baru selesai diunduh. */}
            {item.jenis === 'video' ? (
              /*
                Videonya baru diunduh di sini, saat benar benar dibuka.
                Di kisi galeri tidak ada satu bita pun yang diambil, jadi
                halaman tetap ringan berapa pun video yang kamu pasang.
              */
              <video
                key={item.src}
                src={withBasePath(item.src)}
                poster={item.poster ? withBasePath(item.poster) : undefined}
                controls
                autoPlay
                playsInline
                preload="metadata"
                className="mx-auto max-h-[78svh] max-w-full rounded-2xl border border-white/15 bg-black object-contain shadow-2xl"
              >
                {t(portfolio.ui.videoUnsupported)}
              </video>
            ) : (
              <img
                key={item.src}
                src={withBasePath(item.src)}
                alt={t(item.alt)}
                className="mx-auto max-h-[78svh] max-w-full rounded-2xl border border-white/15 object-contain shadow-2xl"
              />
            )}

            {t(item.caption) ? (
              <figcaption className="mt-4 text-center text-sm text-slate-200">
                {t(item.caption)}
              </figcaption>
            ) : null}

            {banyak ? (
              <p className="mt-2 text-center text-xs tabular-nums text-slate-400">
                {tampilan.posisi + 1} / {tampilan.daftar.length}
              </p>
            ) : null}
          </figure>

          {/* Tombol maju mundur, hanya muncul kalau gambarnya memang serangkaian. */}
          {banyak ? (
            <>
              <button
                type="button"
                onClick={() => geser(-1)}
                aria-label={t(portfolio.ui.lightboxPrev)}
                className="absolute left-2 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-xl transition-colors hover:bg-white/20 sm:left-6"
              >
                <Icon name="arrow-left" className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => geser(1)}
                aria-label={t(portfolio.ui.lightboxNext)}
                className="absolute right-2 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-xl transition-colors hover:bg-white/20 sm:right-6"
              >
                <Icon name="arrow-right" className="h-5 w-5" />
              </button>
            </>
          ) : null}

          <div className="absolute right-4 top-4 z-20 flex items-center gap-2 sm:right-6 sm:top-6">
            {/*
              Unduh gambar yang sedang dibuka. Berlaku untuk semua gambar di
              situs ini, jadi foto dokumentasi pengalaman maupun foto galeri
              sama sama bisa disimpan pengunjung.
            */}
            <a
              href={withBasePath(item.src)}
              download
              aria-label={t(portfolio.ui.lightboxDownload)}
              title={t(portfolio.ui.lightboxDownload)}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-xl transition-colors hover:bg-white/20"
            >
              <Icon name="download" className="h-5 w-5" />
            </a>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeLightbox}
              aria-label={t(portfolio.ui.lightboxClose)}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-xl transition-colors hover:bg-white/20"
            >
              <Icon name="close" className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : null}
    </LightboxContext.Provider>
  );
}

/**
 * Hook pembaca konteks. Aman dipanggil di mana saja: kalau provider-nya tidak
 * ada, hook ini mengembalikan fungsi kosong sehingga komponen tetap jalan.
 */
export function useLightbox() {
  return (
    useContext(LightboxContext) ?? {
      openLightbox: () => {},
      closeLightbox: () => {},
      enabled: false,
    }
  );
}

export default LightboxProvider;
