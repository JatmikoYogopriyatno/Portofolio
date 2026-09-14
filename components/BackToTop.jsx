'use client';

import { portfolio } from '@/data/portfolio';
import { useLanguage } from '@/components/LanguageProvider';
import { useAmbangGulir } from '@/hooks/useGulir';
import Icon from '@/components/Icon';

/**
 * BackToTop: tombol bundar melayang di sudut kanan bawah. Muncul setelah
 * pengunjung menggulir cukup jauh, lalu membawa mereka kembali ke atas.
 *
 * Matikan lewat appearance.backToTop di data/portfolio.js.
 */
export default function BackToTop() {
  const { t } = useLanguage();
  // Menumpang pendengar gulir bersama, lihat hooks/useGulir.js
  const visible = useAmbangGulir(0, 0.9);
  const enabled = portfolio.appearance?.backToTop !== false;

  if (!enabled) return null;

  const label = t(portfolio.ui.backToTop);

  return (
    <button
      type="button"
      data-print="hide"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={label}
      title={label}
      tabIndex={visible ? 0 : -1}
      aria-hidden={visible ? undefined : 'true'}
      className={`glass glass-hover fixed bottom-5 right-5 z-40 grid h-12 w-12 place-items-center rounded-full text-fg transition-all duration-300 sm:bottom-7 sm:right-7 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <Icon name="arrow-up" className="h-5 w-5" />
    </button>
  );
}
