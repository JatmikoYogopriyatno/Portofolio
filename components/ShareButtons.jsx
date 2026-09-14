'use client';

import { useEffect, useRef, useState } from 'react';
import { portfolio } from '@/data/portfolio';
import { useLanguage } from '@/components/LanguageProvider';
import Icon from '@/components/Icon';

/**
 * ShareButtons: baris tombol untuk membagikan satu tulisan.
 *
 * Urutan yang dicoba:
 *  1. Menu berbagi bawaan perangkat, kalau tersedia. Ini yang paling nyaman
 *     di ponsel karena langsung menampilkan semua aplikasi terpasang.
 *  2. Tautan langsung ke WhatsApp, LinkedIn, dan X.
 *  3. Tombol salin tautan sebagai jalan terakhir yang selalu bekerja.
 *
 * Matikan lewat appearance.shareButtons di data/portfolio.js.
 */
export default function ShareButtons({ title, path }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [canUseNativeShare, setCanUseNativeShare] = useState(false);
  const timerRef = useRef(null);

  const enabled = portfolio.appearance?.shareButtons !== false;

  useEffect(() => {
    setCanUseNativeShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
    return () => clearTimeout(timerRef.current);
  }, []);

  if (!enabled) return null;

  // URL dirakit di browser supaya ikut benar walau domainnya berganti.
  const currentUrl = () =>
    typeof window !== 'undefined'
      ? window.location.href
      : `${portfolio.meta.baseUrl.replace(/\/+$/, '')}${path}`;

  const openShare = (buildUrl) => {
    window.open(buildUrl(currentUrl()), '_blank', 'noopener,noreferrer');
  };

  const copyLink = async () => {
    const url = currentUrl();
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const field = document.createElement('textarea');
      field.value = url;
      field.setAttribute('readonly', '');
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.appendChild(field);
      field.select();
      document.execCommand('copy');
      document.body.removeChild(field);
    }
    setCopied(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title, url: currentUrl() });
    } catch {
      // Pengunjung membatalkan dialog berbagi. Tidak perlu ditangani.
    }
  };

  const buttonClass =
    'inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-subtle transition-all duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:text-fg';

  return (
    <div data-print="hide" className="mt-10 flex flex-wrap items-center gap-3 border-t border-line pt-6">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-subtle">
        {t(portfolio.ui.blogShare)}
      </span>

      <div className="flex flex-wrap items-center gap-2">
        {canUseNativeShare ? (
          <button type="button" onClick={nativeShare} aria-label={t(portfolio.ui.shareNative)} title={t(portfolio.ui.shareNative)} className={buttonClass}>
            <Icon name="send" className="h-4 w-4" />
          </button>
        ) : null}

        <button
          type="button"
          onClick={() => openShare((url) => `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`)}
          aria-label="WhatsApp"
          title="WhatsApp"
          className={buttonClass}
        >
          <Icon name="whatsapp" className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => openShare((url) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`)}
          aria-label="LinkedIn"
          title="LinkedIn"
          className={buttonClass}
        >
          <Icon name="linkedin" className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() =>
            openShare((url) => `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`)
          }
          aria-label="X"
          title="X"
          className={buttonClass}
        >
          <Icon name="x" className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={copyLink}
          aria-label={t(portfolio.ui.shareCopyLink)}
          title={t(portfolio.ui.shareCopyLink)}
          className={buttonClass}
        >
          <Icon name={copied ? 'check' : 'copy'} className="h-4 w-4" />
        </button>
      </div>

      <p role="status" aria-live="polite" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
        {copied ? t(portfolio.ui.copied) : ''}
      </p>
    </div>
  );
}
