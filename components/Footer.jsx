'use client';

import Link from 'next/link';
import { portfolio } from '@/data/portfolio';
import { useLanguage } from '@/components/LanguageProvider';
import Icon from '@/components/Icon';
import { DOKUMEN } from '@/components/DokumenBilah';
import StatistikPengunjung from '@/components/StatistikPengunjung';

/** Footer: identitas singkat, tautan sosial, kredit, dan tombol ke atas. */
export default function Footer() {
  const { t } = useLanguage();
  const { profile, social, ui, nav } = portfolio;
  const year = new Date().getFullYear();
  const showPrintLink = portfolio.appearance?.printLink !== false;

  return (
    <footer data-print="hide" className="border-t border-line px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <p className="text-base font-semibold text-fg">{profile.name}</p>
            <p className="mt-2 text-sm leading-6 text-subtle">{t(profile.headline)}</p>
          </div>

          {/* Tautan cepat ke tiap bagian */}
          {/*
            Tinggi minimum 24px supaya nyaman disentuh di layar ponsel. Tanpa
            itu tautan ini hanya setinggi hurufnya dan sering meleset ditekan.
          */}
          <nav aria-label="Footer" className="flex flex-wrap gap-x-4 gap-y-1">
            {nav.map((item) => (
              <Link
                key={item.id}
                href={item.type === 'page' ? item.href : `/#${item.id}`}
                className="inline-flex min-h-6 items-center rounded-md px-1 py-1 text-sm text-subtle transition-colors hover:text-fg"
              >
                {t(item.label)}
              </Link>
            ))}
          </nav>
        </div>

        {social.length > 0 ? (
          <ul className="mt-8 flex flex-wrap gap-2.5">
            {social.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={item.label}
                  title={item.label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-subtle transition-all duration-300 hover:-translate-y-0.5 hover:text-fg"
                >
                  <Icon name={item.icon} className="h-4 w-4" />
                </a>
              </li>
            ))}
          </ul>
        ) : null}

        {/* Penghitung kunjungan. Menyembunyikan dirinya sendiri kalau
            penyimpanannya belum dipasang, lihat lib/kunjungan.js. */}
        <StatistikPengunjung />

        {/* Tombol kembali ke atas sengaja tidak diulang di sini karena sudah
            ada tombol melayang di sudut kanan bawah, lihat BackToTop.jsx. */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-subtle">
            &copy; {year} {profile.name}. {t(ui.rights)}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2" data-print="hide">
            {t(ui.builtWith) ? <p className="text-xs text-subtle">{t(ui.builtWith)}</p> : null}

            {/* Tiga berkas siap unduh, masing masing halaman tersendiri di
                bawah /cetak/ dan dirancang khusus untuk kertas, bukan hasil
                mencetak halaman ini apa adanya. Daftarnya ada di satu tempat,
                DOKUMEN di components/DokumenBilah.jsx, jadi menambah dokumen
                keempat tidak perlu menyentuh berkas ini. */}
            {showPrintLink
              ? [
                  { dok: DOKUMEN.portofolio, ikon: 'download', teks: ui.unduhPortofolio },
                  { dok: DOKUMEN.cv, ikon: 'file-text', teks: ui.unduhCV },
                  { dok: DOKUMEN.cvPeneliti, ikon: 'book', teks: ui.unduhCVPeneliti },
                ].map(({ dok, ikon, teks }) => (
                  <Link
                    key={dok.href}
                    href={dok.href}
                    className="inline-flex min-h-6 items-center gap-1.5 rounded-md py-1 text-xs font-semibold text-subtle transition-colors hover:text-fg"
                  >
                    <Icon name={ikon} className="h-3.5 w-3.5" />
                    {t(teks) || t(dok.label)}
                  </Link>
                ))
              : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
