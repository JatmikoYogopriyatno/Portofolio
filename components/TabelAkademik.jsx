'use client';

import { useState } from 'react';
import { portfolio } from '@/data/portfolio';
import { useLanguage } from '@/components/LanguageProvider';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';
import Icon from '@/components/Icon';

/**
 * =============================================================================
 *  TabelAkademik: satu bentuk tabel untuk semua daftar Daftar Riwayat Hidup.
 * =============================================================================
 *
 *  KENAPA TABEL, BUKAN KARTU
 *  Bagian portofolio lain memakai kartu, dan itu cocok untuk isi yang jumlahnya
 *  sedikit dan tiap butirnya panjang. Daftar penelitian, publikasi, dan naskah
 *  akademik bentuknya kebalikan: barisnya banyak, isinya pendek, dan yang
 *  dicari pembaca adalah perbandingan antarbaris, misalnya tahun berapa saja
 *  seseorang jadi ketua peneliti. Tabel menjawab pertanyaan itu dalam sekali
 *  lihat, kartu tidak.
 *
 *  Bentuknya juga sengaja dibuat sama dengan Daftar Riwayat Hidup resmi, jadi
 *  pembaca yang terbiasa dengan berkas pengajuan penelitian langsung mengenali
 *  susunannya.
 *
 *  DI LAYAR SEMPIT
 *  Tabel tidak dipaksa menggulir ke samping. Di bawah lebar md, tiap baris
 *  berubah jadi satu blok bertumpuk dengan nama kolomnya menempel di tiap
 *  nilai. Itu sebabnya tiap kolom menyimpan labelnya sendiri lewat data-label.
 *
 *  DAFTAR PANJANG
 *  Daftar yang lebih dari `awal` baris dipendekkan dulu, dengan satu tombol
 *  untuk membuka sisanya. Tanpa itu bagian Kebijakan sendirian sudah dua puluh
 *  enam baris dan mendorong seluruh bagian di bawahnya jauh ke bawah halaman.
 *
 *  @param {object} props
 *  @param {string} props.id          anchor bagian, dipakai menu navigasi
 *  @param {string} props.bagian      kunci di content/sections.json
 *  @param {Array}  props.items       barisnya
 *  @param {Array}  props.kolom       [{ judul: {id,en}, ambil: (baris)=>node, lebar?: string }]
 *  @param {number} [props.awal]      jumlah baris yang tampil sebelum dibuka
 *  @param {boolean} [props.nomor]    tampilkan kolom nomor urut
 * =============================================================================
 */
export default function TabelAkademik({ id, bagian, items, kolom, awal = 8, nomor = true }) {
  const { t, lang } = useLanguage();
  const [terbuka, setTerbuka] = useState(false);

  const daftar = Array.isArray(items) ? items : [];
  if (daftar.length === 0) return null;

  const info = portfolio.sections?.[bagian] ?? {};
  const adaSisa = daftar.length > awal;
  const tampil = terbuka || !adaSisa ? daftar : daftar.slice(0, awal);
  const sisa = daftar.length - awal;

  return (
    <section id={id} className="scroll-mt-28 px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow={t(info.eyebrow)}
          title={t(info.title)}
          subtitle={t(info.subtitle)}
        />

        <Reveal className="mt-10">
          <div className="tabel-akademik-bingkai">
            <table className="tabel-akademik">
              <thead>
                <tr>
                  {nomor ? <th scope="col" className="kolom-nomor">No</th> : null}
                  {kolom.map((k) => (
                    <th key={t(k.judul)} scope="col" style={k.lebar ? { width: k.lebar } : undefined}>
                      {t(k.judul)}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {tampil.map((baris, i) => (
                  <tr key={i}>
                    {nomor ? (
                      <td className="kolom-nomor" data-label="No">
                        {i + 1}
                      </td>
                    ) : null}
                    {kolom.map((k) => (
                      <td key={t(k.judul)} data-label={t(k.judul)}>
                        {k.ambil(baris)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {adaSisa ? (
            <button
              type="button"
              onClick={() => setTerbuka((v) => !v)}
              aria-expanded={terbuka}
              className="tombol-lainnya print:hidden"
            >
              {terbuka
                ? lang === 'id'
                  ? 'Ringkas kembali'
                  : 'Show less'
                : lang === 'id'
                  ? `Tampilkan ${sisa} lainnya`
                  : `Show ${sisa} more`}
              <Icon
                name="chevron-down"
                className={`h-4 w-4 transition-transform duration-300 ${terbuka ? 'rotate-180' : ''}`}
              />
            </button>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}

/**
 * Tautan judul karya. Kalau alamatnya kosong, judulnya ditulis sebagai teks
 * biasa, jadi baris tanpa tautan tidak terlihat seperti tautan yang rusak.
 */
export function JudulTaut({ judul, href }) {
  if (!href) return <span className="font-medium text-fg">{judul}</span>;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-start gap-1.5 font-medium text-fg underline decoration-accent/35 decoration-1 underline-offset-[3px] transition-colors hover:text-accent hover:decoration-accent"
    >
      <span>{judul}</span>
      <Icon
        name="external-link"
        className="mt-1 h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-70"
      />
    </a>
  );
}

/** Label kecil untuk peran, jenis, atau kategori. */
export function Tanda({ children, kuat = false }) {
  if (!children) return null;
  return <span className={kuat ? 'tanda-kuat' : 'tanda-halus'}>{children}</span>;
}
