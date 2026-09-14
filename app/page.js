import Hero from '@/components/Hero';
import About from '@/components/About';
import Experience from '@/components/Experience';
import Penelitian from '@/components/Penelitian';
import Pengabdian from '@/components/Pengabdian';
import Publications from '@/components/Publications';
import Seminar from '@/components/Seminar';
import Buku from '@/components/Buku';
import Hki from '@/components/Hki';
import Kebijakan from '@/components/Kebijakan';
import Mengajar from '@/components/Mengajar';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';
import Certifications from '@/components/Certifications';
import Education from '@/components/Education';
import Volunteering from '@/components/Volunteering';
import Galeri from '@/components/Galeri';
import BlogPreview from '@/components/BlogPreview';
import Feedback from '@/components/Feedback';
import PilihanCetak from '@/components/PilihanCetak';
import Contact from '@/components/Contact';
import { getPublishedPosts } from '@/data/posts';

/**
 * Halaman utama. Server component yang tugasnya hanya menyusun urutan section.
 * Tiap section membaca datanya sendiri dari data/portfolio.js dan menyembunyikan
 * diri kalau datanya kosong.
 *
 * URUTANNYA MENGIKUTI DAFTAR RIWAYAT HIDUP PENELITI
 * Setelah profil dan ringkasan tridharma, isinya berjalan persis seperti
 * susunan berkas Daftar Riwayat Hidup yang dipakai pengajuan penelitian:
 * penelitian, pengabdian, publikasi, pemakalah seminar, karya buku, HKI, lalu
 * perumusan kebijakan. Pembaca yang terbiasa dengan berkas itu tidak perlu
 * mencari cari.
 *
 * Bagian yang datanya masih kosong, misalnya Proyek dan Sertifikasi, tidak
 * menampilkan apa apa. Barisnya tetap ditulis di sini supaya bagian itu muncul
 * sendiri begitu isinya ditambahkan lewat panel.
 *
 * Ingin mengubah urutan tampilan? Cukup pindahkan barisnya di sini, lalu
 * sesuaikan urutan menu di panel, menu Navigasi.
 */
export default function HomePage() {
  // Tulisan dibaca di sini, di sisi server, lalu diserahkan ke BlogPreview.
  const latestPosts = getPublishedPosts().slice(0, 3);

  return (
    <>
      <Hero />
      <About />
      <Experience />
      <Penelitian />
      <Pengabdian />
      <Publications />
      <Seminar />
      <Buku />
      <Hki />
      <Kebijakan />
      <Mengajar />
      <Skills />
      <Education />
      <Projects />
      <Certifications />
      <Volunteering />
      <Galeri />
      <BlogPreview posts={latestPosts} />
      <PilihanCetak />
      <Feedback />
      <Contact />
    </>
  );
}
