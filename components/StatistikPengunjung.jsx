'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import Icon from '@/components/Icon';

/**
 * =============================================================================
 *  StatistikPengunjung: penghitung kunjungan kecil di footer.
 * =============================================================================
 *
 *  Isinya dua angka dan satu grafik batang tujuh hari terakhir.
 *
 *  KEPUTUSAN TAMPILAN, SEMUANYA DISENGAJA
 *
 *  Angka besar dulu, grafik belakangan. Yang paling ingin diketahui orang
 *  adalah berapa totalnya, bukan bentuk grafiknya. Jadi angka yang jadi tokoh
 *  utama, dan grafik cuma memberi konteks.
 *
 *  Satu warna saja. Datanya cuma satu deret, yaitu jumlah kunjungan per hari.
 *  Deret tunggal tidak butuh legenda dan tidak butuh warna warni, karena tidak
 *  ada yang perlu dibedakan. Judulnya sudah menjelaskan isinya.
 *
 *  Angka memakai warna teks biasa, bukan warna aksen. Warna aksen dipakai
 *  batangnya saja. Kalau angkanya ikut berwarna, tidak ada lagi yang menonjol.
 *
 *  Ada jalur samar di belakang tiap batang. Tanpa itu, hari yang nol kunjungan
 *  terlihat seperti hari yang hilang, bukan hari yang memang sepi.
 *
 *  Ada tabel tersembunyi untuk pembaca layar, karena bentuk batang tidak bisa
 *  didengar.
 *
 *  Kalau penyimpanannya belum dipasang, seluruh bagian ini tidak tampil sama
 *  sekali. Lihat data/README.md bagian 23.
 * =============================================================================
 */

const KUNCI_SESI = 'portofolio-kunjungan-tercatat';

export default function StatistikPengunjung() {
  const { lang } = useLanguage();
  const [data, setData] = useState(null);

  useEffect(() => {
    let batal = false;

    // Satu kunjungan dihitung sekali per sesi peramban. Berpindah halaman di
    // dalam situs tidak menambah hitungan lagi.
    let sudah = false;
    try {
      sudah = sessionStorage.getItem(KUNCI_SESI) === '1';
    } catch {
      // Penyimpanan sesi diblokir. Anggap saja belum tercatat.
    }

    fetch('/api/kunjungan/', { method: sudah ? 'GET' : 'POST' })
      .then((r) => r.json())
      .then((hasil) => {
        if (batal || !hasil?.aktif) return;
        setData(hasil);
        try {
          sessionStorage.setItem(KUNCI_SESI, '1');
        } catch {
          // Tidak apa apa, paling paling terhitung dua kali.
        }
      })
      .catch(() => {
        // Statistik gagal dimuat. Bagian ini memang boleh absen.
      });

    return () => {
      batal = true;
    };
  }, []);

  if (!data) return null;

  const L =
    lang === 'id'
      ? { judul: 'Statistik kunjungan', total: 'Total kunjungan', hariIni: 'Hari ini', tujuh: '7 hari terakhir', kunjungan: 'kunjungan' }
      : { judul: 'Visit statistics', total: 'Total visits', hariIni: 'Today', tujuh: 'Last 7 days', kunjungan: 'visits' };

  const angka = (n) => new Intl.NumberFormat(lang === 'id' ? 'id-ID' : 'en-US').format(n);

  const hari = data.harian ?? [];
  const tertinggi = Math.max(1, ...hari.map((h) => h.jumlah));

  const namaHari = (tanggal) =>
    new Intl.DateTimeFormat(lang === 'id' ? 'id-ID' : 'en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      timeZone: 'Asia/Jakarta',
    }).format(new Date(`${tanggal}T00:00:00+07:00`));

  return (
    <section
      data-print="hide"
      aria-labelledby="statistik-kunjungan"
      className="glass mt-8 rounded-2xl px-5 py-4"
    >
      <h2
        id="statistik-kunjungan"
        className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-subtle"
      >
        <Icon name="users" className="h-3.5 w-3.5 text-accent" />
        {L.judul}
      </h2>

      <div className="mt-3.5 flex flex-wrap items-end gap-x-8 gap-y-4">
        {/* Dua angka utama. Ditulis dengan warna teks biasa supaya tetap jadi
            yang paling menonjol tanpa harus diberi warna. */}
        <div>
          <p className="text-2xl font-bold leading-none tabular-nums text-fg">{angka(data.total)}</p>
          <p className="mt-1.5 text-meta text-subtle">{L.total}</p>
        </div>

        <div>
          <p className="text-2xl font-bold leading-none tabular-nums text-fg">{angka(data.hariIni)}</p>
          <p className="mt-1.5 text-meta text-subtle">{L.hariIni}</p>
        </div>

        {/*
          Grafik tujuh hari. Deret tunggal, jadi satu warna dan tanpa legenda.

          Lebarnya dibatasi di layar besar. Dibiarkan melar, tujuh batang
          berubah jadi balok lebar dan tidak lagi terbaca sebagai grafik
          ringkas pendamping angka.
        */}
        {hari.length > 0 ? (
          <figure className="min-w-0 grow sm:max-w-[15rem]">
            <div className="flex h-10 items-end gap-[3px]" aria-hidden="true">
              {hari.map((h) => {
                const tinggi = Math.round((h.jumlah / tertinggi) * 100);
                return (
                  <div
                    key={h.tanggal}
                    title={`${namaHari(h.tanggal)}: ${angka(h.jumlah)} ${L.kunjungan}`}
                    className="group relative flex h-full flex-1 items-end rounded-t-[4px] bg-line/50 transition-colors hover:bg-line"
                  >
                    <div
                      className="w-full rounded-t-[4px] bg-linear-to-t from-accent-1 to-accent-2 transition-[height] duration-500 ease-out"
                      // Batang selalu punya tinggi minimal supaya hari yang
                      // sepi tetap terbaca sebagai hari, bukan sebagai celah.
                      style={{ height: `${Math.max(tinggi, h.jumlah > 0 ? 8 : 0)}%` }}
                    />
                  </div>
                );
              })}
            </div>
            <figcaption className="mt-2 text-meta text-subtle">{L.tujuh}</figcaption>
          </figure>
        ) : null}
      </div>

      {/* Bentuk batang tidak bisa didengar, jadi angkanya disediakan juga
          sebagai tabel untuk pembaca layar. */}
      <table className="sr-only">
        <caption>{L.tujuh}</caption>
        <tbody>
          {hari.map((h) => (
            <tr key={h.tanggal}>
              <th scope="row">{namaHari(h.tanggal)}</th>
              <td>
                {angka(h.jumlah)} {L.kunjungan}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
