# Tugas 9 - Autentikasi & Otorisasi

## Identitas
- Nama : Farid Nanda Syauqi
- NIM  : F1D02310050
- Kasus ETS : Product & Order Management API (Express + Prisma)

## Cara Menjalankan
1. **Clone / masuk ke direktori proyek** dan install seluruh dependensi:
   ```bash
   npm install
   ```
2. **Konfigurasi Environment Variables**: buat file `.env` di root proyek dan isi konfigurasi database serta secret JWT:
   ```env
   PORT=3000
   DATABASE_URL="mysql://user:password@localhost:3306/nama_database"
   JWT_ACCESS_SECRET="rahasia_access_token_super_aman"
   JWT_REFRESH_SECRET="rahasia_refresh_token_super_aman"
   ```
3. **Migrasi Database (membuat tabel `User`, `RefreshToken`, `Product`, `Order`, dll.)**:
   ```bash
   npx prisma migrate dev --name init
   ```
4. **Jalankan Server**:
   ```bash
   npm run dev
   ```
   *(Catatan: Untuk menguji akun dengan role `admin`, ubah kolom `role` pada user uji menjadi `'admin'` secara manual melalui Prisma Studio (`npx prisma studio`) atau query database).*

## Akun Uji
Akun dibuat melalui endpoint `POST /auth/register`:

| Role | Email | Password | Keterangan |
| :--- | :--- | :--- | :--- |
| `user` (default) | `user@example.com` | `Password123!` | Akun standar untuk akses baca (`GET`) |
| `admin` | `admin@example.com` | `Admin123!` | Akun dengan hak akses penuh (`POST`, `PUT`, `DELETE`) |

## Struktur Proyek
```text
.
├── index.js                          # Entry point server Express dan registrasi route utama (/auth, /product, /order)
├── .env                              # [BARU/DIUBAH] Menyimpan konfigurasi PORT, DATABASE_URL, serta secret JWT
├── prisma/
│   └── schema.prisma                 # [DIUBAH] Definisi model User, RefreshToken, Product, dan Order
└── src/
    ├── controllers/
    │   ├── auth.controller.js        # [BARU] Menangani request/response HTTP untuk register, login, refresh, logout, dan profil (/saya)
    │   ├── order.controller.js       # Menangani request/response HTTP untuk manajemen order
    │   └── product.controller.js     # Menangani request/response HTTP untuk manajemen produk & review
    ├── data/
    │   ├── order.data.js             # Query Prisma untuk mengambil daftar order beserta detail produk
    │   ├── product.data.js           # Query Prisma untuk operasi CRUD produk dan ulasan
    │   └── user.data.js              # [BARU] Query Prisma untuk manajemen data User dan RefreshToken
    ├── lib/
    │   └── prisma.js                 # Inisialisasi instance Prisma Client
    ├── middleware/
    │   ├── auth.js                   # [BARU] Middleware needLogin (verifikasi Bearer token) dan needRole (otorisasi role)
    │   ├── errorHandler.js           # Penanganan error terpusat (AppError & error sistem)
    │   ├── logger.js                 # Mencatat log setiap HTTP request yang masuk
    │   ├── notFound.js               # Menangani route yang tidak ditemukan (404)
    │   └── validasi.js               # Middleware validasi request body menggunakan skema validator
    ├── routes/
    │   ├── auth.route.js             # [BARU] Definisi endpoint /auth (register, login, refresh, logout, saya)
    │   ├── order.route.js            # [DIUBAH] Definisi endpoint /order dengan proteksi needLogin dan needRole('admin')
    │   └── product.route.js          # [DIUBAH] Definisi endpoint /product dengan proteksi needLogin dan needRole('admin')
    ├── services/
    │   ├── auth.service.js           # [BARU] Logika bisnis hashing password (bcrypt) serta pembuatan & verifikasi JWT
    │   ├── order.service.js          # Logika bisnis transaksi pembuatan order dan pengurangan stok produk
    │   └── product.service.js        # Logika bisnis filter, paginasi, validasi ID, dan CRUD produk
    ├── utils/
    │   └── AppError.js               # Custom class error untuk standarisasi HTTP status dan kode error
    └── validators/
        ├── auth.validator.js         # [BARU] Skema validasi input email dan password untuk autentikasi
        ├── order.validator.js        # Skema validasi input pembuatan order
        └── product.validator.js      # Skema validasi input pembuatan dan pembaruan produk
```

## Endpoint

