'use client';

import { portfolio } from '@/data/portfolio';
import { useLanguage } from '@/components/LanguageProvider';
import TabelAkademik, { Tanda } from '@/components/TabelAkademik';

/** Pengalaman penelitian lima tahun terakhir, di luar skripsi dan tesis. */
export default function Penelitian() {
  const { t } = useLanguage();

  return (
    <TabelAkademik
      id="penelitian"
      bagian="penelitian"
      items={portfolio.penelitian}
      awal={10}
      kolom={[
        {
          judul: { id: 'Judul Penelitian', en: 'Research Title' },
          ambil: (b) => <span className="font-medium text-fg">{b.judul}</span>,
        },
        {
          judul: { id: 'Penyandang Dana', en: 'Funding' },
          lebar: '22%',
          ambil: (b) => <span className="text-muted">{b.dana}</span>,
        },
        {
          judul: { id: 'Tahun', en: 'Year' },
          lebar: '8%',
          ambil: (b) => <span className="tabular-nums text-muted">{b.tahun}</span>,
        },
        {
          judul: { id: 'Peran', en: 'Role' },
          lebar: '12%',
          // Ketua ditandai lebih tegas daripada anggota. Di daftar sepanjang
          // ini, itu yang pertama dicari pembaca.
          ambil: (b) => <Tanda kuat={t(b.peran) === 'Ketua' || t(b.peran).startsWith('Principal')}>{t(b.peran)}</Tanda>,
        },
      ]}
    />
  );
}
