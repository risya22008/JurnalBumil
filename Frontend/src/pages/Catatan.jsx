import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Navbar from "../components/navbar";
import "../App.css";

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
      <main className="flex-grow p-6">
        <h2 className="text-xl font-semibold mb-4">Selamat datang, {name}!</h2>
        {/* konten */}
      </main>
      <Footer />
    </div>
  );
};


const CatatanHarian = () => {
  const symptoms = [
    ["Pusing", "Diare", "Jantung berdebar kencang"],
    ["Demam", "Keputihan", "Batuk pilek"],
    ["Mual muntah", "Pendarahan/keluar cairan", "Sesak nafas"],
    ["Sakit perut", "Sakit saat BAK", ""], // kolom ke-3 kosong
  ];

  // Mapping angka 1-11 untuk gejala
  const symptomIds = [
    1, 2, 3,
    4, 5, 6,
    7, 8, 9,
    10, 11,
  ];

  // State (jika dibutuhkan untuk penanganan form)
  const [formData, setFormData] = useState({
    kondisi: [],
    makanan: "",
    kondisiHarian: "",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Data terkirim:", formData);

    // Di sini bisa dikirim ke backend
    // Misalnya: axios.post("/api/catatan", formData)

    alert("Catatan harian berhasil dikirim!");
  };

  return (
    <div className="p-5 min-h-screen bg-white">
      <h1 className="text-3xl font-semibold text-center mb-10 font-poppins">
        Catatan Harian
      </h1>

      <form
        className="mx-auto max-w-[1022px] px-4"
        onSubmit={handleSubmit}
      >
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

        {/* Tombol Submit */}
        <div className="mt-8 text-right">
          <button
            type="submit"
            className="bg-[#4fa0ff] text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-500 transition"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CatatanHarian;
