# Aplikasi Android

Aplikasi WebView yang menampilkan situs portofolio beserta panel adminnya.

Isinya tidak disalin ke dalam aplikasi. Yang ditampilkan adalah situs yang sama
persis, dimuat dari `https://jatmikoyogop.vercel.app`. Jadi setiap kali kamu
menyunting sesuatu lewat panel, aplikasi ikut berubah tanpa perlu dibangun
ulang maupun dipasang ulang.

---

## 1. Apa yang dikerjakan aplikasi ini

Aplikasi ini sengaja tipis. Seluruh tata letak dan logikanya sudah ada di situs,
dan menyalinnya ke Kotlin berarti dua tempat yang harus diperbarui setiap kali
ada perubahan.

Yang dikerjakan di sisi Android hanya hal yang memang tidak bisa dilakukan
halaman web dari dalam WebView:

| Hal | Kenapa harus ditangani | Tanpa itu |
| --- | --- | --- |
| **Unggah berkas** | WebView tidak membuka pemilih berkas sendiri | Tombol unggah di panel tidak merespons sama sekali |
| **Jendela popup** | Panel membuka jendela baru untuk izin GitHub | Tombol Masuk terlihat mati |
| **Unduhan** | Berkas `.docx` dan PDF tidak tersimpan sendiri | Ketuk unduh, tidak terjadi apa apa |
| **Tombol kembali** | Bawaannya menutup aplikasi | Satu ketukan salah menutup panel yang sedang diisi |
| **Tautan luar** | Jurnal, Scholar, WhatsApp | Pengunjung terjebak di halaman tanpa bilah alamat |

Dua tab di bawah: **Situs** dan **Panel Admin**.

---

## 2. Membangun APK

Butuh **Android Studio** (Ladybug atau lebih baru) dan **JDK 17 atau lebih**.

1. Buka Android Studio, pilih **Open**, arahkan ke folder `android/` ini.
2. Tunggu Gradle selesai mengunduh dependensi. Ini hanya lama pada kali pertama.
3. **Build → Build Bundle(s) / APK(s) → Build APK(s)**.

Hasilnya ada di `app/build/outputs/apk/debug/app-debug.apk`. Berkas itu sudah
bisa dipasang langsung ke ponsel untuk dicoba.

Lewat baris perintah, kalau lebih suka:

```bash
cd android
./gradlew assembleDebug
```

---

## 3. Membangun versi rilis

Versi debug cukup untuk dipakai sendiri. Untuk dibagikan ke orang lain atau
diunggah ke Play Store, APK-nya harus ditandatangani.

**Membuat kunci penandatangan** — sekali saja, lalu simpan baik baik. Kunci yang
hilang berarti aplikasi tidak bisa diperbarui lagi, dan satu satunya jalan
adalah menerbitkannya sebagai aplikasi baru dengan nama paket berbeda.

```bash
keytool -genkey -v -keystore portofolio.keystore \
  -alias portofolio -keyalg RSA -keysize 2048 -validity 10000
```

Lalu buat `android/keystore.properties`:

```properties
storeFile=/jalur/lengkap/ke/portofolio.keystore
storePassword=...
keyAlias=portofolio
keyPassword=...
```

Berkas itu sudah masuk `.gitignore` dan **tidak boleh** ikut ke repositori.

Terakhir, tambahkan blok penandatanganan di `app/build.gradle.kts`, lalu:

```bash
./gradlew assembleRelease      # menghasilkan APK
./gradlew bundleRelease        # menghasilkan AAB, yang diminta Play Store
```

---

## 4. Kalau alamat situs berubah

Alamatnya tertulis di tiga tempat, dan ketiganya harus diganti bersamaan:

1. `app/build.gradle.kts` — `buildConfigField` untuk `SITUS` dan `HOST`
2. `app/src/main/AndroidManifest.xml` — `android:host` pada intent-filter
3. Situsnya sendiri: `base_url` di `public/admin/config.yml` dan `meta.baseUrl`
   di `content/settings.json`

---

## 5. Masuk ke panel dari aplikasi

Prosesnya sama dengan di peramban: ketuk **Masuk dengan GitHub**, jendela izin
GitHub terbuka di dalam aplikasi, dan setelah diizinkan jendelanya menutup
sendiri lalu panel menyala.

Yang perlu diketahui:

- **GitHub OAuth App tidak perlu didaftarkan ulang.** Aplikasi ini memakai
  alamat situs yang sama, jadi alamat callback yang sudah ada tetap berlaku.
- Jendela izin sengaja dibuka **di dalam aplikasi**, bukan dilempar ke peramban.
  Panel menunggu jawabannya lewat `window.postMessage` dari jendela yang
  dibukanya sendiri; peramban luar bukan jendela itu, jadi jawabannya tidak akan
  pernah sampai dan tombol Masuk menggantung selamanya.
- Status masuk bertahan setelah aplikasi ditutup, karena cookie sesinya ditulis
  ke penyimpanan saat aplikasi masuk ke latar belakang.

---

## 6. Memeriksa masalah

Kalau panel bermasalah hanya di aplikasi tetapi normal di peramban, WebView-nya
bisa diperiksa dari komputer seperti halaman web biasa:

1. Pasang versi **debug** ke ponsel, lalu hubungkan dengan kabel USB.
2. Nyalakan **USB debugging** di Opsi Pengembang ponsel.
3. Buka `chrome://inspect` di Chrome pada komputer, lalu pilih WebView-nya.

Console dan pemeriksa elemen langsung tersedia. Ini berguna karena tanpa console
yang terlihat, satu galat JavaScript di ponsel cuma tampak sebagai layar putih
tanpa keterangan apa pun.

Pemeriksaan ini hanya menyala pada versi debug. Membiarkannya aktif pada versi
rilis berarti isi WebView, termasuk sesi panel yang sedang masuk, bisa diperiksa
siapa pun yang menancapkan kabel ke ponsel itu.

---

## 7. Membuka tautan situs langsung di aplikasi

Manifest sudah menyiapkannya. Supaya tautan `jatmikoyogop.vercel.app` membuka
aplikasi ini **tanpa** menanyakan pilihan lebih dulu, situs perlu menyajikan
berkas `/.well-known/assetlinks.json` yang memuat sidik jari kunci
penandatanganmu.

Selama berkas itu belum ada, tautannya tetap bisa dibuka lewat aplikasi, hanya
Android akan bertanya dulu mau dibuka di mana. Tidak ada yang rusak.
