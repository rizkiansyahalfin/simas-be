# simas-be

Backend untuk Sistem Informasi Manajemen Masjid.

## Deskripsi

`SIMAS-BE` adalah backend API yang dibangun menggunakan Node.js, Express, Prisma, dan PostgreSQL. Aplikasi ini menyediakan fitur donasi, otentikasi, manajemen keuangan, dan jadwal Jumat.

## Fitur Utama

- Submit donasi dengan upload bukti pembayaran
- Verifikasi dan penolakan donasi oleh bendahara / superadmin
- Manajemen transaksi kas dan ZIS
- Ringkasan keuangan masjid
- Otentikasi JWT
- Middleware RBAC untuk kontrol akses per peran
- Jadwal Jumat (Jumat Schedule)

## Struktur Folder Utama

- `src/app.ts` - konfigurasi Express, middleware, dan routing utama
- `src/server.ts` - entry point server
- `src/modules/` - modul fitur aplikasi
- `src/middleware/` - middleware otentikasi, RBAC, dan upload
- `src/prisma/` - file schema Prisma dan seed
- `src/database.ts` - konfigurasi Prisma dengan PostgreSQL

## Instalasi

1. Clone repository
2. Install dependency:
   ```bash
   npm install
   ```
3. Buat file environment `.env` dan siapkan variabel berikut:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `GMAIL_USER` (opsional untuk email)
   - `GMAIL_APP_PASSWORD` (opsional untuk email)
4. Jalankan generate Prisma:
   ```bash
   npm run prisma:generate
   ```
5. Jalankan migrasi (jika diperlukan):
   ```bash
   npm run prisma:migrate
   ```
6. Jalankan seed data (opsional):
   ```bash
   npm run prisma:seed
   ```

## Menjalankan Aplikasi

- Mode development:
  ```bash
  npm run dev
  ```
- Build production:
  ```bash
  npm run build
  ```
- Jalankan hasil build:
  ```bash
  npm start
  ```

## Variabel Lingkungan (Environment Variables)

- `PORT` - port server (default: `3000`)
- `DATABASE_URL` - koneksi PostgreSQL
- `JWT_SECRET` - kunci untuk JWT
- `GMAIL_USER` - email pengirim (untuk email notifikasi)
- `GMAIL_APP_PASSWORD` - password aplikasi Gmail

## Endpoint yang Aktif Saat Ini

### Donasi

Base URL: `/api/donations`

1. `POST /api/donations`
   - Submit donasi publik dengan upload bukti
   - Form-data fields:
     - `donorName` (string, minimal 3 karakter)
     - `phone` (string, opsional)
     - `amount` (number, > 0)
     - `category` (string)
     - `proof` (file image: jpeg/png/webp, maksimal 5MB)
   - Response: data donasi baru

2. `GET /api/donations`
   - Hanya untuk user terotentikasi dengan role `bendahara` atau `superadmin`
   - Query optional:
     - `status` = `pending` | `verified` | `rejected`
     - `page` = nomor halaman
     - `limit` = jumlah data per halaman

3. `PUT /api/donations/:id/verify`
   - Verifikasi donasi berdasarkan ID
   - Hanya untuk role `bendahara` atau `superadmin`

4. `PUT /api/donations/:id/reject`
   - Menolak donasi berdasarkan ID
   - Request body:
     - `note` (string, minimal 5 karakter)
   - Hanya untuk role `bendahara` atau `superadmin`

## Router Tambahan yang Terdapat di Kode

Kode juga memiliki struktur route tambahan di file `src/routes/index.ts`, yaitu:

- `/finance` - route keuangan (cash, ZIS, summary)
- `/auth` - route otentikasi dan user
- `/jumat-schedules` - route jadwal Jumat

> Catatan: saat ini `src/app.ts` hanya memasang route `api/donations`. Jika ingin mengaktifkan route tambahan, perlu memasang `src/routes/index.ts` ke `app`.

## Detail Fitur Tambahan di Kode

### Otentikasi

- `POST /auth/login` (tersedia di `src/modules/auth/auth.route.ts`)
- Validasi login menggunakan `email` dan `password`
- JWT berlaku 8 jam
- Middleware `authMiddleware` memeriksa header `Authorization: Bearer <token>`

### RBAC

- Middleware `rbacMiddleware(...)` membatasi akses berdasarkan role
- Role yang tersedia di Prisma:
  - `superadmin`
  - `bendahara`
  - `admin_kegiatan`
  - `admin_inventaris`

### Upload

- Upload file disimpan ke folder `src/uploads/donations`
- Format yang diterima: `image/jpeg`, `image/png`, `image/webp`
- Batas maksimal file bukti donasi: 5MB

## Teknologi Utama

- Node.js + Express
- Prisma ORM
- PostgreSQL
- Zod untuk validasi
- JWT untuk otentikasi
- Multer untuk upload file
- Helmet dan CORS untuk keamanan

## Update Terbaru

### Modul Prayer (Jadwal Sholat)

Modul baru untuk mengelola jadwal sholat dengan integrasi API eksternal.

#### Fitur:
- Pengambilan jadwal sholat otomatis dari API eksternal (Kemenag)
- Penyimpanan jadwal sholat ke database
- Endpoint untuk mendapatkan jadwal berdasarkan tanggal dan kota
- Konfigurasi kota dan status sinkronisasi
- Cron job untuk sinkronisasi harian pukul 5 pagi WIB

#### Endpoint:
- `GET /prayer` - Mendapatkan jadwal sholat
  - Query parameters:
    - `date` (required) - Format: YYYY-MM-DD
    - `city` (optional) - Default: Jakarta
- `PUT /prayer/config` - Update konfigurasi prayer
  - Request body:
    - `city` (string, optional)
    - `enabled` (boolean, optional)

#### Variabel Lingkungan:
- `PRAYER_CITY` - Kota default untuk jadwal sholat (default: "Jakarta")
- `PRAYER_SYNC_ENABLED` - Aktifkan/nonaktifkan sinkronisasi otomatis (default: false)

### Brute Force Protection

Middleware baru untuk mencegah serangan brute force pada endpoint login.

#### Fitur:
- Rate limiting menggunakan express-rate-limit
- Konfigurasi maksimal percobaan login dalam jangka waktu tertentu
- Skip rate limit untuk request yang berhasil
- Response khusus untuk rate limit exceeded

#### Konfigurasi:
File: `src/config/security.config.ts`

Variabel Lingkungan:
- `BRUTE_FORCE_ENABLED` - Aktifkan brute force protection (default: false)
- `BRUTE_FORCE_MAX` - Maksimal percobaan dalam window (default: 5, range: 1-50)
- `BRUTE_FORCE_WINDOW` - Window waktu dalam menit (default: 15, range: 1-1440)

#### Penggunaan:
Middleware `bruteForceMiddleware` dapat dipasang pada route login atau endpoint sensitif lainnya.

## Catatan Tambahan

- Database diakses melalui `src/database.ts`
- Prisma client di-generate ke folder `generated`
- `src/routes/index.ts` menyiapkan beberapa route tambahan, tapi belum dipasang di entry `src/app.ts`

---

Dokumentasi ini ditulis ulang berdasarkan kode yang ada dan struktur route saat ini.
