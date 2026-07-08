# Financial System — Frontend

Frontend SPA untuk sistem pencatatan keuangan sederhana yang dibangun menggunakan **React 19**, **TypeScript**, dan **Vite**. Terhubung ke backend Laravel REST API melalui Axios.

---

## Tech Stack

| Teknologi | Versi | Kegunaan |
|---|---|---|
| React | 19 | UI Framework |
| TypeScript | 6 | Type safety |
| Vite | 8 | Build tool & dev server |
| Tailwind CSS | 4 | Styling |
| React Router DOM | 7 | Client-side routing |
| TanStack React Query | 5 | Server state & data fetching |
| TanStack React Table | 8 | Tabel dengan sorting |
| React Hook Form | 7 | Form management |
| Zod | 4 | Schema validasi form |
| Zustand | 5 | Client state (auth) |
| Axios | 1 | HTTP client |
| Sonner | 2 | Toast notifications |
| Lucide React | — | Icon library |

---

## Fitur

### Autentikasi
- Register akun baru
- Login dengan email & password
- Logout
- Protected routes (redirect ke login jika belum autentikasi)
- Token disimpan via Zustand persist ke localStorage

### Pengelolaan Nomor Akun
- Menampilkan daftar akun dengan tabel sortable
- Tambah akun baru
- Edit akun
- Hapus akun
- Pilih tipe akun: Asset, Liability, Equity, Revenue, Expense
- Toggle status aktif / non-aktif
- Pilih akun induk (parent account)
- Kode akun digenerate otomatis oleh sistem (BE)

### Pencatatan Transaksi
- Input transaksi: tanggal, deskripsi, akun, tipe entri (debit/kredit), jumlah
- Daftar transaksi dengan tabel sortable
- Filter berdasarkan tanggal dan nama akun

### Ringkasan Keuangan
- Menampilkan total saldo per akun
- Dikelompokkan berdasarkan tipe akun
- Mendukung nilai saldo negatif

---

## Arsitektur

Aplikasi ini menggunakan pendekatan **React SPA** yang terhubung ke **Laravel REST API**.

```
┌─────────────────────────────────────┐
│           React SPA (Vite)          │
│                                     │
│  ┌──────────┐    ┌───────────────┐  │
│  │  Router  │───▶│     Pages     │  │
│  └──────────┘    └───────┬───────┘  │
│                          │          │
│  ┌──────────┐    ┌───────▼───────┐  │
│  │  Zustand │    │ React Query   │  │
│  │ (Auth)   │    │ (Server State)│  │
│  └──────────┘    └───────┬───────┘  │
│                          │          │
│                  ┌───────▼───────┐  │
│                  │  Axios Client │  │
│                  └───────┬───────┘  │
└──────────────────────────┼──────────┘
                           │ HTTP / Bearer Token
┌──────────────────────────▼──────────┐
│        Laravel REST API (BE)        │
│         + PostgreSQL + Docker       │
└─────────────────────────────────────┘
```

---

## Struktur Project

```text
src/
├── api/
│   └── axios.ts              # Axios instance + Bearer token interceptor
├── components/
│   ├── layout/
│   │   └── AppLayout.tsx     # Sidebar + main layout
│   └── shared/
│       └── DataTable.tsx     # Reusable TanStack Table component
├── config/
│   └── env.ts                # Environment variable helper
├── pages/
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── accounts/
│   │   ├── AccountListPage.tsx
│   │   └── AccountFormPage.tsx
│   ├── transactions/
│   │   ├── TransactionListPage.tsx
│   │   └── TransactionFormPage.tsx
│   └── summary/
│       └── SummaryPage.tsx
├── router/
│   ├── index.tsx             # Route definitions
│   └── ProtectedRoute.tsx    # Auth guard
├── store/
│   └── authStore.ts          # Zustand auth store (persist)
├── types/
│   ├── auth.types.ts
│   ├── account.types.ts
│   └── transaction.types.ts
├── App.tsx
└── main.tsx
```

---

## Cara Menjalankan

### Prasyarat

- Node.js >= 18
- Backend (`finance-be`) sudah berjalan di `http://localhost:8000`

### Clone Project

```bash
git clone https://github.com/ROFL1ST/finance-fe
cd finance-fe
```

### Install Dependencies

```bash
npm install
```

### Konfigurasi Environment

```bash
cp .env.example .env
```

Sesuaikan URL backend di `.env`:

```env
VITE_API_URL=http://localhost:8000/api
```

### Jalankan Dev Server

```bash
npm run dev
```

Buka browser di:

```
http://localhost:5173
```

---

## Build Production

```bash
npm run build
```

Output akan ada di folder `dist/`. Preview hasil build:

```bash
npm run preview
```

---

## Menjalankan Bersama Backend (Docker)

Pastikan `finance-be` sudah berjalan:

```bash
# Di folder finance-be
docker compose up --build
docker compose exec backend php artisan migrate
```

Kemudian jalankan frontend:

```bash
# Di folder finance-fe
npm install
npm run dev
```

Akses aplikasi di `http://localhost:5173`. Backend berjalan di `http://localhost:8000`.

---

## Konfigurasi Environment

| Variable | Default | Keterangan |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8000/api` | Base URL Laravel API |

---

## Koneksi ke Backend

Semua request HTTP dikirim melalui `src/api/axios.ts`. Token autentikasi dari Zustand store otomatis ditambahkan ke header setiap request:

```
Authorization: Bearer <token>
```

Token didapat dari response login BE (Laravel Sanctum) dan disimpan di localStorage via Zustand persist.

---

## Related Repository

- Backend: [finance-be](https://github.com/ROFL1ST/finance-be) — Laravel 13 + PostgreSQL + Docker

---

## Author

Muhamad Danendra Prawiraamijoyo
