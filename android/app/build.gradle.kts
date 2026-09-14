plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "id.acid.unib.jatmiko.portofolio"
    compileSdk = 35

    defaultConfig {
        applicationId = "id.acid.unib.jatmiko.portofolio"
        minSdk = 24          // Android 7.0, menjangkau hampir semua ponsel aktif
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"

        /*
          ALAMAT SITUS DISIMPAN SEBAGAI SATU NILAI DI SINI

          Dipakai MainActivity untuk menentukan halaman awal sekaligus untuk
          memutuskan alamat mana yang boleh dibuka di dalam aplikasi dan mana
          yang harus dilempar ke peramban.

          Ganti satu baris ini kalau nanti situsnya pindah ke domain sendiri,
          lalu sesuaikan juga res/xml/network_security_config.xml.
        */
        buildConfigField("String", "SITUS", "\"https://jatmikoyogop.vercel.app\"")
        buildConfigField("String", "HOST", "\"jatmikoyogop.vercel.app\"")
    }

    buildFeatures {
        buildConfig = true
        viewBinding = true
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions { jvmTarget = "17" }
}

dependencies {
    implementation("androidx.core:core-ktx:1.15.0")
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("com.google.android.material:material:1.12.0")
    implementation("androidx.constraintlayout:constraintlayout:2.2.0")
    implementation("androidx.swiperefreshlayout:swiperefreshlayout:1.1.0")
    implementation("androidx.webkit:webkit:1.12.1")
    implementation("androidx.activity:activity-ktx:1.9.3")
}
