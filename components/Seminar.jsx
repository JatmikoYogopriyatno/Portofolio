'use client';

import { portfolio } from '@/data/portfolio';
import TabelAkademik from '@/components/TabelAkademik';

/** Pemakalah seminar ilmiah (oral presentation) lima tahun terakhir. */
export default function Seminar() {
  return (
    <TabelAkademik
      id="seminar"
      bagian="seminar"
      items={portfolio.seminar}
      awal={6}
      kolom={[
        {
          judul: { id: 'Nama Temu Ilmiah / Seminar', en: 'Academic Forum / Conference' },
          lebar: '34%',
          ambil: (b) => <span className="font-medium text-fg">{b.forum}</span>,
        },
        {
          judul: { id: 'Judul Artikel Ilmiah', en: 'Paper Title' },
          ambil: (b) => <span className="text-muted">{b.judul}</span>,
        },
        {
          judul: { id: 'Waktu dan Tempat', en: 'Time and Venue' },
          lebar: '24%',
          ambil: (b) => <span className="text-muted">{b.waktu}</span>,
        },
      ]}
    />
  );
}
