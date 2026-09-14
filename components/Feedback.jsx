'use client';

import { useRef, useState } from 'react';
import { portfolio } from '@/data/portfolio';
import { useLanguage } from '@/components/LanguageProvider';
import SectionHeading from '@/components/SectionHeading';
import GlassCard from '@/components/GlassCard';
import Reveal from '@/components/Reveal';
import Icon from '@/components/Icon';

/**
 * =============================================================================
 *  Feedback: formulir masukan dan saran untuk tamu.
 * =============================================================================
 *
 *  Hanya kolom pesan yang wajib diisi. Nama dan kontak sengaja dibuat opsional
 *  supaya orang yang ingin jujur tanpa menyebut identitas tetap merasa aman
 *  menulis. Yang tidak mengisi nama akan tercatat sebagai kiriman anonim.
 *
 *  Kirimannya masuk ke panel /admin pada menu Masukan.
 *
 *  Matikan seluruh bagian ini lewat panel: Pengaturan, lalu Masukan, lalu
 *  hilangkan centang "Tampilkan formulir".
 * =============================================================================
 */
export default function Feedback() {
  const { t } = useLanguage();
  const { feedback, sections } = portfolio;

  // Waktu formulir mulai ditampilkan, dipakai untuk menghitung jeda mengetik.
  const mulaiRef = useRef(Date.now());
  const [status, setStatus] = useState('siap'); // siap | mengirim | berhasil | gagal
  const [galat, setGalat] = useState('');
  const [pesan, setPesan] = useState('');
  const [nama, setNama] = useState('');
  const [kontak, setKontak] = useState('');
  const [situs, setSitus] = useState(''); // kolom umpan untuk robot

  if (feedback?.enabled === false) return null;

  const kirim = async (event) => {
    event.preventDefault();
    if (status === 'mengirim') return;

    setStatus('mengirim');
    setGalat('');

    try {
      // Garis miring di akhir dipakai konsisten di situs ini. Tanpa itu,
      // kiriman ini kena pengalihan alamat dulu sebelum sampai ke tujuan.
      const tanggapan = await fetch('/api/feedback/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pesan,
          nama,
          kontak,
          situs,
          jeda: Date.now() - mulaiRef.current,
        }),
      });

      const hasil = await tanggapan.json().catch(() => ({}));

      if (tanggapan.ok && hasil.ok) {
        setStatus('berhasil');
        setPesan('');
        setNama('');
        setKontak('');
        return;
      }

      setStatus('gagal');
      setGalat(hasil.pesan || 'Masukannya belum bisa terkirim. Coba lagi sebentar lagi.');
    } catch {
      setStatus('gagal');
      setGalat('Sambungan sedang bermasalah. Coba lagi setelah jaringan stabil.');
    }
  };

  const kolom =
    'w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-fg placeholder:text-subtle focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/35';

  return (
    <section id="feedback" className="px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          eyebrow={t(sections.feedback?.eyebrow)}
          title={t(sections.feedback?.title)}
          subtitle={t(sections.feedback?.subtitle)}
        />

        <Reveal delay={80}>
          <GlassCard className="mt-10 p-6 sm:p-8">
            {status === 'berhasil' ? (
              // Layar terima kasih, menggantikan formulir setelah terkirim.
              <div className="py-6 text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-linear-to-br from-accent-1 to-accent-2 text-white">
                  <Icon name="check" className="h-6 w-6" />
                </span>
                <p className="mt-4 text-base font-semibold text-fg">{t(feedback.success)}</p>
                <button
                  type="button"
                  onClick={() => {
                    mulaiRef.current = Date.now();
                    setStatus('siap');
                  }}
                  className="btn-ghost mt-5"
                >
                  Tulis masukan lagi
                </button>
              </div>
            ) : (
              <form onSubmit={kirim} noValidate>
                <p className="mb-5 text-body-sm text-muted">{t(feedback.subtitle)}</p>

                {/* Kolom umpan. Tersembunyi dari mata dan dari pembaca layar,
                    tapi tetap terisi oleh robot pengirim iklan. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-[9999px] top-0 h-px w-px overflow-hidden opacity-0"
                >
                  <label htmlFor="situs-web">Jangan diisi</label>
                  <input
                    id="situs-web"
                    name="situs-web"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={situs}
                    onChange={(e) => setSitus(e.target.value)}
                  />
                </div>

                <label htmlFor="masukan-pesan" className="mb-1.5 block text-sm font-medium text-fg">
                  Masukan kamu <span className="text-accent">*</span>
                </label>
                <textarea
                  id="masukan-pesan"
                  required
                  rows={5}
                  maxLength={3000}
                  value={pesan}
                  onChange={(e) => setPesan(e.target.value)}
                  placeholder={t(feedback.placeholder)}
                  className={`${kolom} resize-y`}
                />

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="masukan-nama" className="mb-1.5 block text-sm font-medium text-fg">
                      Nama <span className="font-normal text-subtle">(boleh dikosongkan)</span>
                    </label>
                    <input
                      id="masukan-nama"
                      type="text"
                      maxLength={80}
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      placeholder="Anonim"
                      autoComplete="name"
                      className={kolom}
                    />
                  </div>

                  <div>
                    <label htmlFor="masukan-kontak" className="mb-1.5 block text-sm font-medium text-fg">
                      Email atau kontak <span className="font-normal text-subtle">(opsional)</span>
                    </label>
                    <input
                      id="masukan-kontak"
                      type="text"
                      maxLength={120}
                      value={kontak}
                      onChange={(e) => setKontak(e.target.value)}
                      placeholder="Isi kalau ingin dibalas"
                      autoComplete="email"
                      className={kolom}
                    />
                  </div>
                </div>

                <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-subtle">
                  <Icon name="eye-off" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {t(feedback.privacy)}
                </p>

                {status === 'gagal' && galat ? (
                  <p role="alert" className="mt-4 rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-fg">
                    {galat}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={status === 'mengirim' || pesan.trim().length < 5}
                  className="btn-primary mt-5 disabled:cursor-not-allowed disabled:opacity-55"
                >
                  <Icon name="send" className="h-4 w-4" />
                  {status === 'mengirim' ? 'Mengirim...' : 'Kirim masukan'}
                </button>
              </form>
            )}
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}
