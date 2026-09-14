/**
 * =============================================================================
 *  lib/dokumen-docx.js  |  MEMBANGUN BERKAS WORD DARI DATA YANG SAMA
 * =============================================================================
 *
 *  Ketiga dokumen cetak juga tersedia sebagai .docx. Bukan hasil ubahan dari
 *  halaman HTML-nya, melainkan disusun ulang dari sumber yang sama, yaitu
 *  berkas di content/.
 *
 *  KENAPA TIDAK MENGUBAH HTML MENJADI DOCX
 *  Jalan itu terdengar lebih hemat, dan memang ada pustakanya. Hasilnya yang
 *  tidak bisa dipakai: tata letak halaman berubah ubah, lebar kolom tabel
 *  ditebak dari lebar layar, dan berkasnya sering terbuka dengan kotak teks
 *  bertumpuk yang tidak bisa diedit dengan nyaman. Padahal justru itu gunanya
 *  .docx bagi pemakainya: dibuka di Word, lalu disunting.
 *
 *  Disusun ulang dari data, tabelnya jadi tabel Word sungguhan dengan lebar
 *  kolom yang ditentukan, dan seluruh isinya bisa diklik dan diketik ulang.
 *
 *  YANG DIHASILKAN
 *    portofolio    ringkasan rekam jejak, satu kolom
 *    cv            CV satu kolom gaya Harvard, tanpa tabel
 *    cv-peneliti   Daftar Riwayat Hidup bertabel, bagian A sampai J
 *
 *  Ketiganya menghormati rentang waktu yang dipilih pembaca, lihat
 *  lib/rentang.js.
 * =============================================================================
 */

import {
  AlignmentType,
  BorderStyle,
  Document,
  ExternalHyperlink,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';

import { portfolio } from '@/data/portfolio';
import { t as terjemah } from '@/lib/i18n';
import { keteranganRentang, saring } from '@/lib/rentang';

/* --------------------------------------------------------------------------
 *  Satuan dan gaya dasar
 * -------------------------------------------------------------------------- */

/*
  Ukuran di docx memakai satuan setengah titik untuk huruf, dan twip untuk
  jarak. Satu titik sama dengan 20 twip. Angka mentah seperti 480 tidak
  memberi tahu apa apa saat dibaca ulang, jadi dibungkus dua pembantu ini.
*/
const pt = (n) => n * 20;
const huruf = (n) => n * 2;

/** Huruf berkait, sama dengan yang dipakai halaman cetaknya. */
const SERIF = 'Times New Roman';

/** Garis tabel tipis, hitam, seperti berkas Daftar Riwayat Hidup resmi. */
const GARIS = { style: BorderStyle.SINGLE, size: 4, color: '000000' };
const SEMUA_GARIS = { top: GARIS, bottom: GARIS, left: GARIS, right: GARIS };

/** Teks biasa. */
function teks(isi, opsi = {}) {
  return new TextRun({ text: String(isi ?? ''), font: SERIF, size: huruf(opsi.ukuran ?? 10), ...opsi });
}

/** Satu paragraf teks biasa. */
function p(isi, opsi = {}) {
  const { ukuran, tebal, miring, rata, jarakAtas, jarakBawah, ...sisa } = opsi;
  return new Paragraph({
    alignment: rata,
    spacing: { before: pt(jarakAtas ?? 0), after: pt(jarakBawah ?? 4) },
    children: [teks(isi, { ukuran, bold: tebal, italics: miring })],
    ...sisa,
  });
}

/** Judul bagian, misalnya "C. Pengalaman Penelitian". */
function judulBagian(isi) {
  return new Paragraph({
    spacing: { before: pt(12), after: pt(5) },
    keepNext: true, // judul tidak boleh tertinggal sendirian di dasar halaman
    children: [teks(isi, { ukuran: 11, bold: true })],
  });
}

/** Satu sel tabel. */
function sel(isi, opsi = {}) {
  const isiParagraf = Array.isArray(isi) ? isi : [typeof isi === 'string' ? p(isi, { ukuran: 9, jarakBawah: 0 }) : isi];
  return new TableCell({
    borders: SEMUA_GARIS,
    width: opsi.lebar ? { size: opsi.lebar, type: WidthType.PERCENTAGE } : undefined,
    shading: opsi.arsir ? { fill: 'F2F2F2' } : undefined,
    margins: { top: pt(2), bottom: pt(2), left: pt(4), right: pt(4) },
    children: isiParagraf,
  });
}

/** Sel kepala kolom. */
function selKepala(isi, lebar) {
  return sel([p(isi, { ukuran: 9, tebal: true, rata: AlignmentType.CENTER, jarakBawah: 0 })], {
    lebar,
    arsir: true,
  });
}

/** Alamat yang bisa diklik di dalam Word. */
function tautan(alamat) {
  const bersih = String(alamat ?? '').trim();
  if (!bersih) return p('', { ukuran: 8, jarakBawah: 0 });

  return new Paragraph({
    spacing: { after: 0 },
    children: [
      new ExternalHyperlink({
        link: bersih,
        children: [
          new TextRun({
            text: bersih.replace(/^https?:\/\//i, ''),
            font: SERIF,
            size: huruf(8),
            style: 'Hyperlink',
          }),
        ],
      }),
    ],
  });
}

/**
 * Tabel bernomor, dipakai bagian C sampai J pada CV Peneliti.
 *
 * @param {string[]} kepala nama kolom, di luar kolom nomor
 * @param {number[]} lebar  lebar tiap kolom dalam persen, termasuk kolom nomor
 * @param {Array<Array>} baris isi tiap baris
 */
function tabelBernomor(kepala, lebar, baris) {
  // Bagian yang belum terisi tetap mencetak satu baris kosong, supaya terbaca
  // sebagai "belum ada", bukan sebagai bagian yang terlupa dicetak.
  const isi = baris.length > 0 ? baris : [kepala.map(() => '')];

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        tableHeader: true, // kepala kolom diulang di tiap halaman
        children: [selKepala('No', lebar[0]), ...kepala.map((nama, i) => selKepala(nama, lebar[i + 1]))],
      }),
      ...isi.map((kolom, i) =>
        new TableRow({
          children: [
            sel([p(baris.length > 0 ? String(i + 1) : '', { ukuran: 9, rata: AlignmentType.CENTER, jarakBawah: 0 })], {
              lebar: lebar[0],
            }),
            ...kolom.map((nilai, j) =>
              sel(nilai instanceof Paragraph ? [nilai] : String(nilai ?? ''), { lebar: lebar[j + 1] })
            ),
          ],
        })
      ),
    ],
  });
}

