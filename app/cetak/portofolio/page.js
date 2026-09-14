import '@/app/cetak.css';
import { portfolio } from '@/data/portfolio';
import DokumenPortofolio from '@/components/DokumenPortofolio';

const { profile } = portfolio;

/**
 * Halaman dokumen portofolio, siap disimpan sebagai PDF.
 *
 * Sengaja tidak diindeks mesin pencari. Isinya sama dengan halaman utama,
 * hanya tata letaknya yang berbeda, dan dua halaman berisi hal yang sama
 * justru membuat mesin pencari bingung memilih mana yang harus ditampilkan.
 */
export const metadata = {
  title: `Portofolio ${profile.name}`,
  description: `Dokumen portofolio ${profile.name}, siap dicetak atau disimpan sebagai PDF.`,
  robots: { index: false, follow: true },
  alternates: { canonical: '/' },
};

export default function HalamanDokumenPortofolio() {
  return <DokumenPortofolio />;
}