### 1. Autentikasi (`/auth`)
| Method | URL | Akses | Status Sukses / Error |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Publik | `201 Created`, `400 Bad Request`, `409 Conflict` |
| `POST` | `/auth/login` | Publik | `200 OK`, `400 Bad Request`, `401 Unauthorized` |
| `POST` | `/auth/refresh` | Publik (Butuh Refresh Token) | `200 OK`, `401 Unauthorized` |
| `POST` | `/auth/logout` | Publik (Butuh Refresh Token) | `204 No Content` |
| `GET` | `/auth/saya` | Wajib Login (`needLogin`) | `200 OK`, `401 Unauthorized` |

### 2. Produk (`/product`)
| Method | URL | Akses | Status Sukses / Error |
| :--- | :--- | :--- | :--- |
| `GET` | `/product` | Wajib Login (`needLogin`) | `200 OK`, `400 Bad Request`, `401 Unauthorized` |
| `GET` | `/product/:id` | Wajib Login (`needLogin`) | `200 OK`, `400 Bad Request`, `401 Unauthorized`, `404 Not Found` |
| `GET` | `/product/:id/reviews` | Wajib Login (`needLogin`) | `200 OK`, `400 Bad Request`, `401 Unauthorized`, `404 Not Found` |
| `POST` | `/product` | Wajib Login + Role `admin` | `201 Created`, `400/401/403/409` |
| `PUT` | `/product/:id` | Wajib Login + Role `admin` | `200 OK`, `400/401/403/404/409` |
| `DELETE` | `/product/:id` | Wajib Login + Role `admin` | `204 No Content`, `400/401/403/404` |

### 3. Pesanan (`/order`)
| Method | URL | Akses | Status Sukses / Error |
| :--- | :--- | :--- | :--- |
| `GET` | `/order` | Wajib Login (`needLogin`) | `200 OK`, `401 Unauthorized` |
| `POST` | `/order` | Wajib Login + Role `admin` | `201 Created`, `400/401/403/404/409` |

## Pengujian

1. **Register Akun Baru (`POST /auth/register`)**
   ![Screenshot Register](./screenshots/01-register.png)
   Pengujian pendaftaran user baru berhasil mengembalikan status `201 Created` beserta data user tanpa menampilkan `passwordHash`.

2. **Login & Mendapatkan Token (`POST /auth/login`)**
   ![Screenshot Login](./screenshots/02-login.png)
   Pengujian login dengan kredensial valid berhasil mengembalikan `accessToken` dan `refreshToken` dengan status `200 OK`.

3. **Akses Profil Sendiri (`GET /auth/saya`)**
   ![Screenshot Saya](./screenshots/03-saya.png)
   Pengujian mengambil data payload token milik user yang sedang login menggunakan header `Authorization: Bearer <accessToken>`.

4. **Akses Daftar Produk dengan Token (`GET /product`)**
   ![Screenshot Get Product](./screenshots/04-get-product.png)
   Pengujian endpoint terproteksi `needLogin` berhasil menampilkan daftar produk beserta metadata paginasi.

5. **Pembaruan Access Token (`POST /auth/refresh`)**
   ![Screenshot Refresh Logout](./screenshots/05-refresh.png)
   Pengujian menukar `refreshToken` menjadi `accessToken` baru.

5. **Logout (`POST /auth/logout`)**
   ![Screenshot Refresh Logout](./screenshots/06-logout.png)
   menghapus sesi token dari database saat logout (`204 No Content`)

## Dua Percobaan

### Percobaan 1: Mengakses Endpoint Terproteksi Tanpa Token (`GET /product`)
![Screenshot Percobaan 1](./screenshots/percobaan-1-tanpa-token.png)
- **Hasil:** Server menolak permintaan dan mengembalikan status `401 Unauthorized`.
- **Penjelasan:** Request dikirim ke `GET /product` tanpa menyertakan header `Authorization: Bearer <token>`. Middleware `needLogin` mendeteksi tidak adanya token yang valid sehingga langsung memutus alur request sebelum masuk ke controller.

### Percobaan 2: User Biasa Mencoba Membuat Produk Baru (`POST /product`)
![Screenshot Percobaan 2](./screenshots/percobaan-2-forbidden-role.png)
- **Hasil:** Server mengembalikan status `403 Forbidden`.
- **Penjelasan:** Request dikirim menggunakan `accessToken` milik akun dengan role `user` (bukan `admin`). Middleware `needLogin` berhasil memverifikasi token, tetapi middleware `needRole('admin')` menolak akses karena role pengguna tidak sesuai dengan hak akses yang diizinkan untuk membuat produk.

## Deklarasi Penggunaan AI

