'use client';

import { portfolio } from '@/data/portfolio';
import { useLanguage } from '@/components/LanguageProvider';
import { withBasePath } from '@/lib/asset';
import Icon from '@/components/Icon';

/**
 * =============================================================================
 *  BerkasUnduhan: deretan tombol unduh untuk berkas yang dilampirkan ke kartu.
 * =============================================================================
 *
 *  Dipakai di kartu Pengalaman. Isinya kamu atur lewat panel, di menu
 *  Isi Halaman > Pengalaman > Berkas untuk diunduh. Tiap baris berisi nama
 *  tombol dan berkasnya, bebas jenis apa saja: PDF surat keputusan, sertifikat
 *  hasil pindai, foto kegiatan, atau dokumen lain.
 *
 *  Kartu tanpa lampiran tidak menampilkan apa pun, jadi bagian ini aman
 *  dibiarkan kosong.
 * =============================================================================
 */

/**
 * Ikon per jenis berkas. Yang tidak terdaftar memakai ikon dokumen biasa,
 * jadi menambah jenis berkas baru tidak akan merusak tampilan.
 */
const IKON = {
  pdf: 'file-text',
  doc: 'file-text',
  docx: 'file-text',
  txt: 'file-text',
  xls: 'file-text',
  xlsx: 'file-text',
  ppt: 'file-text',
  pptx: 'file-text',
  jpg: 'image',
  jpeg: 'image',
  png: 'image',
  webp: 'image',
  gif: 'image',
  svg: 'image',
  mp4: 'film',
  webm: 'film',
  mov: 'film',
  mp3: 'music',
  wav: 'music',
  m4a: 'music',
  zip: 'folder',
  rar: 'folder',
};

/** Akhiran nama berkas, tanpa titik dan selalu huruf kecil. */
function akhiran(alamat) {
  const bersih = alamat.split(/[?#]/)[0];
  const titik = bersih.lastIndexOf('.');
  if (titik < 0) return '';
  return bersih.slice(titik + 1).toLowerCase();
}

/** Nama berkas apa adanya, dipakai kalau tombolnya belum diberi nama. */
function namaBerkas(alamat) {
  const bersih = alamat.split(/[?#]/)[0];
  return decodeURIComponent(bersih.slice(bersih.lastIndexOf('/') + 1));
}

export default function BerkasUnduhan({ items, className = '' }) {
  const { t } = useLanguage();

  const daftar = (Array.isArray(items) ? items : []).filter((baris) => baris?.file);
  if (daftar.length === 0) return null;

  return (
    <div className={className}>
      <p className="text-meta font-semibold uppercase tracking-[0.14em] text-subtle">
        {t(portfolio.ui.attachments)}
      </p>

      <ul className="mt-2 flex flex-wrap gap-2">
        {daftar.map((baris) => {
          const jenis = akhiran(baris.file);
          const luar = /^https?:\/\//i.test(baris.file);

          return (
            <li key={baris.file}>
              <a
                href={withBasePath(baris.file)}
                /*
                  Atribut download memaksa berkasnya tersimpan, bukan dibuka di
                  tab baru. PDF paling terasa bedanya: tanpa ini peramban malah
                  menampilkannya dan pengunjung harus menyimpannya sendiri.
                  Hanya berlaku untuk berkas milik situs ini, jadi tautan ke
                  alamat luar dibiarkan terbuka seperti biasa.
                */
                download={luar ? undefined : ''}
                target={luar ? '_blank' : undefined}
                rel={luar ? 'noopener noreferrer' : undefined}
                className="tombol-berkas"
              >
                <Icon name={IKON[jenis] ?? 'file-text'} className="h-4 w-4 shrink-0 text-accent" />
                <span className="min-w-0 truncate">{t(baris.label) || namaBerkas(baris.file)}</span>
                {jenis ? <span className="tombol-berkas-jenis">{jenis}</span> : null}
                <Icon
                  name={luar ? 'external-link' : 'download'}
                  className="h-3.5 w-3.5 shrink-0 opacity-60"
                />
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
