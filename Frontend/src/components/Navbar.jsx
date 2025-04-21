import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { decodeJwt } from "../utils/decode";

const Navbar = ({ user, onLogout }) => {
  const token = localStorage.getItem("token");
  const decodedToken = token ? decodeJwt(token) : null;
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token"); // Hapus token langsung di sini
    navigate("/login"); // Redirect ke halaman login
  };
  
  

//   //testing
//   user = { name: "Panji Pragiwaksono", role: "bidan" }; 



  return (
    <nav className="flex items-center justify-between px-6 py-4 shadow bg-white">
      {/* Kiri: Logo dan Navigasi */}
      <div className="flex items-center space-x-6">
        <Link to="/beranda" className="flex items-center space-x-2">
          <img src="/logoreal.png" alt="Logo" className="w-6 h-6" />
          <span className="font-bold text-xl text-gray-800">Jurnal Bumil</span>
        </Link>

        <Link to="/beranda" className="text-gray-700 hover:underline">Beranda</Link>

        {/* Role Ibu */}
        {decodedToken?.role === "ibu" && (
          <>
            <Link to="/catatan" className="text-gray-700 hover:underline">Buat Catatan</Link>
            <Link to="/histori/catatan" className="text-gray-700 hover:underline">Histori Catatan</Link>
            <Link to="/histori/kunjungan" className="text-gray-700 hover:underline">Histori Kunjungan</Link>
          </>
        )}

        {/* Role Bidan */}
        {decodedToken?.role === "bidan" && (
          <>
            <Link to="/laporan" className="text-gray-700 hover:underline">Buat Laporan</Link>
            <Link to="/data" className="text-gray-700 hover:underline">Data Bumil</Link>
          </>
        )}
      </div>

      {/* Kanan: Login/Register atau Nama dan Logout */}
      <div className="flex items-center space-x-4">
        {!token ? (
          <>
            <Link to="/register/ibu" className="text-blue-800 font-medium hover:underline">Daftar</Link>
            <Link to="/login" className="bg-blue-800 text-white px-4 py-1 rounded hover:bg-blue-700">Masuk</Link>
          </>
        ) : (
          <>
            <span className="font-semibold text-gray-800">{decodedToken.nama}</span>
            <img src="/user.jpg" alt="User" className="w-8 h-8 rounded-full" />
            <button onClick={handleLogout} className="text-red-500 hover:underline">Keluar</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
