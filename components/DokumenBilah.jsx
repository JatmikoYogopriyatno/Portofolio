'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';

/**
 * =============================================================================
 *  DokumenBilah: bilah tombol di atas halaman dokumen cetak.
 * =============================================================================
 *
 *  Isinya tautan kembali ke situs, sakelar bahasa, tautan ke dokumen lain, dan
 *  tombol simpan. Seluruh bilah ini tidak pernah ikut tercetak.
 *
 *  TIGA DOKUMEN, BUKAN DUA
 *  Dulu bilah ini hanya mengenal satu dokumen pasangan lewat prop lainHref dan
 *  lainLabel, karena memang cuma ada dua halaman cetak. Sekarang ada tiga, dan
 *  tiap halaman perlu menunjuk ke dua halaman sisanya. Jadi propnya diganti
 *  satu larik `lain`, dan bilah ini tidak perlu tahu ada berapa dokumen.
 *  Menambah dokumen keempat nanti cukup menambah satu isian di larik itu.
 *
 *  @param {object} props
 *  @param {string} props.judul  nama dokumen ini, tampil di kiri
 *  @param {Array<{href: string, label: {id: string, en: string}}>} props.lain
 * =============================================================================
 */
export default function DokumenBilah({ judul, lain = [] }) {
  const { lang, setLang } = useLanguage();

  return (
    <div className="dok-bilah" data-cetak="sembunyi">
      <div className="dok-bilah-kiri">
        <Link href="/">{lang === 'id' ? 'Kembali ke situs' : 'Back to site'}</Link>
        <span className="hidden sm:inline">{judul}</span>
      </div>

      <div className="dok-bilah-kanan">
        {/* Dokumen ikut bahasa yang sedang aktif, jadi sakelarnya disediakan
            di sini supaya tidak perlu bolak balik ke halaman utama. */}
        <button
          type="button"
          onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
          style={{ background: 'transparent', borderColor: 'rgba(226,232,240,0.28)', color: 'inherit' }}
        >
          {lang === 'id' ? 'English' : 'Bahasa Indonesia'}
        </button>

        {lain.map((dok) => (
          <Link key={dok.href} href={dok.href}>
            {dok.label?.[lang] ?? dok.label?.id ?? ''}
          </Link>
        ))}

        <button type="button" onClick={() => window.print()}>
          {lang === 'id' ? 'Simpan sebagai PDF' : 'Save as PDF'}
        </button>
      </div>
    </div>
  );
}

/**
 * Ketiga dokumen cetak yang tersedia.
 *
 * Ditulis sekali di sini supaya nama dan alamatnya tidak berbeda beda antara
 * bilah dokumen, menu perintah, dan tautan di kaki halaman. Dipakai juga oleh
 * components/PilihanCetak.jsx.
 */
export const DOKUMEN = {
  portofolio: {
    href: '/cetak/portofolio/',
    label: { id: 'Portofolio', en: 'Portfolio' },
    keterangan: {
      id: 'Dokumen portofolio lengkap dengan tata letak rapi, siap dicetak atau dikirim.',
      en: 'A complete portfolio document with a clean layout, ready to print or send.',
    },
  },
  cv: {
    href: '/cetak/cv/',
    label: { id: 'CV ATS', en: 'ATS CV' },
    keterangan: {
      id: 'CV satu kolom tanpa tabel dan tanpa gambar, dibuat agar terbaca mesin pelacak lamaran.',
      en: 'A single-column CV without tables or images, built to be read by applicant tracking systems.',
    },
  },
  cvPeneliti: {
    href: '/cetak/cv-peneliti/',
    label: { id: 'CV Peneliti', en: 'Researcher CV' },
    keterangan: {
      id: 'Daftar Riwayat Hidup berbentuk tabel, mengikuti format berkas pengajuan penelitian.',
      en: 'A tabular curriculum vitae following the format used for research funding submissions.',
    },
  },
};

/** Dua dokumen selain yang sedang dibuka, untuk mengisi prop `lain`. */
export function dokumenLain(kunciSekarang) {
  return Object.entries(DOKUMEN)
    .filter(([kunci]) => kunci !== kunciSekarang)
    .map(([, dok]) => ({ href: dok.href, label: dok.label }));
}
