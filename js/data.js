// Kunci utama penyimpanan di browser
const STORAGE_KEY = "sim_aset_sdn1_garawangi";

// 1. Data Awal (Seed Data) agar tabel tidak kosong saat pertama kali dibuka
const dataAwal = {
  // Daftar Master Aset Sekolah
  aset: [
    {
      kode: "INV/SDN1/2025/001",
      nama: "Proyektor Epson EB-X400",
      kategori: "Elektronik",
      jumlah: 4,
      baik: 3,
      rusak: 1,
      lokasi: "Ruang Kelas 5B & Gudang"
    },
    {
      kode: "INV/SDN1/2025/002",
      nama: "Laptop Chromebook Acer",
      kategori: "Elektronik",
      jumlah: 10,
      baik: 10,
      rusak: 0,
      lokasi: "Lab Komputer"
    },
    {
      kode: "INV/SDN1/2025/003",
      nama: "Speaker Portable Meeting",
      kategori: "Audio/Visual",
      jumlah: 2,
      baik: 2,
      rusak: 0,
      lokasi: "Ruang Guru"
    }
  ],

  // Daftar Usulan Pengadaan (Dari Sarpras -> Kepsek -> Sekretaris)
  pengadaan: [
    {
      id: "PGD-01",
      tanggal: "2026-11-04",
      pengusul: "Bpk. Ahmad (Sarpras)",
      namaBarang: "Printer Canon Pixma TS307",
      kategori: "Elektronik",
      jumlah: 1,
      biaya: 1500000,
      alasan: "Penggantian printer administrasi kantor yang rusak berat",
      status: "Menunggu" // Pilihan: Menunggu | Disetujui | Ditolak | Sudah Dikodefikasi
    },
    {
      id: "PGD-02",
      tanggal: "2026-11-02",
      pengusul: "Bpk. Ahmad (Sarpras)",
      namaBarang: "Meja & Kursi Guru Set",
      kategori: "Mebel",
      jumlah: 3,
      biaya: 2400000,
      alasan: "Penambahan fasilitas ruang kelas baru",
      status: "Disetujui" // Sudah di-ACC Kepsek, siap dikodefikasi Sekretaris
    }
  ],

  // Daftar Usulan Penghapusan Aset Rusak Berat (Sarpras -> Kepsek)
  penghapusan: [
    {
      id: "HPS-01",
      kodeAset: "INV/SDN1/2021/089",
      namaBarang: "Proyektor InFocus IN112",
      jumlah: 1,
      kondisi: "Mati Total / Lampu Putus",
      keterangan: "Biaya perbaikan melebihi harga unit baru",
      status: "Menunggu" // Pilihan: Menunggu | Disetujui | Ditolak
    }
  ],

  // Daftar Arsip Berita Acara (Dikelola Sekretaris)
  arsipSurat: [
    {
      nomorSurat: "421.2/041/BAST-SDN1/2026",
      tanggal: "2026-10-15",
      perihal: "BAST Pengadaan 10 Unit Laptop Chromebook",
      sumberDana: "Hibah Kemendikbud",
      status: "Disahkan Kepsek"
    },
    {
      nomorSurat: "421.2/043/BAST-SDN1/2026",
      tanggal: "2026-11-01",
      perihal: "BAST Pembelian Proyektor Epson EB-X400",
      sumberDana: "Dana BOS",
      status: "Disahkan Kepsek"
    }
  ]
};

// 2. Fungsi Mengambil Data dari Browser
function ambilData() {
  const tersimpan = localStorage.getItem(STORAGE_KEY);
  if (!tersimpan) {
    // Jika belum ada data di browser, isi dengan dataAwal
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataAwal));
    return dataAwal;
  }
  return JSON.parse(tersimpan);
}

// 3. Fungsi Menyimpan Perubahan Data ke Browser
function simpanData(dataBaru) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dataBaru));
}

// 4. Fungsi Reset Data (Sangat berguna saat latihan atau sebelum presentasi ke dosen)
function resetDataDemo() {
  if (confirm("Kembalikan semua data simulasi ke kondisi awal?")) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataAwal));
    window.location.reload();
  }
}

// 5. Helper Format Angka ke Rupiah
function formatRupiah(angka) {
  return "Rp " + Number(angka).toLocaleString("id-ID");
}