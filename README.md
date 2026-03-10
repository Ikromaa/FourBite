# 🍔 FourBite — Food Ordering Web App

FourBite adalah aplikasi web pemesanan makanan full-stack yang terdiri dari **website pelanggan**, **panel admin**, dan **REST API backend**. Dibangun menggunakan React + Vite untuk frontend, Node.js + Express untuk backend, dan MongoDB Atlas sebagai database.

---

## 🌐 Demo

| Layanan | URL |
|---|---|
| 🛍️ Website Pelanggan | https://ikroma.store |
| 🖥️ Panel Admin | https://fourbite-admin.onrender.com |
| ⚙️ Backend API | https://fourbite-backend.onrender.com |

---

## 🧱 Tech Stack

### Frontend (Pelanggan)
| Teknologi | Kegunaan |
|---|---|
| React 19 | UI Library |
| Vite (rolldown) | Build Tool |
| Tailwind CSS v4 | Styling |
| React Router DOM v7 | Routing |
| Framer Motion | Animasi |
| Axios | HTTP Client |
| React Hot Toast | Notifikasi |
| React Icons | Icon Library |

### Admin Panel
| Teknologi | Kegunaan |
|---|---|
| React 19 | UI Library |
| Vite (rolldown) | Build Tool |
| Tailwind CSS v4 | Styling |
| React Router DOM v7 | Routing |
| Axios | HTTP Client |
| React Icons | Icon Library |

### Backend
| Teknologi | Kegunaan |
|---|---|
| Node.js + Express v5 | REST API Server |
| MongoDB Atlas + Mongoose | Database |
| JWT (jsonwebtoken) | Autentikasi |
| Bcrypt | Hash Password |
| Cloudinary | Cloud Image Storage |
| Multer + multer-storage-cloudinary | Upload Gambar |
| Stripe | Pembayaran Online |
| Dotenv | Environment Variables |

---

## 📁 Struktur Project

```
project_sister/
├── backend/                  # REST API Server (Express)
│   ├── config/               # Konfigurasi database
│   ├── controllers/          # Logic handler tiap endpoint
│   │   ├── cartController.js
│   │   ├── itemController.js
│   │   ├── orderController.js
│   │   └── userController.js
│   ├── middleware/           # Auth middleware (JWT)
│   ├── modals/               # Mongoose Schema / Model
│   │   ├── cartModal.js
│   │   ├── itemModal.js
│   │   ├── orderModal.js
│   │   └── userModal.js
│   ├── routes/               # Express Router
│   │   ├── cartRoutes.js
│   │   ├── itemRoute.js
│   │   ├── orderRoutes.js
│   │   └── userRoutes.js
│   ├── .env                  # Environment variables (tidak di-commit)
│   ├── package.json
│   └── server.js             # Entry point server
├── frontend/                 # Website Pelanggan (React + Vite)
│   └── src/
│       ├── pages/            # Halaman: Home, Menu, Cart, Checkout, dll
│       ├── components/       # Komponen reusable
│       ├── cartContext/      # Context API untuk keranjang belanja
│       └── App.jsx
├── admin/                    # Panel Admin (React + Vite)
│   └── src/
│       └── components/       # AddItem, List, Order, Navbar
└── package.json              # Root package (workspace)
```

---

## ✨ Fitur

### 🛍️ Website Pelanggan
- Browse menu makanan berdasarkan kategori
- Keranjang belanja (Cart) dengan Context API
- Checkout dengan isian alamat pengiriman
- Pilihan pembayaran: **COD** atau **Online (Stripe)**
- Verifikasi pembayaran otomatis via Stripe Webhook
- Halaman **My Orders** untuk riwayat pesanan
- Halaman About & Contact

### 🖥️ Panel Admin
- Tambah menu beserta gambar (upload ke Cloudinary)
- Lihat & hapus seluruh daftar menu
- Monitoring semua pesanan masuk
- Update status pesanan (Processing → Out for Delivery → Delivered)

### ⚙️ Backend API
- Register & Login user dengan JWT
- CRUD menu item (dengan upload gambar ke Cloudinary)
- Manajemen keranjang belanja per user
- Buat pesanan + integrasi Stripe Checkout Session
- Konfirmasi pembayaran dari Stripe
- CRUD pesanan (user & admin)

---

## 🔌 API Endpoints

