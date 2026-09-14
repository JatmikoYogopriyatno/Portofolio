'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { portfolio } from '@/data/portfolio';
import { DOKUMEN } from '@/components/DokumenBilah';
import { useLanguage } from '@/components/LanguageProvider';
import { useTheme } from '@/components/ThemeProvider';
import { withBasePath } from '@/lib/asset';
import Icon from '@/components/Icon';

/** Nama event yang menghubungkan tombol di navbar dengan dialog pencarian. */
const OPEN_EVENT = 'portfolio:open-command-palette';

/**
 * CommandPalette: pencarian cepat yang dibuka dengan Ctrl+K atau Cmd+K.
 *
 * Isinya dirakit dari data yang sudah ada, jadi menambah proyek, tulisan, atau
 * tautan sosial otomatis menambahnya ke daftar pencarian tanpa pekerjaan lain.
 *
 * Kendali keyboard:
 *   Ctrl+K atau Cmd+K   buka dan tutup
 *   Panah atas / bawah  pindah pilihan
 *   Enter               buka pilihan
 *   Escape              tutup
 *
 * Daftar tulisan dikirim app/layout.js sebagai props dalam bentuk ringkas
 * (hanya slug, judul, dan topik), supaya isi lengkap artikel tidak ikut
 * dikirim ke browser di setiap halaman.
 *
 * Matikan lewat appearance.commandPalette di data/portfolio.js.
 */
