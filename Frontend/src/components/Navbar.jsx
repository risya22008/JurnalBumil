import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { decodeJwt } from "../utils/decode";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const decodedToken = token ? decodeJwt(token) : null;
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Kiri: Logo */}
        <div className="flex items-center space-x-2">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <img src="/logoreal.png" alt="Logo" className="w-6 h-6" />
            <span className="font-bold text-xl text-gray-800">Jurnal Bumil</span>
          </Link>
        </div>

        {/* Tombol hamburger */}
        <button
          className="md:hidden text-gray-800 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>

        {/* Kanan: Desktop menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/dashboard" className="text-gray-700 hover:underline">Beranda</Link>

          {decodedToken?.role === "ibu" && (
            <>
              <Link to="/catatan" className="text-gray-700 hover:underline">Buat Catatan</Link>
              <Link to={`/history-catatan/${decodedToken?.id}`} className="text-gray-700 hover:underline">Histori Catatan</Link>
              <Link to={`/history-kunjungan/${decodedToken?.id}`} className="text-gray-700 hover:underline">Histori Kunjungan</Link>
            </>
          )}

          {decodedToken?.role === "bidan" && (
            <>
              <Link to="/laporan" className="text-gray-700 hover:underline">Buat Laporan</Link>
              <Link to="/data" className="text-gray-700 hover:underline">Data Bumil</Link>
            </>
          )}

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
      </div>

      {/* Mobile menu */}
      {menuOpen && (
  <div className="md:hidden absolute right-4 top-16 bg-white shadow-md rounded-lg p-4 w-52 text-left z-50">
    <div className="w-full text-left">
      <Link to="/dashboard" className="block text-gray-700 hover:underline">Beranda</Link>

      {decodedToken?.role === "ibu" && (
        <>
          <Link to="/catatan" className="block text-gray-700 hover:underline">Buat Catatan</Link>
          <Link to={`/history-catatan/${decodedToken?.id}`} className="block text-gray-700 hover:underline">Histori Catatan</Link>
          <Link to={`/history-kunjungan/${decodedToken?.id}`} className="block text-gray-700 hover:underline">Histori Kunjungan</Link>
        </>
      )}

      {decodedToken?.role === "bidan" && (
        <>
          <Link to="/laporan" className="block text-gray-700 hover:underline">Buat Laporan</Link>
          <Link to="/data" className="block text-gray-700 hover:underline">Data Bumil</Link>
        </>
      )}

      {!token ? (
        <>
          <Link to="/register/ibu" className="block text-blue-800 font-medium hover:underline">Daftar</Link>
          <Link to="/login" className="block bg-blue-800 text-white px-4 py-1 rounded hover:bg-blue-700">Masuk</Link>
        </>
      ) : (
        <div className="flex flex-col space-y-2 mt-4 border-t pt-3">
  <div className="flex items-center space-x-3">
    <div className="flex-1">
      <span className="font-semibold text-gray-800 block truncate text-sm">{decodedToken.nama}</span>
    </div>
  </div>
  <button
    onClick={handleLogout}
    className="text-red-500 text-left text-sm hover:underline"
  >
    Keluar
  </button>
</div>

      )}
    </div>
  </div>
)}

    </nav>
  );
};

export default Navbar;
