import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import InitialAvatar from '../components/Avatar'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import Star from '../components/Star'
import CatatanCard from '../components/CatatanCard'

const HistoryCatatanIbu = () => {

    const { id } = useParams()

    const [momData, setMomData] = useState(null)
    const [momNotes, setMomNotes] = useState(null)
    useEffect(() => {
        const fetchMomData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/ibu/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });
                setMomData(response.data);
            } catch (error) {
                console.error("Error fetching mom data:", error);
            }
        }

        const fetchCatatanByMomId = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/catatan/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });
                console.log(response.data.data)
                setMomNotes(response.data.data);
            } catch (error) {
                console.error("Error fetching mom notes:", error);
            }

        }
        fetchMomData()

        fetchCatatanByMomId()
    }, [id])

    return (
        <>
            <Navbar />
            <main className='bg-[#f0f0f0] w-full min-h-screen'>
                <section className='container flex flex-col py-14 gap-4'>

                    {momData && (
                       <div className='bg-white px-9 py-12 rounded-xl'>
                       <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center w-full gap-6'>
                           <div className='flex items-start gap-6'>
                               <InitialAvatar name={momData.nama_ibu} />
                               <div className='text-[#02467C] grid grid-cols-[max-content_1fr] gap-x-3 gap-y-3 text-base md:text-2xl text-start'>
                                   <div>Nama Ibu</div>       <div>: {momData.nama_ibu ?? ""}</div>
                                   <div>Usia Kehamilan</div> <div>: {momData.usia_kehamilan} Minggu</div>
                               </div>
                           </div>
                   
                           <Link to={`/history-kunjungan/${id}`}>
                               <button className='text-base md:text-lg lg:text-xl bg-[#02467C] text-white py-4 px-7 rounded-2xl self-start lg:self-center hover:bg-[#0368B5] hover:shadow-lg'>
                                   History Kunjungan
                               </button>
                           </Link>
                       </div>
                       </div>
                   )}
                    <div className='flex flex-col gap-8 md:gap-16 mt-14'>
                        {momNotes && momNotes.length > 0 ? (
                            momNotes.map((note) => (
                                <CatatanCard key={note.id} mom={momData} note={note} />
                            ))) : (
                            <div className='bg-white px-4 py-6 rounded-xl flex flex-col gap-4 lg:flex-row justify-between items-center'>
                                <p>Tidak ada catatan untuk ibu ini.</p>
                            </div>)}
                    </div>

                </section>
            </main>
        </>
    )
}

export default HistoryCatatanIbu
