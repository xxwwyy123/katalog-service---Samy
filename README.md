# 📦 Samy - Katalog Service

Bagian ini dikerjakan oleh **Samy (Peserta 1)** yang bertindak sebagai mikroservis pengelola katalog produk, kategori, manajemen inventaris stok, serta mekanisme *Two-Phase Reservation* (`reserve`, `release`, `commit`).

---

## 🎯 Tanggung Jawab
- **Manajemen Produk**: Menyimpan data produk, kategori, harga, dan ketersediaan stok.
- **Konsistensi Data Stok**: Mencegah race condition melalui sistem reservasi stok sebelum transaksi pembayaran dinyatakan berhasil.
- **Operasi Stok Terdistribusi**:
  - `POST /products/:id/reserve` &rarr; Mengunci stok sementara saat pesanan dibuat.
  - `POST /products/:id/release` &rarr; Membatalkan reservasi (kompensasi jika pembayaran gagal).
  - `POST /products/:id/commit` &rarr; Memotong stok secara permanen setelah pembayaran sukses.

---

## 🛠️ Cara Menjalankan Secara Mandiri (Lokal)

```bash
# 1. Masuk ke folder
cd Samy-katalog-service

# 2. Install dependensi
npm install

# 3. Jalankan service (Port: 3001)
npm start
```

---

## 🌐 Daftar Endpoint API

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/health` | Cek status operasional service |
| `GET` | `/products` | Mengambil seluruh daftar produk |
| `GET` | `/products/:id` | Mengambil detail produk tertentu |
| `POST` | `/products` | Menambahkan produk baru |
| `POST` | `/products/:id/reserve` | Mengunci sejumlah stok |
| `POST` | `/products/:id/release` | Membatalkan penguncian stok |
| `POST` | `/products/:id/commit` | Mengurangi stok permanen |
