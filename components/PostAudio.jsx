'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { withBasePath } from '@/lib/asset';
import { adaSuaraLain, jedakanYangLain } from '@/lib/audio-tunggal';
import { jam, potongan } from '@/lib/waktu-audio';
import Icon from '@/components/Icon';

/**
 * =============================================================================
 *  PostAudio: pemutar audio pendamping satu tulisan.
 * =============================================================================
 *
 *  Menempel di bawah judul artikel, seperti tombol "dengarkan tulisan ini" di
 *  Substack. Dipakai untuk tiga hal:
 *
 *    narasi     rekaman kamu membacakan tulisannya
 *    podcast    obrolan atau wawancara yang jadi dasar tulisan
 *    lagu       musik yang cocok menemani tulisannya
 *
 *  CARA MENGISINYA
 *  Panel, Tulisan Blog, buka tulisannya, lalu bagian "Audio pendamping".
 *  Kosongkan kalau tulisan itu tidak punya audio, dan seluruh pemutar ini
 *  tidak ikut tampil.
 *
 *  ---------------------------------------------------------------------------
 *  MEMUTAR SENDIRI, DAN KENAPA KADANG TIDAK BISA
 *  ---------------------------------------------------------------------------
 *  Kalau "Putar sendiri" dinyalakan, musiknya mulai begitu tulisan dibuka.
 *  Tapi ada satu aturan peramban yang tidak bisa dilawan siapa pun:
 *
 *      Suara tidak boleh keluar sebelum pengunjung menyentuh halaman.
 *
 *  Chrome, Safari, dan Firefox sama-sama memakai aturan ini untuk menghentikan
 *  iklan yang tiba-tiba berteriak. Akibatnya:
 *
 *    - Pembaca yang MENGEKLIK tulisan dari daftar blog  -> langsung berbunyi.
 *      Kliknya tadi sudah dihitung sebagai sentuhan.
 *
 *    - Pembaca yang membuka alamatnya langsung dari Google atau dari tautan
 *      yang dibagikan  -> belum berbunyi. Pemutar ini lalu menunggu diam-diam,
 *      dan mulai pada sentuhan pertama, entah klik, ketikan, atau ketukan
 *      di layar. Pembaca tidak perlu menekan tombol putar.
 *
 *  Yang tidak dihitung sebagai sentuhan oleh Chrome adalah menggulir halaman,
 *  jadi menggulir sengaja tidak dipasang sebagai pemicu. Memasangnya cuma
 *  membuat pemutarannya gagal diam-diam.
 *
 *  Suaranya juga dinaikkan pelan selama satu detik, bukan langsung keras.
 *  Musik yang menyambar begitu halaman terbuka itu mengagetkan.
 *
 *  Kalau pembaca menekan jeda, pemutar ini tidak akan menyalakan dirinya lagi.
 *  Sekali orang bilang tidak, jawabannya dihormati.
 * =============================================================================
 */

/** Pilihan kecepatan putar, sama seperti pemutar podcast pada umumnya. */
const KECEPATAN = [1, 1.25, 1.5, 2];

/** Besar suara yang dituju saat musiknya mulai sendiri. */
const SUARA_OTOMATIS = 0.85;

/** Lama suara dinaikkan dari senyap, dalam milidetik. */
const LAMA_NAIK = 1000;

/*
  Peristiwa yang oleh peramban dihitung sebagai "pengunjung menyentuh halaman".
  Menggulir dan menggerakkan tetikus TIDAK termasuk, jadi tidak didaftarkan.
*/
const SENTUHAN = ['pointerdown', 'keydown', 'touchend'];

const JENIS = {
  narasi: { ikon: 'headphones', id: 'Dengarkan tulisan ini', en: 'Listen to this post' },
  podcast: { ikon: 'music', id: 'Dengarkan podcastnya', en: 'Listen to the podcast' },
  lagu: { ikon: 'music', id: 'Musik penemani', en: 'Music to read along to' },
};

