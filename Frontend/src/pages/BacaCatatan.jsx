import React, { useState, useEffect } from 'react';
import { decodeJwt } from "../utils/decode";
import { useSearchParams } from "react-router-dom";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
                const response = await fetch(`${BASE_URL}/api/histori/catatan/baca?id_ibu=${id_ibu}&tanggal=${tanggal}`,
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


        <div className="w-full p-3 rounded-md">
  <h2 className="text-2xl font-bold text-center">Catatan harian</h2>


</div>




  
        <form className="mx-auto max-w-[1022px] px-4">
          <div className="mb-6">
            <div className="text-left space-y-1 text-lg">
    <p className="text-blue-800 font-semibold">
      Tanggal: <span className="font-normal text-black">
    {new Date(catatan.date).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })} </span>
  </p>
    <p className="text-blue-800 font-semibold">
  Nama Ibu: <span className="font-normal text-black">{catatan.nama_ibu}</span>
</p>
<p className="text-blue-800 font-semibold mb-4">
  Usia Kehamilan: <span className="font-normal text-black">{catatan.usia_kehamilan} Minggu</span>
</p>
<br />
  </div>
            <p className="text-lg font-semibold text-left mb-4 font-poppins">
              Adakah gejala yang dialami?
            </p>
  
            <div className=" text-left grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
  {symptoms.flat().map((symptom, index) => {
    const id = symptomIds[index];
    if (!symptom) return null;
    return (
      <label key={id} className="flex items-center space-x-2">
        <input
          type="checkbox"
          className="custom-checkbox"
          name="kondisi"
          checked={catatan.gejala.includes(id)}
          readOnly
        />
        <span>{symptom}</span>
      </label>
    );
  })}
</div>

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
              Seberapa baik kondisi bunda hari ini?
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
