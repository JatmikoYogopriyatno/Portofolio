'use client';

import { portfolio } from '@/data/portfolio';
import TabelAkademik, { Tanda } from '@/components/TabelAkademik';

/** Perolehan Hak Kekayaan Intelektual sepuluh tahun terakhir. */
export default function Hki() {
  return (
    <TabelAkademik
      id="hki"
      bagian="hki"
      items={portfolio.hki}
      awal={6}
      kolom={[
        {
          judul: { id: 'Tahun', en: 'Year' },
          lebar: '8%',
          ambil: (b) => <span className="tabular-nums text-muted">{b.tahun}</span>,
        },
        {
          judul: { id: 'Judul / Tema HKI', en: 'Title / Subject' },
          ambil: (b) => <span className="font-medium text-fg">{b.judul}</span>,
        },
        {
          judul: { id: 'Jenis', en: 'Type' },
          lebar: '10%',
          ambil: (b) => <Tanda>{b.jenis}</Tanda>,
        },
        {
          judul: { id: 'Nomor Pendaftaran / Sertifikat', en: 'Registration / Certificate No.' },
          lebar: '28%',
          ambil: (b) => <span className="tabular-nums text-muted">{b.nomor}</span>,
        },
      ]}
    />
  );
}
