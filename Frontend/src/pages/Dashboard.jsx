import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Navbar from "../components/navbar";

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
      <Navbar />
      <main className="flex-grow px-6 py-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">
          Perjalanan Kehamilan di Trimester-(x): Apa yang Perlu Ibu Tahu?
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Yuk Kenali Apa yang Terjadi & Apa yang Harus Dilakukan di Trimester Ini
        </p>
        <img
          src="tes-artikel-1.png"
          alt="Ibu hamil makan salad"
          className="w-full h-auto rounded-lg mb-8"
        />

        <section className="mb-10 text-gray-700 text-justify text-justify">
          <p>
            Setiap trimester dalam kehamilan membawa perubahan yang unik bagi ibu dan janin. Di trimester-(x), tubuh ibu mengalami penyesuaian penting, sementara janin berkembang pesat sesuai tahap usianya. Memahami apa yang terjadi, langkah apa yang perlu dilakukan, dan mengenali tanda bahaya sejak dini akan membantu ibu menjalani kehamilan dengan lebih tenang dan sehat. Mari kita bahas apa saja yang terjadi di trimester ini.
          </p>
        </section>

        {/* Apa yang Terjadi pada Ibu */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2 ">Apa yang Terjadi pada Ibu?</h2>
          
          <img
            src="tes-artikel-2.png"
            alt="Ibu membaca artikel"
            className="w-full h-auto rounded-lg mb-4"
          />
        </section>

        {/* Apa yang Terjadi pada Janin */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">Apa yang Terjadi pada Janin?</h2>
          <p className="text-sm text-gray-500 mb-2">(diambil dari database artikel bagian janin)</p>
          <p className="text-gray-700 text-justify">
            Protein sangat penting untuk pertumbuhan sel dan jaringan janin serta menjaga kesehatan ibu. <strong>Sumber makanan:</strong> Daging tanpa lemak, ikan, telur, tahu, tempe, dan kacang-kacangan. <br />
            Zat besi membantu mencegah anemia pada ibu hamil serta memastikan pasokan oksigen yang cukup ke janin. <strong>Sumber makanan:</strong> Daging merah, bayam, kacang-kacangan, dan sereal yang diperkaya zat besi. <br />
            Kalsium dalam pembentukan tulang dan gigi bayi serta menjaga kesehatan tulang ibu. <strong>Sumber makanan:</strong> Susu, keju, yogurt, dan sayuran hijau seperti brokoli.
          </p>
        </section>

        {/* Apa yang Harus Dilakukan Ibu */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">Apa yang harus dilakukan ibu?</h2>
          <p className="text-sm text-gray-500 mb-2">(diambil dari database tabel artikel bagian yang dilakukan)</p>
          <p className="text-gray-700 text-justify mb-4">
            Banyak aplikasi yang dapat membantu ibu hamil memantau asupan nutrisi harian, seperti pencatat makanan dan kalender kehamilan. Menggunakan teknologi ini dapat memudahkan ibu tetap menjaga pola makan sehat dan memastikan kebutuhan gizi terpenuhi.
          </p>
          <img
            src="tes-artikel-3.png"
            alt="Ibu makan sehat"
            className="w-full h-auto rounded-lg"
          />
        </section>

        {/* Kondisi Berbahaya */}
        <section className="mb-10 bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Kondisi apa yang jadi tanda bahaya?</h2>
          <p className="text-sm text-gray-500 mb-2">(diambil dari database tabel artikel)</p>
          <p className="text-gray-700 text-justify">
            Memenuhi kebutuhan nutrisi selama kehamilan sangat penting untuk kesehatan ibu dan bayi. Ibu hamil dapat memastikan pertumbuhan janin yang optimal serta menjaga kesehatannya sendiri dengan mengonsumsi makanan kaya gizi seperti asam folat, protein, zat besi, kalsium, dan omega-3. Jangan lupa konsultasi dengan dokter atau ahli gizi untuk saran yang sesuai.
          </p>
        </section>

        {/* Navigasi Artikel */}
        <div className="flex justify-between mt-10">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md">Cek Artikel Sebelumnya</button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md">Cek Artikel Selanjutnya</button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
