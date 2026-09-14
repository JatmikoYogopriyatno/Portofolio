'use client';

import { portfolio } from '@/data/portfolio';
import { useLanguage } from '@/components/LanguageProvider';
import TabelAkademik, { Tanda } from '@/components/TabelAkademik';

/**
 * Pengalaman merumuskan kebijakan publik dan rekayasa sosial.
 *
 * Ini bagian terpanjang di halaman, dua puluh enam baris. Yang tampil lebih
 * dulu sengaja dibatasi delapan supaya bagian di bawahnya tetap terjangkau
 * tanpa menggulir jauh.
 */
export default function Kebijakan() {
  const { t } = useLanguage();

  return (
    <TabelAkademik
      id="kebijakan"
      bagian="kebijakan"
      items={portfolio.kebijakan}
      awal={8}
      kolom={[
        {
          judul: { id: 'Judul / Tema / Jenis Rekayasa Sosial', en: 'Title / Subject / Type' },
          ambil: (b) => <span className="font-medium text-fg">{b.judul}</span>,
        },
        {
          judul: { id: 'Tahun', en: 'Year' },
          lebar: '8%',
          ambil: (b) => <span className="tabular-nums text-muted">{b.tahun}</span>,
        },
        {
          judul: { id: 'Tempat Penerapan', en: 'Applied At' },
          lebar: '26%',
          ambil: (b) => <span className="text-muted">{b.tempat}</span>,
        },
        {
          judul: { id: 'Respon Masyarakat', en: 'Public Response' },
          lebar: '13%',
          ambil: (b) => <Tanda>{t(b.respon)}</Tanda>,
        },
      ]}
    />
  );
}
