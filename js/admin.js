document.addEventListener("DOMContentLoaded", function () {
  renderDashboardAdmin();
});

function renderDashboardAdmin() {
  const data = ambilData();
  const daftarAkun = ambilDaftarAkun();

  // 1. Statistik Ringkasan
  let totalUnit = 0;
  let totalRusak = 0;
  data.aset.forEach((item) => {
    totalUnit += Number(item.jumlah);
    totalRusak += Number(item.rusak);
  });

  document.getElementById("stat-total").textContent = totalUnit + " Unit";
  document.getElementById("stat-rusak").textContent = totalRusak + " Unit";
  document.getElementById("stat-pengajuan").textContent = data.pengadaan.length + " Usulan";
  document.getElementById("stat-akun").textContent = daftarAkun.length + " Akun";

  // 2. Isi Dropdown dari Data Master & Daftar Aset
  const selKategoriAset = document.getElementById("kategori-aset-baru");
  const selKategoriPengadaan = document.getElementById("kategori-pengadaan");
  selKategoriAset.innerHTML = "";
  selKategoriPengadaan.innerHTML = "";
  data.masterKategori.forEach((kat) => {
    selKategoriAset.innerHTML += `<option value="${kat}">${kat}</option>`;
    selKategoriPengadaan.innerHTML += `<option value="${kat}">${kat}</option>`;
  });

  const selLokasiAset = document.getElementById("lokasi-aset-baru");
  selLokasiAset.innerHTML = "";
  data.masterLokasi.forEach((lok) => {
    selLokasiAset.innerHTML += `<option value="${lok}">${lok}</option>`;
  });

  const selAsetRusak = document.getElementById("pilih-aset-rusak");
  selAsetRusak.innerHTML = "";
  data.aset.forEach((item, idx) => {
    selAsetRusak.innerHTML += `<option value="${idx}">${item.kode} - ${item.nama} (Baik: ${item.baik} Unit)</option>`;
  });

  // 3. Render Tabel Data Inventaris Aset
  const tbodyAset = document.getElementById("tabel-aset");
  tbodyAset.innerHTML = "";
  data.aset.forEach((item, index) => {
    tbodyAset.innerHTML += `
      <tr>
        <td><strong>${item.kode}</strong></td>
        <td>${item.nama}</td>
        <td>${item.kategori}</td>
        <td>${item.lokasi}</td>
        <td>${item.jumlah} Unit</td>
        <td><span class="badge badge-green">${item.baik}</span></td>
        <td><span class="badge ${item.rusak > 0 ? "badge-red" : "badge-yellow"}">${item.rusak}</span></td>
        <td>
          <button type="button" onclick="tambahStokAset(${index})" style="padding: 3px 8px; font-size: 0.75rem; background: var(--accent-bg); color: var(--accent-text); border: none; border-radius: 4px; cursor: pointer;">+1 Unit</button>
          <button type="button" onclick="hapusAset(${index})" style="padding: 3px 8px; font-size: 0.75rem; background: #dc2626; color: white; border: none; border-radius: 4px; cursor: pointer;">Hapus</button>
        </td>
      </tr>
    `;
  });

  // 4. Render Tabel Laporan Kerusakan
  const tbodyRusak = document.getElementById("tabel-laporan-kerusakan");
  tbodyRusak.innerHTML = "";
  data.kerusakan.forEach((k) => {
    let badgeClass = "badge-yellow";
    if (k.status.includes("Disetujui")) badgeClass = "badge-green";
    if (k.status === "Ditolak") badgeClass = "badge-red";

    tbodyRusak.innerHTML += `
      <tr>
        <td>${k.tanggal}</td>
        <td>${k.kodeAset}</td>
        <td><strong>${k.namaBarang}</strong></td>
        <td>${k.jumlah} Unit</td>
        <td><strong>${k.tingkat}</strong><br><small style="color: var(--text-secondary);">${k.keterangan}</small></td>
        <td><span class="badge ${badgeClass}">${k.status}</span></td>
      </tr>
    `;
  });

  // 5. Render Tabel Riwayat Pengajuan Pembelian
  const tbodyPengadaan = document.getElementById("tabel-riwayat-pengadaan");
  tbodyPengadaan.innerHTML = "";
  data.pengadaan.forEach((p) => {
    let badgeClass = "badge-yellow";
    if (p.status === "Disetujui" || p.status === "Dana Disalurkan") badgeClass = "badge-green";
    if (p.status === "Ditolak") badgeClass = "badge-red";

    tbodyPengadaan.innerHTML += `
      <tr>
        <td>${p.tanggal}</td>
        <td><strong>${p.namaBarang}</strong> (${p.kategori})</td>
        <td>${p.jumlah} Unit</td>
        <td>${formatRupiah(p.biaya)}</td>
        <td><span class="badge ${badgeClass}">${p.status}</span></td>
      </tr>
    `;
  });

  // 6. Render Tabel Data Master
  const tbodyKat = document.getElementById("tabel-master-kategori");
  tbodyKat.innerHTML = "";
  data.masterKategori.forEach((kat, i) => {
    tbodyKat.innerHTML += `
      <tr>
        <td>${kat}</td>
        <td><button type="button" onclick="hapusMasterKategori(${i})" style="padding: 3px 8px; font-size: 0.75rem; background: #dc2626; color: white; border: none; border-radius: 4px; cursor: pointer;">Hapus</button></td>
      </tr>
    `;
  });

  const tbodyLok = document.getElementById("tabel-master-lokasi");
  tbodyLok.innerHTML = "";
  data.masterLokasi.forEach((lok, i) => {
    tbodyLok.innerHTML += `
      <tr>
        <td>${lok}</td>
        <td><button type="button" onclick="hapusMasterLokasi(${i})" style="padding: 3px 8px; font-size: 0.75rem; background: #dc2626; color: white; border: none; border-radius: 4px; cursor: pointer;">Hapus</button></td>
      </tr>
    `;
  });

  // 7. Render Tabel Akun Pengguna (Dengan Tombol Edit & Hapus)
  const tbodyAkun = document.getElementById("tabel-akun");
  tbodyAkun.innerHTML = "";
  daftarAkun.forEach((u, i) => {
    tbodyAkun.innerHTML += `
      <tr>
        <td><strong>${u.nama}</strong></td>
        <td><code>${u.username}</code></td>
        <td><code>${u.password}</code></td>
        <td><span class="badge badge-yellow">${u.role}</span></td>
        <td>
          <button type="button" onclick="editAkun(${i})" style="padding: 3px 8px; font-size: 0.75rem; background: var(--accent-bg); color: var(--accent-text); border: none; border-radius: 4px; cursor: pointer;">Edit</button>
          <button type="button" onclick="hapusAkun(${i})" style="padding: 3px 8px; font-size: 0.75rem; background: #dc2626; color: white; border: none; border-radius: 4px; cursor: pointer;">Hapus</button>
        </td>
      </tr>
    `;
  });
}