| Bagian | Alat AI | Dipakai untuk apa | Cara saya memeriksa hasilnya |
| :--- | :--- | :--- | :--- |
| Middleware `needLogin` & `needRole` | ChatGPT / Gemini | Referensi struktur pembacaan header `Authorization: Bearer` dan pengecekan role user | Diuji di Postman dengan request tanpa token (`401`) dan role `user` pada route admin (`403`) |
| `auth.service.js` | ChatGPT / Gemini | Contoh implementasi `bcrypt.hash`, `jwt.sign`, dan alur verifikasi refresh token | Diuji alur `register` -> `login` -> `refresh` -> `logout` serta memeriksa isi tabel `User` dan `RefreshToken` di database |
| `README.md` | Gemini | Menyusun struktur dokumentasi proyek sesuai format tugas | Memeriksa kesesuaian daftar endpoint, nama file, dan jawaban pertanyaan konseptual dengan kode proyek |

Pernyataan: **Saya menggunakan AI pada bagian yang tertulis di tabel. Bagian lain saya kerjakan sendiri.**

## Kesimpulan & Kendala

### Jawaban Pertanyaan Konseptual
1. **Kenapa password di-hash, bukan dienkripsi?**
   Enkripsi bersifat dua arah (*reversible*), artinya jika *secret key* enkripsi bocor atau dicuri, penyerang dapat mendekripsi seluruh password pengguna kembali ke bentuk teks asli (*plaintext*). Sebaliknya, *hashing* (seperti `bcrypt` yang digunakan pada proyek ini) bersifat satu arah (*irreversible*) dan dilengkapi *salt*, sehingga password asli tidak dapat dikembalikan dari nilai hash-nya, namun server tetap bisa memverifikasi kecocokan password saat login dengan membandingkan hasil hash.

2. **Kenapa pesan login gagal dibuat sama untuk email tidak terdaftar dan password salah?**
   Pada `auth.service.js`, kedua kondisi tersebut mengembalikan pesan yang sama yaitu `'Incorrect email or password'` (`401 LOGIN_FAILED`). Tujuannya adalah mencegah serangan **User Enumeration**, yaitu teknik di mana penyerang mencoba berbagai alamat email untuk mengetahui email mana saja yang terdaftar di sistem berdasarkan perbedaan pesan error (misalnya *"Email tidak ditemukan"* vs *"Password salah"*).

3. **Apa bedanya halaman/endpoint publik dan wajib login pada proyek ini, serta dari mana server tahu sebuah token sah tanpa menyimpannya?**
   - **Perbedaan akses:** Endpoint publik (seperti `GET /`, `POST /auth/register`, dan `POST /auth/login`) dapat diakses siapa saja tanpa identitas karena tidak melewati middleware `needLogin`. Sebaliknya, endpoint wajib login (seperti `/auth/saya`, `/product`, dan `/order`) diproteksi oleh middleware `needLogin` yang mewajibkan klien mengirimkan token autentikasi yang valid, serta `needRole('admin')` khusus untuk operasi modifikasi data.
   - **Validasi token tanpa menyimpan (*stateless*):** Server tidak menyimpan *access token* di database, melainkan memverifikasinya menggunakan **tanda tangan kriptografi (HMAC signature)** pada JWT. Saat token dibuat dengan `jwt.sign()`, server menandatangani *header* dan *payload* menggunakan `JWT_ACCESS_SECRET`. Ketika klien mengirim kembali token tersebut, server menghitung ulang tanda tangannya menggunakan `JWT_ACCESS_SECRET` yang sama; jika cocok dan waktu kedaluwarsa (`exp`) belum lewat, token dipastikan asli dan tidak dimodifikasi.

### Kendala dan Solusinya
- **Kendala 1:** Saat menguji endpoint `POST /product` dan `POST /order`, terjadi error `403 Forbidden` meskipun sudah berhasil login dan menyertakan Bearer token.
  - **Solusi:** Hal ini terjadi karena default `role` saat registrasi adalah `user`, sedangkan route tersebut membutuhkan `needRole('admin')`. Solusinya adalah memperbarui kolom `role` akun uji menjadi `admin` pada database lalu melakukan login ulang agar *payload* JWT terbaru memuat role `admin`.
- **Kendala 2:** Error validasi atau *unique constraint* Prisma saat mendaftarkan email atau nama produk yang sudah ada sempat mengembalikan error server umum (`500`).
  - **Solusi:** Menambahkan pengecekan duplikasi data terlebih dahulu sebelum proses `create` dan melempar `AppError(409, ...)` sehingga klien menerima respons HTTP `409 Conflict` yang jelas.