/* --------------------------------------------------------------------------
 *  Dokumen 1: Daftar Riwayat Hidup Peneliti
 * -------------------------------------------------------------------------- */

function daftarRiwayatHidup(lang, rentang) {
  const t = (v) => terjemah(v, lang);
  const id = lang === 'id';
  const {
    profile, contact, identitas, education, mengajar,
    penelitian, pengabdian, publications, seminar, buku, hki, kebijakan, penghargaan,
  } = portfolio;

  const R = (daftar) => saring(daftar, rentang);
  const ket = keteranganRentang(rentang, lang);
  // "Pengalaman Penelitian" + " dalam 5 Tahun Terakhir", atau tanpa embel embel
  // kalau yang dipilih seluruh rekam jejak.
  const judul = (dasar) => (ket ? `${dasar} ${ket}` : dasar);

  const anak = [];

  anak.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: pt(14) },
      children: [teks(id ? 'DAFTAR RIWAYAT HIDUP' : 'CURRICULUM VITAE', { ukuran: 14, bold: true })],
    })
  );

  /* ---------- A. Identitas Diri ---------- */
  anak.push(judulBagian(id ? 'A. Identitas Diri' : 'A. Personal Details'));

  const lulusan = identitas?.lulusan ?? {};
  const barisLulusan = [
    lulusan.d3 ? `D3 = ${lulusan.d3} orang` : null,
    lulusan.s1 ? `S1 = ${lulusan.s1} orang` : null,
    lulusan.s2 ? `S2 = ${lulusan.s2} orang` : null,
  ].filter(Boolean).join('; ');

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
  ].filter(([, nilai]) => String(nilai ?? '').trim() !== '');

  const barisDiri = diri.map(([nama, nilai], i) =>
    new TableRow({
      children: [
        sel([p(String(i + 1), { ukuran: 9, rata: AlignmentType.CENTER, jarakBawah: 0 })], { lebar: 6 }),
        sel(nama, { lebar: 32 }),
        sel(String(nilai), { lebar: 62 }),
      ],
    })
  );

  if (mengajar.length > 0) {
    barisDiri.push(
      new TableRow({
        children: [
          sel([p(String(diri.length + 1), { ukuran: 9, rata: AlignmentType.CENTER, jarakBawah: 0 })], { lebar: 6 }),
          sel(id ? 'Mata Kuliah yang Diampu' : 'Courses Taught', { lebar: 32 }),
          sel(
            mengajar.map((mk, i) => p(`${i + 1}. ${mk.nama}`, { ukuran: 9, jarakBawah: 0 })),
            { lebar: 62 }
          ),
        ],
      })
    );
  }

  anak.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: barisDiri }));

  /* ---------- B. Riwayat Pendidikan ---------- */
  const jenjang = ['S1', 'S2', 'S3'];
  const cocok = (tingkat) =>
    education.find((e) => {
      const level = String(e.level ?? '').trim().toUpperCase();
      if (level) return level === tingkat;
      return String(e.degree?.id ?? '').toUpperCase().startsWith(tingkat);
    }) ?? null;

  const kolomPend = jenjang.map(cocok);

  if (kolomPend.some(Boolean)) {
    anak.push(judulBagian(id ? 'B. Riwayat Pendidikan' : 'B. Education'));

    const ambil = (e, kunci) => {
      if (!e) return '-';
      if (kunci === 'sekolah') return e.school ?? '-';
      if (kunci === 'bidang') return t(e.fieldOfStudy) || '-';
      if (kunci === 'tahun') return e.period ?? '-';
      if (kunci === 'judul') return t(e.thesis) || '-';
      if (kunci === 'pembimbing') return t(e.supervisor) || '-';
      return '-';
    };

    const barisPend = [
      [id ? 'Nama Perguruan Tinggi' : 'Institution', 'sekolah'],
      [id ? 'Bidang Ilmu' : 'Field of Study', 'bidang'],
      [id ? 'Tahun Masuk - Lulus' : 'Years Attended', 'tahun'],
      [id ? 'Judul Skripsi / Tesis / Disertasi' : 'Thesis Title', 'judul'],
      [id ? 'Nama Pembimbing / Promotor' : 'Supervisors', 'pembimbing'],
    ];

    anak.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            tableHeader: true,
            children: [
              selKepala(id ? 'Program' : 'Programme', 25),
              ...jenjang.map((j) => selKepala(j, 25)),
            ],
          }),
          ...barisPend.map(([nama, kunci]) =>
            new TableRow({
              children: [sel(nama, { lebar: 25 }), ...kolomPend.map((e) => sel(ambil(e, kunci), { lebar: 25 }))],
            })
          ),
        ],
      })
    );
  }

  /* ---------- C sampai J ---------- */
  const bagian = [
    {
      huruf: 'C',
      judul: judul(id ? 'Pengalaman Penelitian' : 'Research Experience'),
      catatan: id ? '(Bukan Skripsi, Tesis, dan Disertasi)' : '(Excluding theses)',
      kepala: id ? ['Judul Penelitian', 'Penyandang Dana', 'Tahun', 'Peran'] : ['Research Title', 'Funding', 'Year', 'Role'],
      lebar: [6, 51, 22, 9, 12],
      baris: R(penelitian).map((x) => [x.judul, x.dana, x.tahun, t(x.peran)]),
    },
    {
      huruf: 'D',
      judul: judul(id ? 'Pengalaman Pengabdian kepada Masyarakat' : 'Community Service Experience'),
      kepala: id ? ['Judul Pengabdian', 'Penyandang Dana', 'Tahun', 'Peran'] : ['Service Title', 'Funding', 'Year', 'Role'],
      lebar: [6, 51, 22, 9, 12],
      baris: R(pengabdian).map((x) => [x.judul, x.dana, x.tahun, t(x.peran)]),
    },
    {
      huruf: 'E',
      judul: judul(id ? 'Publikasi Artikel Ilmiah dalam Jurnal' : 'Journal Articles'),
      kepala: id ? ['Judul Artikel', 'Aktivitas', 'URL Artikel'] : ['Article Title', 'Activity', 'Article URL'],
      lebar: [6, 49, 13, 32],
      baris: R(publications).map((x) => [x.title, t(x.aktivitas), tautan(x.url)]),
    },
    {
      huruf: 'F',
      judul: judul(id ? 'Pemakalah Seminar Ilmiah (Oral Presentation)' : 'Conference Papers (Oral Presentation)'),
      kepala: id ? ['Nama Temu Ilmiah / Seminar', 'Judul Artikel Ilmiah', 'Waktu dan Tempat'] : ['Conference', 'Paper Title', 'Time and Venue'],
      lebar: [6, 31, 36, 27],
      baris: R(seminar).map((x) => [x.forum, x.judul, x.waktu]),
    },
    {
      huruf: 'G',
      judul: judul(id ? 'Karya Buku' : 'Authored Books'),
      kepala: id ? ['Tahun', 'Judul Buku', 'Jumlah Halaman', 'Penerbit'] : ['Year', 'Book Title', 'Pages', 'Publisher'],
      lebar: [6, 9, 48, 11, 26],
      baris: R(buku).map((x) => [x.tahun, x.judul, x.halaman, x.penerbit]),
    },
    {
      huruf: 'H',
      judul: judul(id ? 'Perolehan HKI' : 'Registered Intellectual Property'),
      kepala: id ? ['Tahun', 'Judul / Tema HKI', 'Jenis', 'Nomor Pendaftaran'] : ['Year', 'Title / Subject', 'Type', 'Registration No.'],
      lebar: [6, 9, 47, 10, 28],
      baris: R(hki).map((x) => [x.tahun, x.judul, x.jenis, x.nomor]),
    },
    {
      huruf: 'I',
      judul: judul(id ? 'Pengalaman Merumuskan Kebijakan Publik / Rekayasa Sosial' : 'Public Policy Formulation'),
      kepala: id ? ['Judul / Tema / Jenis', 'Tahun', 'Tempat Penerapan', 'Respon Masyarakat'] : ['Title / Subject', 'Year', 'Applied At', 'Response'],
      lebar: [6, 47, 9, 25, 13],
      baris: R(kebijakan).map((x) => [x.judul, x.tahun, x.tempat, t(x.respon)]),
    },
    {
      huruf: 'J',
      judul: judul(id ? 'Penghargaan' : 'Awards'),
      kepala: id ? ['Jenis Penghargaan', 'Institusi Pemberi', 'Tahun'] : ['Award', 'Awarding Institution', 'Year'],
      lebar: [6, 48, 36, 10],
      baris: R(penghargaan).map((x) => [t(x.jenis), t(x.institusi), x.tahun]),
    },
  ];

  for (const b of bagian) {
    anak.push(judulBagian(`${b.huruf}. ${b.judul}`));
    if (b.catatan) anak.push(p(b.catatan, { ukuran: 9, miring: true, jarakBawah: 3 }));
    anak.push(tabelBernomor(b.kepala, b.lebar, b.baris));
  }

  /* ---------- Pernyataan dan tanda tangan ---------- */
  anak.push(
    p(
      id
        ? 'Semua data yang saya isikan dan tercantum dalam biodata ini adalah benar dan dapat dipertanggungjawabkan secara hukum. Apabila di kemudian hari ternyata dijumpai ketidaksesuaian dengan kenyataan, saya sanggup menerima sanksi.'
        : 'All information entered in this curriculum vitae is true and can be legally accounted for. Should any discrepancy be found at a later date, I am prepared to accept the consequences.',
      { ukuran: 9, rata: AlignmentType.JUSTIFIED, jarakAtas: 14, jarakBawah: 20 }
    )
  );

  const ttd = identitas?.tandaTangan ?? {};
  for (const baris of [t(ttd.kota), t(ttd.jabatan) || (id ? 'Ketua Peneliti' : 'Principal Investigator')]) {
    if (baris) anak.push(p(baris, { ukuran: 9, rata: AlignmentType.RIGHT, jarakBawah: 0 }));
  }
  // Ruang kosong untuk membubuhkan tanda tangan setelah dicetak.
  anak.push(p('', { ukuran: 9, jarakBawah: 44 }));
  anak.push(p(profile.name, { ukuran: 9, tebal: true, rata: AlignmentType.RIGHT, jarakBawah: 0 }));
  if (identitas?.nip) anak.push(p(`NIP. ${identitas.nip}`, { ukuran: 9, rata: AlignmentType.RIGHT }));

  return anak;
}