// Form Tambah Aset Baru
document.getElementById("form-tambah-aset").addEventListener("submit", function (e) {
  e.preventDefault();
  const data = ambilData();
  const jml = Number(document.getElementById("jumlah-aset-baru").value);

  data.aset.push({
    kode: document.getElementById("kode-aset-baru").value.trim(),
    nama: document.getElementById("nama-aset-baru").value.trim(),
    kategori: document.getElementById("kategori-aset-baru").value,
    lokasi: document.getElementById("lokasi-aset-baru").value,
    jumlah: jml,
    baik: jml,
    rusak: 0
  });

  simpanData(data);
  this.reset();
  alert("✅ Data inventaris aset baru berhasil ditambahkan.");
  renderDashboardAdmin();
});

function tambahStokAset(index) {
  const data = ambilData();
  data.aset[index].jumlah += 1;
  data.aset[index].baik += 1;
  simpanData(data);
  renderDashboardAdmin();
}

function hapusAset(index) {
  const data = ambilData();
  if (confirm(`Hapus "${data.aset[index].nama}" dari inventaris?`)) {
    data.aset.splice(index, 1);
    simpanData(data);
    renderDashboardAdmin();
  }
}

// Form Catat Laporan Kerusakan
document.getElementById("form-kerusakan").addEventListener("submit", function (e) {
  e.preventDefault();
  const data = ambilData();
  const idxAset = Number(document.getElementById("pilih-aset-rusak").value);
  const jmlRusak = Number(document.getElementById("jumlah-rusak").value);
  const asetDipilih = data.aset[idxAset];

  if (!asetDipilih || jmlRusak > asetDipilih.baik) {
    alert("⚠️ Jumlah unit rusak melebihi stok kondisi baik yang tersedia!");
    return;
  }

  asetDipilih.baik -= jmlRusak;
  asetDipilih.rusak += jmlRusak;

  data.kerusakan.push({
    id: "KRS-0" + (data.kerusakan.length + 1),
    tanggal: new Date().toISOString().split("T")[0],
    kodeAset: asetDipilih.kode,
    namaBarang: asetDipilih.nama,
    jumlah: jmlRusak,
    tingkat: document.getElementById("tingkat-rusak").value,
    keterangan: document.getElementById("ket-rusak").value.trim(),
    status: "Menunggu Tindak Lanjut"
  });

  simpanData(data);
  this.reset();
  alert("✅ Laporan kerusakan dicatat dan diteruskan ke Kepala Sekolah.");
  renderDashboardAdmin();
});

