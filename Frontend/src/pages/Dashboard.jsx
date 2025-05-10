import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { decodeJwt } from "../utils/decode"; // pastikan path-nya sesuai

const Dashboard = () => {
  const [artikel, setArtikel] = useState(null);
  const [trimester, setTrimester] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArtikel = async (t) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const decodedToken = token ? decodeJwt(token) : null;
      const role = decodedToken?.role;

      let endpoint = "";

      if (t) {
        endpoint = `http://localhost:8000/api/beranda/trimester/${t}`;
      } else if (role === "bidan") {
        endpoint = `http://localhost:8000/api/beranda/trimester/1`; // default bidan
      } else {
        endpoint = `http://localhost:8000/api/beranda/ibu`; // default ibu
      }

      const res = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Gagal mengambil data artikel");
      }

      const data = await res.json();
      setArtikel(data);
      setTrimester(data.trimester);

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtikel();
  }, []);

  const handleSebelumnya = () => {
    if (trimester > 1) {
      fetchArtikel(trimester - 1);
    }
  };

  const handleSelanjutnya = () => {
    if (trimester < 3) {
      fetchArtikel(trimester + 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Memuat data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow px-6 py-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold py-12 text-center mb-2">
          Perjalanan Kehamilan di Trimester {trimester}: Apa yang Perlu Ibu Tahu?
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Yuk Kenali Apa yang Terjadi & Apa yang Harus Dilakukan di Trimester Ini
        </p>
        <img
          src="tes-artikel-1.png"
          alt="Ibu hamil makan salad"
          className="w-full h-auto rounded-lg mb-8"
        />

      

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 text-left">Apa yang Terjadi pada Ibu?</h2>
          <ul className="list-disc pl-6 text-gray-700 text-justify py-6 space-y-2">
              {artikel.data.ibu.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

          
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 text-left">Apa yang Terjadi pada Janin?</h2>
       
          <ul className="list-disc pl-6 text-gray-700 text-justify py-6 space-y-2">
            {artikel.data.janin.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 text-left">Apa yang harus dilakukan ibu?</h2>
          <ul className="list-disc pl-6 text-gray-700 text-justify py-6 space-y-2">
            {artikel.data.perlu_dilakukan.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
         
          
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2 text-left">Kondisi apa yang jadi tanda bahaya?</h2>
          <ul className="list-disc pl-6 text-gray-700 text-justify py-6 space-y-2">
            {artikel.data.gejala_parah.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          
        </section>

        <div className="flex justify-between mt-10">
          <button
            className={`px-4 py-2 rounded-md ${trimester > 1 ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
            onClick={handleSebelumnya}
            disabled={trimester <= 1}
          >
            Cek Artikel Sebelumnya
          </button>
          <button
            className={`px-4 py-2 rounded-md ${trimester < 3 ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
            onClick={handleSelanjutnya}
            disabled={trimester >= 3}
          >
            Cek Artikel Selanjutnya
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
