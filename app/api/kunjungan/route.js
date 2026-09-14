import { NextResponse } from 'next/server';
import { bacaKunjungan, catatKunjungan, siap } from '@/lib/kunjungan';
import { pengirimPermintaan, terlaluSering } from '@/lib/pembatas';

/**
 * =============================================================================
 *  Penghitung kunjungan.
 * =============================================================================
 *
 *  GET   membaca angkanya saja, tanpa menambah
 *  POST  menambah satu hitungan, lalu mengembalikan angka terbarunya
 *
 *  Satu kunjungan dihitung sekali per sesi peramban. Pengaturannya ada di sisi
 *  pengunjung, lihat components/StatistikPengunjung.jsx, supaya berpindah
 *  halaman di dalam situs tidak menambah hitungan berkali kali.
 *
 *  Kalau penyimpanannya belum dipasang, keduanya menjawab { aktif: false } dan
 *  bagian statistik di footer tidak ikut tampil.
 * =============================================================================
 */
export const dynamic = 'force-dynamic';

function jawab(data) {
  return NextResponse.json(
    { aktif: true, ...data },
    // Jangan disimpan di mana pun, angkanya harus selalu yang terbaru.
    { headers: { 'Cache-Control': 'no-store' } }
  );
}

const belumSiap = () =>
  NextResponse.json({ aktif: false }, { headers: { 'Cache-Control': 'no-store' } });

export async function GET() {
  if (!siap()) return belumSiap();
  const data = await bacaKunjungan();
  return data ? jawab(data) : belumSiap();
}

/*
  BATAS PENAMBAHAN

  Sisi pengunjung sudah membatasi satu hitungan per sesi peramban, tetapi itu
  aturan yang dijalankan di perangkat pengunjung dan gampang dilewati dengan
  memanggil alamat ini langsung. Tanpa batas di sisi server, siapa pun bisa
  menggelembungkan angka pengunjung, dan setiap panggilan juga memakai jatah
  permintaan penyimpanan yang jumlahnya terbatas.

  Dua belas per jam per alamat sudah jauh di atas pemakaian wajar, karena satu
  orang normalnya cuma menambah sekali per sesi.
*/
const MAKS_PER_ALAMAT = 12;
const JENDELA_MS = 60 * 60 * 1000;

export async function POST(request) {
  if (!siap()) return belumSiap();

  if (terlaluSering('kunjungan', pengirimPermintaan(request), MAKS_PER_ALAMAT, JENDELA_MS)) {
    // Dijawab dengan angka terbarunya saja, tanpa menambah. Dari sisi
    // pengunjung tidak ada bedanya, jadi tidak ada yang perlu ditangani.
    const data = await bacaKunjungan();
    return data ? jawab(data) : belumSiap();
  }

  const data = await catatKunjungan();
  return data ? jawab(data) : belumSiap();
}