### User
| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| POST | `/api/user/register` | Registrasi user baru | ❌ |
| POST | `/api/user/login` | Login user | ❌ |

### Items (Menu)
| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| GET | `/api/items` | Ambil semua menu | ❌ |
| POST | `/api/items` | Tambah menu + upload gambar | ❌ |
| DELETE | `/api/items/:id` | Hapus menu | ❌ |

### Cart
| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| GET | `/api/cart` | Ambil isi keranjang user | ✅ |
| POST | `/api/cart` | Tambah item ke keranjang | ✅ |
| PUT | `/api/cart/:id` | Update item di keranjang | ✅ |
| DELETE | `/api/cart/:id` | Hapus item dari keranjang | ✅ |

### Orders
| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| POST | `/api/orders` | Buat pesanan baru | ✅ |
| GET | `/api/orders` | Riwayat pesanan user | ✅ |
| GET | `/api/orders/confirm` | Konfirmasi pembayaran Stripe | ✅ |
| GET | `/api/orders/:id` | Detail pesanan | ✅ |
| PUT | `/api/orders/:id` | Update pesanan | ✅ |
| GET | `/api/orders/getall` | Semua pesanan (admin) | ❌ |
| PUT | `/api/orders/getall/:id` | Update status pesanan (admin) | ❌ |

> **Auth ✅** = Memerlukan Bearer Token JWT di header `Authorization`

---

## ⚙️ Cara Menjalankan Secara Lokal

### Prasyarat
- Node.js v18+
- Akun MongoDB Atlas (dengan connection string)
- Akun Cloudinary (untuk upload gambar)
- Akun Stripe (untuk pembayaran online, opsional)

### 1. Clone Repository
```bash
git clone <url-repo>
cd project_sister
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Buat file `.env` di folder `backend/` berisi:
```env
JWT_SECRET=your_jwt_secret

# App & Database
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:4000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/PemWeb

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe (opsional)
STRIPE_SECRET_KEY=sk_test_xxx
```

Jalankan backend:
```bash
npm start
```
Server berjalan di `http://localhost:4000`

### 3. Setup Frontend (Pelanggan)
```bash
cd frontend
npm install
npm run dev
```
Berjalan di `http://localhost:5173`

### 4. Setup Admin Panel
```bash
cd admin
npm install
npm run dev
```
Berjalan di `http://localhost:5174`

---

## ☁️ Deployment (Render)

Project ini di-deploy di **Render** dengan 3 service terpisah:

| Service | Folder | Tipe |
|---|---|---|
| `fourbite-backend` | `backend/` | Web Service (Node.js) |
| `fourbite-frontend` | `frontend/` | Static Site |
| `fourbite-admin` | `admin/` | Static Site |

### Environment Variables di Render (Backend)
Tambahkan di **Render → fourbite-backend → Environment**:
```
MONGODB_URI
JWT_SECRET
FRONTEND_URL
BACKEND_URL
STRIPE_SECRET_KEY
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

> ⚠️ **Penting:** File gambar **tidak boleh** disimpan di server Render karena filesystem-nya bersifat ephemeral (hilang setiap redeploy). Pastikan selalu menggunakan Cloudinary untuk penyimpanan gambar.

---

## 🗃️ Database Schema

### User
```
username    String  required
email       String  required, unique
password    String  required (di-hash dengan bcrypt)
```

### Item (Menu)
```
name        String  required, unique
description String  required
category    String  required
price       Number  required
rating      Number  default 0
hearts      Number  default 0
total       Number  default 0
imageUrl    String  (URL Cloudinary)
```

### Order
```
user            ObjectId (ref: User)
firstName/lastName/email/phone  String
address/city/zipCode            String
items           [{ item: {name, price, imageUrl}, quantity }]
paymentMethod   enum: cod | online | card | upi
paymentStatus   enum: pending | completed | failed
status          enum: processing | outForDelivery | delivered
subTotal/tax/shipping/total     Number
sessionId/paymentIntentId       String (Stripe)
```

---

## 📦 Branches

| Branch | Keterangan |
|---|---|
| `main` | Production — branch utama yang di-deploy |
| `feature/cloudinary-upload` | Migrasi image storage ke Cloudinary (sudah di-merge) |

---

## 👤 Author

Dibuat sebagai **Tugas Akhir Pemrograman Web** — Semester 7
