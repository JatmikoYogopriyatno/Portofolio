'use client';

import { portfolio } from '@/data/portfolio';
import TabelAkademik from '@/components/TabelAkademik';

/** Karya buku lima tahun terakhir. */
export default function Buku() {
  return (
    <TabelAkademik
      id="buku"
      bagian="buku"
      items={portfolio.buku}
      awal={10}
      kolom={[
        {
          judul: { id: 'Tahun', en: 'Year' },
          lebar: '8%',
          ambil: (b) => <span className="tabular-nums text-muted">{b.tahun}</span>,
        },
        {
          judul: { id: 'Judul Buku', en: 'Book Title' },
          ambil: (b) => <span className="font-medium text-fg">{b.judul}</span>,
        },
        {
          judul: { id: 'Jumlah Halaman', en: 'Pages' },
          lebar: '11%',
          ambil: (b) => <span className="tabular-nums text-muted">{b.halaman}</span>,
        },
        {
          judul: { id: 'Penerbit', en: 'Publisher' },
          lebar: '26%',
          ambil: (b) => <span className="text-muted">{b.penerbit}</span>,
        },
      ]}
    />
  );
}
