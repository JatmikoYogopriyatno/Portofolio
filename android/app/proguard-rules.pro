# Antarmuka yang dipanggil dari JavaScript tidak boleh diganti namanya.
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
