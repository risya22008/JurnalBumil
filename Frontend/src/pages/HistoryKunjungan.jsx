import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import InitialAvatar from '../components/Avatar'
import GrafikLapKun from '../components/GrafikLapkun'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'
import LapKun from './LapKun'
import KunjunganCard from '../components/KunjunganCard'
import { decodeJwt } from '../utils/decode'; // import decodeJwt

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const HistoryKunjungan = () => {
    const { id } = useParams()

    const [momData, setMomData] = useState(null)
    const [kunjunganList, setKunjunganList] = useState([])
    const [decodedToken, setDecodedToken] = useState(null)
    const [laporanList, setLaporanList] = useState([])
    const [grafikData, setGrafikData] = useState([]);

    const getUsiaKehamilanSekarang = (momData) => {
            if (!momData?.tanggal_registrasi?._seconds || momData?.usia_kehamilan == null) return null;

            const tanggalRegistrasi = new Date(momData.tanggal_registrasi._seconds * 1000);
            const sekarang = new Date();

            const selisihHari = Math.floor((sekarang - tanggalRegistrasi) / (1000 * 60 * 60 * 24));
            const mingguTambahan = Math.floor(selisihHari / 7);

            return momData.usia_kehamilan + mingguTambahan;
        };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setDecodedToken(decodeJwt(token)); // decode token once and store
        }

        

        const fetchMomData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/ibu/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                })
                setMomData(response.data)
                console.log("Kunjungan response:", response.data);
            } catch (error) {
                console.error("Error fetching mom data:", error)
            }
        }

        

        const fetchLaporanKunjungan = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/laporan-kunjungan/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                })
                setLaporanList(response.data.data)
                console.log("Kunjungan response:", response.data);
            } catch (error) {
                console.error("Error fetching laporan kunjungan:", error)
            }
        }

        

        const fetchKunjungan = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/histori/kunjungan/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                })
                setKunjunganList(
                        response.data.data.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
                        );

                console.log("Kunjungan response:", response.data);
            } catch (error) {
                console.error("Error fetching kunjungan data:", error)
            }
        }

        const fetchGrafikData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/laporan-kunjungan/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
            },
        });

        
        if (Array.isArray(response.data)) {
            const data = response.data.map((item) => ({
                x: item.tanggal, 
                berat_badan: item.berat_badan,
                lila: item.lingkar_lengan,  
                tinggi_rahim: item.tinggi_rahim,
                denyut_janin: item.denyut_nadi_janin,  
                tekanan_darah: item.tekanan_darah,
                hemoglobin: item.tes_hemoglobin,  
                gula_darah: item.gula_darah,
                imunisasi_tetanus: item.imunisasi_tetanus,
                tablet_tambah_darah: item.tablet_tambah_darah,
            }));
            setGrafikData(data);
        } else {
            console.error("Grafik data tidak valid:", response.data);
        }
    } catch (error) {
        console.error("Error fetching grafik data:", error);
    }
}

        fetchMomData();
        fetchKunjungan();
        fetchLaporanKunjungan();
        fetchGrafikData();

    }, [id])

    return (
        <>
            <Navbar />
            <main className='bg-[#f0f0f0] w-full min-h-screen'>
                <section className='container flex flex-col py-14 gap-4'>

                    {/* Informasi Ibu dan Tombol */}
                    {momData && (
                        <div className='bg-white px-9 py-12 rounded-xl'>
                        <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center w-full gap-6'>
                           <div className='flex items-start gap-6'>
                               <InitialAvatar name={momData.nama_ibu} />
                               <div className='text-[#02467C] grid grid-cols-[max-content_1fr] gap-x-3 gap-y-3 text-base md:text-2xl  text-start'>
                                   <div>Nama Ibu</div>       <div>: {momData.nama_ibu ?? ""}</div>
                                   <div>Usia Kehamilan</div> <div>: {getUsiaKehamilanSekarang(momData)} Minggu</div>
                               </div>
                           </div>
                   
                           <Link to={`/history-catatan/${id}`}>
                               <button className='text-base md:text-lg lg:text-xl bg-[#02467C] text-white py-4 px-7 rounded-2xl self-start lg:self-center hover:bg-[#0368B5] hover:shadow-lg'>
                                   History Catatan
                               </button>
                           </Link>
                       </div>
                   </div>
                    )}

                    {/* Grafik Kunjungan */}
                    <div className='bg-white px-4 py-20 rounded-xl shadow w-full overflow-x-auto md:gap-12 mt-14'>
=======
                    
                    {grafikData.length > 0 ? (
                        <GrafikLapKun data={[...grafikData].sort((a, b) => new Date(a.x) - new Date(b.x))} />
                    ) : (
                        <p>Data grafik tidak tersedia.</p>
                    )}
                    </div>

                    {/* Daftar Kunjungan */}
                    <div className='flex flex-col gap-8 md:gap-12 mt-14'>
                    {kunjunganList.length > 0 ? (
                        [...kunjunganList]
                        .sort((b, a) => new Date(a.tanggal) - new Date(b.tanggal))
                        .map((kunjungan, index) => (
                            <KunjunganCard
                            key={`${kunjungan.tanggal_kunjungan}-${index}`}
                            data={kunjungan}
                            momId={momData.id}
                            />
                        ))
                    ) : (
                        <div className='bg-white px-4 py-6 rounded-xl text-center'>
                        <p>Tidak ada kunjungan yang tercatat.</p>
                        </div>
                    )}
                    </div>

                </section>
            </main>
        </>
    )
}

export default HistoryKunjungan
