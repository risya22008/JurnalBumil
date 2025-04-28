import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RegisterIbu from "./pages/RegisterIbu";
import RegisterBidan from "./pages/RegisterBidan";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Catatan from "./pages/Catatan";
import NotVerivied from "./pages/notVerified";
import ProtectedRoute from "./components/ProtectedRoute";
import DataIbu from "./pages/DataIbu";
import Laporan from "./pages/Laporan";
import BacaLaporan from "./pages/BacaLaporan";
import BacaCatatan from "./pages/BacaCatatan";
import HistoryCatatanIbu from "./pages/HistoryCatatanIbu";


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/register/ibu" replace />} />
      <Route path="/register/ibu" element={<RegisterIbu />} />
      <Route path="/register/bidan" element={<RegisterBidan />} />
      <Route path="/login" element={<Login />} />
      <Route path="/catatan" element={<Catatan />} />
      <Route path="/verifikasi" element={<NotVerivied />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/data" element={<ProtectedRoute><DataIbu /></ProtectedRoute>} />
      <Route path="/laporan" element={<ProtectedRoute><Laporan /></ProtectedRoute>} />
      <Route path="/bacaLaporan" element={<ProtectedRoute><BacaLaporan /></ProtectedRoute>} />
      <Route path="/bacaCatatan" element={<ProtectedRoute><BacaCatatan /></ProtectedRoute>} />
      <Route path="/history-catatan/:id" element={<ProtectedRoute><HistoryCatatanIbu /></ProtectedRoute>} />
    </Routes>
  );
};

export default App;