// Form Pengajuan Pembelian Aset Baru
document.getElementById("form-pengadaan").addEventListener("submit", function (e) {
  e.preventDefault();
  const data = ambilData();
  const sesi = JSON.parse(localStorage.getItem("sesiLogin"));

  data.pengadaan.push({
    id: "PGD-0" + (data.pengadaan.length + 1),
    tanggal: new Date().toISOString().split("T")[0],
    pengusul: `${sesi.nama} (Admin)`,
    namaBarang: document.getElementById("nama-pengadaan").value.trim(),
    kategori: document.getElementById("kategori-pengadaan").value,
    jumlah: Number(document.getElementById("jumlah-usulan").value),
    biaya: Number(document.getElementById("estimasi-biaya").value),
    alasan: document.getElementById("alasan-usulan").value.trim(),
    status: "Menunggu"
  });

  simpanData(data);
  this.reset();
  alert("✅ Pengajuan pembelian berhasil dikirim ke Kepala Sekolah.");
  renderDashboardAdmin();
});

// Form Data Master Kategori & Lokasi
document.getElementById("form-master-kategori").addEventListener("submit", function (e) {
  e.preventDefault();
  const data = ambilData();
  const val = document.getElementById("input-kategori-baru").value.trim();
  if (val && !data.masterKategori.includes(val)) {
    data.masterKategori.push(val);
    simpanData(data);
    this.reset();
    renderDashboardAdmin();
  }
});

function hapusMasterKategori(index) {
  const data = ambilData();
  data.masterKategori.splice(index, 1);
  simpanData(data);
  renderDashboardAdmin();
}

document.getElementById("form-master-lokasi").addEventListener("submit", function (e) {
  e.preventDefault();
  const data = ambilData();
  const val = document.getElementById("input-lokasi-baru").value.trim();
  if (val && !data.masterLokasi.includes(val)) {
    data.masterLokasi.push(val);
    simpanData(data);
    this.reset();
    renderDashboardAdmin();
  }
});

function hapusMasterLokasi(index) {
  const data = ambilData();
  data.masterLokasi.splice(index, 1);
  simpanData(data);
  renderDashboardAdmin();
}

