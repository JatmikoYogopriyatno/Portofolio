'use client';

import { useState } from 'react';
import { portfolio } from '@/data/portfolio';
import { useLanguage } from '@/components/LanguageProvider';
import { terisi } from '@/lib/teks-dokumen';
import DokumenBilah, { dokumenLain } from '@/components/DokumenBilah';
import { RENTANG_BAWAAN, keteranganRentang, saring } from '@/lib/rentang';

/**
 * =============================================================================
 *  DokumenCVPeneliti: Daftar Riwayat Hidup berbentuk tabel.
 * =============================================================================
 *
 *  KENAPA BENTUKNYA BERBEDA DARI DUA DOKUMEN LAIN
 *  Halaman /cetak/cv/ sengaja dibuat tanpa tabel, karena tujuannya dibaca mesin
 *  pelacak lamaran dan mesin seperti itu sering tersandung tabel. Berkas ini
 *  kebalikannya: pembacanya manusia, tepatnya reviewer pengajuan penelitian dan
 *  bagian kepegawaian, dan mereka mengharapkan susunan yang sudah baku.
 *
 *  Jadi bentuknya mengikuti berkas Daftar Riwayat Hidup yang dipakai pengajuan
 *  penelitian: identitas diri bernomor, riwayat pendidikan tiga jenjang
 *  bersanding, lalu bagian A sampai J masing masing berupa tabel. Sampai ke
 *  pernyataan penutup dan blok tanda tangan di bawahnya.
 *
 *  ISINYA SATU SUMBER DENGAN SITUS
 *  Tidak ada isi yang diketik ulang di sini. Semuanya dibaca dari berkas yang
 *  sama dengan yang dipakai halaman utama, jadi memperbarui satu baris lewat
 *  panel langsung terlihat di situs dan di dokumen ini sekaligus.
 *
 *  BAGIAN YANG KOSONG TETAP DICETAK
 *  Berbeda dengan bagian di halaman utama yang menyembunyikan diri saat kosong,
 *  tabel di sini tetap muncul dengan satu baris kosong. Itu disengaja: berkas
 *  Daftar Riwayat Hidup dinilai per bagian, dan bagian yang hilang sama sekali
 *  terbaca sebagai berkas yang tidak lengkap, bukan sebagai bagian yang memang
 *  belum terisi.
 * =============================================================================
 */

/** Satu bagian bertajuk huruf, misalnya "C. Pengalaman Penelitian". */
function Bagian({ huruf, judul, catatan, children }) {
  return (
    <section className="drh-bagian">
      <h2 className="drh-judul">
        <span className="drh-huruf">{huruf}.</span> {judul}
      </h2>
      {catatan ? <p className="drh-catatan">{catatan}</p> : null}
      {children}
    </section>
  );
}

/**
 * Tabel bernomor untuk bagian C sampai J.
 *
 * @param {object} props
 * @param {string[]} props.kepala   nama kolom, di luar kolom nomor
 * @param {Array<Array>} props.baris  isi tiap baris, sejajar dengan kepala
 * @param {string[]} [props.lebar]  lebar tiap kolom, misalnya ['auto','18%']
 */
