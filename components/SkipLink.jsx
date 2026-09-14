'use client';

import { portfolio } from '@/data/portfolio';
import { useLanguage } from '@/components/LanguageProvider';

/**
 * SkipLink: tautan lompat ke konten untuk pengguna keyboard dan pembaca layar.
 * Tersembunyi sampai menerima fokus (Tab pertama saat halaman dibuka).
 */
export default function SkipLink() {
  const { t } = useLanguage();

  return (
    <a
      href="#main"
      className="sr-only rounded-full bg-linear-to-r from-accent-1 to-accent-2 px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60]"
    >
      {t(portfolio.ui.skipToContent)}
    </a>
  );
}
