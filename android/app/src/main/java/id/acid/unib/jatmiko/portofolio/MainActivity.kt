package id.acid.unib.jatmiko.portofolio

import android.annotation.SuppressLint
import android.app.DownloadManager
import android.content.ActivityNotFoundException
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.os.Environment
import android.webkit.CookieManager
import android.webkit.DownloadListener
import android.webkit.URLUtil
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebResourceError
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import id.acid.unib.jatmiko.portofolio.databinding.ActivityMainBinding

/**
 * =============================================================================
 *  MainActivity: satu WebView untuk situs dan panel admin sekaligus.
 * =============================================================================
 *
 *  Aplikasi ini sengaja tipis. Seluruh isi, tata letak, dan logikanya sudah ada
 *  di situs, dan menyalinnya ke Kotlin berarti dua tempat yang harus diperbarui
 *  setiap kali ada perubahan. Yang dikerjakan di sini hanya hal hal yang
 *  memang tidak bisa dilakukan halaman web dari dalam WebView.
 *
 *  ---------------------------------------------------------------------------
 *  EMPAT HAL YANG TIDAK JALAN DI WEBVIEW BAWAAN
 *  ---------------------------------------------------------------------------
 *
 *  1. UNGGAH BERKAS
 *     Tombol pilih berkas di panel admin tidak melakukan apa apa sampai
 *     onShowFileChooser dipasang. Tanpa ini, mengunggah foto atau PDF lewat
 *     aplikasi mustahil, dan itu justru salah satu alasan utama panel dibuka
 *     dari ponsel.
 *
 *  2. JENDELA POPUP UNTUK MASUK GITHUB
 *     Panel membuka jendela baru untuk halaman izin GitHub, lalu menunggu
 *     jawabannya lewat window.postMessage. WebView bawaan menolak membuka
 *     jendela baru, jadi tombol Masuk terlihat tidak merespons sama sekali.
 *     Lihat onCreateWindow di bawah.
 *
 *  3. UNDUHAN
 *     Berkas .docx dan PDF dari situs tidak tersimpan ke mana pun tanpa
 *     DownloadListener. Ketuk tombol unduh, tidak terjadi apa apa.
 *
 *  4. TOMBOL KEMBALI
 *     Bawaannya langsung menutup aplikasi, bukan mundur satu halaman.
 *
 *  ---------------------------------------------------------------------------
 *  ALAMAT LUAR DIBUKA DI PERAMBAN
 *  ---------------------------------------------------------------------------
 *  Tautan ke jurnal, Google Scholar, atau WhatsApp dilempar keluar. Menahannya
 *  di dalam aplikasi membuat pengunjung terjebak di halaman yang tidak punya
 *  bilah alamat, dan halaman masuk pihak ketiga di dalam WebView aplikasi juga
 *  bukan kebiasaan yang baik untuk diajarkan.
 * =============================================================================
 */
class MainActivity : AppCompatActivity() {

    private lateinit var b: ActivityMainBinding

    /** Penampung hasil pemilihan berkas, diisi saat panel meminta unggahan. */
    private var penerimaBerkas: ValueCallback<Array<Uri>>? = null

    /** Jendela popup yang sedang terbuka, kalau ada. Dipakai saat masuk GitHub. */
    private var popup: WebView? = null
    private var dialogPopup: AlertDialog? = null

    /** Penanda tekan kembali dua kali untuk keluar. */
    private var siapKeluar = 0L

    private val pemilihBerkas =
        registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { hasil ->
            /*
              Callback ini WAJIB dipanggil, termasuk saat pengguna membatalkan.
              Kalau dibiarkan null, WebView menganggap dialog berkas masih
              terbuka dan tombol unggah berhenti merespons sampai aplikasi
              dimulai ulang. Itu kegagalan yang tampak seperti panel yang rusak.
            */
            val berkas = WebChromeClient.FileChooserParams.parseResult(hasil.resultCode, hasil.data)
            penerimaBerkas?.onReceiveValue(berkas)
            penerimaBerkas = null
        }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        b = ActivityMainBinding.inflate(layoutInflater)
        setContentView(b.root)

        siapkanWebView(b.web, utama = true)

