/**
 * =============================================================================
 *  lib/github.js  |  Menitipkan satu berkas baru ke repositori
 * =============================================================================
 *
 *  Dipakai oleh app/api/feedback/route.js untuk menyimpan masukan dari tamu
 *  sebagai berkas JSON di folder content/feedback/. Begitu berkasnya masuk,
 *  masukan itu langsung muncul di panel /admin seperti tulisan blog.
 *
 *  Berkas ini hanya berjalan di server. Token tidak pernah sampai ke browser.
 *
 *  PERSIAPAN SEKALI SAJA
 *  Isi environment variable GITHUB_CONTENT_TOKEN di Vercel dengan sebuah
 *  fine-grained personal access token yang izinnya dibatasi:
 *    repositori   hanya JatmikoYogopriyatno/Portofolio
 *    izin         Contents: Read and write
 *  Tidak perlu izin lain. Langkah lengkapnya ada di data/README.md bagian 18.
 * =============================================================================
 */

const API = 'https://api.github.com';

/** Membaca sasaran penyimpanan dari environment variable, dengan nilai bawaan. */
export function repoTujuan() {
  return {
    owner: process.env.GITHUB_REPO_OWNER || 'JatmikoYogopriyatno',
    repo: process.env.GITHUB_REPO_NAME || 'Portofolio',
    branch: process.env.GITHUB_REPO_BRANCH || 'main',
    token: process.env.GITHUB_CONTENT_TOKEN || '',
  };
}

/**
 * Membuat satu berkas baru di repositori.
 *
 * Sengaja hanya bisa membuat, tidak menimpa. Kalau namanya sudah dipakai,
 * GitHub menolak dan fungsi ini melaporkannya sebagai gagal. Jadi kiriman
 * tamu tidak akan pernah menimpa berkas yang sudah ada.
 *
 * @param {{ path: string, isi: object, pesan: string }} opsi
 * @returns {Promise<{ ok: boolean, status: number, detail?: string }>}
 */
export async function buatBerkas({ path, isi, pesan }) {
  const { owner, repo, branch, token } = repoTujuan();

  if (!token) {
    return { ok: false, status: 500, detail: 'GITHUB_CONTENT_TOKEN belum diisi.' };
  }

  const konten = Buffer.from(`${JSON.stringify(isi, null, 2)}\n`, 'utf8').toString('base64');

  const tanggapan = await fetch(`${API}/repos/${owner}/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: pesan, content: konten, branch }),
  });

  if (tanggapan.ok) return { ok: true, status: tanggapan.status };

  // Pesan aslinya dari GitHub tidak diteruskan ke pengunjung, hanya dicatat
  // seperlunya di sini supaya tidak membocorkan detail konfigurasi.
  let detail = `GitHub menolak dengan status ${tanggapan.status}.`;
  try {
    const galat = await tanggapan.json();
    if (galat?.message) detail = `${detail} ${galat.message}`;
  } catch {
    // Tanggapannya bukan JSON, cukup pakai pesan bawaan di atas.
  }

  return { ok: false, status: tanggapan.status, detail };
}
