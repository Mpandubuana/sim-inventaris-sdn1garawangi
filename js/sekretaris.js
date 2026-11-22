document.addEventListener("DOMContentLoaded", function () {
  renderDashboardSekretaris();
});

function renderDashboardSekretaris() {
  const data = ambilData();

  // 1. Hitung Statistik
  const siapSalur = data.pengadaan.filter((p) => p.status === "Disetujui");
  let totalAnggaran = 0;
  data.penyaluranDana.forEach((d) => {
    totalAnggaran += Number(d.nominal);
  });

  let totalAset = 0;
  data.aset.forEach((a) => {
    totalAset += Number(a.jumlah);
  });

  document.getElementById("sek-siap").textContent = siapSalur.length + " Pengajuan";
  document.getElementById("sek-selesai").textContent = data.penyaluranDana.length + " Transaksi";
  document.getElementById("sek-nominal").textContent = formatRupiah(totalAnggaran);
  document.getElementById("sek-aset").textContent = totalAset + " Unit";

  // 2. Isi Dropdown Pengajuan yang Sudah Disetujui Kepsek
  const selPengadaan = document.getElementById("pilih-pengadaan");
  selPengadaan.innerHTML = `<option value="">-- Pilih Pengajuan yang Disetujui Kepala Sekolah --</option>`;
  data.pengadaan.forEach((p, idx) => {
    if (p.status === "Disetujui") {
      selPengadaan.innerHTML += `<option value="${idx}">${p.namaBarang} (${p.jumlah} Unit) - ${formatRupiah(p.biaya)}</option>`;
    }
  });

  // 3. Render Tabel Riwayat Penyaluran Dana
  const tbody = document.getElementById("tabel-penyaluran");
  tbody.innerHTML = "";
  data.penyaluranDana.forEach((item) => {
    tbody.innerHTML += `
      <tr>
        <td><strong>${item.nomorBukti}</strong></td>
        <td>${item.tanggal}</td>
        <td>${item.namaBarang}</td>
        <td>${item.jumlah} Unit</td>
        <td><strong>${formatRupiah(item.nominal)}</strong></td>
        <td>${item.sumberDana}</td>
        <td>${item.penerima}</td>
        <td><span class="badge badge-green">${item.status}</span></td>
      </tr>
    `;
  });
}

// Proses Menyalurkan Dana Pembelian
document.getElementById("form-penyaluran").addEventListener("submit", function (e) {
  e.preventDefault();
  const data = ambilData();
  const idxVal = document.getElementById("pilih-pengadaan").value;

  if (idxVal === "") {
    alert("⚠️ Pilih pengajuan pembelian yang sudah disetujui terlebih dahulu.");
    return;
  }

  const itemPengadaan = data.pengadaan[Number(idxVal)];
  itemPengadaan.status = "Dana Disalurkan";

  data.penyaluranDana.push({
    nomorBukti: document.getElementById("nomor-bukti").value.trim(),
    tanggal: document.getElementById("tgl-salur").value,
    namaBarang: itemPengadaan.namaBarang,
    jumlah: itemPengadaan.jumlah,
    nominal: itemPengadaan.biaya,
    sumberDana: document.getElementById("sumber-dana").value,
    penerima: document.getElementById("penerima-dana").value.trim(),
    status: "Dana Disalurkan"
  });

  simpanData(data);
  this.reset();
  alert("✅ Dana pembelian berhasil disalurkan dan tercatat pada riwayat!");
  renderDashboardSekretaris();
});