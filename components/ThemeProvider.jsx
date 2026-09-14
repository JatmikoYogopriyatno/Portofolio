'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { THEME_STORAGE_KEY } from '@/lib/theme';

/**
 * Satu state tema untuk seluruh situs: 'light' atau 'dark'.
 *
 * Cara kerjanya:
 *  1. Skrip kecil di app/layout.js sudah memasang atribut data-theme pada <html>
 *     sebelum halaman digambar, jadi tidak ada kedipan warna saat memuat.
 *  2. Provider ini membaca atribut itu sebagai nilai awal, lalu menyimpan
 *     pilihan pengguna ke localStorage.
 *  3. Kalau pengguna belum pernah memilih, situs mengikuti pengaturan sistem
 *     dan ikut berubah otomatis saat sistemnya berubah.
 */
const ThemeContext = createContext(null);

function readInitialTheme() {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(readInitialTheme);
  // Menandai apakah pengguna sudah memilih sendiri (bukan mengikuti sistem).
  const [isPinned, setIsPinned] = useState(false);

  // Sinkronkan state React dengan DOM saat komponen pertama kali hidup.
  useEffect(() => {
    setThemeState(readInitialTheme());
    try {
      setIsPinned(Boolean(window.localStorage.getItem(THEME_STORAGE_KEY)));
    } catch {
      setIsPinned(false);
    }
  }, []);

  // Terapkan tema ke <html> dan simpan pilihannya.
  const setTheme = useCallback((next) => {
    setThemeState(next);
    setIsPinned(true);
    document.documentElement.dataset.theme = next;
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Mode penyamaran atau penyimpanan diblokir: tema tetap jalan, hanya tidak tersimpan.
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  // Ikuti pengaturan sistem selama pengguna belum memilih sendiri.
  useEffect(() => {
    if (isPinned || typeof window.matchMedia !== 'function') return;

    const query = window.matchMedia('(prefers-color-scheme: light)');
    const apply = (event) => {
      const next = event.matches ? 'light' : 'dark';
      setThemeState(next);
      document.documentElement.dataset.theme = next;
    };

    query.addEventListener('change', apply);
    return () => query.removeEventListener('change', apply);
  }, [isPinned]);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme, isDark: theme === 'dark' }),
    [theme, setTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme harus dipakai di dalam <ThemeProvider>.');
  return context;
}

export default ThemeProvider;
