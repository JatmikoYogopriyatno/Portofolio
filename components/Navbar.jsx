'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { portfolio } from '@/data/portfolio';
import { useLanguage } from '@/components/LanguageProvider';
import { useAmbangGulir } from '@/hooks/useGulir';
import ThemeToggle from '@/components/ThemeToggle';
import SmartImage from '@/components/SmartImage';
import { CommandPaletteTrigger } from '@/components/CommandPalette';
import Icon from '@/components/Icon';

/**
 * Navbar berbentuk pill kaca yang melayang di atas halaman.
 *
 *  - Menu dibangun dari portfolio.nav, hapus satu baris di sana dan item itu
 *    langsung hilang dari sini.
 *  - Item bertipe 'section' melompat ke anchor. Saat pengunjung sedang berada
 *    di halaman lain (misalnya blog), tautannya otomatis berubah jadi '/#id'.
 *  - Item bertipe 'page' pindah halaman lewat komponen Link.
 *  - Section yang sedang terlihat disorot memakai IntersectionObserver.
 *  - Di layar kecil menunya berubah jadi drawer dengan latar peredup.
 */
export default function Navbar() {
  const { lang, langLangsung, toggleLang, t } = useLanguage();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // Menumpang pendengar gulir bersama, lihat hooks/useGulir.js
  const scrolled = useAmbangGulir(24);
  const [active, setActive] = useState('');

  const items = portfolio.nav ?? [];
  const profile = portfolio.profile;
  const isHome = pathname === '/' || pathname === '';
  const usePhotoLogo = portfolio.appearance?.photoAsLogo !== false && Boolean(profile.avatar);

  /*
    ------------------------------------------------------------------------
    APAKAH MENU MENDATAR MASIH MUAT
    ------------------------------------------------------------------------
    Dulu jawabannya ditebak lewat satu ambang lebar layar, xl. Tebakan itu
    pasti meleset cepat atau lambat, karena isi menunya kamu yang tentukan
    lewat panel. Begitu menu Galeri dan Masukan ditambahkan, isinya jadi 28
    piksel lebih lebar daripada pill-nya, dan tombol tema, sebagai anak
    terakhir, terdorong setengah keluar dari kotak kacanya. Itu yang terlihat
    seperti navbar rusak.

    Sekarang lebarnya benar benar diukur. Kalau isinya tidak muat, menu laci
    yang dipakai, berapa pun lebar layarnya, jadi menambah menu lewat panel
    tidak akan pernah lagi merusak tampilannya.
  */
  const barisRef = useRef(null);
  const menuRef = useRef(null);

  /* Lebar yang dibutuhkan, disimpan dari pengukuran terakhir saat menunya
     memang sedang digambar. Tanpa disimpan, angkanya hilang begitu menunya
     disembunyikan, dan navbar akan berkedip bolak balik antara dua bentuk. */
  const butuhRef = useRef(0);
  const [muat, setMuat] = useState(true);

  const periksaMuat = useCallback(() => {
    const baris = barisRef.current;
    if (!baris) return;

    const menu = menuRef.current;
    if (menu && menu.offsetWidth > 0) {
      const anak = [...baris.children];
      // gap-3 pada barisnya, 0,75rem, dihitung sebagai 12 piksel
      const jarak = 12 * Math.max(0, anak.length - 1);
      butuhRef.current = anak.reduce((jumlah, el) => jumlah + el.offsetWidth, 0) + jarak;
    }

    // Delapan piksel kelonggaran supaya tidak berkedip tepat di batasnya.
    if (butuhRef.current > 0) setMuat(baris.clientWidth >= butuhRef.current + 8);
  }, []);

  useEffect(() => {
    const baris = barisRef.current;
    if (!baris || typeof ResizeObserver === 'undefined') return undefined;

    periksaMuat();

    const pengamat = new ResizeObserver(periksaMuat);

    // Barisnya, untuk menangkap layar yang diubah ukurannya.
    pengamat.observe(baris);

    /*
      Deretan menunya juga, dan ini bukan berlebihan.

      Lebar baris tidak berubah saat isinya berubah, karena barisnya w-full.
      Jadi kalau cuma barisnya yang diamati, dua hal lolos tanpa terdeteksi:
      huruf webfont yang baru selesai dimuat lalu melebarkan semua tulisan
      menu, dan menu yang bertambah. Mengamati deretannya menangkap keduanya.
    */
    if (menuRef.current) pengamat.observe(menuRef.current);

    /*
      Pengukuran pertama sering terjadi saat huruf cadangan masih dipakai,
      dan huruf cadangan lebarnya berbeda. Diukur ulang setelah hurufnya
      benar benar siap.
    */
    let batal = false;
    document.fonts?.ready.then(() => {
      if (!batal) periksaMuat();
    });

    return () => {
      batal = true;
      pengamat.disconnect();
    };
    // lang ikut jadi pemicu karena panjang tulisan menu berbeda tiap bahasa
  }, [periksaMuat, lang, items.length]);

  // Inisial dari nama, dipakai kalau logo foto dimatikan lewat data.
  const initials = profile.name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // Sorot menu sesuai section yang sedang terlihat. Hanya berlaku di beranda.
  useEffect(() => {
    if (!isHome) {
      // Di halaman blog, sorot item blog.
      setActive(pathname.startsWith('/blog') ? 'blog' : '');
      return;
    }
    if (typeof IntersectionObserver === 'undefined') return;

    const sections = items
      .filter((item) => item.type !== 'page')
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items, isHome, pathname]);

  // Kunci scroll halaman selama drawer terbuka, dan tutup dengan tombol Escape.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  if (items.length === 0) return null;

  /** Alamat tujuan tiap item menu, menyesuaikan halaman yang sedang dibuka. */
  const hrefFor = (item) => {
    if (item.type === 'page') return item.href ?? `/${item.id}/`;
    return isHome ? `#${item.id}` : `/#${item.id}`;
  };

  /** Section memakai <a> biasa agar smooth scroll bawaan browser tetap jalan. */
  const NavLink = ({ item, className, children, onClick }) => {
    const href = hrefFor(item);
    const shared = {
      className,
      onClick,
      'aria-current': active === item.id ? 'true' : undefined,
    };
    if (item.type === 'page' || !isHome) {
      return (
        <Link href={href} {...shared}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} {...shared}>
        {children}
      </a>
    );
  };

  /*
    ------------------------------------------------------------------------
    BENTUK CIUT DI LAYAR KECIL
    ------------------------------------------------------------------------
    Di ponsel, pill navbar selebar layar menutupi bagian atas tulisan yang
    sedang dibaca. Begitu halaman digulir, pill-nya menciut jadi satu tombol
    bundar berisi ikon menu saja, menempel di pojok kanan atas. Ditekan sekali,
    dia memanjang lagi jadi pill utuh beserta laci menunya.

    Hanya berlaku di bawah xl. Setiap kelas di bawah punya pasangan xl: yang
    mengembalikan bentuk semula, karena di desktop tampilannya memang sudah
    pas dan tidak perlu diubah.
  */
  const ciut = scrolled && !open;

  /* Kendali yang ikut disembunyikan saat menciut. Tombol menu tidak termasuk,
     justru dialah satu satunya yang tersisa. */
  const sembunyiSaatCiut = ciut ? 'hidden xl:flex' : 'flex';

  return (
    <header
      data-print="hide"
      className={`fixed inset-x-0 top-0 z-50 flex px-4 xl:justify-center ${
        ciut ? 'justify-end' : 'justify-center'
      }`}
    >
      {/* Peredup halaman selama drawer terbuka. */}
      {open ? (
        <button
          type="button"
          aria-label={t(portfolio.ui.closeMenu)}
          onClick={() => setOpen(false)}
          className={`fixed inset-0 -z-10 cursor-default bg-black/50 backdrop-blur-sm ${muat ? 'xl:hidden' : ''}`}
        />
      ) : null}

      <nav
        aria-label={lang === 'id' ? 'Navigasi utama' : 'Main navigation'}
        className={[
          /*
            max-w-7xl, naik dari 6xl.

            Isi navbar saat ini butuh 1154 piksel, sedangkan 6xl cuma 1152.
            Kurang dua piksel saja sudah cukup membuat tombol tema terdorong
            keluar pill. Batas baru ini memberi ruang lebih, dan pengukuran
            di periksaMuat yang menjaga kalau suatu saat isinya bertambah
            lagi. Dua duanya dibutuhkan: yang satu supaya sekarang lega,
            yang satu supaya nanti tidak rusak diam diam.
          */
          /*
            Daftar properti yang dianimasikan ditulis satu per satu, bukan
            transition-all.

            Sebabnya sudut kotak ini. Saat menu ponsel dibuka, bentuknya
            berubah dari rounded-full menjadi rounded-3xl. rounded-full di
            Tailwind bernilai tak hingga, dan transition-all menganggap itu
            angka yang harus dilewati pelan pelan menuju 24 piksel. Bingkai
            pertama setelah tombol ditekan sempat bernilai tiga puluh juta
            piksel, dan pada kotak setinggi laci menu itu tampil sebagai
            lonjong raksasa yang menutupi seluruh menunya selama sepertiga
            detik. Terlihat seperti halaman yang gagal memuat.

            Sekarang sudutnya berganti seketika, sementara warna, bayangan,
            dan jarak dalamnya tetap berubah halus seperti semula.
          */
          'glass glass-nav relative z-50 mt-4 max-w-7xl',
          'transition-[background-color,border-color,box-shadow,padding] duration-300',
          open ? 'rounded-3xl' : 'rounded-full',
          /*
            Saat menciut, lebarnya mengikuti isi, dan isinya tinggal satu
            tombol. Jarak dalamnya dibuat sama rata supaya hasilnya bundar
            sempurna, bukan lonjong. Di xl semuanya kembali seperti semula.
          */
          ciut
            ? 'w-auto p-1.5 xl:w-full xl:px-3 xl:py-1.5'
            : `w-full px-3 ${scrolled ? 'py-1.5' : 'py-2.5'}`,
          // Dipekatkan saat halaman digulir, dan saat menu ponsel terbuka.
          scrolled || open ? 'glass-nav-solid' : '',
        ].join(' ')}
      >
        <div ref={barisRef} className="flex items-center justify-between gap-3">
          {/* Logo, mengarah kembali ke beranda. Memakai foto profil dengan
              bingkai gradien. Isi appearance.photoAsLogo dengan false untuk
              kembali memakai inisial nama. */}
          <Link
            href="/"
            aria-label={`${portfolio.profile.name}, ${lang === 'id' ? 'kembali ke beranda' : 'back to home'}`}
            className={`group ml-1 shrink-0 items-center gap-2.5 rounded-full py-1 pl-1 pr-2 text-sm font-bold text-fg ${sembunyiSaatCiut}`}
          >
            {usePhotoLogo ? (
              <span className="grid h-8 w-8 place-items-center rounded-full bg-linear-to-br from-accent-1 via-accent-2 to-accent-3 p-[1.5px] transition-transform duration-300 group-hover:scale-105">
                <SmartImage
                  src={profile.avatar}
                  fallbackSrc={profile.avatarFallback}
                  alt=""
                  width={64}
                  height={64}
                  loading="eager"
                  className="h-full w-full rounded-full object-cover"
                />
              </span>
            ) : (
              <span className="grid h-8 w-8 place-items-center rounded-full bg-linear-to-br from-accent-1 to-accent-2 text-xs text-white transition-transform duration-300 group-hover:scale-105">
                {initials}
              </span>
            )}
            <span className="hidden whitespace-nowrap sm:inline">{profile.shortName}</span>
          </Link>

          {/*
            Menu layar besar.

            Ambangnya xl, bukan lg. Di layar 1024 sampai 1279 piksel deretan
            menu ini sebenarnya tidak muat: isinya mendorong tombol pencarian,
            pengalih bahasa, dan tombol tema keluar dari tepi kanan layar,
            sehingga ketiganya tidak bisa dipakai sama sekali. Di lebar itu
            sekarang dipakai menu laci yang memang muat.
          */}
          {/*
            shrink-0 penting untuk pengukuran. Tanpa itu deretan menu ini
            dipepetkan oleh flexbox saat kekurangan ruang, offsetWidth-nya
            ikut mengecil, dan lebar yang sebenarnya dibutuhkan jadi tidak
            pernah ketahuan.
          */}
          <ul
            ref={menuRef}
            className={`hidden shrink-0 items-center gap-0.5 ${muat ? 'xl:flex' : ''}`}
          >
            {items.map((item) => (
              <li key={item.id}>
                <NavLink
                  item={item}
                  // inline-flex penting di sini. Tanpa itu tautan ini jadi
                  // elemen sebaris biasa, padding atas bawahnya diabaikan saat
                  // menghitung posisi, dan hurufnya duduk belasan piksel lebih
                  // tinggi daripada nama di logo.
                  className={`link-underline relative inline-flex items-center rounded-full px-2.5 py-2 text-sm font-medium leading-none transition-colors duration-200 ${
                    active === item.id ? 'text-fg' : 'text-subtle hover:text-fg'
                  }`}
                >
                  {active === item.id ? (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full border border-line bg-surface"
                    />
                  ) : null}
                  <span className="relative">{t(item.label)}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex shrink-0 items-center gap-2">
            {/* Pencarian cepat, juga bisa dibuka dengan Ctrl+K atau Cmd+K */}
            <span className={sembunyiSaatCiut}>
              <CommandPaletteTrigger />
            </span>

            {/*
              Ganti bahasa.

              Penanda ID/EN di sini mengikuti langLangsung, bukan lang. Isi
              halaman butuh waktu untuk digambar ulang seluruhnya, dan kalau
              tombolnya ikut menunggu, sentuhan pengunjung terasa tidak terjawab
              selama menunggu itu. Lihat components/LanguageProvider.jsx.
            */}
            <button
              type="button"
              onClick={toggleLang}
              aria-label={`${t(portfolio.ui.switchLanguage)}, ${langLangsung === 'id' ? 'English' : 'Bahasa Indonesia'}`}
              className={`items-center gap-1 rounded-full border border-line bg-surface p-0.5 text-xs font-semibold transition-colors hover:border-line-strong ${sembunyiSaatCiut}`}
            >
              <span
                className={`rounded-full px-2.5 py-1 transition-colors ${
                  langLangsung === 'id' ? 'bg-linear-to-r from-accent-1 to-accent-2 text-white' : 'text-subtle'
                }`}
              >
                ID
              </span>
              <span
                className={`rounded-full px-2.5 py-1 transition-colors ${
                  langLangsung === 'en' ? 'bg-linear-to-r from-accent-1 to-accent-2 text-white' : 'text-subtle'
                }`}
              >
                EN
              </span>
            </button>

            {/*
              Ganti mode terang dan gelap.

              Dibungkus span, bukan diberi kelas 'hidden' langsung, karena
              tombolnya sendiri sudah memakai 'grid'. Dua kelas display pada
              satu elemen membuat yang menang bergantung urutan Tailwind
              menuliskannya, dan itu bukan sesuatu yang pantas ditebak.
            */}
            <span className={sembunyiSaatCiut}>
              <ThemeToggle />
            </span>

            {/* Tombol menu untuk layar kecil */}
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? t(portfolio.ui.closeMenu) : t(portfolio.ui.openMenu)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className={`grid h-9 w-9 place-items-center rounded-full border border-line bg-surface text-fg transition-colors hover:border-line-strong ${
                muat ? 'xl:hidden' : ''
              }`}
            >
              <Icon name={open ? 'close' : 'menu'} className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Drawer layar kecil */}
        {open ? (
          <div
            id="mobile-menu"
            style={{ animation: 'drawer-in 0.16s ease-out' }}
            className={`mt-3 border-t border-line pt-3 ${muat ? 'xl:hidden' : ''}`}
          >
            <ul className="flex flex-col gap-1 pb-2">
              {items.map((item) => (
                <li key={item.id}>
                  <NavLink
                    item={item}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                      active === item.id
                        ? 'bg-surface text-fg'
                        : 'text-muted hover:bg-surface hover:text-fg'
                    }`}
                  >
                    {t(item.label)}
                    <Icon name="arrow-up-right" className="h-4 w-4 opacity-50" />
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </nav>
    </header>
  );
}
