document.addEventListener("DOMContentLoaded", function () {
  renderDashboardKepsek();

  // Aktifkan filter otomatis pada bagian laporan
  document.getElementById("filter-kategori").addEventListener("change", renderLaporanKepsek);
  document.getElementById("filter-kondisi").addEventListener("change", renderLaporanKepsek);
});

function renderDashboardKepsek() {
  const data = ambilData();

  // 1. Hitung statistik ringkasan Kepala Sekolah
  let totalAset = 0;
  let totalBaik = 0;

  data.aset.forEach((item) => {
    totalAset += Number(item.jumlah);
    totalBaik += Number(item.baik);
  });

  const persenBaik = totalAset > 0 ? ((totalBaik / totalAset) * 100).toFixed(1) : 0;
  const pendingPengadaan = data.pengadaan.filter((p) => p.status === "Menunggu").length;
  const pendingHapus = data.penghapusan.filter((h) => h.status === "Menunggu").length;

  document.getElementById("kepsek-total").textContent = totalAset + " Unit";
  document.getElementById("kepsek-pending").textContent = pendingPengadaan + " Usulan";
  document.getElementById("kepsek-hapus").textContent = pendingHapus + " Barang";
  document.getElementById("kepsek-baik").textContent = persenBaik + "%";

  // 2. Render Tabel Persetujuan Pengadaan Barang Baru
  const tbodyPengadaan = document.getElementById("tabel-acc-pengadaan");
  tbodyPengadaan.innerHTML = "";

  data.pengadaan.forEach((item, index) => {
    let kolomKeputusan = "";
    if (item.status === "Menunggu") {
      kolomKeputusan = `
        <button type="button" onclick="prosesPengadaan(${index}, 'Disetujui')" style="padding: 4px 10px; background:#22c55e; color:white; border:none; border-radius:4px; cursor:pointer;">Setujui</button>
        <button type="button" onclick="prosesPengadaan(${index}, 'Ditolak')" style="padding: 4px 10px; background:#ef4444; color:white; border:none; border-radius:4px; cursor:pointer;">Tolak</button>
      `;
    } else {
      const badgeClass = item.status === "Ditolak" ? "badge-red" : "badge-green";
      kolomKeputusan = `<span class="badge ${badgeClass}">${item.status}</span>`;
    }

    tbodyPengadaan.innerHTML += `
      <tr>
        <td>${item.tanggal}</td>
        <td>${item.pengusul}</td>
        <td><strong>${item.namaBarang}</strong></td>
        <td>${item.kategori}</td>
        <td>${item.jumlah} Unit</td>
        <td>${formatRupiah(item.biaya)}</td>
        <td>${item.alasan}</td>
        <td>${kolomKeputusan}</td>
      </tr>
    `;
  });

  // 3. Render Tabel Persetujuan Penghapusan Aset Rusak
  const tbodyHapus = document.getElementById("tabel-acc-penghapusan");
  tbodyHapus.innerHTML = "";

  data.penghapusan.forEach((item, index) => {
    let kolomTindakan = "";
    if (item.status === "Menunggu") {
      kolomTindakan = `
        <button type="button" onclick="prosesPenghapusan(${index}, 'Disetujui')" style="padding: 4px 10px; background:#22c55e; color:white; border:none; border-radius:4px; cursor:pointer;">Setujui Penghapusan</button>
        <button type="button" onclick="prosesPenghapusan(${index}, 'Ditolak')" style="padding: 4px 10px; background:#64748b; color:white; border:none; border-radius:4px; cursor:pointer;">Tolak</button>
      `;
    } else {
      const badgeClass = item.status === "Ditolak" ? "badge-red" : "badge-green";
      kolomTindakan = `<span class="badge ${badgeClass}">${item.status}</span>`;
    }

    tbodyHapus.innerHTML += `
      <tr>
        <td>${item.kodeAset}</td>
        <td><strong>${item.namaBarang}</strong></td>
        <td>${item.jumlah} Unit</td>
        <td><span class="badge badge-red">${item.kondisi}</span></td>
        <td>${item.keterangan}</td>
        <td>${kolomTindakan}</td>
      </tr>
    `;
  });

  renderLaporanKepsek();
}

// Fungsi Setujui / Tolak Pengadaan
function prosesPengadaan(index, keputusan) {
  const data = ambilData();
  data.pengadaan[index].status = keputusan;
  simpanData(data);
  renderDashboardKepsek();
}

// Fungsi Setujui / Tolak Penghapusan
function prosesPenghapusan(index, keputusan) {
  const data = ambilData();
  data.penghapusan[index].status = keputusan;
  simpanData(data);
  renderDashboardKepsek();
}

// Fungsi Filter & Tampilkan Tabel Laporan
function renderLaporanKepsek() {
  const data = ambilData();
  const kategoriDipilih = document.getElementById("filter-kategori").value.toLowerCase();
  const kondisiDipilih = document.getElementById("filter-kondisi").value;

  const tbodyLaporan = document.getElementById("tabel-laporan-kepsek");
  tbodyLaporan.innerHTML = "";

  const hasilFilter = data.aset.filter((item) => {
    const cocokKategori = kategoriDipilih === "semua" || item.kategori.toLowerCase().includes(kategoriDipilih);
    const cocokKondisi =
      kondisiDipilih === "semua" ||
      (kondisiDipilih === "baik" && item.baik > 0) ||
      (kondisiDipilih === "rusak" && item.rusak > 0);
    return cocokKategori && cocokKondisi;
  });

  hasilFilter.forEach((item) => {
    tbodyLaporan.innerHTML += `
      <tr>
        <td>${item.kode}</td>
        <td>${item.nama}</td>
        <td>${item.kategori}</td>
        <td>${item.jumlah} Unit</td>
        <td>${item.baik}</td>
        <td>${item.rusak}</td>
      </tr>
    `;
  });
}