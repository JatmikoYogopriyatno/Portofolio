'use client';

import { useState } from 'react';
import { portfolio } from '@/data/portfolio';
import { useLanguage } from '@/components/LanguageProvider';
import { barisInstansi, rapikanTanggal, terisi } from '@/lib/teks-dokumen';
import { labelTautan } from '@/lib/tautan-cv';
import DokumenBilah, { dokumenLain } from '@/components/DokumenBilah';
import { RENTANG_BAWAAN, saring } from '@/lib/rentang';

/**
 * =============================================================================
 *  DokumenCV: CV satu kolom gaya Harvard, ramah mesin pelacak lamaran.
 * =============================================================================
 *
 *  KENAPA TAMPILANNYA POLOS
 *  Sebagian besar lamaran kerja tidak langsung dibaca manusia. Berkasnya lebih
 *  dulu melewati mesin pelacak lamaran, yang membaca teksnya lalu memilah mana
 *  pendidikan, mana pengalaman, mana keahlian. Mesin seperti itu gampang
 *  tersandung, dan CV yang cantik di mata sering justru tidak terbaca olehnya.
 *
 *  Jadi semua yang ada di sini disengaja:
 *
 *    satu kolom        mesin membaca atas ke bawah, kolom mengacaukan urutan
 *    tanpa tabel       isi tabel sering terbaca berantakan atau terlewat
 *    tanpa foto        gambar tidak terbaca sama sekali, hanya menyita ruang
 *    tanpa ikon        sama alasannya
 *    huruf Arial       ada di semua sistem, tidak perlu disulih
 *    judul baku        PENDIDIKAN, PENGALAMAN, dan seterusnya
 *
 *  Susunannya mengikuti pola Harvard: identitas ringkas di atas, lalu
 *  pendidikan, pengalaman, dan seterusnya, masing masing dari yang terbaru.
 *
 *  Isinya diambil dari sumber yang sama dengan situs, jadi cukup perbarui
 *  lewat panel dan CV ini ikut berubah.
 * =============================================================================
 */

/**
 * Memecah satu paragraf menjadi beberapa butir.
 *
 * Pemecahan hanya dilakukan pada titik yang diikuti spasi lalu huruf kapital.
 * Aturan itu penting supaya nomor surat seperti "SK Rektor No. 1664/UN30.9"
 * tidak ikut terpotong, karena titik di situ diikuti angka, bukan huruf.
 */
function keBulir(teks) {
  const bersih = terisi(teks);
  if (!bersih) return [];

  const bagian = bersih
    .split(/(?<=\.)\s+(?=[A-Z])/)
    .map((s) => s.trim())
    .filter(Boolean);

  // Kalau pemecahannya cuma menghasilkan satu potong, biarkan utuh.
  return bagian.length > 1 ? bagian : [bersih];
}

