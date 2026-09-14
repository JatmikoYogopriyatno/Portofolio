import '@/app/cetak.css';
import { portfolio } from '@/data/portfolio';
import DokumenCV from '@/components/DokumenCV';

const { profile } = portfolio;

/**
 * Halaman CV satu kolom yang ramah mesin pelacak lamaran.
 *
 * Sama seperti halaman dokumen portofolio, ini tidak diindeks mesin pencari
 * karena isinya mengulang halaman utama.
 */
export const metadata = {
  title: `CV ${profile.name}`,
  description: `CV ${profile.name} dalam format satu kolom yang terbaca mesin pelacak lamaran.`,
  robots: { index: false, follow: true },
  alternates: { canonical: '/' },
};

export default function HalamanDokumenCV() {
  return <DokumenCV />;
}