function Tabel({ kepala, baris, lebar = [] }) {
  // Bagian yang belum terisi tetap menampilkan satu baris kosong, supaya
  // terbaca sebagai "belum ada", bukan sebagai bagian yang terlupa dicetak.
  const isi = baris.length > 0 ? baris : [kepala.map(() => '')];

  return (
    <table className="drh-tabel">
      <thead>
        <tr>
          <th className="drh-no">No</th>
          {kepala.map((nama, i) => (
            <th key={nama} style={lebar[i] ? { width: lebar[i] } : undefined}>
              {nama}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {isi.map((sel, i) => (
          <tr key={i}>
            <td className="drh-no">{baris.length > 0 ? i + 1 : ''}</td>
            {sel.map((nilai, j) => (
              <td key={j}>{nilai}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/**
 * Alamat artikel di kolom URL.
 *
 * Ditulis utuh, bukan diganti nama seperti di CV ATS. Di berkas Daftar Riwayat
 * Hidup, alamat itu justru yang diperiksa reviewer untuk menelusuri artikelnya,
 * jadi harus terbaca apa adanya walau barisnya jadi panjang. Aturan patah kata
 * di .drh-url yang menjaganya tetap masuk kolom.
 */
function Alamat({ href }) {
  const bersih = terisi(href);
  if (!bersih) return null;

  return (
    <a className="drh-url" href={bersih} rel="noopener noreferrer">
      {bersih.replace(/^https?:\/\//i, '')}
    </a>
  );
}

export default function DokumenCVPeneliti() {
  const { lang, t } = useLanguage();

  /*
    Rentang waktu isi dokumen. Disimpan di sini, bukan di alamat halaman,
    karena halaman ini dibuat sekali saat build dan alamatnya tidak boleh
    bercabang jadi banyak versi di mesin pencari.
  */
  const [rentang, setRentang] = useState(RENTANG_BAWAAN);
  const {
    profile,
    contact,
    identitas,
    education,
    mengajar,
    penelitian,
    pengabdian,
    publications,
    seminar,
    buku,
    hki,
    kebijakan,
    penghargaan,
  } = portfolio;

  const id = lang === 'id';

  /** Menyaring satu daftar menurut rentang yang sedang dipilih. */
  const R = (daftar) => saring(daftar, rentang);

  /*
    Judul bagian ikut rentang. Berkas aslinya berbunyi "dalam 5 Tahun
    Terakhir", dan kalimat itu jadi keliru begitu pembaca memilih tiga tahun
    atau seluruh rekam jejak. Jadi keterangannya disusun, bukan ditulis tetap.
  */
  const ket = keteranganRentang(rentang, lang);
  const judulRentang = (dasar) => (ket ? `${dasar} ${ket}` : dasar);

  const L = id
    ? {
        dokumen: 'DAFTAR RIWAYAT HIDUP',
        identitas: 'Identitas Diri',
        pendidikan: 'Riwayat Pendidikan',
        penelitian: judulRentang('Pengalaman Penelitian'),
        penelitianCatatan: '(Bukan Skripsi, Tesis, dan Disertasi)',
        pengabdian: judulRentang('Pengalaman Pengabdian kepada Masyarakat'),
        publikasi: judulRentang('Publikasi Artikel Ilmiah dalam Jurnal'),
        seminar: judulRentang('Pemakalah Seminar Ilmiah (Oral Presentation)'),
        buku: judulRentang('Karya Buku'),
        hki: judulRentang('Perolehan HKI'),
        kebijakan: judulRentang('Pengalaman Merumuskan Kebijakan Publik / Rekayasa Sosial Lainnya'),
        penghargaan: judulRentang('Penghargaan') + ' (dari pemerintah, asosiasi atau institusi lainnya)',
        pernyataan:
          'Semua data yang saya isikan dan tercantum dalam biodata ini adalah benar dan dapat dipertanggungjawabkan secara hukum. Apabila di kemudian hari ternyata dijumpai ketidaksesuaian dengan kenyataan, saya sanggup menerima sanksi.',
        ketua: 'Ketua Peneliti',
      }
    : {
        dokumen: 'CURRICULUM VITAE',
        identitas: 'Personal Details',
        pendidikan: 'Education',
        penelitian: judulRentang('Research Experience'),
        penelitianCatatan: '(Excluding undergraduate, master, and doctoral theses)',
        pengabdian: judulRentang('Community Service Experience'),
        publikasi: judulRentang('Journal Articles'),
        seminar: judulRentang('Conference Papers (Oral Presentation)'),
        buku: judulRentang('Authored Books'),
        hki: judulRentang('Registered Intellectual Property'),
        kebijakan: judulRentang('Public Policy Formulation and Social Engineering'),
        penghargaan: judulRentang('Awards') + ' (from government, associations, or institutions)',
        pernyataan:
          'All information entered in this curriculum vitae is true and can be legally accounted for. Should any discrepancy be found at a later date, I am prepared to accept the consequences.',
        ketua: 'Principal Investigator',
      };

  /*
    Identitas diri, bernomor seperti di berkas aslinya.

    Barisnya disusun sebagai larik, bukan ditulis satu per satu sebagai <tr>,
    supaya baris yang isinya kosong bisa dibuang sekaligus di satu tempat.
    Yang kosong memang harus hilang: baris "NIDN" tanpa nomor di sebelahnya
    tidak memberi keterangan apa pun.
  */
  const lulusan = identitas?.lulusan ?? {};
  const barisLulusan = [
    lulusan.d3 ? `D3 = ${lulusan.d3} orang` : null,
    lulusan.s1 ? `S1 = ${lulusan.s1} orang` : null,
    lulusan.s2 ? `S2 = ${lulusan.s2} orang` : null,
  ]
    .filter(Boolean)
    .join('; ');

  const diri = [
    [id ? 'Nama Lengkap' : 'Full Name', profile.name],
    [id ? 'Jenis Kelamin' : 'Gender', t(identitas?.jenisKelamin)],
    [id ? 'Jabatan Fungsional' : 'Academic Rank', t(identitas?.jabatanFungsional)],
    ['NIP', identitas?.nip],
    ['NIDN', identitas?.nidn],
    [id ? 'Tempat dan Tanggal Lahir' : 'Place and Date of Birth', t(identitas?.tempatTanggalLahir)],
    ['E-mail', contact?.email],
    [id ? 'Nomor Telepon / HP' : 'Phone', contact?.phone],
    [id ? 'Alamat Kantor' : 'Office Address', t(identitas?.alamatKantor)],
    [id ? 'Lulusan yang Telah Dihasilkan' : 'Graduates Supervised', barisLulusan],
  ].filter(([, nilai]) => terisi(nilai));

  /*
    Riwayat pendidikan disusun tiga kolom bersanding: S1, S2, S3.

    Bentuk itu yang dipakai berkas aslinya, dan memang berguna. Reviewer
    membaca satu baris untuk membandingkan satu hal di ketiga jenjang
    sekaligus, misalnya nama perguruan tingginya. Kalau ditumpuk ke bawah,
    perbandingan itu hilang.

    Data pendidikan di panel tersimpan urut dari yang terbaru, karena itu yang
    benar untuk tampilan di situs dan untuk CV. Di sini urutannya dibalik dan
    dijodohkan ke kolom menurut jenjangnya.
  */
  const jenjang = ['S1', 'S2', 'S3'];

  /*
    Jenjang dibaca dari kolom Jenjang yang kamu isi di panel, bukan ditebak
    dari judul gelarnya.

    Menebak dari judul sempat dicoba dan gagal di satu tempat yang tidak
    kelihatan: judul gelar versi Inggris berbunyi "Master's Degree in Public
    Administration", dan di situ tidak ada satu pun huruf S2. Jadi begitu
    pengunjung menekan tombol EN, seluruh tabel pendidikan berubah jadi tanda
    hubung. Kolom Jenjang isinya sama di kedua bahasa, jadi tidak bisa hilang
    seperti itu.
  */
  const cocokJenjang = (tingkat) =>
    education.find((e) => {
      const level = String(e.level ?? '').trim().toUpperCase();
      if (level) return level === tingkat;
      // Cadangan untuk baris lama yang kolom Jenjangnya belum diisi.
      return String(e.degree?.id ?? '').toUpperCase().startsWith(tingkat);
    }) ?? null;

  const kolomPendidikan = jenjang.map(cocokJenjang);
  const adaPendidikan = kolomPendidikan.some(Boolean);

  const barisPendidikan = [
    [id ? 'Nama Perguruan Tinggi' : 'Institution', (e) => e?.school],
    [id ? 'Bidang Ilmu' : 'Field of Study', (e) => t(e?.fieldOfStudy) || t(e?.major)],
    [id ? 'Tahun Masuk - Lulus' : 'Years Attended', (e) => e?.period],
    [id ? 'Judul Skripsi / Tesis / Disertasi' : 'Thesis Title', (e) => t(e?.thesis)],
    [id ? 'Nama Pembimbing / Promotor' : 'Supervisors', (e) => t(e?.supervisor)],
  ];

  /*
    Judul skripsi dan nama pembimbing tersimpan menyatu di dalam catatan, bukan
    sebagai kolom tersendiri, karena begitulah bentuknya di templat aslinya dan
    itu yang dipakai halaman Pendidikan di situs.

    Di sini keduanya dipisahkan kembali dengan membaca awalan kalimatnya.
    Kalau pemisahan gagal, catatannya tetap dicetak utuh di baris judul, jadi
    tidak ada isi yang hilang.
  */
  const pisahCatatan = (e) => {
    const catatan = terisi(t(e?.notes));
    if (!catatan) return { judul: '', pembimbing: '' };

    const potong = catatan.split(/\s*(?:Pembimbing|Supervisors?)\s*:\s*/i);
    const judul = potong[0].replace(/^(?:Skripsi|Tesis|Thesis|Undergraduate thesis)\s*:\s*/i, '').trim();
    return { judul, pembimbing: (potong[1] ?? '').trim() };
  };

  const ambilPendidikan = (e, i) => {
    if (!e) return '';

    // Kolom tersendiri selalu didahulukan.
    const langsung = terisi(barisPendidikan[i][1](e));
    if (langsung) return langsung;

    // Baru kalau kosong, isinya dicari di dalam catatan.
    if (i === 3 || i === 4) {
      const { judul, pembimbing } = pisahCatatan(e);
      return i === 3 ? judul : pembimbing;
    }

    return '';
  };

  return (
    <div className="dok-lembar">
      <DokumenBilah
        judul={id ? 'CV Peneliti' : 'Researcher CV'}
        lain={dokumenLain('cvPeneliti')}
        jenis="cv-peneliti"
        rentang={rentang}
        setRentang={setRentang}
      />

      <div className="dok-kertas">
        <article className="drh">
          <h1 className="drh-nama">{L.dokumen}</h1>

          {/* ---------------- A. Identitas Diri ---------------- */}
          <Bagian huruf="A" judul={L.identitas}>
            <table className="drh-tabel drh-tabel-diri">
              <tbody>
                {diri.map(([nama, nilai], i) => (
                  <tr key={nama}>
                    <td className="drh-no">{i + 1}</td>
                    <th scope="row">{nama}</th>
                    <td>{nilai}</td>
                  </tr>
                ))}

                {mengajar.length > 0 ? (
                  <tr>
                    <td className="drh-no">{diri.length + 1}</td>
                    <th scope="row">{id ? 'Mata Kuliah yang Diampu' : 'Courses Taught'}</th>
                    <td>
                      <ol className="drh-daftar-mk">
                        {mengajar.map((mk) => (
                          <li key={mk.nama}>{mk.nama}</li>
                        ))}
                      </ol>
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </Bagian>

          {/* ---------------- B. Riwayat Pendidikan ---------------- */}
          {adaPendidikan ? (
            <Bagian huruf="B" judul={L.pendidikan}>
              <table className="drh-tabel drh-tabel-pendidikan">
                <thead>
                  <tr>
                    <th>{id ? 'Program' : 'Programme'}</th>
                    {jenjang.map((j) => (
                      <th key={j}>{j}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {barisPendidikan.map(([nama], i) => (
                    <tr key={nama}>
                      <th scope="row">{nama}</th>
                      {kolomPendidikan.map((e, k) => (
                        <td key={jenjang[k]}>{ambilPendidikan(e, i) || '-'}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Bagian>
          ) : null}

          {/* ---------------- C. Penelitian ---------------- */}
          <Bagian huruf="C" judul={L.penelitian} catatan={L.penelitianCatatan}>
            <Tabel
              kepala={[
                id ? 'Judul Penelitian' : 'Research Title',
                id ? 'Penyandang Dana' : 'Funding',
                id ? 'Tahun' : 'Year',
                id ? 'Peran' : 'Role',
              ]}
              lebar={['auto', '22%', '8%', '11%']}
              baris={R(penelitian).map((p) => [p.judul, p.dana, p.tahun, t(p.peran)])}
            />
          </Bagian>

          {/* ---------------- D. Pengabdian ---------------- */}
          <Bagian huruf="D" judul={L.pengabdian}>
            <Tabel
              kepala={[
                id ? 'Judul Pengabdian kepada Masyarakat' : 'Community Service Title',
                id ? 'Penyandang Dana' : 'Funding',
                id ? 'Tahun' : 'Year',
                id ? 'Peran' : 'Role',
              ]}
              lebar={['auto', '22%', '8%', '11%']}
              baris={R(pengabdian).map((p) => [p.judul, p.dana, p.tahun, t(p.peran)])}
            />
          </Bagian>

          {/* ---------------- E. Publikasi ---------------- */}
          <Bagian huruf="E" judul={L.publikasi}>
            <Tabel
              kepala={[
                id ? 'Judul Artikel' : 'Article Title',
                id ? 'Aktivitas (Riset / PPM)' : 'Activity',
                id ? 'URL Artikel' : 'Article URL',
              ]}
              lebar={['auto', '13%', '31%']}
              baris={R(publications).map((p) => [
                p.title,
                t(p.aktivitas),
                <Alamat key={p.url} href={p.url} />,
              ])}
            />
          </Bagian>

          {/* ---------------- F. Seminar ---------------- */}
          <Bagian huruf="F" judul={L.seminar}>
            <Tabel
              kepala={[
                id ? 'Nama Temu Ilmiah / Seminar' : 'Academic Forum / Conference',
                id ? 'Judul Artikel Ilmiah' : 'Paper Title',
                id ? 'Waktu dan Tempat' : 'Time and Venue',
              ]}
              lebar={['31%', 'auto', '27%']}
              baris={R(seminar).map((s) => [s.forum, s.judul, s.waktu])}
            />
          </Bagian>

          {/* ---------------- G. Karya Buku ---------------- */}
          <Bagian huruf="G" judul={L.buku}>
            <Tabel
              kepala={[
                id ? 'Tahun' : 'Year',
                id ? 'Judul Buku' : 'Book Title',
                id ? 'Jumlah Halaman' : 'Pages',
                id ? 'Penerbit' : 'Publisher',
              ]}
              lebar={['8%', 'auto', '11%', '26%']}
              baris={R(buku).map((b) => [b.tahun, b.judul, b.halaman, b.penerbit])}
            />
          </Bagian>

          {/* ---------------- H. HKI ---------------- */}
          <Bagian huruf="H" judul={L.hki}>
            <Tabel
              kepala={[
                id ? 'Tahun' : 'Year',
                id ? 'Judul / Tema HKI' : 'Title / Subject',
                id ? 'Jenis' : 'Type',
                id ? 'Nomor Pendaftaran / Sertifikat' : 'Registration / Certificate No.',
              ]}
              lebar={['8%', 'auto', '10%', '28%']}
              baris={R(hki).map((h) => [h.tahun, h.judul, h.jenis, h.nomor])}
            />
          </Bagian>

          {/* ---------------- I. Kebijakan ---------------- */}
          <Bagian huruf="I" judul={L.kebijakan}>
            <Tabel
              kepala={[
                id
                  ? 'Judul / Tema / Jenis Rekayasa Sosial Lainnya yang Telah Ditetapkan'
                  : 'Title / Subject / Type of Social Engineering',
                id ? 'Tahun' : 'Year',
                id ? 'Tempat Penerapan' : 'Applied At',
                id ? 'Respon Masyarakat' : 'Public Response',
              ]}
              lebar={['auto', '8%', '26%', '13%']}
              baris={R(kebijakan).map((k) => [k.judul, k.tahun, k.tempat, t(k.respon)])}
            />
          </Bagian>

          {/* ---------------- J. Penghargaan ---------------- */}
          <Bagian huruf="J" judul={L.penghargaan}>
            <Tabel
              kepala={[
                id ? 'Jenis Penghargaan' : 'Award',
                id ? 'Institusi Pemberi Penghargaan' : 'Awarding Institution',
                id ? 'Tahun' : 'Year',
              ]}
              lebar={['auto', '38%', '10%']}
              baris={R(penghargaan).map((p) => [t(p.jenis), t(p.institusi), p.tahun])}
            />
          </Bagian>

          {/* ---------------- Pernyataan dan tanda tangan ---------------- */}
          <section className="drh-penutup">
            <p>{L.pernyataan}</p>

            {/*
              Blok tanda tangan. Ruang kosong di antara jabatan dan nama memang
              disengaja, itu tempat tanda tangan dibubuhkan setelah dicetak.
            */}
            <div className="drh-ttd">
              {/*
                Kota dan tanggal diisi sendiri lewat panel, bukan diambil dari
                jam komputer pengunjung.

                Tanggal otomatis sempat dipertimbangkan dan ditolak. Berkas ini
                dicetak sekali lalu dilampirkan ke pengajuan, dan tanggal yang
                tertera seharusnya tanggal penandatanganan, bukan tanggal kapan
                pun halamannya dibuka orang lain. Lagipula halaman ini dirakit
                di peramban, jadi tanggal otomatis akan berbeda antara yang
                dikirim server dan yang dihitung peramban.
              */}
              <p>{t(identitas?.tandaTangan?.kota)}</p>
              <p>{t(identitas?.tandaTangan?.jabatan) || L.ketua}</p>
              <p className="drh-ttd-nama">{profile.name}</p>
              {identitas?.nip ? <p>NIP. {identitas.nip}</p> : null}
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