// Fungsi Masuk ke Mode Edit Akun
function editAkun(index) {
  const daftarAkun = ambilDaftarAkun();
  const akun = daftarAkun[index];

  document.getElementById("akun-edit-index").value = index;
  document.getElementById("akun-nama").value = akun.nama;
  document.getElementById("akun-role").value = akun.role;
  document.getElementById("akun-username").value = akun.username;
  document.getElementById("akun-password").value = akun.password;

  document.getElementById("btn-submit-akun").textContent = "💾 Simpan Perubahan";
  document.getElementById("btn-batal-akun").style.display = "inline-block";
  document.getElementById("kelola-akun").scrollIntoView({ behavior: "smooth" });
}

// Fungsi Batal Edit & Kembalikan Form ke Mode Tambah
function batalEditAkun() {
  document.getElementById("form-tambah-akun").reset();
  document.getElementById("akun-edit-index").value = "";
  document.getElementById("btn-submit-akun").textContent = "+ Buat Akun Pengguna";
  document.getElementById("btn-batal-akun").style.display = "none";
}

// Form Tambah & Edit Akun Pengguna
document.getElementById("form-tambah-akun").addEventListener("submit", function (e) {
  e.preventDefault();
  const daftarAkun = ambilDaftarAkun();
  const editIndex = document.getElementById("akun-edit-index").value;
  const nama = document.getElementById("akun-nama").value.trim();
  const username = document.getElementById("akun-username").value.trim().toLowerCase();
  const password = document.getElementById("akun-password").value.trim();
  const role = document.getElementById("akun-role").value;

  const duplikat = daftarAkun.some(
    (u, idx) => u.username.toLowerCase() === username && String(idx) !== editIndex
  );
  if (duplikat) {
    alert("⚠️ Username sudah digunakan akun lain! Pilih username berbeda.");
    return;
  }

  let halamanTujuan = "dashboard-admin.html";
  if (role === "Kepala Sekolah") halamanTujuan = "dashboard-kepsek.html";
  if (role === "Sekretaris Sekolah") halamanTujuan = "dashboard-sekretaris.html";

  const dataAkunBaru = {
    nama: nama,
    username: username,
    password: password,
    role: role,
    halaman: halamanTujuan
  };

  if (editIndex === "") {
    daftarAkun.push(dataAkunBaru);
    simpanDaftarAkun(daftarAkun);
    alert("✅ Akun pengguna baru berhasil dibuat.");
  } else {
    const idx = Number(editIndex);
    const sesi = JSON.parse(localStorage.getItem("sesiLogin"));
    const usernameLama = daftarAkun[idx].username;

    daftarAkun[idx] = dataAkunBaru;
    simpanDaftarAkun(daftarAkun);

    if (sesi && sesi.username === usernameLama) {
      localStorage.setItem("sesiLogin", JSON.stringify(dataAkunBaru));
      const elNama = document.getElementById("nama-user-login");
      if (elNama) elNama.textContent = dataAkunBaru.nama;

      if (dataAkunBaru.halaman !== "dashboard-admin.html") {
        alert("✅ Perubahan disimpan. Anda akan dialihkan sesuai role baru.");
        window.location.href = dataAkunBaru.halaman;
        return;
      }
    }

    alert("✅ Data akun pengguna berhasil diperbarui.");
  }

  batalEditAkun();
  renderDashboardAdmin();
});

function hapusAkun(index) {
  const daftarAkun = ambilDaftarAkun();
  const sesi = JSON.parse(localStorage.getItem("sesiLogin"));

  if (daftarAkun[index].username === sesi.username) {
    alert("⚠️ Anda tidak dapat menghapus akun yang sedang Anda gunakan login.");
    return;
  }

  if (confirm(`Hapus akun "${daftarAkun[index].nama}"?`)) {
    daftarAkun.splice(index, 1);
    simpanDaftarAkun(daftarAkun);
    batalEditAkun();
    renderDashboardAdmin();
  }
}