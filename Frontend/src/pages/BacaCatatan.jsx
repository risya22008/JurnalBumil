import React, { useState, useEffect } from 'react';
import { decodeJwt } from "../utils/decode";
import { useSearchParams } from "react-router-dom";
import Navbar from '../components/navbar';
import Footer from '../components/Footer';

const Catatan = () => {

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
    
    // State untuk menyimpan data catatan
    const [catatan, setCatatan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();

    const [error, setError] = useState(null);
    const id_ibu = searchParams.get("id_ibu");
    const tanggal = searchParams.get("tanggal");
  
    console.log(id_ibu)
    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log(id_ibu)
        // const decodedToken = decodeJwt(token);
        

        // const id_ibu = decodedToken?.id;
        // if (!id_ibu) {
        //   alert("ID pengguna tidak ditemukan di token.");
        //   return;
        // }
      
        // Fungsi untuk mengambil data catatan dari backend
        const fetchCatatan = async () => {
            try {
                // Membuat request ke API
                const response = await fetch(`http://localhost:8000/api/histori/catatan/baca?id_ibu=${id_ibu}&tanggal=${tanggal}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                console.log(response)
                
                // Mengecek jika response tidak OK
                if (!response.ok) {
                    throw new Error('Data tidak ditemukan atau terjadi kesalahan');
                }

                // Mengambil data JSON dari response
                const catatanInfo = await response.json();
                console.log(catatanInfo)
                // Menyimpan data catatan ke state
                setCatatan(catatanInfo.data);
                setLoading(false);  // Menandakan bahwa data sudah dimuat
                
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        // Memanggil fungsi fetch ketika komponen dimuat
        fetchCatatan();
    }, [id_ibu, tanggal]);  // Mengupdate setiap id_ibu dan tanggal berubah

    // Jika data masih dimuat, tampilkan loading spinner
    if (loading) {
        return <div>Loading...</div>;
    }

    // Jika terjadi error saat mengambil data
    if (error) {
        return <div>Error: {error}</div>;
    }

    // Jika tidak ada catatan ditemukan
    if (!catatan || catatan.length === 0) {
        return <div>Catatan tidak ditemukan untuk id_ibu dan tanggal yang diberikan.</div>;
    }

    // Menampilkan catatan
    return (
        <div className="flex flex-col min-h-screen">
        <Navbar />
      <div className="p-5 min-h-screen bg-white">
        <h1 className="text-3xl font-semibold text-center mb-10 font-poppins">
          Catatan Harian
        </h1>
  
        <form className="mx-auto max-w-[1022px] px-4">
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
                                // value={id.toString()}
                                checked={catatan.gejala.includes(id)}
                                readOnly
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
              value={catatan.catatan_konsumsi}
             readOnly
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
              value={catatan.catatan_kondisi}
              readOnly
            ></textarea>
          </div>
  
          {/* Skor Harian - Rating Bintang */}
          <div className="mt-8 mb-4 text-left">
            <p className="text-lg font-semibold mb-2 font-poppins">
              Seberapa puas bunda hari ini?
            </p>
            <div className="flex justify-start gap-2 text-2xl">
                {Array.from({ length: catatan.rating }).map((num, index) => (
                  <button
                    key={index}
                    type="button"
                    className="focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill={"#4fa0ff"}
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
  
         
        </form>
        <Footer />
      </div>
      </div>
    );
};

export default Catatan;
