'use client';

import { portfolio } from '@/data/portfolio';
import { useLanguage } from '@/components/LanguageProvider';
import TabelAkademik, { JudulTaut, Tanda } from '@/components/TabelAkademik';

/**
 * Publikasi artikel ilmiah dalam jurnal.
 *
 * Templat aslinya menampilkan publikasi sebagai kartu besar lengkap dengan
 * abstrak yang bisa dibuka. Bentuk itu pas untuk satu atau dua artikel, tapi
 * daftar di sini dua puluh enam baris dan tiap barisnya cuma punya judul,
 * jenis luaran, dan tautan. Dua puluh enam kartu besar berisi tiga baris teks
 * membuat halaman panjang tanpa menambah keterangan apa pun.
 *
 * Jadi bentuknya disamakan dengan bagian akademik yang lain: tabel, dengan
 * judul yang langsung bisa diklik ke sumber artikelnya.
 *
 * Kolom venue, tanggal, dan abstrak tetap ada di berkasnya dan tetap muncul di
 * panel. Isinya dipakai halaman CV. Begitu kamu mengisinya, tidak ada yang
 * perlu diubah di sini.
 */
export default function Publications() {
  const { t } = useLanguage();

  return (
    <TabelAkademik
      id="publications"
      bagian="publications"
      items={portfolio.publications}
      awal={8}
      kolom={[
        {
          judul: { id: 'Judul Artikel', en: 'Article Title' },
          ambil: (b) => <JudulTaut judul={b.title} href={b.url} />,
        },
        {
          judul: { id: 'Jurnal / Penerbit', en: 'Journal / Publisher' },
          lebar: '22%',
          ambil: (b) => <span className="text-muted">{t(b.venue)}</span>,
        },
        {
          judul: { id: 'Aktivitas', en: 'Activity' },
          lebar: '14%',
          ambil: (b) => <Tanda>{t(b.aktivitas)}</Tanda>,
        },
      ]}
    />
  );
}
