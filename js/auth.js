// 1. Daftar akun resmi untuk 3 aktor manajemen aset
const daftarAkun = [
  {
    username: "sarpras",
    password: "sarpras123",
    nama: "Bpk. Ahmad (Sarpras)",
    role: "Petugas Sarpras",
    halaman: "dashboard-sarpras.html"
  },
  {
    username: "sekretaris",
    password: "sekretaris123",
    nama: "Ibu Siti Rahmawati, S.AP.",
    role: "Sekretaris Sekolah",
    halaman: "dashboard-sekretaris.html"
  },
  {
    username: "kepsek",
    password: "kepsek123",
    nama: "Bpk. H. Mulyana, M.Pd.",
    role: "Kepala Sekolah",
    halaman: "dashboard-kepsek.html"
  }
];

// 2. Tangkap elemen form dan pesan error dari index.html
const loginForm = document.getElementById("login-form");
const errorMsg = document.getElementById("error-msg");

if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const inputUser = document.getElementById("username").value.trim().toLowerCase();
    const inputPass = document.getElementById("password").value.trim();

    const akunCocok = daftarAkun.find(
      (akun) => akun.username === inputUser && akun.password === inputPass
    );

    if (akunCocok) {
      localStorage.setItem("sesiLogin", JSON.stringify(akunCocok));
      window.location.href = akunCocok.halaman;
    } else {
      errorMsg.textContent = "Username atau Password salah! Cek kembali akun demo di bawah.";
      errorMsg.style.display = "block";
    }
  });
}

// 3. Fungsi Logout
function logout() {
  localStorage.removeItem("sesiLogin");
  window.location.href = "index.html";
}

// 4. Proteksi Otomatis Halaman Sesuai Hak Akses
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
    }
  }
})(); // <-- Penutup proteksiHalaman di sini

// 5. Logika Ganti Tema Monochrome (Di luar proteksiHalaman agar bisa diklik)
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

// Jalankan tema tersimpan otomatis setiap kali halaman dibuka
terapkanTema(localStorage.getItem("temaMonochrome") || "light");