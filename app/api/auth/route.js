import { NextResponse } from 'next/server';
import {
  OAUTH_STATE_COOKIE,
  buildGitHubAuthorizeUrl,
  originFromRequest,
  readOAuthConfig,
} from '@/lib/oauth';

/**
 * Langkah pertama login CMS.
 *
 * Sveltia CMS membuka alamat ini di jendela kecil. Tugas endpoint ini hanya
 * mengarahkan pengunjung ke halaman izin GitHub, sambil menitipkan satu kode
 * acak (state) di cookie untuk dicocokkan lagi nanti. Kode acak itu yang
 * mencegah orang lain memancing proses login ini dari situs mereka.
 *
 * Tidak ada rahasia apa pun yang dikirim ke browser di langkah ini.
 */
export const dynamic = 'force-dynamic';

export async function GET(request) {
  const config = readOAuthConfig();

  if (!config.ok) {
    return NextResponse.json(
      {
        error: 'Konfigurasi OAuth belum lengkap.',
        detail: config.message,
        petunjuk:
          'Isi GITHUB_CLIENT_ID dan GITHUB_CLIENT_SECRET pada Environment Variables proyek di dashboard Vercel, lalu deploy ulang.',
      },
      { status: 500 }
    );
  }

  // Kode acak sekali pakai untuk mencocokkan permintaan dan jawabannya.
  const state = crypto.randomUUID();
  const origin = originFromRequest(request);

  const response = NextResponse.redirect(
    buildGitHubAuthorizeUrl({ clientId: config.clientId, state, origin })
  );

  response.cookies.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 600, // sepuluh menit, cukup untuk menyelesaikan login
  });

  return response;
}
