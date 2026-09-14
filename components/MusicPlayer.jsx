'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { portfolio } from '@/data/portfolio';
import { useLanguage } from '@/components/LanguageProvider';
import { withBasePath } from '@/lib/asset';
import { jedakanYangLain } from '@/lib/audio-tunggal';
import Icon from '@/components/Icon';

/**
 * =============================================================================
 *  MusicPlayer: pemutar musik kecil yang menempel di pojok kiri bawah.
 * =============================================================================
 *
 *  CARA MENGISINYA
 *  Buka panel di /admin, menu Pengaturan, lalu Musik. Nyalakan sakelarnya,
 *  unggah berkas lagu, isi judulnya, selesai. Kalau daftar lagunya kosong atau
 *  sakelarnya mati, seluruh pemutar ini tidak ikut tampil sama sekali.
 *
 *  JANJI KE PENGUNJUNG
 *  Pemutar INI tidak pernah berbunyi sendiri saat halaman dibuka. Itu disengaja.
 *  Suara yang tiba tiba muncul mengagetkan, memakan kuota, dan mengganggu orang
 *  yang sedang mendengarkan hal lain. Pengunjung yang memutuskan untuk memutar.
 *
 *  Yang boleh berbunyi sendiri cuma audio pendamping di halaman tulisan blog,
 *  dan itu pun kamu yang menyalakannya per tulisan lewat panel. Lihat
 *  components/PostAudio.jsx. Supaya keduanya tidak pernah berbunyi bersamaan,
 *  yang paling terakhir dinyalakan menjeda yang lain, lihat lib/audio-tunggal.js.
 *
 *  Pilihan terakhir pengunjung (lagu yang sedang diputar dan besar suaranya)
 *  diingat di perangkat mereka sendiri, tidak dikirim ke mana pun.
 * =============================================================================
 */

const SIMPANAN = 'portofolio-musik';