export default function CommandPalette({ posts = [] }) {
  const { lang, toggleLang, t } = useLanguage();
  const { toggleTheme, isDark } = useTheme();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);

  const inputRef = useRef(null);
  const listRef = useRef(null);
  const openerRef = useRef(null);

  const enabled = portfolio.appearance?.commandPalette !== false;
  const { ui, nav, projects, social, profile, contact } = portfolio;

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setCursor(0);
    if (openerRef.current instanceof HTMLElement) openerRef.current.focus();
  }, []);

  /* ------------------------------------------------------------------ data */
  // Seluruh isi pencarian, dirakit sekali per perubahan bahasa.
  const entries = useMemo(() => {
    const list = [];

    nav.forEach((navItem) => {
      list.push({
        id: `nav-${navItem.id}`,
        group: t(ui.searchGroupSections),
        label: t(navItem.label),
        hint: t(portfolio.sections?.[navItem.id]?.subtitle) ?? '',
        icon: navItem.type === 'page' ? 'newspaper' : 'compass',
        run: () => {
          if (navItem.type === 'page') router.push(navItem.href ?? `/${navItem.id}/`);
          else window.location.hash = `#${navItem.id}`;
        },
      });
    });

    projects.forEach((project) => {
      list.push({
        id: `project-${project.name}`,
        group: t(ui.searchGroupProjects),
        label: project.name,
        hint: [t(project.org), ...(project.tags ?? [])].filter(Boolean).join(' · '),
        icon: 'folder',
        run: () => {
          window.location.hash = '#projects';
        },
      });
    });

    posts.forEach((post) => {
      list.push({
        id: `post-${post.slug}`,
        group: t(ui.searchGroupPosts),
        label: t(post.title),
        hint: (post.tags ?? []).join(' · '),
        icon: 'pen-line',
        run: () => router.push(`/blog/${post.slug}/`),
      });
    });

    social.forEach((item) => {
      list.push({
        id: `social-${item.label}`,
        group: t(ui.searchGroupSocial),
        label: item.label,
        hint: item.handle ?? '',
        icon: item.icon,
        run: () => window.open(item.href, '_blank', 'noopener,noreferrer'),
      });
    });

    list.push({
      id: 'action-theme',
      group: t(ui.searchGroupActions),
      label: isDark ? t(ui.themeToLight) : t(ui.themeToDark),
      hint: t(ui.searchActionTheme),
      icon: isDark ? 'sun' : 'moon',
      run: toggleTheme,
    });

    list.push({
      id: 'action-language',
      group: t(ui.searchGroupActions),
      label: lang === 'id' ? 'English' : 'Bahasa Indonesia',
      hint: t(ui.searchActionLanguage),
      icon: 'languages',
      run: toggleLang,
    });

    list.push({
      id: 'action-email',
      group: t(ui.searchGroupActions),
      label: t(contact.ctaText),
      hint: contact.email,
      icon: 'mail',
      run: () => {
        window.location.href = `mailto:${contact.email}`;
      },
    });

    if (profile.resumeUrl) {
      list.push({
        id: 'action-resume',
        group: t(ui.searchGroupActions),
        label: t(ui.ctaResume),
        hint: t(ui.searchActionResume),
        icon: 'download',
        run: () => {
          const href = profile.resumeUrl.startsWith('http')
            ? profile.resumeUrl
            : withBasePath(profile.resumeUrl);
          window.open(href, '_blank', 'noopener,noreferrer');
        },
      });
    }

    if (portfolio.appearance?.printLink !== false) {
      // Tiga berkas siap unduh, masing masing halaman tersendiri di /cetak/.
      list.push(
        {
          id: 'action-dok-portofolio',
          group: t(ui.searchGroupActions),
          label: t(ui.unduhPortofolio) || t(DOKUMEN.portofolio.label),
          hint: t(ui.searchActionPrint),
          icon: 'download',
          run: () => router.push(DOKUMEN.portofolio.href),
        },
        {
          id: 'action-dok-cv',
          group: t(ui.searchGroupActions),
          label: t(ui.unduhCV) || t(DOKUMEN.cv.label),
          hint: t(ui.searchActionPrint),
          icon: 'file-text',
          run: () => router.push(DOKUMEN.cv.href),
        },
        {
          id: 'action-dok-cv-peneliti',
          group: t(ui.searchGroupActions),
          label: t(ui.unduhCVPeneliti) || t(DOKUMEN.cvPeneliti.label),
          hint: t(ui.searchActionPrint),
          icon: 'book',
          run: () => router.push(DOKUMEN.cvPeneliti.href),
        }
      );
    }

    return list;
  }, [lang, isDark, nav, projects, social, profile, contact, posts, ui, t, router, toggleTheme, toggleLang]);

  // Pencocokan sederhana: semua kata yang diketik harus muncul di label atau petunjuk.
  const results = useMemo(() => {
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (words.length === 0) return entries;

    return entries.filter((entry) => {
      const haystack = `${entry.label} ${entry.hint} ${entry.group}`.toLowerCase();
      return words.every((word) => haystack.includes(word));
    });
  }, [entries, query]);

  // Kelompokkan hasil, urutannya mengikuti kemunculan pertama tiap kelompok.
  const groups = useMemo(() => {
    const map = new Map();
    results.forEach((entry) => {
      if (!map.has(entry.group)) map.set(entry.group, []);
      map.get(entry.group).push(entry);
    });
    return [...map.entries()];
  }, [results]);

  /* -------------------------------------------------------------- keyboard */
  // Pintasan keyboard global, plus event yang dipakai tombol di navbar.
  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (event) => {
      const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
      if (!isShortcut) return;
      event.preventDefault();
      setOpen((value) => {
        if (!value) openerRef.current = document.activeElement;
        return !value;
      });
    };

    // Tombol pemicu di navbar cukup melempar event ini, tanpa perlu context.
    const onRequestOpen = () => {
      openerRef.current = document.activeElement;
      setOpen(true);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener(OPEN_EVENT, onRequestOpen);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener(OPEN_EVENT, onRequestOpen);
    };
  }, [enabled]);

  // Kunci gulir halaman dan pindahkan fokus ke kotak isian saat terbuka.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    inputRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  // Jaga agar pilihan tidak melewati jumlah hasil saat pencarian menyempit.
  useEffect(() => {
    setCursor((value) => Math.min(value, Math.max(0, results.length - 1)));
  }, [results.length]);

  // Gulirkan pilihan yang aktif agar selalu terlihat.
  useEffect(() => {
    if (!open) return;
    const active = listRef.current?.querySelector('[data-active="true"]');
    active?.scrollIntoView({ block: 'nearest' });
  }, [cursor, open]);

  const runEntry = useCallback(
    (entry) => {
      close();
      // Tunggu satu frame supaya kunci gulir sudah dilepas sebelum berpindah.
      requestAnimationFrame(() => entry.run());
    },
    [close]
  );

  const onInputKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setCursor((value) => (results.length === 0 ? 0 : (value + 1) % results.length));
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setCursor((value) => (results.length === 0 ? 0 : (value - 1 + results.length) % results.length));
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      const entry = results[cursor];
      if (entry) runEntry(entry);
    }
  };

  if (!enabled) return null;

  // Nomor urut global dipakai untuk menandai baris mana yang sedang dipilih.
  let runningIndex = -1;

  return (
    <>
      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t(ui.searchOpen)}
          data-print="hide"
          className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[12svh]"
          style={{ animation: 'fade-in 0.2s ease-out' }}
        >
          <button
            type="button"
            aria-label={t(ui.searchHintClose)}
            onClick={close}
            className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-md"
          />

          <div
            className="glass relative z-10 flex max-h-[70svh] w-full max-w-xl flex-col overflow-hidden rounded-2xl"
            style={{ animation: 'lightbox-in 0.3s cubic-bezier(0.22, 1, 0.36, 1)' }}
          >
            {/* Kotak isian */}
            <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
              <Icon name="compass" className="h-4 w-4 shrink-0 text-accent" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setCursor(0);
                }}
                onKeyDown={onInputKeyDown}
                placeholder={t(ui.searchPlaceholder)}
                aria-label={t(ui.searchPlaceholder)}
                // Cincin fokus dimatikan khusus di sini karena kotak dialognya
                // sendiri sudah menjadi penanda fokus, dan kursor teks sudah
                // menunjukkan tempat mengetik.
                className="min-w-0 grow bg-transparent text-[0.9375rem] text-fg outline-none focus-visible:outline-none placeholder:text-subtle"
              />
              <kbd className="hidden shrink-0 rounded-md border border-line px-1.5 py-0.5 text-[0.65rem] font-semibold text-subtle sm:block">
                ESC
              </kbd>
            </div>

            {/* Hasil */}
            <div ref={listRef} className="min-h-0 grow overflow-y-auto overscroll-contain p-2">
              {results.length === 0 ? (
                <p className="px-3 py-8 text-center text-sm text-subtle">{t(ui.searchEmpty)}</p>
              ) : (
                groups.map(([groupName, groupItems]) => (
                  <div key={groupName} className="mb-1.5 last:mb-0">
                    <p className="px-3 pb-1 pt-2 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-subtle">
                      {groupName}
                    </p>
                    <ul>
                      {groupItems.map((entry) => {
                        runningIndex += 1;
                        const index = runningIndex;
                        const active = index === cursor;

                        return (
                          <li key={entry.id}>
                            <button
                              type="button"
                              data-active={active}
                              onMouseMove={() => setCursor(index)}
                              onClick={() => runEntry(entry)}
                              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                                active ? 'bg-surface text-fg' : 'text-muted hover:bg-surface'
                              }`}
                            >
                              <span
                                className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-line ${
                                  active ? 'bg-linear-to-br from-accent-1 to-accent-2 text-white' : 'text-subtle'
                                }`}
                              >
                                <Icon name={entry.icon} className="h-3.5 w-3.5" />
                              </span>

                              <span className="min-w-0 grow">
                                <span className="block truncate text-sm font-medium text-fg">
                                  {entry.label}
                                </span>
                                {entry.hint ? (
                                  <span className="block truncate text-xs text-subtle">{entry.hint}</span>
                                ) : null}
                              </span>

                              {active ? (
                                <Icon name="arrow-right" className="h-4 w-4 shrink-0 text-accent" />
                              ) : null}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))
              )}
            </div>

            {/* Petunjuk tombol */}
            <div className="hidden items-center gap-4 border-t border-line px-4 py-2.5 text-[0.7rem] text-subtle sm:flex">
              <span className="inline-flex items-center gap-1.5">
                <kbd className="rounded border border-line px-1.5 py-0.5 font-semibold">&uarr;</kbd>
                <kbd className="rounded border border-line px-1.5 py-0.5 font-semibold">&darr;</kbd>
                {t(ui.searchHintNavigate)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <kbd className="rounded border border-line px-1.5 py-0.5 font-semibold">&crarr;</kbd>
                {t(ui.searchHintOpen)}
              </span>
              <span className="ml-auto">{results.length}</span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

/**
 * Tombol pembuka pencarian, dipakai di navbar.
 *
 * Sengaja dipisah dari dialognya dan berkomunikasi lewat satu event window,
 * supaya navbar tidak perlu tahu apa pun tentang isi pencarian.
 */
export function CommandPaletteTrigger({ className = '' }) {
  const { t } = useLanguage();
  const [isMac, setIsMac] = useState(false);

  const enabled = portfolio.appearance?.commandPalette !== false;

  useEffect(() => {
    // Tampilkan lambang tombol yang sesuai dengan perangkat pengunjung.
    setIsMac(/mac|iphone|ipad/i.test(navigator.userAgent));
  }, []);

  if (!enabled) return null;

  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent(OPEN_EVENT))}
      aria-label={t(portfolio.ui.searchOpen)}
      title={t(portfolio.ui.searchOpen)}
      className={`hidden items-center gap-2 rounded-full border border-line bg-surface py-1.5 pl-3 pr-1.5 text-xs text-subtle transition-colors hover:border-line-strong hover:text-fg md:flex ${className}`}
    >
      <Icon name="compass" className="h-3.5 w-3.5" />
      <kbd className="rounded-md border border-line px-1.5 py-0.5 text-[0.65rem] font-semibold">
        {isMac ? '⌘' : 'Ctrl'} K
      </kbd>
    </button>
  );
}
