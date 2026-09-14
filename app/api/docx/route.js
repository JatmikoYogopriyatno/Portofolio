import { NextResponse } from 'next/server';
import { buatDocx, namaBerkas, JENIS_DOCX } from '@/lib/dokumen-docx';
import { bacaRentang } from '@/lib/rentang';

/**
 * =============================================================================
 *  Unduhan dokumen dalam bentuk Word (.docx)
 * =============================================================================
 *
 *  Contoh pemakaian:
 *    /api/docx/?jenis=cv-peneliti&lang=id&rentang=5
 *
 *  Berkasnya dibangun saat diminta, bukan disimpan sebagai berkas tetap.
 *  Alasannya: isinya ikut berubah setiap kamu menyunting sesuatu lewat panel,
 *  dan ada dua belas kemungkinan gabungan jenis, bahasa, dan rentang. Menyimpan
 *  dua belas berkas lalu menjaganya tetap mutakhir jauh lebih merepotkan
 *  daripada menyusunnya ulang dalam sepersekian detik.
 *
 *  Dokumen yang sama juga tersedia sebagai halaman HTML di bawah /cetak/, yang
 *  bisa disimpan sebagai PDF lewat dialog cetak peramban. Word untuk yang ingin
 *  menyuntingnya, PDF untuk yang ingin mengirimkannya apa adanya.
 * =============================================================================
 */

export const dynamic = 'force-dynamic';

/*
  Membangun berkas Word memakan memori dan waktu jauh lebih besar daripada
  menyajikan halaman biasa, terutama untuk Daftar Riwayat Hidup yang memuat
  sembilan tabel. Tanpa batas, satu skrip yang memanggil alamat ini berulang
  ulang bisa menghabiskan jatah fungsi Vercel dalam hitungan menit.

  Tiga puluh per jam per alamat sudah sangat longgar: satu orang biasanya
  mengunduh dua atau tiga berkas, lalu selesai.
*/
const MAKS_PER_ALAMAT = 30;
const JENDELA_MS = 60 * 60 * 1000;
const jejak = new Map();

function terlaluSering(alamat) {
  const sekarang = Date.now();
  const daftar = (jejak.get(alamat) ?? []).filter((w) => sekarang - w < JENDELA_MS);

  // Peta dibersihkan sekalian supaya tidak tumbuh terus selama proses hidup.
  if (jejak.size > 500) {
    for (const [kunci, waktu] of jejak) {
      if (waktu.every((w) => sekarang - w >= JENDELA_MS)) jejak.delete(kunci);
    }
  }

  if (daftar.length >= MAKS_PER_ALAMAT) {
    jejak.set(alamat, daftar);
    return true;
  }

  daftar.push(sekarang);
  jejak.set(alamat, daftar);
  return false;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const jenis = String(searchParams.get('jenis') ?? '').trim();
  if (!JENIS_DOCX.includes(jenis)) {
    return NextResponse.json(
      {
        error: 'Jenis dokumen tidak dikenal.',
        tersedia: JENIS_DOCX,
      },
      { status: 400 }
    );
  }

  const lang = searchParams.get('lang') === 'en' ? 'en' : 'id';
  const rentang = bacaRentang(searchParams.get('rentang'));

  const alamat =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'tanpa-alamat';

  if (terlaluSering(alamat)) {
    return NextResponse.json(
      { error: 'Terlalu banyak permintaan. Coba lagi beberapa saat lagi.' },
      { status: 429 }
    );
  }

  try {
    const berkas = await buatDocx({ jenis, lang, rentang });
    const nama = namaBerkas({ jenis, lang, rentang });

    return new NextResponse(berkas, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        /*
          Dua bentuk nama berkas sekaligus. Yang pertama polos, untuk peramban
          lama; yang kedua disandikan UTF-8, supaya nama yang memuat huruf
          beraksen tetap utuh. Peramban modern memakai yang kedua.
        */
        'Content-Disposition': `attachment; filename="${nama.replace(/[^\x20-\x7E]/g, '_')}"; filename*=UTF-8''${encodeURIComponent(nama)}`,
        'Content-Length': String(berkas.length),
        // Isinya ikut berubah setiap konten disunting lewat panel, jadi tidak
        // boleh disimpan perantara mana pun.
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (galat) {
    console.error('[docx] gagal membangun dokumen:', galat);
    return NextResponse.json(
      { error: 'Dokumen gagal dibuat.', detail: String(galat?.message ?? galat) },
      { status: 500 }
    );
  }
}