export default function MusicPlayer() {
  const { t } = useLanguage();
  const music = portfolio.music ?? {};
  const tracks = Array.isArray(music.tracks) ? music.tracks.filter((lagu) => lagu?.file) : [];

  const audioRef = useRef(null);
  const panelId = useId();

  const [terbuka, setTerbuka] = useState(false);
  const [indeks, setIndeks] = useState(0);
  const [main, setMain] = useState(false);
  const [suara, setSuara] = useState(0.7);
  const [bisu, setBisu] = useState(false);
  const [posisi, setPosisi] = useState(0);
  const [durasi, setDurasi] = useState(0);

  // Kembalikan pilihan terakhir pengunjung di perangkat ini.
  useEffect(() => {
    try {
      const tersimpan = JSON.parse(localStorage.getItem(SIMPANAN) || '{}');
      if (typeof tersimpan.volume === 'number') setSuara(Math.min(1, Math.max(0, tersimpan.volume)));
      if (typeof tersimpan.track === 'number') setIndeks(tersimpan.track);
    } catch {
      // Penyimpanan diblokir peramban. Pemutar tetap jalan dengan nilai bawaan.
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(SIMPANAN, JSON.stringify({ volume: suara, track: indeks }));
    } catch {
      // Tidak apa apa, ini cuma kenyamanan tambahan.
    }
  }, [suara, indeks]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = bisu ? 0 : suara;
  }, [suara, bisu]);

  const pindah = useCallback(
    (arah) => {
      if (tracks.length === 0) return;
      setIndeks((kini) => (kini + arah + tracks.length) % tracks.length);
      setPosisi(0);
      // Lagu berikutnya langsung diputar kalau yang sebelumnya sedang berbunyi.
      if (main) requestAnimationFrame(() => audioRef.current?.play().catch(() => setMain(false)));
    },
    [main, tracks.length]
  );

  if (music.enabled === false || tracks.length === 0) return null;

  const laguKini = tracks[Math.min(indeks, tracks.length - 1)] ?? tracks[0];
  const judulLagu = t(laguKini.title) || 'Tanpa judul';

  const putarJeda = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => setMain(true)).catch(() => setMain(false));
    } else {
      audio.pause();
      setMain(false);
    }
  };

  const jam = (detik) => {
    if (!Number.isFinite(detik)) return '0:00';
    const m = Math.floor(detik / 60);
    const d = Math.floor(detik % 60);
    return `${m}:${String(d).padStart(2, '0')}`;
  };

  return (
    <div data-print="hide" className="fixed bottom-5 left-4 z-40 sm:bottom-6 sm:left-6">
      <audio
        ref={audioRef}
        src={withBasePath(laguKini.file)}
        preload="none"
        onTimeUpdate={(e) => setPosisi(e.currentTarget.currentTime)}
        onDurationChange={(e) => setDurasi(e.currentTarget.duration)}
        onEnded={() => pindah(1)}
        onPlay={(e) => {
          setMain(true);
          // Audio pendamping di halaman blog bisa berbunyi sendiri. Kalau
          // pengunjung menyalakan pemutar ini, yang itu harus mengalah.
          jedakanYangLain(e.currentTarget);
        }}
        onPause={() => setMain(false)}
      />

      {/* Panel daftar lagu, muncul di atas tombolnya. */}
      {terbuka ? (
        <div
          id={panelId}
          className="glass glass-nav-solid mb-3 w-[min(19rem,calc(100vw-2rem))] rounded-2xl p-3.5"
        >
          <div className="mb-3 flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-fg">{judulLagu}</p>
              {t(laguKini.artist) ? (
                <p className="truncate text-xs text-subtle">{t(laguKini.artist)}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => setTerbuka(false)}
              aria-label={t(portfolio.ui.closeMenu)}
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-subtle hover:text-fg"
            >
              <Icon name="close" className="h-4 w-4" />
            </button>
          </div>

          {/* Garis waktu lagu */}
          <label className="sr-only" htmlFor={`${panelId}-posisi`}>
            Posisi lagu
          </label>
          <input
            id={`${panelId}-posisi`}
            type="range"
            min={0}
            max={durasi || 0}
            step={1}
            value={Math.min(posisi, durasi || 0)}
            onChange={(e) => {
              const nilai = Number(e.target.value);
              setPosisi(nilai);
              if (audioRef.current) audioRef.current.currentTime = nilai;
            }}
            className="w-full accent-[var(--accent-1)]"
          />
          <div className="mb-3 flex justify-between text-[0.7rem] tabular-nums text-subtle">
            <span>{jam(posisi)}</span>
            <span>{jam(durasi)}</span>
          </div>

          {/* Tombol kendali */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => pindah(-1)}
                aria-label="Lagu sebelumnya"
                className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-surface hover:text-fg"
              >
                <Icon name="skip-back" className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={putarJeda}
                aria-label={main ? 'Jeda' : 'Putar'}
                className="grid h-11 w-11 place-items-center rounded-full bg-linear-to-br from-accent-1 to-accent-2 text-white"
              >
                <Icon name={main ? 'pause' : 'play'} className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => pindah(1)}
                aria-label="Lagu berikutnya"
                className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-surface hover:text-fg"
              >
                <Icon name="skip-forward" className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setBisu((n) => !n)}
                aria-label={bisu ? 'Bunyikan' : 'Bisukan'}
                className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-surface hover:text-fg"
              >
                <Icon name={bisu ? 'volume-off' : 'volume'} className="h-4 w-4" />
              </button>
              <label className="sr-only" htmlFor={`${panelId}-suara`}>
                Besar suara
              </label>
              <input
                id={`${panelId}-suara`}
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={bisu ? 0 : suara}
                onChange={(e) => {
                  setSuara(Number(e.target.value));
                  setBisu(false);
                }}
                className="w-16 accent-[var(--accent-1)]"
              />
            </div>
          </div>

          {/* Daftar lagu, hanya kalau memang lebih dari satu. */}
          {tracks.length > 1 ? (
            <ul className="mt-3 max-h-44 space-y-0.5 overflow-y-auto border-t border-line pt-2.5">
              {tracks.map((lagu, i) => (
                <li key={`${lagu.file}-${i}`}>
                  <button
                    type="button"
                    onClick={() => {
                      setIndeks(i);
                      setPosisi(0);
                      requestAnimationFrame(() => audioRef.current?.play().catch(() => setMain(false)));
                    }}
                    aria-current={i === indeks ? 'true' : undefined}
                    className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition-colors ${
                      i === indeks ? 'bg-surface text-fg' : 'text-muted hover:bg-surface hover:text-fg'
                    }`}
                  >
                    <span className="w-4 shrink-0 text-center tabular-nums text-subtle">{i + 1}</span>
                    <span className="truncate">{t(lagu.title) || 'Tanpa judul'}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      {/* Tombol utama yang selalu terlihat. */}
      <button
        type="button"
        onClick={() => setTerbuka((n) => !n)}
        aria-expanded={terbuka}
        aria-controls={terbuka ? panelId : undefined}
        title={t(music.title) || 'Musik'}
        className="glass glass-hover flex h-12 items-center gap-2 rounded-full px-3.5 text-muted hover:text-fg"
      >
        <span
          className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${
            main ? 'bg-linear-to-br from-accent-1 to-accent-2 text-white' : ''
          }`}
        >
          <Icon name="music" className="h-4 w-4" />
        </span>
        <span className="hidden max-w-36 truncate text-xs font-medium sm:block">
          {main ? judulLagu : t(music.title) || 'Musik'}
        </span>
      </button>
    </div>
  );
}
