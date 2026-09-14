import { NextResponse } from 'next/server';
import {
  OAUTH_STATE_COOKIE,
  buildHandshakePage,
  callbackUrl,
  originFromRequest,
  readOAuthConfig,
} from '@/lib/oauth';

/**
 * Langkah kedua login CMS.
 *
 * GitHub mengembalikan pengunjung ke sini bersama satu kode sekali pakai.
 * Endpoint ini menukar kode itu dengan token akses, lalu menyerahkan tokennya
 * ke panel CMS lewat jendela pembuka.
 *
 * Client Secret hanya dipakai di sini, di sisi server, dan tidak pernah ikut
 * terkirim ke browser.
 */
export const dynamic = 'force-dynamic';

/** Membungkus jawaban sebagai halaman HTML kecil untuk jendela login. */
function handshakeResponse(status, payload, statusCode = 200) {
  const response = new NextResponse(buildHandshakePage(status, payload), {
    status: statusCode,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
  // Kode acak sudah terpakai, hapus supaya tidak bisa dipakai ulang.
  response.cookies.delete(OAUTH_STATE_COOKIE);
  return response;
}

export async function GET(request) {
  const config = readOAuthConfig();
  if (!config.ok) {
    return handshakeResponse('error', config.message, 500);
  }

  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const savedState = request.cookies.get(OAUTH_STATE_COOKIE)?.value;

  if (url.searchParams.get('error')) {
    return handshakeResponse('error', url.searchParams.get('error_description') || 'Izin ditolak.');
  }

  if (!code) {
    return handshakeResponse('error', 'GitHub tidak mengirimkan kode otorisasi.', 400);
  }

  // Kode acak harus sama persis dengan yang dititipkan di langkah pertama.
  if (!state || !savedState || state !== savedState) {
    return handshakeResponse(
      'error',
      'Kode keamanan tidak cocok. Coba tutup jendela ini lalu ulangi login.',
      400
    );
  }

  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        redirect_uri: callbackUrl(originFromRequest(request)),
      }),
    });

    const data = await tokenResponse.json();

    if (!tokenResponse.ok || data.error || !data.access_token) {
      return handshakeResponse(
        'error',
        data.error_description || data.error || 'GitHub menolak menukar kode ini dengan token.',
        400
      );
    }

    return handshakeResponse('success', { token: data.access_token, provider: 'github' });
  } catch (error) {
    return handshakeResponse('error', `Gagal menghubungi GitHub: ${error.message}`, 502);
  }
}