export default function DokumenCV() {
  const { lang, t } = useLanguage();
  const [rentang, setRentang] = useState(RENTANG_BAWAAN);

  /** Menyaring satu daftar menurut rentang yang sedang dipilih. */
  const R = (daftar) => saring(daftar, rentang);
  const {
    profile,
    contact,
    social,
    experience,
    education,
    publications,
    certifications,
    skills,
    languages,
    volunteering,
    buku,
    hki,
    kebijakan,
    meta,
  } = portfolio;

  const L =
    lang === 'id'
      ? {
          pendidikan: 'Pendidikan',
          pengalaman: 'Pengalaman',
          publikasi: 'Publikasi',
          sukarela: 'Kegiatan dan Kepemimpinan',
          sertifikasi: 'Sertifikasi',
          keahlian: 'Keahlian',
          bahasa: 'Bahasa',
          buku: 'Karya Buku',
          hki: 'Hak Kekayaan Intelektual',
          kebijakan: 'Perumusan Kebijakan Publik',
        }
      : {
          pendidikan: 'Education',
          pengalaman: 'Experience',
          publikasi: 'Publications',
          sukarela: 'Leadership and Activities',
          sertifikasi: 'Certifications',
          keahlian: 'Skills',
          bahasa: 'Languages',
          buku: 'Authored Books',
          hki: 'Intellectual Property',
          kebijakan: 'Public Policy Formulation',
        };

  /*
    Identitas dipecah jadi dua baris, bukan satu baris panjang.

    Baris pertama yang selalu dibaca perekrut lebih dulu: tempat tinggal,
    nomor telepon, surel. Baris kedua barulah alamat web. Dulu kesembilannya
    dijejer dalam satu paragraf, dan hasilnya alamat panjang terpotong di
    tengah tengah sehingga tidak bisa disalin maupun diklik.
  */
  const jati = [terisi(profile.location), terisi(contact.phone)].filter(Boolean);

  const surel = terisi(contact.email);

  /*
    Alamat web. Yang pendek ditulis apa adanya supaya mesin pelacak lamaran
    tetap membaca alamatnya, yang panjang diganti namanya. Lihat
    lib/tautan-cv.js untuk alasan lengkapnya.
  */
  const tautan = [
    terisi(meta.baseUrl) ? { href: meta.baseUrl, nama: 'Portofolio' } : null,
    ...social
      .filter((s) => s.href?.startsWith('http'))
      .map((s) => ({ href: s.href, nama: terisi(t(s.label)) })),
  ].filter(Boolean);

  /**
   * Satu tautan di dalam CV. Warnanya diwarisi dari teks sekitarnya, jadi
   * tetap hitam seperti CV Harvard pada umumnya, tapi di dalam PDF tetap
   * bisa diklik.
   */
  const Tautan = ({ href, children }) =>
    href ? (
      <a className="cv-tautan" href={href} rel="noopener noreferrer">
        {children}
      </a>
    ) : (
      children
    );

  /*
    Sertifikasi diurutkan dari tahun terbaru.

    Panduan Harvard meminta setiap bagian disusun terbalik menurut waktu, dari
    yang paling baru. Urutan di data mengikuti kapan kamu memasukkannya lewat
    panel, dan hasilnya melompat lompat: 2022, 2024, 2026, 2026, 2026, 2026,
    2023, dan seterusnya. Diurutkan di sini, bukan di data, supaya kamu tetap
    bebas menyusunnya sesuka hati di panel.

    Angka tahun diambil dengan parseInt supaya isian seperti "2026" maupun
    "Mei 2026" sama sama terbaca. Yang tidak berisi angka ditaruh di belakang.
  */
  const sertifikatTerurut = [...certifications].sort((a, b) => {
    const tahun = (x) => Number.parseInt(String(x.year ?? '').match(/\d{4}/)?.[0] ?? '0', 10);
    return tahun(b) - tahun(a);
  });

  const Bagian = ({ judul, children }) => (
    <section className="cv-bagian">
      <h2 className="cv-judul">{judul}</h2>
      {children}
    </section>
  );

  return (
    <div className="dok-lembar">
      <DokumenBilah
        judul="CV"
        lain={dokumenLain('cv')}
        jenis="cv"
        rentang={rentang}
        setRentang={setRentang}
      />

      <div className="dok-kertas">
        <article className="cv">
          {/* ---------------- Identitas ---------------- */}
          <header>
            <h1 className="cv-nama">{profile.name}</h1>

            <p className="cv-kontak">
              {jati.map((isi, i) => (
                <span key={isi}>
                  {i > 0 ? <span className="cv-pemisah"> | </span> : null}
                  <span className="cv-utuh">{isi}</span>
                </span>
              ))}
              {surel ? (
                <span>
                  {jati.length > 0 ? <span className="cv-pemisah"> | </span> : null}
                  <Tautan href={`mailto:${surel}`}>{surel}</Tautan>
                </span>
              ) : null}
            </p>

            {tautan.length > 0 ? (
              <p className="cv-kontak">
                {tautan.map((item, i) => (
                  <span key={item.href}>
                    {i > 0 ? <span className="cv-pemisah"> | </span> : null}
                    <Tautan href={item.href}>{labelTautan(item.href, item.nama)}</Tautan>
                  </span>
                ))}
              </p>
            ) : null}
          </header>

          {/* ---------------- Pendidikan ---------------- */}
          {education.length > 0 ? (
            <Bagian judul={L.pendidikan}>
              {education.map((item, i) => (
                <div key={i} className="cv-entri">
                  {/* Sekolah dan kotanya di kiri, tanggal rata kanan, gelar
                      turun ke baris kedua. Susunan yang sama dengan bagian
                      Pengalaman di bawah, dan itu memang disengaja: panduan
                      Harvard memakai satu bentuk entri untuk seluruh CV. */}
                  <div className="cv-baris">
                    <span className="cv-utama">{barisInstansi(t(item.school), t(item.location))}</span>
                    <span className="cv-waktu">{rapikanTanggal(t(item.period))}</span>
                  </div>
                  <p className="cv-kedua cv-padat">
                    {[terisi(t(item.degree)), terisi(t(item.gpa))].filter(Boolean).join(', ')}
                  </p>
                  {terisi(t(item.notes)) ? (
                    <ul className="cv-daftar">
                      <li>{t(item.notes)}</li>
                    </ul>
                  ) : null}
                </div>
              ))}
            </Bagian>
          ) : null}

          {/* ---------------- Pengalaman ---------------- */}
          {experience.length > 0 ? (
            <Bagian judul={L.pengalaman}>
              {experience.map((item, i) => {
                const org = terisi(t(item.org));
                const lokasi = terisi(t(item.location));
                const jenis = terisi(t(item.type));
                const bulir = keBulir(t(item.description));

                /*
                  Jenis dilewati kalau isinya sama dengan jabatannya. Tanpa
                  penjagaan ini, satu entri di data ini tercetak sebagai
                  "Magang, Magang".
                */
                const sama = jenis.toLowerCase() === terisi(t(item.role)).toLowerCase();
                const barisKedua = [terisi(t(item.role)), sama ? '' : jenis]
                  .filter(Boolean)
                  .join(', ');

                return (
                  <div key={i} className="cv-entri">
                    {/*
                      Susunan baku Harvard, dan urutannya bukan selera:

                        baris 1 kiri   nama instansi, lalu kotanya
                        baris 1 kanan  tanggal
                        baris 2        jabatan

                      Sebelumnya lokasi ikut ditumpuk di baris kedua bersama
                      jabatan dan jenis kerja. Selain menyalahi susunan, tiga
                      hal dalam satu baris membuatnya patah ke baris ketiga
                      dan CV-nya jadi terlihat berantakan.
                    */}
                    <div className="cv-baris">
                      <span className="cv-utama">
                        {org ? barisInstansi(org, lokasi) : terisi(t(item.role))}
                      </span>
                      <span className="cv-waktu">{rapikanTanggal(t(item.period))}</span>
                    </div>
                    {org && barisKedua ? <p className="cv-kedua cv-padat">{barisKedua}</p> : null}
                    {bulir.length > 0 ? (
                      <ul className="cv-daftar">
                        {bulir.map((b, j) => (
                          <li key={j}>{b}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                );
              })}
            </Bagian>
          ) : null}

          {/*
            KARYA BUKU, HKI, DAN KEBIJAKAN

            Tiga bagian ini tidak ada di templat aslinya, dan memang tidak
            dibutuhkan CV lamaran kerja pada umumnya. Untuk CV seorang dosen,
            meninggalkannya justru menghilangkan bagian terbesar dari rekam
            jejaknya: sepuluh buku dan dua puluh enam naskah kebijakan.

            Bentuknya tetap mengikuti aturan CV ATS di berkas ini: satu kolom,
            tanpa tabel, judul bagian berhuruf baku. Yang berbeda cuma satu,
            bagian Kebijakan dipadatkan jadi satu baris per butir tanpa baris
            kedua, karena dua puluh enam entri bergaya Harvard penuh akan
            menghabiskan satu halaman sendiri.
          */}
          {R(buku).length > 0 ? (
            <Bagian judul={L.buku}>
              {R(buku).map((item, i) => (
                <div key={i} className="cv-entri">
                  <div className="cv-baris">
                    <span className="cv-utama">{item.judul}</span>
                    <span className="cv-waktu">{item.tahun}</span>
                  </div>
                  <p className="cv-kedua cv-padat">
                    {[terisi(item.penerbit), terisi(item.halaman) ? `${item.halaman} hlm` : '']
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                </div>
              ))}
            </Bagian>
          ) : null}

          {R(hki).length > 0 ? (
            <Bagian judul={L.hki}>
              {R(hki).map((item, i) => (
                <div key={i} className="cv-entri">
                  <div className="cv-baris">
                    <span className="cv-utama">{item.judul}</span>
                    <span className="cv-waktu">{item.tahun}</span>
                  </div>
                  <p className="cv-kedua cv-padat">
                    {[terisi(item.jenis), terisi(item.nomor)].filter(Boolean).join(', ')}
                  </p>
                </div>
              ))}
            </Bagian>
          ) : null}

          {R(kebijakan).length > 0 ? (
            <Bagian judul={L.kebijakan}>
              {R(kebijakan).map((item, i) => (
                <div key={i} className="cv-entri">
                  <div className="cv-baris">
                    <span className="cv-utama">
                      {[item.judul, terisi(item.tempat)].filter(Boolean).join(' - ')}
                    </span>
                    <span className="cv-waktu">{item.tahun}</span>
                  </div>
                </div>
              ))}
            </Bagian>
          ) : null}

          {/* ---------------- Publikasi ---------------- */}
          {R(publications).length > 0 ? (
            <Bagian judul={L.publikasi}>
              {R(publications).map((item, i) => (
                <div key={i} className="cv-entri">
                  <div className="cv-baris">
                    {/* Judulnya sendiri yang jadi tautan. Alamat publikasi
                        sering panjang sekali, dan mencetaknya sebagai baris
                        tersendiri cuma menghabiskan ruang tanpa menambah
                        keterangan apa pun buat perekrut. */}
                    <span className="cv-utama">
                      <Tautan href={item.url}>{t(item.title)}</Tautan>
                    </span>
                    <span className="cv-waktu">{rapikanTanggal(t(item.date))}</span>
                  </div>
                  <p className="cv-kedua cv-padat">
                    {[terisi(t(item.venue)), terisi(t(item.role))].filter(Boolean).join(', ')}
                  </p>
                </div>
              ))}
            </Bagian>
          ) : null}

          {/* ---------------- Kegiatan dan kepemimpinan ---------------- */}
          {volunteering.length > 0 ? (
            <Bagian judul={L.sukarela}>
              {volunteering.map((item, i) => {
                const org = terisi(t(item.org));
                const bulir = keBulir(t(item.description));
                return (
                  <div key={i} className="cv-entri">
                    <div className="cv-baris">
                      <span className="cv-utama">{barisInstansi(org || t(item.role), t(item.location))}</span>
                      <span className="cv-waktu">{rapikanTanggal(t(item.period))}</span>
                    </div>
                    {org ? <p className="cv-kedua cv-padat">{t(item.role)}</p> : null}
                    {bulir.length > 0 ? (
                      <ul className="cv-daftar">
                        {bulir.map((b, j) => (
                          <li key={j}>{b}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                );
              })}
            </Bagian>
          ) : null}

          {/* ---------------- Sertifikasi ---------------- */}
          {certifications.length > 0 ? (
            <Bagian judul={L.sertifikasi}>
              <ul className="cv-daftar">
                {sertifikatTerurut.map((item, i) => (
                  <li key={i}>
                    {/* Nama sertifikatnya yang jadi tautan ke bukti kreditnya.
                        Alamat bukti kredit LinkedIn panjangnya bisa lebih dari
                        dua ratus huruf, jadi mencetaknya sebagai teks bukan
                        pilihan. Begini perekrut tetap bisa membuka buktinya
                        dengan satu klik, dan halamannya tetap bersih. */}
                    <Tautan href={item.credentialUrl}>{terisi(t(item.name))}</Tautan>
                    {/* Skor ikut dicantumkan karena untuk ujian seperti UKBI dan
                        TOEFL, angkanya justru yang paling dicari perekrut. */}
                    {[terisi(t(item.issuer)), terisi(item.year), terisi(t(item.score))]
                      .filter(Boolean)
                      .map((isi) => `, ${isi}`)
                      .join('')}
                  </li>
                ))}
              </ul>
            </Bagian>
          ) : null}

          {/* ---------------- Keahlian ---------------- */}
          {skills.groups?.length > 0 ? (
            <Bagian judul={L.keahlian}>
              {skills.groups.map((grup, i) => (
                <p key={i} className="cv-padat">
                  <span className="cv-utama">{t(grup.title)}: </span>
                  {grup.items.join(', ')}
                </p>
              ))}
            </Bagian>
          ) : null}

          {/* ---------------- Bahasa ---------------- */}
          {languages.length > 0 ? (
            <Bagian judul={L.bahasa}>
              <p className="cv-padat">
                {languages.map((b) => `${t(b.name)} (${t(b.level)})`).join(', ')}
              </p>
            </Bagian>
          ) : null}
        </article>
      </div>
    </div>
  );
}
