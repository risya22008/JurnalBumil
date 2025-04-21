import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import { decodeJwt } from "../utils/decode";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "../App.css";
import RequireAuth from "../components/RequireAuth";

const CatatanHarian = () => {
  const symptoms = [
    ["Pusing", "Diare", "Jantung berdebar kencang"],
    ["Demam", "Keputihan", "Batuk pilek"],
    ["Mual muntah", "Pendarahan/keluar cairan", "Sesak nafas"],
    ["Sakit perut", "Sakit saat BAK", ""],
  ];

  const symptomIds = [
    1, 2, 3,
    4, 5, 6,
    7, 8, 9,
    10, 11,
  ];

  const [formData, setFormData] = useState({
    kondisi: [],
    makanan: "",
    kondisiHarian: "",
    skorHarian: 0,
  });

  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => {
      const isChecked = prev.kondisi.includes(value);
      return {
        ...prev,
        kondisi: isChecked
          ? prev.kondisi.filter((v) => v !== value)
          : [...prev.kondisi, value],
      };
    });
  };

  const handleSkorChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      skorHarian: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const isConfirmed = window.confirm("Apakah semua data sudah lengkap dan benar?");
    if (!isConfirmed) return;
  
    const token = localStorage.getItem("token");
    const decodedToken = decodeJwt(token);
  
    const id_ibu = decodedToken?.id;
    if (!id_ibu) {
      alert("ID pengguna tidak ditemukan di token.");
      return;
    }
  
    const postData = {
      catatan_kondisi: formData.kondisiHarian,
      catatan_konsumsi: formData.makanan,
      gejala: formData.kondisi.map(Number),
      rating: formData.skorHarian,
      date: new Date().toISOString().split("T")[0],
      id_ibu,
    };
  
    try {
      await axios.post("http://localhost:8000/api/catatan", postData);
      alert("Catatan harian berhasil dikirim!");
      setFormData({
        kondisi: [],
        makanan: "",
        kondisiHarian: "",
        skorHarian: 0,
      });
    } catch (err) {
      const msg = err.response?.data?.message || "Terjadi kesalahan saat mengirim catatan.";
      console.error("Error:", msg);
      alert(msg);
    }
  };  
  

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
    <div className="p-5 min-h-screen bg-white">
      <h1 className="text-3xl font-semibold text-center mb-10 font-poppins">
        Catatan Harian
      </h1>

      <form className="mx-auto max-w-[1022px] px-4" onSubmit={handleSubmit}>
        <div className="mb-6">
          <p className="text-lg font-semibold text-left mb-4 font-poppins">
            Adakah gejala yang dialami?
          </p>

          <table className="w-full text-left table-auto">
            <tbody>
              {symptoms.map((row, rowIndex) => (
                <tr key={rowIndex} className="h-10">
                  {row.map((symptom, colIndex) => {
                    const index = rowIndex * 3 + colIndex;
                    const id = symptomIds[index];
                    return (
                      <td
                        key={colIndex}
                        className="align-middle px-4 py-1 text-left"
                        style={{
                          width: "33%",
                          height: "40px",
                          border: "1px solid transparent",
                        }}
                      >
                        {symptom && (
                          <label className="inline-flex items-center space-x-2">
                            <input
                              type="checkbox"
                              className="custom-checkbox"
                              name="kondisi"
                              value={id.toString()}
                              onChange={handleCheckboxChange}
                            />
                            <span>{symptom}</span>
                          </label>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Makanan */}
        <div className="mt-6">
          <p className="text-lg font-semibold text-left mb-4 font-poppins">
            Makan apa saja hari ini bun?
          </p>
          <textarea
            className="w-full p-3 rounded-md font-poppins"
            rows="4"
            placeholder="Tulis makanan yang Anda makan hari ini..."
            value={formData.makanan}
            onChange={(e) =>
              setFormData({ ...formData, makanan: e.target.value })
            }
          ></textarea>
        </div>

        {/* Kondisi harian */}
        <div className="mt-6">
          <p className="text-lg font-semibold text-left mb-4 font-poppins">
            Gimana kondisinya hari ini bun?
          </p>
          <textarea
            className="w-full p-3 rounded-md font-poppins"
            rows="4"
            placeholder="Tulis kondisi Anda hari ini..."
            value={formData.kondisiHarian}
            onChange={(e) =>
              setFormData({ ...formData, kondisiHarian: e.target.value })
            }
          ></textarea>
        </div>

        {/* Skor Harian - Rating Bintang */}
        <div className="mt-8 mb-4 text-left">
          <p className="text-lg font-semibold mb-2 font-poppins">
            Seberapa puas bunda hari ini?
          </p>
          <div className="flex justify-start gap-2 text-2xl">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  className="focus:outline-none"
                  onClick={() => handleSkorChange(num)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill={formData.skorHarian >= num ? "#4fa0ff" : "#d1d5db"}
                    viewBox="0 0 24 24"
                    stroke="none"
                    className="w-6 h-6"
                  >
                    <path d="M12 .587l3.668 7.431L24 9.587l-6 5.847 1.42 8.28L12 18.896l-7.42 4.818L6 15.434 0 9.587l8.332-1.569z" />
                  </svg>
                </button>
              ))}
            
          </div>
        </div>

        <div className="mt-4 text-right">
          <button
            type="submit"
            className="bg-[#4fa0ff] text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-500 transition"
          >
            Submit
          </button>
        </div>
      </form>
      <Footer />
    </div>
    </div>
  );
};
export default () => (
  <RequireAuth>
    <CatatanHarian />
  </RequireAuth>
);