export default function PostAudio({ audio }) {
  const { lang, t } = useLanguage();
  const audioRef = useRef(null);
  const idBar = useId();

  const [main, setMain] = useState(false);
  const [posisi, setPosisi] = useState(0);
  const [durasi, setDurasi] = useState(0);
  const [kecepatan, setKecepatan] = useState(1);
  const [gagal, setGagal] = useState(false);

  /* Menandai bahwa pembaca sudah menekan jeda sendiri. Sesudah itu pemutar
     tidak boleh menyalakan dirinya lagi. */
  const dijedaPembaca = useRef(false);

  /* Lompatan ke menit awal cuma boleh sekali. Tanpa penanda ini, tiap kali
     berkasnya dimuat ulang posisi pembaca akan ditarik balik ke awal. */
  const sudahDilompat = useRef(false);

  const { mulai, selesai } = potongan(audio);
  const otomatis = audio?.autoplay !== false;
  const ulang = audio?.loop === true;

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = kecepatan;
  }, [kecepatan]);

  /** Menaikkan suara pelan-pelan dari senyap sampai besar yang dituju. */
  const naikkanSuara = useCallback((el) => {
    const awal = performance.now();
    const langkah = (waktu) => {
      /*
        Dijepit ke rentang nol sampai satu. Cap waktu yang dikirim
        requestAnimationFrame itu waktu MULAI bingkainya, dan itu bisa
        sedikit lebih awal daripada performance.now() yang baru saja dicatat
        di atas. Tanpa penjepit ini, kemajuannya sempat bernilai minus,
        volumenya ikut minus, dan peramban melempar IndexSizeError.
      */
      const maju = Math.min(1, Math.max(0, (waktu - awal) / LAMA_NAIK));
      el.volume = SUARA_OTOMATIS * maju;
      if (maju < 1) requestAnimationFrame(langkah);
    };
    requestAnimationFrame(langkah);
  }, []);

  /*
    Memutar sendiri saat tulisan dibuka.

    Percobaan pertama dilakukan langsung. Kalau ditolak peramban, pemutar
    menunggu sentuhan pertama pengunjung lalu mencoba sekali lagi. Panggilan
    play() di dalam penangan sentuhan itu harus langsung, tanpa await, karena
    Safari cuma menerima pemutaran yang terjadi di dalam gerakan pengguna.
  */
  useEffect(() => {
    if (!otomatis || !audio?.file) return undefined;

    const el = audioRef.current;
    if (!el) return undefined;

    let dilepas = false;

    const lepas = () => {
      if (dilepas) return;
      dilepas = true;
      SENTUHAN.forEach((nama) => window.removeEventListener(nama, coba));
    };

    function coba() {
      if (dijedaPembaca.current) return lepas();
      // Pengunjung sudah menyalakan musik lain. Jangan direbut.
      if (adaSuaraLain(el)) return lepas();

      el.volume = 0;
      const janji = el.play();
      if (janji?.then) {
        janji.then(
          () => {
            lepas();
            naikkanSuara(el);
          },
          () => {
            // Ditolak peramban. Biarkan pendengar sentuhan tetap terpasang.
          }
        );
      }
    }

    coba();
    SENTUHAN.forEach((nama) => window.addEventListener(nama, coba, { passive: true }));

    return () => {
      lepas();
      el.pause();
    };
  }, [otomatis, audio?.file, naikkanSuara]);

  if (!audio?.file || gagal) return null;

  const jenis = JENIS[audio.kind] ?? JENIS.narasi;
  const judul = t(audio.title) || jenis[lang] || jenis.id;

  /*
    Garis waktu memperlihatkan POTONGANNYA, bukan seluruh lagu. Kalau kamu
    memilih menit 1:00 sampai 2:30, pembaca melihat 0:00 sampai 1:30, karena
    itulah yang benar-benar akan dia dengar.
  */
  const ujung = selesai ?? durasi;
  const panjang = Math.max(0, ujung - mulai);
  const majuSegmen = Math.min(Math.max(0, posisi - mulai), panjang);
  const persen = panjang > 0 ? (majuSegmen / panjang) * 100 : 0;

  const putarJeda = () => {
    const el = audioRef.current;
    if (!el) return;

    if (el.paused) {
      dijedaPembaca.current = false;
      el.volume = SUARA_OTOMATIS;
      el.play().then(
        () => setMain(true),
        () => setMain(false)
      );
    } else {
      // Ditekan orang, bukan oleh akhir potongan. Jangan menyala sendiri lagi.
      dijedaPembaca.current = true;
      el.pause();
      setMain(false);
    }
  };

  const mundur = () => {
    const el = audioRef.current;
    if (el) el.currentTime = Math.max(mulai, el.currentTime - 15);
  };

  /* Melompat ke menit awal yang kamu pilih, begitu panjang lagunya diketahui. */
  const siapkanPosisi = (el) => {
    if (sudahDilompat.current || mulai <= 0) return;
    if (!Number.isFinite(el.duration) || mulai >= el.duration) return;
    sudahDilompat.current = true;
    el.currentTime = mulai;
  };

  /* Menjaga agar pemutaran berhenti tepat di menit yang kamu pilih. */
  const jagaUjung = (el) => {
    if (selesai === null || el.currentTime < selesai) return;

    if (ulang) {
      el.currentTime = mulai;
      return;
    }

    el.pause();
    el.currentTime = mulai;
    sudahDilompat.current = true;
    setPosisi(mulai);
  };

  return (
    <div data-print="hide" className="glass mt-7 rounded-2xl p-3.5 sm:p-4">
      <audio
        ref={audioRef}
        src={withBasePath(audio.file)}
        /*
          preload="none", bukan "metadata".

          Dengan "metadata", Chrome mengunduh berkas MP3-nya utuh hanya untuk
          mencari tahu durasinya. Satu tulisan berlagu jadi memakan hampir
          sembilan megabita kuota pembaca sebelum tombol putar disentuh sama
          sekali. Sekarang tidak ada satu bita pun yang diunduh sampai
          pemutarannya benar-benar dimulai.
        */
        preload="none"
        onLoadedMetadata={(e) => {
          setDurasi(e.currentTarget.duration);
          siapkanPosisi(e.currentTarget);
        }}
        onTimeUpdate={(e) => {
          setPosisi(e.currentTarget.currentTime);
          jagaUjung(e.currentTarget);
        }}
        onDurationChange={(e) => setDurasi(e.currentTarget.duration)}
        onEnded={(e) => {
          if (!ulang) return setMain(false);
          e.currentTarget.currentTime = mulai;
          e.currentTarget.play().catch(() => setMain(false));
        }}
        onPlay={(e) => {
          setMain(true);
          jedakanYangLain(e.currentTarget);
        }}
        onPause={() => setMain(false)}
        onError={() => setGagal(true)}
      />

      <div className="flex items-center gap-3 sm:gap-3.5">
        <button
          type="button"
          onClick={putarJeda}
          aria-label={main ? 'Jeda' : `Putar: ${judul}`}
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-linear-to-br from-accent-1 to-accent-2 text-white transition-transform hover:scale-105"
        >
          <Icon name={main ? 'pause' : 'play'} className="h-[18px] w-[18px]" />
        </button>

        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 truncate text-sm font-semibold text-fg">
            <Icon name={jenis.ikon} className="h-3.5 w-3.5 shrink-0 text-accent" />
            {judul}
          </p>

          {/* Garis waktu. Bagian yang sudah lewat diwarnai lewat gradien latar. */}
          <label className="sr-only" htmlFor={idBar}>
            Posisi audio
          </label>
          <input
            id={idBar}
            type="range"
            min={0}
            max={panjang || 0}
            step={1}
            value={majuSegmen}
            onChange={(e) => {
              const nilai = Number(e.target.value);
              setPosisi(mulai + nilai);
              if (audioRef.current) {
                sudahDilompat.current = true;
                audioRef.current.currentTime = mulai + nilai;
              }
            }}
            className="pemutar-garis mt-2 w-full"
            style={{ '--lewat': `${persen}%` }}
          />

          <div className="mt-1 flex items-center justify-between text-[0.7rem] tabular-nums text-subtle">
            <span>{jam(majuSegmen)}</span>
            <span>{panjang ? jam(panjang) : ''}</span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={mundur}
            aria-label="Mundur 15 detik"
            title="Mundur 15 detik"
            className="grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-surface hover:text-fg"
          >
            <Icon name="rewind-15" className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setKecepatan((k) => KECEPATAN[(KECEPATAN.indexOf(k) + 1) % KECEPATAN.length])}
            aria-label={`Kecepatan putar ${kecepatan} kali. Klik untuk mengubah.`}
            title="Kecepatan putar"
            className="grid h-9 min-w-11 place-items-center rounded-full px-2 text-xs font-semibold tabular-nums text-muted transition-colors hover:bg-surface hover:text-fg"
          >
            {kecepatan}x
          </button>
        </div>
      </div>
    </div>
  );
}
