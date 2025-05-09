import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import InitialAvatar from '../components/Avatar'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'
import LapKun from './LapKun'
import KunjunganCard from '../components/KunjunganCard'
import { decodeJwt } from '../utils/decode'; // import decodeJwt

const HistoryKunjungan = () => {
    const { id } = useParams()

    const [momData, setMomData] = useState(null)
    const [kunjunganList, setKunjunganList] = useState([])
    const [decodedToken, setDecodedToken] = useState(null)
    const [laporanList, setLaporanList] = useState([])

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setDecodedToken(decodeJwt(token)); // decode token once and store
        }

        const fetchMomData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/ibu/${id}`, {
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
                const response = await axios.get(`http://localhost:8000/api/laporan-kunjungan/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                })
                console.log("Laporan Kunjungan:", response.data.data);  // Log data di sini
                const parsedData = response.data.data.map(laporan => ({
                    ...laporan,
                    tanggal: new Date(laporan.tanggal._seconds * 1000).toLocaleDateString()
                }));
                setLaporanList(parsedData);
            } catch (error) {
                console.error("Error fetching laporan kunjungan:", error)
            }
        }
        

        const fetchKunjungan = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/histori/kunjungan/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                })
                setKunjunganList(response.data.data)
                console.log("Kunjungan response:", response.data);
            } catch (error) {
                console.error("Error fetching kunjungan data:", error)
            }
        }

        fetchMomData();
        fetchKunjungan();
        fetchLaporanKunjungan();

    }, [id])

    return (
        <>
            <Navbar />
            <main className='bg-[#f0f0f0] w-full min-h-screen'>
                <section className='container flex flex-col py-14 gap-4'>

                    {/* Informasi Ibu dan Tombol */}
                    {momData && (
                        <div className='bg-white px-4 py-6 rounded-xl flex flex-col gap-4 lg:flex-row justify-between items-center'>
                            <div className='flex flex-row gap-6'>
                                <InitialAvatar name={momData.nama_ibu} />
                                <div className='text-[#02467C] flex flex-col text-base md:text-2xl gap-4 items-start'>
                                    <span>Nama Ibu: {momData.nama_ibu ?? ""}</span>
                                    <span>Usia Kehamilan: {momData.usia_kehamilan} Minggu</span>
                                </div>
                            </div>
                            {decodedToken && (
                                <Link to={`/history-catatan/${momData.id}`}>
                                    <button className='py-4 px-10 bg-[#02467C] text-white rounded-lg'>
                                        Histori Catatan
                                    </button>
                                </Link>
                            )}
                        </div>
                    )}

                    {/* Grafik Kunjungan */}
                    <div className='bg-white px-4 py-6 rounded-xl shadow'>
                        <LapKun />
                    

                    {/* Tabel Berat Badan */}
                    {laporanList.length > 0 && (
                        <div className='bg-white px-4 py-6 rounded-xl shadow'>
                            <h2 className='text-[#02467C] text-xl font-semibold mb-4'>Tabel Berat Badan</h2>
                            <table className='w-full text-left border'>
                                <thead>
                                    <tr className='bg-[#02467C] text-white'>
                                        <th className='px-4 py-2'>Tanggal</th>
                                        <th className='px-4 py-2'>Berat Badan (kg)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {laporanList.map((laporan, index) => (
                                        <tr key={index} className='border-t'>
                                            <td className='px-4 py-2'>{laporan.tanggal}</td>
                                            <td className='px-4 py-2'>{laporan.berat_badan ?? "-"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

</div>

                    {/* Daftar Kunjungan */}
                    <div className='flex flex-col gap-8 md:gap-12 mt-14'>
                        {kunjunganList.length > 0 ? (
                            kunjunganList.map((kunjungan, index) => (
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
