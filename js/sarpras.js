// Jalankan otomatis saat halaman dashboard-sarpras.html dibuka
document.addEventListener("DOMContentLoaded", function () {
  renderDashboardSarpras();
});

function renderDashboardSarpras() {
  const data = ambilData();

  // 1. Hitung total stok & kondisi rusak dari data.aset
  let totalUnit = 0;
  let totalRusak = 0;

  data.aset.forEach((item) => {
    totalUnit += Number(item.jumlah);
    totalRusak += Number(item.rusak);
  });

  const pengadaanAcc = data.pengadaan.filter((p) => p.status === "Disetujui").length;

  // Tampilkan ke kartu ringkasan atas
  document.getElementById("stat-total").textContent = totalUnit + " Unit";
  document.getElementById("stat-servis").textContent = totalRusak + " Unit";
  document.getElementById("stat-rusak").textContent = totalRusak + " Unit";
  document.getElementById("stat-disetujui").textContent = pengadaanAcc + " Usulan";

  // 2. Isi baris tabel Master Data Inventaris
  const tbody = document.getElementById("tabel-aset");
  tbody.innerHTML = "";

  data.aset.forEach((item, index) => {
    tbody.innerHTML += `
      <tr>
        <td><strong>${item.kode}</strong></td>
        <td>${item.nama}</td>
        <td>${item.kategori}</td>
        <td>${item.jumlah} Unit</td>
        <td><span class="badge badge-green">${item.baik}</span></td>
        <td><span class="badge ${item.rusak > 0 ? "badge-red" : "badge-green"}">${item.rusak}</span></td>
        <td>
          <button type="button" onclick="laporkanRusak(${index})" style="padding: 3px 8px; font-size: 0.75rem; background:#eab308; color:white; border:none; border-radius:4px; cursor:pointer;">+1 Rusak</button>
          <button type="button" onclick="hapusAset(${index})" style="padding: 3px 8px; font-size: 0.75rem; background:#ef4444; color:white; border:none; border-radius:4px; cursor:pointer;">Hapus</button>
        </td>
      </tr>
    `;
  });
}

// Fungsi tombol "+1 Rusak"
function laporkanRusak(index) {
  const data = ambilData();
  if (data.aset[index].baik > 0) {
    data.aset[index].baik -= 1;
    data.aset[index].rusak += 1;
    simpanData(data);
    renderDashboardSarpras();
  } else {
    alert("Semua unit barang ini sudah tercatat dalam kondisi rusak.");
  }
}

// Fungsi tombol "Hapus"
function hapusAset(index) {
  const data = ambilData();
  if (confirm(`Yakin ingin menghapus "${data.aset[index].nama}" dari inventaris?`)) {
    data.aset.splice(index, 1);
    simpanData(data);
    renderDashboardSarpras();
  }
}

// Fungsi kirim Form Usulan Pengadaan ke Kepala Sekolah
const formPengadaan = document.getElementById("form-pengadaan");
if (formPengadaan) {
  formPengadaan.addEventListener("submit", function (e) {
    e.preventDefault();
    const data = ambilData();

    const usulanBaru = {
      id: "PGD-0" + (data.pengadaan.length + 1),
      tanggal: new Date().toISOString().split("T")[0],
      pengusul: "Bpk. Ahmad (Sarpras)",
      namaBarang: document.getElementById("nama-pengadaan").value.trim(),
      kategori: document.getElementById("kategori-pengadaan").value,
      jumlah: Number(document.getElementById("jumlah-usulan").value),
      biaya: Number(document.getElementById("estimasi-biaya").value),
      alasan: document.getElementById("alasan-usulan").value.trim(),
      status: "Menunggu"
    };

    data.pengadaan.push(usulanBaru);
    simpanData(data);

    alert("✅ Usulan pengadaan berhasil dikirim ke Kepala Sekolah!");
    formPengadaan.reset();
    renderDashboardSarpras();
  });
}