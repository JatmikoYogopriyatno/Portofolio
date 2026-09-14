'use client';

import { useState } from 'react';
import { portfolio } from '@/data/portfolio';
import { useLanguage } from '@/components/LanguageProvider';
import { terisi } from '@/lib/teks-dokumen';
import { withBasePath } from '@/lib/asset';
import DokumenBilah, { dokumenLain } from '@/components/DokumenBilah';
import { RENTANG_BAWAAN } from '@/lib/rentang';

/**
 * =============================================================================
 *  DokumenPortofolio: berkas portofolio lengkap, siap disimpan sebagai PDF.
 * =============================================================================
 *
 *  Dibuat sebagai halaman tersendiri, bukan hasil mencetak halaman utama.
 *  Alasannya sederhana: halaman utama dirancang untuk layar, dengan latar
 *  bergerak, kartu kaca, gambar hiasan, dan teks yang sengaja dipotong lalu
 *  bisa dibuka. Semua itu bagus di layar dan buruk di atas kertas.
 *
 *  Di sini semuanya kebalikannya:
 *
 *    teks utuh          tidak ada yang dipotong "Selengkapnya"
 *    hitam di atas putih apa pun tema yang sedang dipakai pengunjung
 *    tanpa hiasan       tidak ada gambar penghias yang memakan satu halaman
 *    pemenggalan diatur  satu entri tidak pernah terbelah dua halaman
 *
 *  Isinya diambil dari sumber yang sama dengan situs, jadi begitu kamu
 *  memperbarui sesuatu lewat panel, berkas ini ikut berubah sendiri.
 * =============================================================================
 */

