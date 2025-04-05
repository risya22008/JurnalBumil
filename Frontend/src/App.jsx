import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import RegisterIbu from "./pages/RegisterIbu";
import RegisterBidan from "./pages/RegisterBidan";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/register/ibu" replace />} />
      <Route path="/register/ibu" element={<RegisterIbu />} />
      <Route path="/register/bidan" element={<RegisterBidan />} />
    </Routes>
  );
};

export default App;