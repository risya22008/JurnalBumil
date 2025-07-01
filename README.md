# 📝 Jurnal Bumil – Web Aplikasi Catatan Kehamilan

Jurnal Bumil adalah aplikasi web yang dirancang untuk membantu ibu hamil dalam mencatat kondisi harian serta memantau histori kunjungan medis bersama bidan. Aplikasi ini juga menyediakan artikel edukatif yang disesuaikan dengan usia kehamilan dan dilengkapi fitur verifikasi email untuk keamanan data.

---

## 🚀 Fitur Utama

### Untuk Ibu Hamil

* ✍️ **Catatan Harian Kehamilan**
    * Menambahkan catatan tentang kondisi kesehatan, makanan, dan perasaan harian.
* 📖 **Histori Catatan**
    * Melihat catatan-catatan terdahulu dan merangkum dalam bentuk paragraf menggunakan OpenAI API.
* 📊 **Histori Kunjungan Medis**
    * Menampilkan data pemeriksaan (berat janin, tekanan darah, dsb) dalam bentuk tabel dan grafik.
* 📚 **Artikel Edukasi Kehamilan**
    * Artikel otomatis ditampilkan sesuai usia kehamilan pengguna.

### Untuk Bidan

* 📝 **Laporan Kunjungan**
    * Input data pemeriksaan rutin ibu hamil seperti tekanan darah, lingkar perut, dan catatan tambahan.
* 👩‍⚕️ **Data Ibu Binaan**
    * Menampilkan daftar ibu hamil dalam pengawasan, lengkap dengan histori kesehatan dan integrasi AI untuk ringkasan.
* 🔐 **Verifikasi Akun**
    * Sistem berbasis email untuk memastikan validitas data saat registrasi ibu maupun bidan.

---

## 🔧 Teknologi & Tools

* **Frontend**: React (dengan navigasi berdasarkan role)
* **Backend**: Express.js + Firebase Authentication, Firestore (penyimpanan data)
* **Database Query**: SQL-like untuk fetching data dari tabel `ibu`, `bidan`, `catatan_harian`, dan `laporan_kunjungan`
* **API AI**: OpenAI API untuk membuat ringkasan otomatis
* **Deployment**: Google Cloud / Firebase Hosting

---

## 📌 Endpoints Penting (Backend)

### Autentikasi & Registrasi

* `POST /api/ibu` – Registrasi akun ibu
* `POST /api/bidan` – Registrasi akun bidan
* `GET /api/login` – Login untuk semua role
* `GET /api/ibu/verifikasi` – Verifikasi ibu
* `GET /api/bidan/login` – Verifikasi bidan

### Artikel

* `GET /api/beranda/awal` – Artikel umum (belum login)
* `GET /api/beranda/ibu` – Artikel berdasarkan usia kehamilan

### Catatan Harian & Laporan

* `POST /api/catatan` – Tambah catatan harian
* `GET /api/histori/catatan` – Ambil semua catatan ibu
* `POST /api/laporan` – Tambah laporan kunjungan
* `GET /api/histori/kunjungan` – Ambil data kunjungan untuk grafik

---

## 🧠 AI Integration

Menggunakan OpenAI GPT untuk:
* Meringkas catatan harian ibu.
* Menyusun ringkasan laporan kunjungan untuk bidan.