/* --------------------------------------------------------------------------
 *  Dokumen 2: CV satu kolom
 * -------------------------------------------------------------------------- */

function cvSatuKolom(lang, rentang) {
  const t = (v) => terjemah(v, lang);
  const id = lang === 'id';
  const { profile, contact, meta, education, experience, publications, buku, hki, kebijakan, skills, languages } = portfolio;
  const R = (daftar) => saring(daftar, rentang);

  const anak = [];

  anak.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: pt(2) },
      children: [teks(profile.name.toUpperCase(), { ukuran: 15, bold: true })],
    })
  );

  const kontak = [profile.location, contact?.phone, contact?.email, meta?.baseUrl?.replace(/^https?:\/\//, '')]
    .filter(Boolean)
    .join('  |  ');
  anak.push(p(kontak, { ukuran: 9, rata: AlignmentType.CENTER, jarakBawah: 10 }));

  /** Judul bagian bergaris bawah, gaya CV Harvard. */
  const bagian = (nama) =>
    new Paragraph({
      spacing: { before: pt(10), after: pt(4) },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '000000' } },
      keepNext: true,
      children: [teks(nama.toUpperCase(), { ukuran: 10.5, bold: true, characterSpacing: 20 })],
    });

  /** Satu entri: baris kiri tebal, tanggal di kanan. */
  const entri = (kiri, kanan) =>
    new Paragraph({
      spacing: { before: pt(4), after: 0 },
      tabStops: [{ type: 'right', position: 9000 }],
      children: [teks(kiri, { ukuran: 10, bold: true }), teks('\t' + (kanan ?? ''), { ukuran: 10 })],
    });

  if (education.length > 0) {
    anak.push(bagian(id ? 'Pendidikan' : 'Education'));
    for (const e of education) {
      anak.push(entri(`${e.school}${profile.location ? ', ' + (e.location ?? '') : ''}`.replace(/, $/, ''), e.period));
      anak.push(p(t(e.degree), { ukuran: 10, jarakBawah: 1 }));
      if (t(e.notes)) anak.push(p(t(e.notes), { ukuran: 9.5, jarakBawah: 2 }));
    }
  }

  if (experience.length > 0) {
    anak.push(bagian(id ? 'Pengalaman' : 'Experience'));
    for (const x of experience) {
      anak.push(entri(t(x.org) || t(x.role), t(x.period)));
      anak.push(p([t(x.role), t(x.type)].filter(Boolean).join(', '), { ukuran: 10, jarakBawah: 1 }));
      if (t(x.description)) anak.push(p(t(x.description), { ukuran: 9.5, jarakBawah: 2 }));
    }
  }

  const daftarSederhana = [
    { nama: id ? 'Karya Buku' : 'Authored Books', isi: R(buku), baris: (x) => [`${x.judul}`, x.tahun, [x.penerbit, x.halaman ? `${x.halaman} hlm` : ''].filter(Boolean).join(', ')] },
    { nama: id ? 'Hak Kekayaan Intelektual' : 'Intellectual Property', isi: R(hki), baris: (x) => [x.judul, x.tahun, [x.jenis, x.nomor].filter(Boolean).join(', ')] },
    { nama: id ? 'Perumusan Kebijakan Publik' : 'Public Policy Formulation', isi: R(kebijakan), baris: (x) => [x.judul, x.tahun, x.tempat] },
    { nama: id ? 'Publikasi' : 'Publications', isi: R(publications), baris: (x) => [x.title, x.tahun ?? '', [t(x.venue), t(x.aktivitas)].filter(Boolean).join(', ')] },
  ];

  for (const d of daftarSederhana) {
    if (d.isi.length === 0) continue;
    anak.push(bagian(d.nama));
    for (const x of d.isi) {
      const [utama, tahun, kedua] = d.baris(x);
      anak.push(entri(utama, tahun));
      if (kedua) anak.push(p(kedua, { ukuran: 9.5, jarakBawah: 1 }));
    }
  }

  if (skills?.groups?.length) {
    anak.push(bagian(id ? 'Keahlian' : 'Skills'));
    for (const g of skills.groups) {
      anak.push(p(`${t(g.title)}: ${(g.items ?? []).join(', ')}`, { ukuran: 9.5, jarakBawah: 2 }));
    }
  }

  if (languages.length > 0) {
    anak.push(bagian(id ? 'Bahasa' : 'Languages'));
    anak.push(p(languages.map((b) => `${t(b.name)} (${t(b.level)})`).join('; '), { ukuran: 9.5 }));
  }

  return anak;
}