        b.web.webChromeClient = KlienTampilan()
        b.web.webViewClient = KlienHalaman()
        b.web.setDownloadListener(pengunduh)

        b.tarikSegar.setOnRefreshListener { b.web.reload() }
        b.tombolCobaLagi.setOnClickListener {
            sembunyikanGalat()
            b.web.reload()
        }

        b.navBawah.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_situs -> { buka(BuildConfig.SITUS + "/"); true }
                R.id.nav_panel -> { buka(BuildConfig.SITUS + "/admin/"); true }
                else -> false
            }
        }

        aturTombolKembali()

        if (savedInstanceState != null) {
            b.web.restoreState(savedInstanceState)
        } else {
            // Tautan yang diketuk di luar aplikasi membuka halaman itu langsung.
            val dariTautan = intent?.data?.takeIf { it.host == BuildConfig.HOST }?.toString()
            buka(dariTautan ?: (BuildConfig.SITUS + "/"))
        }
    }

    /** Setelan yang dipakai WebView utama maupun jendela popup. */
    @SuppressLint("SetJavaScriptEnabled")
    private fun siapkanWebView(w: WebView, utama: Boolean) {
        w.settings.apply {
            javaScriptEnabled = true

            // Panel admin menyimpan draf dan setelan tampilannya di penyimpanan
            // lokal peramban. Tanpa ini, panel gagal menyala tanpa pesan galat.
            domStorageEnabled = true
            databaseEnabled = true

            // Situs sudah menyediakan tata letak untuk layar sempit, jadi
            // halaman tidak perlu diperkecil lalu diperbesar sendiri.
            loadWithOverviewMode = false
            useWideViewPort = true
            setSupportZoom(true)
            builtInZoomControls = true
            displayZoomControls = false

            // Jendela popup untuk halaman masuk GitHub.
            javaScriptCanOpenWindowsAutomatically = true
            setSupportMultipleWindows(true)

            mediaPlaybackRequiresUserGesture = true
            mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW

            /*
              Ukuran huruf mengikuti setelan Ukuran Font di ponsel, bukan
              dipaku 100 persen. Pengguna yang memperbesar huruf sistemnya
              melakukannya karena butuh, dan aplikasi yang mengabaikannya
              memaksa mereka memperbesar dua kali di tiap halaman.
            */
            textZoom = (resources.configuration.fontScale * 100).toInt().coerceIn(85, 200)

            userAgentString = "$userAgentString PortofolioJatmikoApp/1.0"
        }

        CookieManager.getInstance().setAcceptCookie(true)
        CookieManager.getInstance().setAcceptThirdPartyCookies(w, true)

        if (utama) {
            w.isScrollbarFadingEnabled = true
            w.overScrollMode = WebView.OVER_SCROLL_NEVER
        }
    }

    /* ---------------------------------------------------------------------
     *  Memuat halaman
     * --------------------------------------------------------------------- */

    private fun buka(alamat: String) {
        sembunyikanGalat()
        b.web.loadUrl(alamat)
    }

    private fun tampilkanGalat() {
        b.galat.visibility = android.view.View.VISIBLE
        b.web.visibility = android.view.View.INVISIBLE
    }

    private fun sembunyikanGalat() {
        b.galat.visibility = android.view.View.GONE
        b.web.visibility = android.view.View.VISIBLE
    }

    /** Apakah alamat ini milik situs sendiri? */
    private fun milikSitus(u: Uri?): Boolean = u?.host?.equals(BuildConfig.HOST, true) == true

    /**
     * Alamat yang harus tetap di dalam aplikasi walau bukan milik situs.
     *
     * Halaman izin GitHub termasuk di sini. Kalau dilempar ke peramban, proses
     * masuk terputus: peramban menyelesaikan izinnya, tetapi jawabannya tidak
     * pernah sampai ke jendela di dalam aplikasi yang menunggunya.
     */
    private fun bagianDariMasuk(u: Uri?): Boolean {
        val host = u?.host?.lowercase() ?: return false
        return host == "github.com" || host.endsWith(".github.com")
    }

    private inner class KlienHalaman : WebViewClient() {

        override fun shouldOverrideUrlLoading(view: WebView, req: WebResourceRequest): Boolean {
            val u = req.url

            if (milikSitus(u) || bagianDariMasuk(u)) return false

            // mailto:, tel:, whatsapp:, dan tautan keluar lainnya.
            return try {
                startActivity(Intent(Intent.ACTION_VIEW, u).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
                true
            } catch (_: ActivityNotFoundException) {
                // Tidak ada aplikasi yang bisa membukanya. Dibiarkan di dalam
                // WebView daripada tidak terjadi apa apa sama sekali.
                false
            }
        }

        override fun onPageFinished(view: WebView, url: String) {
            b.tarikSegar.isRefreshing = false
            // Menu bawah mengikuti halaman yang sedang dibuka, termasuk saat
            // pengguna berpindah lewat tautan di dalam halaman.
            val diPanel = url.contains("/admin", ignoreCase = true)
            b.navBawah.menu.findItem(if (diPanel) R.id.nav_panel else R.id.nav_situs).isChecked = true
        }

        override fun onReceivedError(view: WebView, req: WebResourceRequest, err: WebResourceError) {
            // Hanya kegagalan halaman utamanya yang ditampilkan. Satu gambar
            // yang gagal dimuat tidak boleh menutupi seluruh halaman yang
            // sebenarnya sudah tampil dengan benar.
            if (req.isForMainFrame) {
                b.tarikSegar.isRefreshing = false
                tampilkanGalat()
            }
        }
    }

    /* ---------------------------------------------------------------------
     *  Unggah berkas, popup masuk GitHub, dan kemajuan muat
     * --------------------------------------------------------------------- */

    private inner class KlienTampilan : WebChromeClient() {

        override fun onProgressChanged(view: WebView, baru: Int) {
            b.kemajuan.progress = baru
            b.kemajuan.visibility =
                if (baru in 1..99) android.view.View.VISIBLE else android.view.View.GONE
        }

        override fun onShowFileChooser(
            view: WebView,
            penerima: ValueCallback<Array<Uri>>,
            param: FileChooserParams,
        ): Boolean {
            // Permintaan sebelumnya yang belum selesai dibatalkan dulu, supaya
            // tidak ada callback yang menggantung selamanya.
            penerimaBerkas?.onReceiveValue(null)
            penerimaBerkas = penerima

            return try {
                pemilihBerkas.launch(param.createIntent())
                true
            } catch (_: ActivityNotFoundException) {
                penerimaBerkas = null
                Toast.makeText(this@MainActivity, R.string.pilih_berkas, Toast.LENGTH_SHORT).show()
                false
            }
        }

        /**
         * Jendela baru, dipakai panel admin untuk halaman izin GitHub.
         *
         * Jendelanya dibuat sebagai WebView kedua di dalam dialog, bukan
         * dilempar ke peramban. Alasannya penting: panel menunggu jawaban lewat
         * window.postMessage dari jendela yang dibukanya sendiri. Peramban luar
         * bukan jendela itu, jadi jawabannya tidak akan pernah sampai dan
         * tombol Masuk menggantung selamanya.
         */
        override fun onCreateWindow(
            view: WebView,
            isDialog: Boolean,
            isUserGesture: Boolean,
            resultMsg: android.os.Message,
        ): Boolean {
            val anak = WebView(this@MainActivity)
            siapkanWebView(anak, utama = false)

            anak.webViewClient = object : WebViewClient() {
                override fun shouldOverrideUrlLoading(v: WebView, req: WebResourceRequest) = false
            }

            anak.webChromeClient = object : WebChromeClient() {
                override fun onCloseWindow(w: WebView) {
                    // GitHub menutup jendelanya sendiri setelah izin diberikan.
                    tutupPopup()
                }

                override fun onShowFileChooser(
                    v: WebView,
                    penerima: ValueCallback<Array<Uri>>,
                    param: FileChooserParams,
                ): Boolean {
                    penerimaBerkas?.onReceiveValue(null)
                    penerimaBerkas = penerima
                    return try {
                        pemilihBerkas.launch(param.createIntent()); true
                    } catch (_: ActivityNotFoundException) {
                        penerimaBerkas = null; false
                    }
                }
            }

            popup = anak
            dialogPopup = AlertDialog.Builder(this@MainActivity)
                .setTitle(R.string.masuk_github)
                .setView(anak)
                .setNegativeButton(R.string.tutup) { _, _ -> tutupPopup() }
                .setOnDismissListener { bersihkanPopup() }
                .create()
                .also { it.show() }

            // Menyerahkan WebView anak ke halaman yang memintanya. Tanpa baris
            // ini, window.open() di halaman mengembalikan null dan panel
            // menganggap jendelanya diblokir.
            (resultMsg.obj as WebView.WebViewTransport).webView = anak
            resultMsg.sendToTarget()
            return true
        }
    }

    private fun tutupPopup() {
        dialogPopup?.dismiss()
        bersihkanPopup()
        // Panel membaca token yang baru disimpan setelah jendela izin ditutup.
        b.web.reload()
    }

    private fun bersihkanPopup() {
        popup?.let {
            it.stopLoading()
            (it.parent as? android.view.ViewGroup)?.removeView(it)
            it.destroy()
        }
        popup = null
        dialogPopup = null
    }

    /* ---------------------------------------------------------------------
     *  Unduhan
     * --------------------------------------------------------------------- */

    private val pengunduh = DownloadListener { url, agen, disposisi, jenisIsi, _ ->
        try {
            val nama = URLUtil.guessFileName(url, disposisi, jenisIsi)

            val permintaan = DownloadManager.Request(Uri.parse(url)).apply {
                setMimeType(jenisIsi)
                addRequestHeader("User-Agent", agen)
                // Cookie ikut dikirim. Tanpa ini, unduhan yang butuh sesi
                // dijawab halaman masuk, dan yang tersimpan justru berkas HTML
                // bernama .docx yang gagal dibuka Word.
                CookieManager.getInstance().getCookie(url)?.let { addRequestHeader("Cookie", it) }
                setTitle(nama)
                setDescription(getString(R.string.app_name))
                setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
                setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, nama)
            }

            (getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager).enqueue(permintaan)
            Toast.makeText(this, getString(R.string.unduhan_mulai, nama), Toast.LENGTH_SHORT).show()
        } catch (_: Exception) {
            Toast.makeText(this, R.string.unduhan_gagal, Toast.LENGTH_SHORT).show()
        }
    }

    /* ---------------------------------------------------------------------
     *  Tombol kembali
     * --------------------------------------------------------------------- */

    private fun aturTombolKembali() {
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                when {
                    dialogPopup?.isShowing == true -> tutupPopup()
                    b.web.canGoBack() -> b.web.goBack()
                    else -> {
                        /*
                          Konfirmasi dua ketukan sebelum keluar.

                          Tanpa ini, satu ketukan tidak sengaja di halaman
                          pertama menutup aplikasi, dan kalau itu terjadi saat
                          sedang mengisi formulir di panel, isian yang belum
                          disimpan ikut hilang.
                        */
                        val sekarang = System.currentTimeMillis()
                        if (sekarang - siapKeluar < 2000) {
                            finish()
                        } else {
                            siapKeluar = sekarang
                            Toast.makeText(
                                this@MainActivity,
                                R.string.keluar_konfirmasi,
                                Toast.LENGTH_SHORT,
                            ).show()
                        }
                    }
                }
            }
        })
    }

    /* ---------------------------------------------------------------------
     *  Daur hidup
     * --------------------------------------------------------------------- */

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        // Riwayat halaman ikut disimpan, jadi memutar layar tidak mengembalikan
        // pengguna ke halaman depan.
        b.web.saveState(outState)
    }

    override fun onPause() {
        b.web.onPause()
        // Cookie sesi panel ditulis ke penyimpanan sekarang, bukan nanti.
        // Kalau sistem menutup aplikasi saat di latar belakang, status masuk
        // tetap tersimpan dan pengguna tidak perlu masuk ulang.
        CookieManager.getInstance().flush()
        super.onPause()
    }

    override fun onResume() {
        super.onResume()
        b.web.onResume()
    }

    override fun onDestroy() {
        bersihkanPopup()
        b.web.destroy()
        super.onDestroy()
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        intent.data?.takeIf { milikSitus(it) }?.let { buka(it.toString()) }
    }
}
