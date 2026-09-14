import Link from 'next/link';

/**
 * Halaman 404 statis, diekspor menjadi out/404.html.
 * Vercel dan GitHub Pages sama-sama memakainya untuk alamat yang tidak dikenal.
 */
export const metadata = {
  title: 'Halaman tidak ditemukan',
};

export default function NotFound() {
  return (
    <section className="flex min-h-svh flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">404</p>
      <h1 className="mt-3 text-3xl font-bold text-fg sm:text-4xl">Halaman tidak ditemukan</h1>
      <p className="mt-3 max-w-md text-sm leading-7 text-subtle">
        Tautan yang kamu buka sudah tidak tersedia, atau alamatnya salah ketik.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">
          Kembali ke beranda
        </Link>
        <Link href="/blog/" className="btn-ghost">
          Lihat blog
        </Link>
      </div>
    </section>
  );
}
