User Manual — ECOSTEPS (Sistem Pelaporan Kerusakan Lingkungan)

ECOSTEPS adalah platform pelaporan kerusakan lingkungan dan komunitas yang memungkinkan pengguna:
- Melaporkan kerusakan lingkungan (dengan foto/video dan koordinat lokasi).
- Melihat riwayat laporan dan status penanganannya.
- Berpartisipasi di forum diskusi.
- Membaca artikel terkait lingkungan.
- Mengikuti tantangan harian untuk mendapatkan poin dan naik di leaderboard.
- Bagi admin: mengelola laporan, mengubah status, mengelola pengguna, dan menghapus forum.

Panduan penggunaan (untuk pengguna akhir)

1. Akses & Autentikasi
- Halaman utama: buka beranda (Landing Page) untuk informasi umum.
- Register (Daftar): klik "Daftar", isi username/email/password. Setelah pendaftaran diarahkan ke verifikasi email.
- Verifikasi Email: masukkan kode OTP yang dikirim ke email; ada timer (contoh: 40 detik) sebelum bisa kirim ulang. Setelah verifikasi, login.
- Login: masukkan email & password. Jika berhasil, token akan disimpan dan Anda diarahkan ke Dashboard (role 'admin' → AdminDashboard, role 'user' → Dashboard).
- Reset Password: gunakan menu Reset Password — masukkan email untuk menerima OTP, lalu masukkan OTP dan password baru.

2. Dashboard (setelah login)
- Ringkasan: menampilkan jumlah tantangan selesai hari ini, total poin, total laporan, dan status terbaru laporan Anda.
- Quick Actions: akses cepat ke fitur penting (mis. buat laporan).
- Riwayat Laporan: ringkasan laporan terakhir dan tautan ke daftar lengkap.
- Tampilan artikel singkat (artikel lingkungan terfilter).

Catatan penting: dashboard untuk pengguna memiliki tata letak desktop; tampilan dashboard tidak mendukung ukuran layar mobile — gunakan laptop/desktop untuk fungsi penuh.

3. Membuat Laporan (Fitur utama)
- Buka menu "Laporan" → klik tombol "+ Tambah Laporan".
- Form Tambah Laporan (popup/modal):
  - Judul (wajib): ringkasan singkat masalah.
  - Deskripsi (wajib): uraian detail kejadian/kerusakan.
  - Foto URL (opsional): link foto dokumentasi.
  - Video URL (opsional): link video dokumentasi.
  - Lokasi (opsional tapi sangat dianjurkan): tombol "Ambil lokasi" akan meminta hak akses geolocation browser dan mengisi koordinat (format latitude,longitude).
- Setelah submit, laporan dikirim ke server. Pesan keberhasilan atau error akan ditampilkan.
- Rekomendasi isi laporan: jelas, lokasi aktif, lampirkan foto/video bila tersedia, hindari menyertakan data pribadi orang lain.

4. Melihat Riwayat & Detail Laporan
- Halaman Laporan menampilkan tabel berisi:
  - No, Judul, Deskripsi (potongan), Dokumentasi (tautan "Lihat foto"/"Lihat video"), Lokasi (dipersingkat), Status, Tanggal melapor.
- Klik tautan foto/video untuk melihat dokumentasi.
- Status laporan: mis. "Diproses", "Selesai", atau status lain sesuai admin.
- Jika belum ada laporan, halaman menampilkan ilustrasi dan ajakan membuat laporan pertama.

5. Laporan & Privasi
- Lokasi yang dikirim berupa koordinat; ditampilkan di tabel (dipersingkat).
- Foto/video yang Anda kirim berupa URL — pastikan Anda memiliki hak atas media dan tidak memuat data sensitif.
- Laporan dapat dilihat oleh admin (untuk tindak lanjut) dan kemungkinan oleh pengguna lain tergantung kebijakan platform.

6. Forum (Diskusi Komunitas)
- Menu "Forum" memungkinkan:
  - Membuat posting baru (+ Buat forum baru), dengan judul dan isi.
  - Melihat daftar topik, isi, author, tanggal.
  - Memberi komentar pada posting (kolom komentar dan tombol "Kirim").
- Pesan sukses/error akan ditampilkan saat membuat forum atau komentar.
- Jika forum kosong, tampilkan ilustrasi ajakan membuat topik.

