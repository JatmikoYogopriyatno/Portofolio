/**
 * MeshBackground: latar berlapis yang membuat halaman tidak terasa polos.
 *
 * Lapisannya dari bawah ke atas:
 *   1. gradien dasar yang mengikuti warna tema
 *   2. empat blob blur beranimasi dengan warna aksen
 *   3. sapuan aurora tipis di bagian atas layar
 *   4. garis grid halus yang memudar ke tepi
 *   5. titik-titik kecil sebagai tekstur kedua
 *   6. butiran noise supaya gradiennya tidak terlihat seperti plastik
 *   7. vignette lembut di pinggir layar
 *
 * Intensitas tiap lapisan diatur variabel --blob-opacity, --grid-opacity,
 * --dot-opacity, dan --noise-opacity di app/globals.css, dan nilainya berbeda
 * antara mode terang dan gelap.
 *
 * Semua animasinya otomatis berhenti saat pengguna mengaktifkan
 * "kurangi gerakan" di perangkatnya.
 *
 * Komponen ini server component, tidak menyimpan state apa pun.
 */
export default function MeshBackground() {
  return (
    <div
      aria-hidden="true"
      data-print="hide"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* 1. Gradien dasar */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(125% 125% at 50% 0%, var(--bg-deep) 0%, var(--bg) 55%, var(--bg) 100%)',
        }}
      />

      {/* 2. Blob warna aksen */}
      <div
        className="absolute -left-[18%] -top-[22%] h-[62vmax] w-[62vmax] rounded-full blur-[110px]"
        style={{
          opacity: 'var(--blob-opacity)',
          background: 'radial-gradient(circle at 30% 30%, var(--accent-1), transparent 68%)',
          animation: 'blob-drift-a var(--blob-speed) ease-in-out infinite',
        }}
      />
      <div
        className="absolute -right-[16%] top-[6%] h-[56vmax] w-[56vmax] rounded-full blur-[120px]"
        style={{
          opacity: 'calc(var(--blob-opacity) * 0.85)',
          background: 'radial-gradient(circle at 60% 40%, var(--accent-2), transparent 68%)',
          animation: 'blob-drift-b calc(var(--blob-speed) * 1.35) ease-in-out infinite',
        }}
      />
      <div
        className="absolute bottom-[-26%] left-[20%] h-[54vmax] w-[54vmax] rounded-full blur-[130px]"
        style={{
          opacity: 'calc(var(--blob-opacity) * 0.75)',
          background: 'radial-gradient(circle at 50% 50%, var(--accent-3), transparent 70%)',
          animation: 'blob-drift-c calc(var(--blob-speed) * 1.7) ease-in-out infinite',
        }}
      />
      <div
        className="absolute right-[8%] bottom-[8%] h-[38vmax] w-[38vmax] rounded-full blur-[100px]"
        style={{
          opacity: 'calc(var(--blob-opacity) * 0.6)',
          background: 'radial-gradient(circle at 40% 60%, var(--accent-1), transparent 72%)',
          animation: 'blob-drift-d calc(var(--blob-speed) * 2.1) ease-in-out infinite',
        }}
      />

      {/* 3. Sapuan aurora di bagian atas */}
      <div
        className="absolute -top-[10%] left-[-20%] h-[45vmax] w-[140%] blur-[90px]"
        style={{
          opacity: 'calc(var(--blob-opacity) * 0.35)',
          background:
            'linear-gradient(100deg, transparent 5%, var(--accent-2) 35%, var(--accent-3) 60%, transparent 95%)',
          animation: 'aurora-sweep calc(var(--blob-speed) * 1.9) ease-in-out infinite',
        }}
      />

      {/* 4. Garis grid, memudar ke arah tepi layar */}
      <div
        className="layer-grid absolute inset-0 text-fg"
        style={{
          opacity: 'var(--grid-opacity)',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 78%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 78%)',
        }}
      />

      {/* 5. Titik-titik tekstur */}
      <div
        className="layer-dots absolute inset-0 text-fg"
        style={{
          opacity: 'var(--dot-opacity)',
          maskImage: 'linear-gradient(to bottom, black 0%, transparent 65%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 65%)',
        }}
      />

      {/* 6. Butiran noise */}
      <div
        className="layer-noise absolute inset-0 mix-blend-overlay"
        style={{ opacity: 'var(--noise-opacity)' }}
      />

      {/* 7. Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(100% 100% at 50% 50%, transparent 58%, color-mix(in oklab, var(--bg) 92%, transparent) 100%)',
        }}
      />
    </div>
  );
}
