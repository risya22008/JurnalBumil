import React, { useEffect, useState } from 'react'
import Navbar from '../components/navbar'
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
    const [grafikData, setGrafikData] = useState([]);

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

        const fetchKunjungan = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/laporan/bidan/${id}`, {
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

        const fetchGrafikData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/laporan/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = response.data.data.map((item) => ({
                    x: item.tanggal_kunjungan,
                    berat_badan: item.berat_badan,
                    lila: item.lila,
                    tinggi_rahim: item.tinggi_rahim,
                    denyut_janin: item.denyut_janin,
                    tekanan_darah: item.tekanan_darah,
                    hemoglobin: item.hemoglobin,
                    gula_darah: item.gula_darah,
                    imunisasi_tetanus: item.imunisasi_tetanus,
                    tablet_tambah_darah: item.tablet_tambah_darah,
                }));
                setGrafikData(data);
                console.log("Grafik data response:", response.data);
            } catch (error) {
                console.error("Error fetching grafik data:", error);
            }
        };

        fetchMomData()
        fetchKunjungan()
        fetchGrafikData();
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
                    {grafikData.length > 0 ? (
                        <GrafikLapKun data={grafikData} />
                    ) : (
                        <p>Data grafik tidak tersedia.</p>
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
