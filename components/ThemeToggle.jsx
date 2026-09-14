'use client';

import { portfolio } from '@/data/portfolio';
import { useLanguage } from '@/components/LanguageProvider';
import { useTheme } from '@/components/ThemeProvider';
import Icon from '@/components/Icon';

/**
 * Tombol ganti mode terang dan gelap.
 * Ikonnya bertukar dengan transisi putar supaya terasa hidup tapi tidak berisik.
 */
export default function ThemeToggle({ className = '' }) {
  const { t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();

  const label = isDark ? t(portfolio.ui.themeToLight) : t(portfolio.ui.themeToDark);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={`relative grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full border border-line bg-surface text-fg transition-colors hover:border-line-strong ${className}`}
    >
      <span
        className={`absolute transition-all duration-500 ${
          isDark ? 'translate-y-0 rotate-0 opacity-100' : '-translate-y-6 rotate-90 opacity-0'
        }`}
      >
        <Icon name="moon" className="h-[18px] w-[18px]" />
      </span>
      <span
        className={`absolute transition-all duration-500 ${
          isDark ? 'translate-y-6 -rotate-90 opacity-0' : 'translate-y-0 rotate-0 opacity-100'
        }`}
      >
        <Icon name="sun" className="h-[18px] w-[18px]" />
      </span>
    </button>
  );
}
