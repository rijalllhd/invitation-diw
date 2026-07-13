# Undangan Ulang Tahun (Pink & Lucu 🎀)

Website undangan ulang tahun, siap deploy ke **Vercel** atau **Netlify** (static site, tanpa backend).

## Struktur folder
```
index.html          → isi & teks undangan
style.css            → tampilan (warna, font, animasi)
script.js            → interaksi (tiup lilin, countdown, musik, RSVP)
assets/photos/       → 4 foto placeholder (ganti dengan fotomu)
assets/music.mp3     → BELUM ADA, kamu perlu tambahkan sendiri
```

## Yang WAJIB kamu ganti sebelum publish

### 1. Foto
Ganti 4 file di `assets/photos/photo1.jpg` … `photo4.jpg` dengan foto asli kamu.
Pakai nama file yang sama persis (atau ganti juga path-nya di `index.html`, cari `assets/photos/`).
Rasio persegi (1:1) hasilnya paling rapi.

### 2. Musik backsound
Taruh file mp3 kamu di `assets/music.mp3` (nama file harus persis sama).
Aku nggak bisa menyertakan lagu asli (hak cipta), jadi kamu tinggal drag & drop file mp3 pilihanmu ke folder `assets/`.
Cari musik bebas hak cipta di [Pixabay Music](https://pixabay.com/music/) atau [YouTube Audio Library](https://www.youtube.com/audiolibrary) kalau belum punya.

### 3. Detail acara
Semua teks (nama, tanggal, lokasi, rundown) ada di `index.html` — tinggal cari & ganti teksnya, contoh:
- `Kirana` → nama yang ulang tahun
- `Sabtu, 16 Agustus 2026` → tanggal acara
- `The Pavilion Garden, Jl. Melati No. 8, Bogor` → lokasi
- Bagian `<section id="rundown">` → susunan acara

### 4. Tanggal countdown & nomor WhatsApp
Buka `script.js`, di paling atas ada:
```js
const EVENT_DATE = new Date('2026-08-16T16:00:00+07:00'); // ganti tanggal & jam acara
const WA_NUMBER = '6281234567890'; // ganti nomor WA panitia, format 62xxxxxxxxxx
```

## Cara deploy

### Vercel
1. Push folder ini ke GitHub repo (atau drag-drop langsung).
2. Buka [vercel.com/new](https://vercel.com/new), import repo-nya.
3. Framework preset pilih **Other** (static). Build command & output directory dikosongkan saja.
4. Deploy — selesai.

### Netlify
1. Buka [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag & drop folder ini langsung ke browser.
3. Selesai, langsung online.

## Catatan teknis
- Semua animasi pakai CSS + JS murni (Web Animations API), tanpa library eksternal, jadi loading-nya ringan.
- Font pakai Google Fonts (Fredoka, Quicksand, Caveat) — butuh koneksi internet saat dibuka.
- Musik baru bisa autoplay setelah user tap tombol "tiup lilin" (aturan browser modern, semua browser begini).
- Responsive dari HP kecil sampai layar laptop besar.
