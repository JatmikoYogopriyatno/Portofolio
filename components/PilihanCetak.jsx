'use client';

import Link from 'next/link';
import { portfolio } from '@/data/portfolio';
import { useLanguage } from '@/components/LanguageProvider';
import { DOKUMEN } from '@/components/DokumenBilah';
import SectionHeading from '@/components/SectionHeading';
import GlassCard from '@/components/GlassCard';
import Reveal from '@/components/Reveal';
import Icon from '@/components/Icon';

/**
 * =============================================================================
 *  PilihanCetak: tiga pilihan dokumen untuk dicetak atau disimpan sebagai PDF.
 * =============================================================================
 *
 *  KENAPA PERLU BAGIAN TERSENDIRI
 *  Ketiga dokumen sebenarnya sudah bisa dijangkau dari kaki halaman dan dari
 *  menu perintah. Tapi keduanya tempat yang dicari orang yang sudah tahu apa
 *  yang dicarinya. Pengunjung yang baru pertama datang, misalnya reviewer atau
 *  panitia seminar, tidak tahu bahwa ada tiga bentuk berkas dan bahwa ketiganya
 *  berbeda isi.
 *
 *  Jadi ketiganya ditampilkan berdampingan lengkap dengan keterangan singkat,
 *  supaya pilihan "yang mana yang saya butuhkan" bisa dijawab tanpa membuka
 *  ketiganya satu per satu.
 *
 *  Nama, alamat, dan keterangan tiap dokumen dibaca dari DOKUMEN di
 *  components/DokumenBilah.jsx, satu sumber yang sama dengan bilah dokumen dan
 *  menu perintah. Tidak ada nama dokumen yang ditulis dua kali.
 *
 *  Bagian ini ikut mati kalau sakelar Tautan Cetak di panel dimatikan, sama
 *  seperti tautan di kaki halaman.
 * =============================================================================
 */

const PILIHAN = [
  { kunci: 'portofolio', ikon: 'download', jenis: 'portofolio' },
  { kunci: 'cv', ikon: 'file-text', jenis: 'cv' },
  { kunci: 'cvPeneliti', ikon: 'book', jenis: 'cv-peneliti' },
];

export default function PilihanCetak() {
  const { t, lang } = useLanguage();
  const { ui, appearance } = portfolio;

  if (appearance?.printLink === false) return null;

  return (
    <section id="berkas" className="scroll-mt-28 px-4 py-20 sm:px-6 sm:py-24" data-print="hide">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow={t(ui.berkasEyebrow)}
          title={t(ui.berkasJudul)}
          subtitle={t(ui.berkasSubjudul)}
        />

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {PILIHAN.map(({ kunci, ikon, jenis }, i) => {
            const dok = DOKUMEN[kunci];

            return (
              <Reveal key={dok.href} delay={Math.min(i * 90, 240)} className="h-full">
                <GlassCard className="flex h-full flex-col">
                  {/*
                    Seluruh kartu jadi satu tautan, bukan cuma tombol kecil di
                    dasarnya. Sasaran seukuran kartu jauh lebih mudah dikenai di
                    layar sentuh, dan tidak ada bagian kartu yang terlihat bisa
                    diklik tapi ternyata tidak.
                  */}
                  <Link href={dok.href} className="group flex flex-1 flex-col p-6">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-linear-to-br from-accent-1 to-accent-2 text-white">
                      <Icon name={ikon} className="h-5 w-5" />
                    </span>

                    <h3 className="mt-4 text-[1.0625rem] font-semibold leading-snug text-fg">
                      {t(dok.label)}
                    </h3>

                    <p className="mt-2 text-body-sm text-muted">{t(dok.keterangan)}</p>

                    <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-accent">
                      {t(ui.berkasBuka)}
                      <Icon
                        name="chevron-down"
                        className="h-4 w-4 -rotate-90 transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </span>
                  </Link>

                  {/*
                    Unduhan Word ditaruh di luar tautan kartu, bukan di dalamnya.
                    Tautan di dalam tautan tidak sah dan peramban menanganinya
                    sendiri sendiri: sebagian mengabaikan yang dalam, sebagian
                    membuka keduanya sekaligus.

                    Dipisah garis supaya jelas keduanya berbeda: kartu membuka
                    dokumennya untuk dibaca atau disimpan sebagai PDF, tombol ini
                    langsung mengunduh berkas Word yang bisa disunting.
                  */}
                  <div className="border-t border-line px-6 py-3">
                    <a
                      href={`/api/docx/?jenis=${jenis}&lang=${lang}&rentang=semua`}
                      download
                      className="tombol-berkas"
                    >
                      <Icon name="download" className="h-4 w-4 shrink-0 text-accent" />
                      <span className="min-w-0 truncate">{t(ui.berkasWord)}</span>
                      <span className="tombol-berkas-jenis">docx</span>
                    </a>
                  </div>
                </GlassCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
