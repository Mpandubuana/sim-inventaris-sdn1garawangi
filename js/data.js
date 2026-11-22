const STORAGE_KEY = "sim_aset_sdn1_garawangi_v2";

const dataAwal = {
  masterKategori: ["Elektronik", "Audio/Visual", "Mebel", "Alat Tulis Kantor"],
  masterLokasi: ["Ruang Kelas 5B", "Lab Komputer", "Ruang Guru", "Kantor TU", "Gudang Sarpras"],

  aset: [
    {
      kode: "INV/SDN1/2025/001",
      nama: "Proyektor Epson EB-X400",
      kategori: "Elektronik",
      lokasi: "Ruang Kelas 5B",
      jumlah: 4,
      baik: 3,
      rusak: 1
    },
    {
      kode: "INV/SDN1/2025/002",
      nama: "Laptop Chromebook Acer",
      kategori: "Elektronik",
      lokasi: "Lab Komputer",
      jumlah: 10,
      baik: 10,
      rusak: 0
    },
    {
      kode: "INV/SDN1/2025/003",
      nama: "Speaker Portable Meeting",
      kategori: "Audio/Visual",
      lokasi: "Ruang Guru",
      jumlah: 2,
      baik: 2,
      rusak: 0
    }
  ],

  kerusakan: [
    {
      id: "KRS-01",
      tanggal: "2026-11-20",
      kodeAset: "INV/SDN1/2025/001",
      namaBarang: "Proyektor Epson EB-X400",
      jumlah: 1,
      tingkat: "Rusak Ringan (Perlu Servis)",
      keterangan: "Lampu proyektor redup saat digunakan mengajar",
      status: "Menunggu Tindak Lanjut"
    }
  ],

  pengadaan: [
    {
      id: "PGD-01",
      tanggal: "2026-11-21",
      pengusul: "Bpk. Ahmad (Admin)",
      namaBarang: "Printer Canon Pixma TS307",
      kategori: "Elektronik",
      jumlah: 1,
      biaya: 1500000,
      alasan: "Penggantian printer administrasi TU yang rusak total",
      status: "Menunggu"
    },
    {
      id: "PGD-02",
      tanggal: "2026-11-18",
      pengusul: "Bpk. Ahmad (Admin)",
      namaBarang: "Meja & Kursi Guru Set",
      kategori: "Mebel",
      jumlah: 3,
      biaya: 2400000,
      alasan: "Penambahan fasilitas ruang guru",
      status: "Disetujui"
    }
  ],

  penyaluranDana: [
    {
      nomorBukti: "421.2/041/KUITANSI-SDN1/2026",
      tanggal: "2026-11-10",
      namaBarang: "Laptop Chromebook Acer (2 Unit)",
      jumlah: 2,
      nominal: 8000000,
      sumberDana: "Dana BOS Reguler",
      penerima: "CV. Mitra Edukasi Kuningan",
      status: "Dana Disalurkan"
    }
  ]
};

function ambilData() {
  const tersimpan = localStorage.getItem(STORAGE_KEY);
  if (!tersimpan) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataAwal));
    return dataAwal;
  }
  return JSON.parse(tersimpan);
}

function simpanData(dataBaru) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dataBaru));
}

function formatRupiah(angka) {
  return "Rp " + Number(angka).toLocaleString("id-ID");
}