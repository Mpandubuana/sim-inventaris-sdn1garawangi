document.addEventListener("DOMContentLoaded", function () {
  renderDashboardSekretaris();
});

function renderDashboardSekretaris() {
  const data = ambilData();

  // 1. Ambil daftar barang pengadaan yang sudah di-ACC Kepsek tapi belum dikodefikasi
  const siapKodefikasi = data.pengadaan.filter((p) => p.status === "Disetujui");
  const suratSah = data.pengadaan.filter((p) => p.status === "Disetujui" || p.status === "Sudah Dikodefikasi").length;
  const skHapus = data.penghapusan.filter((h) => h.status === "Disetujui").length;

  // Update kartu statistik
  document.getElementById("sek-bast").textContent = data.arsipSurat.length + " Dokumen";
  document.getElementById("sek-pending").textContent = siapKodefikasi.length + " Aset Baru";
  document.getElementById("sek-surat").textContent = suratSah + " Surat";
  document.getElementById("sek-sk").textContent = skHapus + " Dokumen";

  // 2. Isi pilihan dropdown di Form Kodefikasi Aset
  const selectBarang = document.getElementById("asal-barang");
  selectBarang.innerHTML = '<option value="">-- Pilih Barang yang Sudah Disetujui Kepsek --</option>';

  siapKodefikasi.forEach((item) => {
    selectBarang.innerHTML += `
      <option value="${item.id}">${item.namaBarang} (${item.jumlah} Unit - ${item.kategori})</option>
    `;
  });

  // 3. Render Tabel Arsip Dokumen & Berita Acara
  const tbodyArsip = document.getElementById("tabel-arsip");
  tbodyArsip.innerHTML = "";

  data.arsipSurat.forEach((surat) => {
    tbodyArsip.innerHTML += `
      <tr>
        <td><strong>${surat.nomorSurat}</strong></td>
        <td>${surat.tanggal}</td>
        <td>${surat.perihal}</td>
        <td>${surat.sumberDana}</td>
        <td><span class="badge badge-green">${surat.status}</span></td>
        <td>
          <button type="button" onclick="alert('DETAIL BERKAS RESMI\\nNomor: ${surat.nomorSurat}\\nTanggal: ${surat.tanggal}\\nPerihal: ${surat.perihal}\\nStatus: ${surat.status}')" style="padding: 3px 8px; font-size: 0.75rem; background:#2563eb; color:white; border:none; border-radius:4px; cursor:pointer;">
            Lihat Berkas
          </button>
        </td>
      </tr>
    `;
  });
}

// Fungsi Simpan Kodefikasi & Masukkan Otomatis ke Master Aset Sarpras
const formKodefikasi = document.getElementById("form-kodefikasi");
if (formKodefikasi) {
  formKodefikasi.addEventListener("submit", function (e) {
    e.preventDefault();
    const data = ambilData();

    const idPengadaan = document.getElementById("asal-barang").value;
    const kodeBaru = document.getElementById("kode-aset").value.trim();

    const indexPengadaan = data.pengadaan.findIndex((p) => p.id === idPengadaan);
    if (indexPengadaan === -1) {
      alert("Silakan pilih barang yang sudah disetujui Kepala Sekolah terlebih dahulu!");
      return;
    }

    const barangDipilih = data.pengadaan[indexPengadaan];

    // Ubah status pengadaan menjadi Sudah Dikodefikasi
    data.pengadaan[indexPengadaan].status = "Sudah Dikodefikasi";

    // Tambahkan resmi ke Master Data Aset (langsung muncul di dashboard Sarpras & Laporan Kepsek)
    data.aset.push({
      kode: kodeBaru,
      nama: barangDipilih.namaBarang,
      kategori: barangDipilih.kategori,
      jumlah: barangDipilih.jumlah,
      baik: barangDipilih.jumlah,
      rusak: 0,
      lokasi: "Inventaris Baru 2026"
    });

    simpanData(data);
    alert(`✅ Berhasil! "${barangDipilih.namaBarang}" resmi terdaftar dengan kode ${kodeBaru}.`);
    formKodefikasi.reset();
    renderDashboardSekretaris();
  });
}

// Fungsi Buat & Arsip Berita Acara (BAST)
const formBast = document.getElementById("form-bast");
if (formBast) {
  formBast.addEventListener("submit", function (e) {
    e.preventDefault();
    const data = ambilData();

    const selectJenis = document.getElementById("jenis-ba");
    const perihalTeks = selectJenis.options[selectJenis.selectedIndex].text;

    data.arsipSurat.unshift({
      nomorSurat: document.getElementById("nomor-surat").value.trim(),
      tanggal: document.getElementById("tgl-surat").value,
      perihal: perihalTeks,
      sumberDana: "Dana BOS / Inventaris Sekolah",
      status: "Disahkan Kepsek"
    });

    simpanData(data);
    alert("✅ Berita Acara berhasil diterbitkan dan masuk ke arsip!");
    formBast.reset();
    renderDashboardSekretaris();
  });
}