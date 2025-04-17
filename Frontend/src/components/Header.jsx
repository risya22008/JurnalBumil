import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserName(parsedUser.name || "");
    }
  }, []);

  return (
    <header className="flex items-center justify-between px-8 py-4 shadow-md bg-white">
      <div className="flex items-center gap-2">
        <img src="/logo.jpg" alt="Logo Jurnal Bumil" className="h-6" />
      </div>

      <nav className="flex items-center gap-6 text-sm font-medium text-gray-700">
        <Link to="/dashboard">Beranda</Link>
        <Link to="/artikel">Artikel</Link>
        <Link to="/catatan-harian">Catatan Harian</Link>
        <Link to="/laporan-kunjungan">Laporan Kunjungan</Link>
      </nav>

      <div className="flex items-center gap-2">
        <img
          src="/logo.jpg"
          alt="Foto Profil"
          className="h-8 w-8 rounded-full object-cover"
        />
        <span className="text-sm font-semibold text-gray-800">
          {userName || "Pengguna"}
        </span>
      </div>
    </header>
  );
};

export default Header;