/* --------------------------------------------------------------------------
 *  Dokumen 3: Portofolio
 * -------------------------------------------------------------------------- */

function dokumenPortofolio(lang, rentang) {
  const t = (v) => terjemah(v, lang);
  const id = lang === 'id';
  const { profile, contact, meta, stats } = portfolio;

  const anak = [];

  anak.push(
    new Paragraph({
      spacing: { after: pt(2) },
      children: [teks(profile.name, { ukuran: 17, bold: true })],
    })
  );
  anak.push(p(t(profile.headline), { ukuran: 10.5, jarakBawah: 6 }));
  anak.push(
    p([profile.location, contact?.phone, contact?.email, meta?.baseUrl?.replace(/^https?:\/\//, '')].filter(Boolean).join('  |  '), {
      ukuran: 9,
      jarakBawah: 10,
    })
  );

  const ringkas = Array.isArray(profile[id ? 'summaryId' : 'summaryEn']) ? profile[id ? 'summaryId' : 'summaryEn'] : [];
  if (ringkas.length) {
    anak.push(judulBagian(id ? 'Profil' : 'Profile'));
    for (const par of ringkas) anak.push(p(par, { ukuran: 10, rata: AlignmentType.JUSTIFIED, jarakBawah: 4 }));
  }

  if (stats.length) {
    anak.push(judulBagian(id ? 'Angka Sorotan' : 'At a Glance'));
    for (const s of stats) anak.push(p(`${s.value}  ${t(s.label)}`, { ukuran: 10, jarakBawah: 2 }));
  }

  // Sisanya memakai susunan yang sama dengan CV, supaya tidak ada dua tempat
  // yang harus diperbarui setiap daftar isinya bertambah.
  anak.push(...cvSatuKolom(lang, rentang).slice(2));

  return anak;
}

/* --------------------------------------------------------------------------
 *  Pintu masuk
 * -------------------------------------------------------------------------- */

const PEMBANGUN = {
  'cv-peneliti': daftarRiwayatHidup,
  cv: cvSatuKolom,
  portofolio: dokumenPortofolio,
};

/** Jenis dokumen yang tersedia sebagai .docx. */
export const JENIS_DOCX = Object.keys(PEMBANGUN);

/**
 * Membangun satu berkas .docx.
 *
 * @param {{jenis: string, lang?: 'id'|'en', rentang?: string}} opsi
 * @returns {Promise<Buffer>}
 */
export async function buatDocx({ jenis, lang = 'id', rentang = 'semua' }) {
  const pembangun = PEMBANGUN[jenis];
  if (!pembangun) throw new Error(`Jenis dokumen tidak dikenal: ${jenis}`);

  const dokumen = new Document({
    creator: portfolio.profile.name,
    title: `${jenis} ${portfolio.profile.name}`,
    styles: {
      default: {
        document: { run: { font: SERIF, size: huruf(10) } },
      },
    },
    sections: [
      {
        properties: {
          page: {
            // A4 dalam twip, dengan margin 15 sampai 16 milimeter seperti
            // halaman cetaknya.
            size: { width: 11906, height: 16838 },
            margin: { top: 907, right: 850, bottom: 907, left: 850 },
          },
        },
        children: pembangun(lang, rentang),
      },
    ],
  });

  return Packer.toBuffer(dokumen);
}

/** Nama berkas yang diusulkan saat diunduh. */
export function namaBerkas({ jenis, lang = 'id', rentang = 'semua' }) {
  const nama = portfolio.profile.name
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
  const bagian = { 'cv-peneliti': 'Daftar-Riwayat-Hidup', cv: 'CV', portofolio: 'Portofolio' }[jenis] ?? jenis;
  const akhiran = rentang === 'semua' ? '' : `-${rentang}tahun`;
  return `${bagian}-${nama}${akhiran}-${lang}.docx`;
}
