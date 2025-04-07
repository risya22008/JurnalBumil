import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RegisterIbu from "./pages/RegisterIbu";
import RegisterBidan from "./pages/RegisterBidan";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/register/ibu" replace />} />
      <Route path="/register/ibu" element={<RegisterIbu />} />
      <Route path="/register/bidan" element={<RegisterBidan />} />
      <Route path="/login" element={<Login/>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
    </Routes>
  );
};

export default App;