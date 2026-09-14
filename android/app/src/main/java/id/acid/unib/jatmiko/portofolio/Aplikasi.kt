package id.acid.unib.jatmiko.portofolio

import android.app.Application
import android.os.Build
import android.webkit.WebView

/**
 * Kelas aplikasi. Isinya satu hal saja, dan hanya berjalan saat proyek dibangun
 * dalam mode debug.
 */
class Aplikasi : Application() {
    override fun onCreate() {
        super.onCreate()

        /*
          MEMERIKSA ISI WEBVIEW DARI KOMPUTER

          Dengan baris ini menyala, WebView aplikasi bisa dibuka lewat
          chrome://inspect di Chrome pada komputer, lengkap dengan console dan
          pemeriksa elemen seperti halaman web biasa.

          Sangat berguna saat panel admin bermasalah hanya di ponsel, karena
          tanpa console yang terlihat, satu galat JavaScript cuma tampak
          sebagai layar putih tanpa keterangan apa pun.

          Dibatasi pada mode debug: membiarkannya menyala pada versi rilis
          berarti isi WebView, termasuk sesi panel yang sedang masuk, bisa
          diperiksa siapa pun yang menancapkan kabel ke ponsel ini.
        */
        if (BuildConfig.DEBUG && Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            WebView.setWebContentsDebuggingEnabled(true)
        }
    }
}
