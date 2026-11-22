document.addEventListener("DOMContentLoaded", function () {
  renderDashboardKepsek();
  document.getElementById("filter-kategori").addEventListener("change", renderLaporanKepsek);
  document.getElementById("filter-kondisi").addEventListener("change", renderLaporanKepsek);
});

function renderDashboardKepsek() {
  const data = ambilData();

  // 1. Hitung Statistik
  let totalAset = 0;
  let totalBaik = 0;
  data.aset.forEach((item) => {
    totalAset += Number(item.jumlah);
    totalBaik += Number(item.baik);
  });

  const persenBaik = totalAset > 0 ? ((totalBaik / totalAset) * 100).toFixed(1) : 0;
  const pendingPengadaan = data.pengadaan.filter((p) => p.status === "Menunggu").length;
  const pendingKerusakan = data.kerusakan.filter((k) => k.status === "Menunggu Tindak Lanjut").length;

  document.getElementById("kepsek-total").textContent = totalAset + " Unit";
  document.getElementById("kepsek-pending").textContent = pendingPengadaan + " Menunggu";
  document.getElementById("kepsek-hapus").textContent = pendingKerusakan + " Menunggu";
  document.getElementById("kepsek-baik").textContent = persenBaik + "%";

  // 2. Render Tabel Persetujuan Pembelian
  const tbodyPengadaan = document.getElementById("tabel-acc-pengadaan");
  tbodyPengadaan.innerHTML = "";
  data.pengadaan.forEach((item, index) => {
    let kolomKeputusan = "";
    if (item.status === "Menunggu") {
      kolomKeputusan = `
        <button type="button" onclick="prosesPengadaan(${index}, 'Disetujui')" style="padding: 4px 10px; background: var(--accent-bg); color: var(--accent-text); border: none; border-radius: 4px; cursor: pointer;">Setujui</button>
        <button type="button" onclick="prosesPengadaan(${index}, 'Ditolak')" style="padding: 4px 10px; background: #dc2626; color: white; border: none; border-radius: 4px; cursor: pointer;">Tolak</button>
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

  // 3. Render Tabel Tindak Lanjut Laporan Kerusakan
  const tbodyRusak = document.getElementById("tabel-acc-penghapusan");
  tbodyRusak.innerHTML = "";
  data.kerusakan.forEach((item, index) => {
    let kolomTindakan = "";
    if (item.status === "Menunggu Tindak Lanjut") {
      kolomTindakan = `
        <button type="button" onclick="tindakLanjutKerusakan(${index}, 'perbaikan')" style="padding: 4px 8px; font-size: 0.75rem; background: var(--accent-bg); color: var(--accent-text); border: none; border-radius: 4px; cursor: pointer;">ACC Perbaikan</button>
        <button type="button" onclick="tindakLanjutKerusakan(${index}, 'penghapusan')" style="padding: 4px 8px; font-size: 0.75rem; background: #52525b; color: white; border: none; border-radius: 4px; cursor: pointer;">ACC Penghapusan</button>
        <button type="button" onclick="tindakLanjutKerusakan(${index}, 'tolak')" style="padding: 4px 8px; font-size: 0.75rem; background: #dc2626; color: white; border: none; border-radius: 4px; cursor: pointer;">Tolak</button>
      `;
    } else {
      const badgeClass = item.status === "Ditolak" ? "badge-red" : "badge-green";
      kolomTindakan = `<span class="badge ${badgeClass}">${item.status}</span>`;
    }

    tbodyRusak.innerHTML += `
      <tr>
        <td>${item.tanggal}</td>
        <td>${item.kodeAset}</td>
        <td><strong>${item.namaBarang}</strong></td>
        <td>${item.jumlah} Unit</td>
        <td><span class="badge badge-yellow">${item.tingkat}</span></td>
        <td>${item.keterangan}</td>
        <td>${kolomTindakan}</td>
      </tr>
    `;
  });

  // 4. Isi Filter Kategori secara dinamis dari Data Master
  const selKategori = document.getElementById("filter-kategori");
  const pilihanSebelumnya = selKategori.value || "semua";
  selKategori.innerHTML = `<option value="semua">-- Semua Kategori --</option>`;
  data.masterKategori.forEach((kat) => {
    selKategori.innerHTML += `<option value="${kat.toLowerCase()}">${kat}</option>`;
  });
  selKategori.value = pilihanSebelumnya;

  renderLaporanKepsek();
}

function prosesPengadaan(index, keputusan) {
  const data = ambilData();
  data.pengadaan[index].status = keputusan;
  simpanData(data);
  renderDashboardKepsek();
}

function tindakLanjutKerusakan(index, aksi) {
  const data = ambilData();
  const laporan = data.kerusakan[index];
  const asetTerkait = data.aset.find((a) => a.kode === laporan.kodeAset);

  if (aksi === "perbaikan") {
    laporan.status = "Disetujui (Diperbaiki)";
    if (asetTerkait) {
      asetTerkait.rusak = Math.max(0, asetTerkait.rusak - laporan.jumlah);
      asetTerkait.baik += laporan.jumlah;
    }
  } else if (aksi === "penghapusan") {
    laporan.status = "Disetujui (Dihapus)";
    if (asetTerkait) {
      asetTerkait.rusak = Math.max(0, asetTerkait.rusak - laporan.jumlah);
      asetTerkait.jumlah = Math.max(0, asetTerkait.jumlah - laporan.jumlah);
    }
  } else {
    laporan.status = "Ditolak";
  }

  simpanData(data);
  renderDashboardKepsek();
}

function renderLaporanKepsek() {
  const data = ambilData();
  const kategoriDipilih = document.getElementById("filter-kategori").value.toLowerCase();
  const kondisiDipilih = document.getElementById("filter-kondisi").value;

  const tbodyLaporan = document.getElementById("tabel-laporan-kepsek");
  tbodyLaporan.innerHTML = "";

  const hasilFilter = data.aset.filter((item) => {
    const cocokKategori = kategoriDipilih === "semua" || item.kategori.toLowerCase() === kategoriDipilih;
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
        <td>${item.lokasi}</td>
        <td>${item.jumlah} Unit</td>
        <td>${item.baik}</td>
        <td>${item.rusak}</td>
      </tr>
    `;
  });
}