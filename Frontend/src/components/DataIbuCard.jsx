import React from 'react'
import InitialAvatar from './Avatar'
import { Link } from 'react-router-dom'

export default function DataIbuCard({ ibu }) {
    return (
        <div className='bg-white rounded-2xl py-3 md:py-6 pl-4 md:pl-8 xl:pl-16 pr-2 md:pr-4 flex flex-row text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl gap-9 '>
            <div className="w-12 md:w-24 aspect-square">
                <InitialAvatar name={ibu.nama_ibu} />
            </div>
            <div className='flex flex-col text-[#02467C] gap-4 items-start' >
                <span>Nama Ibu: {ibu.nama_ibu}</span>
                <span>Usia Kehamilan: {ibu.usia_kehamilan} Minggu</span>
                <span>Kondisi Kesehatan :</span>
                <p className='text-black'>
                    {ibu.catatan[0]?.catatan_kondisi ?? "-"}
                </p>
                <div className='flex gap-6 flex-col md:flex-row'>
                    <Link to={`/history-catatan/${ibu.id}`}>
                        <button className='text-sm bg-[#02467C] text-white py-3 px-4 rounded-2xl'>History Catatan</button>
                    </Link>
                    <button className='text-sm bg-[#02467C] text-white py-3 px-4 rounded-2xl'>History Kunjungan</button>
                </div>
            </div>
        </div>
    )
}
