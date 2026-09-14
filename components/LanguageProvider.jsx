'use client';

import {
  createContext,
  useCallback,
  useContext,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { portfolio } from '@/data/portfolio';
import { t as translate } from '@/lib/i18n';

/**
 * =============================================================================
 *  Satu state bahasa untuk seluruh situs (ID dan EN), tanpa library i18n.
 * =============================================================================
 *
 *  Nilai awal diambil dari portfolio.meta.locale di data/portfolio.js.
 *
 *  KENAPA ADA DUA NILAI BAHASA DI SINI
 *
 *  Beranda ini memakai t() di puluhan komponen sekaligus. Menekan tombol ID/EN
 *  berarti seluruh halaman, lebih dari seribu enam ratus elemen, harus digambar
 *  ulang dalam sekali kerja. Di ponsel kelas menengah itu memakan waktu yang
 *  cukup untuk terasa: layar membeku sebentar, sentuhan tidak terjawab, dan
 *  tombolnya sendiri baru menyala setelah semuanya selesai.
 *
 *  Karena itu ada dua nilai:
 *
 *    langLangsung   berubah seketika saat tombolnya ditekan. Hanya dipakai
 *                   tombol pengalih bahasa, supaya penandanya langsung pindah
 *                   dan terasa menjawab sentuhan.
 *
 *    lang           versi tertunda lewat useDeferredValue. Ini yang dipakai
 *                   seluruh isi halaman. React mengerjakannya sebagai pekerjaan
 *                   berprioritas rendah yang boleh disela, jadi menggulir dan
 *                   menyentuh tetap lancar selama teksnya berganti.
 *
 *  Hasil yang terlihat sama saja: teksnya berganti. Yang berubah cuma halaman
 *  tidak lagi membeku selama pergantiannya berlangsung.
 * =============================================================================
 */
const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [langLangsung, setLang] = useState(portfolio.meta.locale === 'en' ? 'en' : 'id');
  const lang = useDeferredValue(langLangsung);

  // Sinkronkan atribut lang pada <html> agar screen reader membaca dengan benar.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLang = useCallback(() => {
    setLang((current) => (current === 'id' ? 'en' : 'id'));
  }, []);

  // `t` terikat ke bahasa aktif supaya komponen cukup memanggil t(value).
  const value = useMemo(
    () => ({
      lang,
      langLangsung,
      setLang,
      toggleLang,
      t: (input) => translate(input, lang),
    }),
    [lang, langLangsung, toggleLang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

/** Hook pembaca konteks bahasa. */
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage harus dipakai di dalam <LanguageProvider>.');
  }
  return context;
}

export default LanguageProvider;
