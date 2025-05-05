import React from 'react'
import Star from './Star'
import { Link } from 'react-router-dom'

const CatatanCard = ({ mom, note }) => {
    const gejalaMap = {
        1: "Pusing",
        2: "Diare",
        3: "Jantung berdebar kencang",
        4: "Demam",
        5: "Keputihan",
        6: "Batuk pilek",
        7: "Mual muntah",
        8: "Pendarahan/keluar cairan",
        9: "Sesak nafas",
        10: "Sakit perut",
        11: "Sakit saat BAK",
    };

    return (
        <div className='bg-white px-6 md:px-10 lg:px-14 xl:px-20 py-6 md:py-10 rounded-xl flex flex-col gap-4 items-start text-base md:text-2xl text-[#02467C] text-start'>
            <span>Tanggal: {new Date(note.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
            <span>Usia Kehamilan: {mom.usia_kehamilan} minggu</span>
            <span>Kondisi Kesehatan:</span>
            <ul className="list-disc pl-5">
                {note.gejala && note.gejala.length > 0 ? (
                    note.gejala.map((id) => (
                        <li key={id}>{gejalaMap[id] || `Gejala ID ${id}`}</li>
                    ))
                ) : (
                    <li>Tidak ada gejala</li>
                )}
            </ul>
            <span>Rating Kondisi: </span>
            <div className='overflow-x-auto max-w-full'>
                <div className='flex gap-4 items-center'>
                    {[...Array(5)].map((_, index) => (
                        <Star key={index} active={index < note.rating} />
                    ))}
                </div>
            </div>

            <Link to={`/bacaCatatan?id_ibu=${mom.id}&tanggal=${note.date}`}>
                <button className='py-4 px-10 bg-[#02467C] text-white rounded-lg'>
                    Lihat Catatan
                </button>
            </Link>


        </div>
    )
}

export default CatatanCard
