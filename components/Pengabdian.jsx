'use client';

import { portfolio } from '@/data/portfolio';
import { useLanguage } from '@/components/LanguageProvider';
import TabelAkademik, { Tanda } from '@/components/TabelAkademik';

/** Pengabdian kepada masyarakat lima tahun terakhir. */
export default function Pengabdian() {
  const { t } = useLanguage();

  return (
    <TabelAkademik
      id="pengabdian"
      bagian="pengabdian"
      items={portfolio.pengabdian}
      awal={7}
      kolom={[
        {
          judul: { id: 'Judul Pengabdian', en: 'Community Service Title' },
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
          ambil: (b) => <Tanda kuat={t(b.peran) === 'Ketua' || t(b.peran) === 'Lead'}>{t(b.peran)}</Tanda>,
        },
      ]}
    />
  );
}
