/**
 * =============================================================================
 *  lib/oauth.js  |  Bagian bersama untuk login CMS lewat GitHub
 * =============================================================================
 *
 *  Dipakai oleh dua endpoint:
 *    app/api/auth/route.js      mengantar pengguna ke halaman izin GitHub
 *    app/api/callback/route.js  menukar kode dari GitHub menjadi token akses
 *
 *  Berkas ini hanya berjalan di server. Client Secret tidak pernah sampai ke
 *  browser.
 * =============================================================================
 */

/** Nama cookie penyimpan kode acak anti pemalsuan permintaan. */
export const OAUTH_STATE_COOKIE = 'cms_oauth_state';

/**
 * Membaca kredensial dari Environment Variables dan memastikan keduanya ada.
 *
 * @returns {{ ok: true, clientId: string, clientSecret: string }
 *          | { ok: false, message: string }}
 */
export function readOAuthConfig() {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  const missing = [];
  if (!clientId) missing.push('GITHUB_CLIENT_ID');
  if (!clientSecret) missing.push('GITHUB_CLIENT_SECRET');

  if (missing.length > 0) {
    return { ok: false, message: `Environment variable belum diisi: ${missing.join(' dan ')}.` };
  }

  return { ok: true, clientId, clientSecret };
}

/**
 * Menentukan alamat asal situs (skema + domain) dari sebuah permintaan.
 *
 * Di Vercel, permintaan lewat dulu melalui perantara sebelum sampai ke kode
 * ini, jadi alamat mentahnya kadang berisi nama host internal. Perantara itu
 * menitipkan alamat aslinya di header x-forwarded-*, dan itulah yang dipakai
 * lebih dulu. Ini penting karena alamat callback harus sama persis dengan yang
 * didaftarkan di GitHub, sampai ke huruf terakhir.
 */
export function originFromRequest(request) {
  const headers = request.headers;
  const host = headers.get('x-forwarded-host') || headers.get('host');
  const proto = headers.get('x-forwarded-proto') || 'https';

  // Header bisa berisi beberapa nilai kalau permintaan melewati lebih dari
  // satu perantara. Yang pertama adalah alamat yang dilihat pengunjung.
  const firstHost = host?.split(',')[0].trim();
  const firstProto = proto.split(',')[0].trim();

  if (firstHost) return `${firstProto}://${firstHost}`;

  // Cadangan terakhir kalau header di atas tidak ada sama sekali.
  return new URL(request.url).origin;
}

/**
 * Alamat tujuan GitHub setelah pengguna memberi izin.
 *
 * Garis miring di akhir dipakai konsisten karena situs ini memakai
 * trailingSlash. Tanpa itu, GitHub mendarat di alamat yang langsung dialihkan,
 * dan alamat yang didaftarkan di OAuth app jadi tidak sama persis.
 *
 * NILAI INI HARUS SAMA PERSIS dengan Authorization callback URL yang kamu isi
 * saat mendaftarkan OAuth app di GitHub.
 */
export function callbackUrl(origin) {
  return `${origin}/api/callback/`;
}

/**
 * Menyusun alamat halaman izin GitHub.
 *
 * Cakupan izin yang diminta:
 *   repo         agar CMS bisa membaca dan menulis berkas di repositori
 *   user:email   agar nama penulis pada commit terisi benar
 */
export function buildGitHubAuthorizeUrl({ clientId, state, origin }) {
  const url = new URL('https://github.com/login/oauth/authorize');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', callbackUrl(origin));
  url.searchParams.set('scope', 'repo,user:email');
  url.searchParams.set('state', state);
  return url.toString();
}

/**
 * Halaman kecil yang dikirim balik ke jendela login.
 *
 * Sveltia CMS dan Decap CMS memakai percakapan tiga langkah lewat postMessage:
 *   1. jendela login memberi tahu bahwa proses sedang berjalan
 *   2. jendela utama membalas, sehingga alamat asalnya diketahui
 *   3. jendela login mengirim hasilnya hanya ke alamat asal tersebut
 *
 * Token tidak pernah dikirim dengan tujuan wildcard, jadi tidak bisa disadap
 * jendela lain.
 *
 * PENGETATAN: hanya membalas ke situs ini sendiri.
 *
 * Sebelumnya halaman ini membalas ke alamat asal mana pun yang menyapanya
 * lebih dulu. Jendela yang membuka halaman ini bisa menyapa dari alamat mana
 * saja, dan balasannya berisi token yang memberi akses tulis ke seluruh
 * repositori. Sekarang sapaan dari alamat selain situs ini diabaikan, jadi
 * hanya panel di /admin yang bisa menerima tokennya.
 *
 * @param {'success'|'error'} status
 * @param {object|string} payload token beserta providernya, atau pesan kesalahan
 */
export function buildHandshakePage(status, payload) {
  const message = `authorization:github:${status}:${JSON.stringify(payload)}`;
  const isError = status === 'error';

  return `<!doctype html>
<html lang="id">
  <head>
    <meta charset="utf-8" />
    <title>${isError ? 'Login gagal' : 'Login berhasil'}</title>
    <style>
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        background: #05070f;
        color: #e2e8f0;
        font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
        text-align: center;
        padding: 1.5rem;
      }
      p { max-width: 28rem; line-height: 1.7; }
      strong { color: #ffffff; }
    </style>
  </head>
  <body>
    <p>
      <strong>${isError ? 'Login gagal.' : 'Login berhasil.'}</strong><br />
      ${isError ? 'Silakan tutup jendela ini dan coba lagi.' : 'Jendela ini akan menutup sendiri.'}
    </p>
    <script>
      (function () {
        var message = ${JSON.stringify(message)};

        var asal = window.location.origin;

        function handleReply(event) {
          // Sapaan dari alamat lain diabaikan. Tokennya hanya boleh sampai ke
          // panel di situs ini sendiri, bukan ke jendela mana pun yang
          // kebetulan membuka halaman ini.
          if (event.origin !== asal) return;

          window.opener.postMessage(message, asal);
          window.removeEventListener('message', handleReply, false);
        }

        if (!window.opener) {
          document.body.innerHTML =
            '<p>Halaman ini hanya bisa dibuka dari panel CMS.</p>';
          return;
        }

        window.addEventListener('message', handleReply, false);
        window.opener.postMessage('authorizing:github', asal);
      })();
    </script>
  </body>
</html>`;
}
