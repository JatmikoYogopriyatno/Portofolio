import '@/app/cetak.css';
import { portfolio } from '@/data/portfolio';
import DokumenCVPeneliti from '@/components/DokumenCVPeneliti';

const { profile } = portfolio;

/**
 * Halaman Daftar Riwayat Hidup berbentuk tabel, mengikuti format berkas
 * pengajuan penelitian.
 *
 * Sama seperti dua halaman cetak lainnya, ini tidak diindeks mesin pencari
 * karena isinya mengulang halaman utama dengan tata letak yang berbeda.
 */
export const metadata = {
  title: `Daftar Riwayat Hidup ${profile.name}`,
  description: `Daftar Riwayat Hidup ${profile.name} dalam format tabel untuk keperluan pengajuan penelitian.`,
  robots: { index: false, follow: true },
  alternates: { canonical: '/' },
};

export default function HalamanDokumenCVPeneliti() {
  return <DokumenCVPeneliti />;
}
