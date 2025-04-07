import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Dashboard = () => {
  const [name, setName] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsed = JSON.parse(userData);
      setName(parsed.nama);
    }
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-6">
        <h2 className="text-xl font-semibold mb-4">Selamat datang, {name}!</h2>
        {/* konten */}
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