7. Artikel (Informasi Lingkungan)
- Menu "Artikel" memuat artikel yang diambil dari sumber eksternal dan difilter untuk topik lingkungan (kata kunci terkait lingkungan).
- Klik artikel untuk membuka sumber aslinya di tab baru.
- Jika tidak ada artikel terkait, ditampilkan pesan "Tidak ada artikel lingkungan ditemukan."

8. Tantangan & Gamifikasi
- Menu "Tantangan" menampilkan:
  - Tantangan harian (daftar tugas singkat dengan deskripsi dan poin).
  - Checkbox untuk menandai tantangan selesai (mengirimkan ke server dan menambah poin).
  - Leaderboard top 5 menunjukkan pengguna dengan poin tertinggi.
  - Poin total Anda ditampilkan di pojok atas halaman Tantangan.
- Mekanisme sederhana: menandai tantangan sebagai selesai mengirimkan POST ke server dan memperbarui tampilan (completed, poin).
- Gunakan fitur ini untuk mendorong partisipasi dan pelaporan yang baik.

9. Admin Dashboard (untuk admin)
- Akses: /AdminDashboard (role admin).
- Fitur utama:
  - Tab "Laporan": lihat semua laporan, lihat dokumentasi, lokasi, dan deskripsi.
    - Update status: tombol Proses (set status ke "Diproses"), Selesai (set status ke "Selesai").
    - Hapus laporan.
  - Tab "Users": daftar user, edit username/role, hapus user.
  - Tab "Forums": daftar forum, opsi hapus (jika perlu).
- Admin melihat pesan hasil aksi (mis. "Status berhasil diupdate", "Laporan berhasil dihapus").
- Jika token tidak valid atau tidak login, admin akan diarahkan ke login.

10. Pesan & Notifikasi
- Sistem menampilkan pesan sukses/gagal pada setiap aksi (daftar, verifikasi, kirim laporan, buat forum, update status).
- Verifikasi email dan reset password menggunakan OTP; ada batas waktu dan opsi kirim ulang dengan countdown.

11. Hal-hal yang Perlu Diperhatikan (FAQ singkat)
Q: Bagaimana cara mengirim laporan dengan lokasi?
A: Pada form Tambah Laporan klik "Ambil lokasi" dan izinkan browser mengakses lokasi Anda. Koordinat akan otomatis diisi.

Q: Apakah bisa mengunggah file langsung?
A: Form saat ini meminta URL foto/video — Anda dapat mengunggah file ke layanan hosting media lalu tempelkan URL. (Jika implementasi backend mendukung upload file secara langsung, opsi itu akan tercantum di UI.)

Q: Saya melihat dashboard kosong di ponsel.
A: Dashboard penuh hanya didukung di desktop/laptop. Gunakan perangkat dengan layar lebar untuk mengakses Dashboard pengguna/admin.

Q: Apa yang dimaksud status "Diproses"?
A: Artinya laporan sedang ditangani oleh pihak terkait (ditetapkan oleh admin). "Selesai" berarti sudah ditindaklanjuti sepenuhnya.

12. Rekomendasi untuk Pengguna
- Isi judul dan deskripsi sejelas mungkin.
- Sertakan foto/video berkualitas cukup untuk verifikasi kerusakan.
- Gunakan lokasi otomatis agar petugas mudah menemukan titik kejadian.
- Hindari memuat data pribadi pihak ketiga dalam laporan.

13. Kontak & Pelaporan Bug
- Untuk masalah teknis, hubungi tim pengelola (link/kanal dukungan dicantumkan di beranda bila tersedia).
- Untuk bug UI, sertakan langkah reproduksi, screenshot, dan URL halaman terkait.

Penutup
Dokumen ini menyesuaikan manual sebelumnya menjadi panduan lengkap penggunaan ECOSTEPS sebagai platform pelaporan kerusakan lingkungan dan komunitas. Salin dokumen ini untuk distribusi ke pengguna/pengelola.
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

Dokumen ini menyesuaikan seluruh penjelasan agar sesuai dengan fungsi ECOSTEPS: platform pelaporan kerusakan lingkungan, forum komunitas, artikel lingkungan, dan gamifikasi tantangan.