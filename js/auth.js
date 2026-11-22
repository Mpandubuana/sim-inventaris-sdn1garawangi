const USERS_STORAGE_KEY = "sim_users_sdn1_garawangi";

// 1. Akun default sesuai 3 aktor pada Use Case Diagram
const akunDefault = [
  {
    username: "admin",
    password: "admin123",
    nama: "Bpk. Ahmad",
    role: "Admin",
    halaman: "dashboard-admin.html"
  },
  {
    username: "kepsek",
    password: "kepsek123",
    nama: "Bpk. H. Mulyana, M.Pd.",
    role: "Kepala Sekolah",
    halaman: "dashboard-kepsek.html"
  },
  {
    username: "sekretaris",
    password: "sekretaris123",
    nama: "Ibu Siti Rahmawati, S.AP.",
    role: "Sekretaris Sekolah",
    halaman: "dashboard-sekretaris.html"
  }
];

function ambilDaftarAkun() {
  const tersimpan = localStorage.getItem(USERS_STORAGE_KEY);
  if (!tersimpan) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(akunDefault));
    return akunDefault;
  }
  return JSON.parse(tersimpan);
}

function simpanDaftarAkun(daftarBaru) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(daftarBaru));
}

// 2. Proses Login
const loginForm = document.getElementById("login-form");
const errorMsg = document.getElementById("error-msg");

if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const inputUser = document.getElementById("username").value.trim().toLowerCase();
    const inputPass = document.getElementById("password").value.trim();
    const daftarAkun = ambilDaftarAkun();

    const akunCocok = daftarAkun.find(
      (akun) => akun.username.toLowerCase() === inputUser && akun.password === inputPass
    );

    if (akunCocok) {
      localStorage.setItem("sesiLogin", JSON.stringify(akunCocok));
      window.location.href = akunCocok.halaman;
    } else {
      errorMsg.textContent = "Username atau Password salah! Silakan periksa kembali.";
      errorMsg.style.display = "block";
    }
  });
}

// 3. Fungsi Logout
function logout() {
  localStorage.removeItem("sesiLogin");
  window.location.href = "index.html";
}

// 4. Proteksi Halaman & Tampilkan Nama User yang Sedang Login
(function proteksiHalaman() {
  const path = window.location.pathname;
  const namaFile = path.substring(path.lastIndexOf("/") + 1);

  if (namaFile.startsWith("dashboard-")) {
    const sesi = JSON.parse(localStorage.getItem("sesiLogin"));

    if (!sesi) {
      alert("⚠️ Akses ditolak! Silakan login terlebih dahulu.");
      window.location.href = "index.html";
    } else if (sesi.halaman !== namaFile) {
      alert(`⚠️ Hak akses tidak sesuai! Anda login sebagai ${sesi.role}.`);
      window.location.href = sesi.halaman;
    } else {
      const elNama = document.getElementById("nama-user-login");
      if (elNama) elNama.textContent = sesi.nama;
    }
  }
})();

// 5. Logika Tema Monochrome (Matahari = Terang, Bulan = Gelap)
function terapkanTema(tema) {
  const tombolTema = document.getElementById("theme-toggle");
  if (tema === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    if (tombolTema) tombolTema.textContent = "☀️";
  } else {
    document.documentElement.removeAttribute("data-theme");
    if (tombolTema) tombolTema.textContent = "🌙";
  }
}

function toggleTema() {
  const temaSaatIni = localStorage.getItem("temaMonochrome");
  const temaBaru = temaSaatIni === "dark" ? "light" : "dark";
  localStorage.setItem("temaMonochrome", temaBaru);
  terapkanTema(temaBaru);
}

terapkanTema(localStorage.getItem("temaMonochrome") || "light");