export default function DokumenPortofolio() {
  const { lang, t } = useLanguage();
  const [rentang, setRentang] = useState(RENTANG_BAWAAN);
  const {
    profile,
    contact,
    social,
    experience,
    education,
    publications,
    projects,
    certifications,
    skills,
    languages,
    volunteering,
    meta,
  } = portfolio;

  const ringkasan = lang === 'en' ? profile.summaryEn ?? profile.summaryId : profile.summaryId;
  const tautan = social.filter((s) => s.href?.startsWith('http'));

  const L = {
    ringkasan: lang === 'id' ? 'Ringkasan' : 'Summary',
    pengalaman: lang === 'id' ? 'Pengalaman' : 'Experience',
    pendidikan: lang === 'id' ? 'Pendidikan' : 'Education',
    publikasi: lang === 'id' ? 'Publikasi' : 'Publications',
    proyek: lang === 'id' ? 'Proyek' : 'Projects',
    sertifikasi: lang === 'id' ? 'Sertifikasi' : 'Certifications',
    keahlian: lang === 'id' ? 'Keahlian' : 'Skills',
    bahasa: lang === 'id' ? 'Bahasa' : 'Languages',
    sukarela: lang === 'id' ? 'Kesukarelawanan' : 'Volunteering',
    kompetensi: lang === 'id' ? 'Kompetensi' : 'Skills',
  };

  /** Judul bagian, hanya muncul kalau bagiannya memang punya isi. */
  const Bagian = ({ judul, children, kelas = '' }) => (
    <section className={`dok-bagian ${kelas}`}>
      <h2 className="dok-judul">{judul}</h2>
      {children}
    </section>
  );

  return (
    <div className="dok-lembar">
      <DokumenBilah
        judul={lang === 'id' ? 'Portofolio' : 'Portfolio'}
        lain={dokumenLain('portofolio')}
        jenis="portofolio"
        rentang={rentang}
        setRentang={setRentang}
      />

      <div className="dok-kertas">
        <article className="dok">
          {/* ---------------- Kepala dokumen ---------------- */}
          <header className="dok-kepala">
            {profile.avatar ? (
              <img className="dok-foto" src={withBasePath(profile.avatar)} alt={t(profile.avatarAlt)} />
            ) : null}

            <div>
              <h1 className="dok-nama">{profile.name}</h1>
              <p className="dok-headline">{t(profile.headline)}</p>

              <p className="dok-kontak">
                {terisi(profile.location) ? <span>{profile.location}</span> : null}
                {terisi(contact.phone) ? <span>{contact.phone}</span> : null}
                {terisi(contact.email) ? <span>{contact.email}</span> : null}
                {/* Alamat situs ditaruh di sini, bukan di catatan kaki. Di baris
                    kontak dia langsung terlihat pembaca, dan dokumennya tidak
                    lagi menyisakan satu lembar terakhir yang isinya cuma satu
                    baris. */}
                {terisi(meta.baseUrl) ? <span>{meta.baseUrl.replace(/^https?:\/\//, '')}</span> : null}
              </p>

              {tautan.length > 0 ? (
                <p className="dok-kontak">
                  {tautan.map((s) => (
                    <span key={s.label}>
                      {s.label}: {s.href.replace(/^https?:\/\/(www\.)?/, '')}
                    </span>
                  ))}
                </p>
              ) : null}
            </div>
          </header>

          {/* ---------------- Ringkasan ---------------- */}
          {ringkasan?.length > 0 ? (
            <Bagian judul={L.ringkasan}>
              {ringkasan.map((paragraf, i) => (
                <p key={i} className="dok-teks" style={i === 0 ? { marginTop: 0 } : undefined}>
                  {paragraf}
                </p>
              ))}
            </Bagian>
          ) : null}

          {/* ---------------- Pengalaman ---------------- */}
          {experience.length > 0 ? (
            <Bagian judul={L.pengalaman}>
              {experience.map((item, i) => {
                const org = terisi(t(item.org));
                const jenis = terisi(t(item.type));
                const lokasi = terisi(t(item.location));
                const baris2 = [org, jenis, lokasi].filter(Boolean).join(' · ');

                return (
                  <div key={i} className="dok-entri">
                    <div className="dok-baris">
                      <h3 className="dok-peran">{t(item.role)}</h3>
                      <span className="dok-waktu">{t(item.period)}</span>
                    </div>
                    {baris2 ? <p className="dok-org">{baris2}</p> : null}
                    {t(item.description) ? <p className="dok-teks">{t(item.description)}</p> : null}
                    {item.skills?.length > 0 ? (
                      <p className="dok-tag">
                        <strong>{L.kompetensi}:</strong> {item.skills.join(' · ')}
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </Bagian>
          ) : null}

          {/* ---------------- Pendidikan ---------------- */}
          {education.length > 0 ? (
            <Bagian judul={L.pendidikan}>
              {education.map((item, i) => (
                <div key={i} className="dok-entri">
                  <div className="dok-baris">
                    <h3 className="dok-peran">{t(item.degree)}</h3>
                    <span className="dok-waktu">{t(item.period)}</span>
                  </div>
                  <p className="dok-org">
                    {[terisi(t(item.school)), terisi(t(item.gpa))].filter(Boolean).join(' · ')}
                  </p>
                  {t(item.notes) ? <p className="dok-teks">{t(item.notes)}</p> : null}
                </div>
              ))}
            </Bagian>
          ) : null}

          {/* ---------------- Publikasi ---------------- */}
          {publications.length > 0 ? (
            <Bagian judul={L.publikasi}>
              {publications.map((item, i) => (
                <div key={i} className="dok-entri">
                  <div className="dok-baris">
                    <h3 className="dok-peran">{t(item.title)}</h3>
                    <span className="dok-waktu">{t(item.date)}</span>
                  </div>
                  <p className="dok-org">
                    {[terisi(t(item.venue)), terisi(t(item.role))].filter(Boolean).join(' · ')}
                  </p>
                  {t(item.abstract) ? <p className="dok-teks">{t(item.abstract)}</p> : null}
                  {item.url ? <p className="dok-tag">{item.url}</p> : null}
                </div>
              ))}
            </Bagian>
          ) : null}

          {/* ---------------- Proyek ---------------- */}
          {projects.length > 0 ? (
            <Bagian judul={L.proyek}>
              {projects.map((item, i) => (
                <div key={i} className="dok-entri">
                  <div className="dok-baris">
                    <h3 className="dok-peran">{t(item.name)}</h3>
                    <span className="dok-waktu">{t(item.period)}</span>
                  </div>
                  {terisi(t(item.org)) ? <p className="dok-org">{t(item.org)}</p> : null}
                  {t(item.description) ? <p className="dok-teks">{t(item.description)}</p> : null}
                  {item.tags?.length > 0 ? <p className="dok-tag">{item.tags.join(' · ')}</p> : null}
                </div>
              ))}
            </Bagian>
          ) : null}

          {/* ---------------- Kesukarelawanan ---------------- */}
          {volunteering.length > 0 ? (
            <Bagian judul={L.sukarela}>
              {volunteering.map((item, i) => (
                <div key={i} className="dok-entri">
                  <div className="dok-baris">
                    <h3 className="dok-peran">{t(item.role)}</h3>
                    <span className="dok-waktu">{t(item.period)}</span>
                  </div>
                  {terisi(t(item.org)) ? <p className="dok-org">{t(item.org)}</p> : null}
                  {t(item.description) ? <p className="dok-teks">{t(item.description)}</p> : null}
                </div>
              ))}
            </Bagian>
          ) : null}

          {/* ---------------- Sertifikasi ---------------- */}
          {certifications.length > 0 ? (
            <Bagian judul={L.sertifikasi}>
              <div className="dok-dua-kolom">
                {certifications.map((item, i) => (
                  <div key={i} className="dok-entri" style={{ marginBottom: '0.5rem' }}>
                    <p className="dok-peran" style={{ fontSize: '9.5pt' }}>
                      {t(item.name)}
                    </p>
                    <p className="dok-tag" style={{ marginTop: '0.05rem' }}>
                      {[terisi(t(item.issuer)), terisi(item.year), terisi(t(item.score))]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  </div>
                ))}
              </div>
            </Bagian>
          ) : null}

          {/* ----------- Keahlian, sekaligus bahasa yang dikuasai -----------
              Bahasa digabung ke sini, bukan dijadikan bagian tersendiri.
              Isinya cuma satu baris, dan sebagai bagian terpisah dia sering
              terdorong ke halaman baru sendirian sehingga menyisakan satu
              lembar yang hampir seluruhnya kosong. */}
          {skills.groups?.length > 0 || languages.length > 0 ? (
            <Bagian judul={L.keahlian}>
              {skills.groups?.map((grup, i) => (
                <p key={i} className="dok-tag" style={{ marginTop: i === 0 ? 0 : '0.3rem' }}>
                  <strong>{t(grup.title)}:</strong> {grup.items.join(' · ')}
                </p>
              ))}

              {languages.length > 0 ? (
                <p className="dok-tag" style={{ marginTop: '0.3rem' }}>
                  <strong>{L.bahasa}:</strong>{' '}
                  {languages.map((b) => `${t(b.name)} (${t(b.level)})`).join(' · ')}
                </p>
              ) : null}
            </Bagian>
          ) : null}

        </article>
      </div>
    </div>
  );
}
