````markdown name=User_Manual_Ecosteps.md
```markdown
# User Manual — ECOSTEPS (Sistem Pelaporan Kerusakan Lingkungan)

**Repo:** MJohanBintangP/SemangatBelajar (main)  
**Tanggal:** 2025-11-16

## Ringkasan
ECOSTEPS adalah platform untuk:
- Melaporkan kerusakan lingkungan dengan dokumentasi (foto/video) dan lokasi.
- Melacak status penanganan laporan.
- Berdiskusi di forum komunitas.
- Membaca artikel lingkungan yang relevan.
- Mengikuti tantangan harian untuk mendapatkan poin.
- Admin dapat mengelola laporan, pengguna, dan forum.

---

## 1. Akses & Autentikasi
- Daftar → Verifikasi email (OTP) → Login.
- Lupa password → Reset via OTP.
- Setelah login, sesi disimpan sehingga Anda tetap masuk sampai logout.
- Role (user/admin) menentukan halaman tujuan (Dashboard vs AdminDashboard).

---

## 2. Dashboard Pengguna
- Menampilkan ringkasan:
  - Tantangan selesai hari ini
  - Total poin
  - Total laporan
  - Status terbaru laporan
- Quick Actions (akses cepat) dan preview artikel.
- Catatan: Dashboard dirancang untuk desktop; tampilan dashboard tidak didukung di perangkat mobile.

---

## 3. Membuat Laporan
Langkah:
1. Buka menu **Laporan**.
2. Klik **+ Tambah Laporan**.
3. Isi form:
   - Judul (wajib)
   - Deskripsi (wajib)
   - Foto URL (opsional)
   - Video URL (opsional)
   - Lokasi: klik **Ambil lokasi** untuk mengisi koordinat lewat fitur geolocation browser.
4. Klik **Tambah laporan**.
5. Pesan sukses atau error akan muncul. Setelah sukses, laporan masuk ke riwayat Anda.

Tips: jika tidak punya URL media, unggah foto ke layanan hosting (mis. Google Drive/Imgur) lalu gunakan link.

---

## 4. Melihat Riwayat & Detail Laporan
- Halaman menampilkan tabel: No, Judul, Deskripsi (ringkasan), Dokumentasi (tautan), Lokasi, Status, Tanggal.
- Klik "Lihat foto"/"Lihat video" untuk melihat dokumentasi.
- Status akan berubah saat admin memperbarui (mis. Diproses → Selesai).

---

## 5. Forum Komunitas
- Create topic: klik **+ Buat forum baru** → isi judul & isi.
- Memberi komentar: kotak komentar pada setiap posting.
- Menampilkan daftar topik, komentar terbaru.
- Admin dapat menghapus topik jika perlu.

---

## 6. Artikel Lingkungan
- Daftar artikel diambil dari sumber eksternal dan disaring menurut kata kunci lingkungan.
- Klik judul/thumbnail untuk membuka sumber asli di tab baru.
- Jika tidak ditemukan artikel lingkungan, akan muncul pesan pemberitahuan.

---

## 7. Tantangan & Leaderboard
- Halaman Tantangan:
  - Daftar tantangan harian dengan deskripsi dan poin.
  - Checkbox untuk menandai selesai (akan mengirim data ke server).
  - Leaderboard top 5 menunjukkan pengguna dengan poin tertinggi.
  - Total poin user tampil di halaman.
- Tujuan: mendorong perilaku positif (mis. laporan yang baik, kegiatan hijau).

---

## 8. Admin Dashboard (Fitur Admin)
- Tab utama: Laporan / Users / Forums.
- Laporan:
  - Lihat semua laporan, dokumentasi, lokasi.
  - Update status: Proses (Diproses) / Selesai.
  - Hapus laporan.
- Users:
  - Lihat daftar user, edit username/role, hapus user.
- Forums:
  - Lihat topik forum, hapus topik jika perlu.
- Pesan hasil aksi ditampilkan setiap kali admin melakukan perubahan.

---

## 9. Verifikasi Email & Reset Password
- Verifikasi Email:
  - Setelah register diarahkan ke halaman verifikasi.
  - Masukkan kode OTP (6 digit). Ada countdown (mis. 40 detik) sebelum bisa kirim ulang.
- Reset Password:
  - Masukkan email, terima OTP, masukkan OTP dan password baru.
  - Validasi client: minimal panjang password, OTP 6 digit.

---

## 10. Hal-hal Teknis yang Perlu Diketahui Pengguna
- Saat login, token dan role disimpan supaya akses ke API terotentikasi.
- Form tambah laporan saat ini menerima URL media — bukan upload file langsung.
- Lokasi dari fitur "Ambil lokasi" mengambil koordinat dari browser; pastikan mengizinkan akses lokasi.

---

## 11. Privasi & Keamanan (Catatan untuk Pengguna)
- Jangan sertakan data pribadi orang lain dalam deskripsi atau foto.
- Pastikan media yang di-link tidak melanggar hak cipta atau privasi.
- Lokasi yang dikirim membantu respon cepat, namun gunakan dengan bijak.

---

## 12. FAQ Singkat
Q: Bagaimana cara menambahkan foto/video?
A: Tempelkan URL foto/video pada field yang tersedia. Jika Anda perlu mengunggah file, gunakan layanan hosting lalu tempelkan link.

Q: Saya mendapat notifikasi "Perangkat Tidak Didukung" di dashboard.
A: Gunakan laptop/desktop — dashboard tidak tersedia di layar kecil.

Q: Berapa lama OTP berlaku?
A: Terdapat countdown di UI (mis. 40 detik) yang menandai batas kirim ulang; masa berlaku OTP tergantung kebijakan server.

---

## 13. Rekomendasi Penggunaan Terbaik
- Foto yang jelas dan lokasi akurat mempercepat penanganan.
- Tulis deskripsi yang informatif: apa yang rusak, kapan terlihat, apakah berbahaya.
- Ikuti tantangan untuk mendapatkan poin dan kontribusi lebih besar ke komunitas.

---

## 14. Kontak & Laporan Masalah
- Untuk masalah teknis atau bug: laporkan ke kontak/dokumentasi tim pengembang (informasi kontak biasanya ada di beranda atau repository).
- Sertakan langkah reproduksi, screenshot, halaman terkait, dan waktu kejadian.

---
