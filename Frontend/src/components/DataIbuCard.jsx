import React from 'react'
import InitialAvatar from './Avatar'
import { Link } from 'react-router-dom'

export default function DataIbuCard({ ibu }) {
    return (
        
        <div className='bg-white rounded-2xl py-4 md:py-6 pl-4 md:pl-8 xl:pl-16 pr-2 md:pr-4 flex flex-row text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl gap-9 '>
    
            <div className="w-12 md:w-24 aspect-square">
                <InitialAvatar name={ibu.nama_ibu} />
            </div>

            <div className="flex-1 md:text-lg lg:text-xl text-[#02467C]">
            <div className='grid grid-cols-[250px_1fr] text-[#02467C] gap-4 text-start' >
                <div>Nama Ibu</div><div>: {ibu.nama_ibu}</div>
                <div>Usia Kehamilan</div><div>: {ibu.usia_kehamilan} Minggu</div>
                <span>Kondisi Kesehatan</span>
                <div>:</div>
                <p className='text-black mb-6 md:mb-10 lg:mb-12'>
                    {ibu.catatan[0]?.catatan_kondisi ?? "-"}
                </p>
                
            </div>
            
            <div className='flex gap-9 flex-col md:flex-row'>
                    <Link to={`/history-catatan/${ibu.id}`}>
                        <button className='text-base md:text-lg lg:text-xl bg-[#02467C] text-white py-4 px-7 rounded-2xl '>History Catatan</button>
                    </Link>
                    <Link to={`/history-kunjungan/${ibu.id}`}>
                    <button className='text-base md:text-lg lg:text-xl bg-[#02467C] text-white py-4 px-7 rounded-2xl '>History Kunjungan</button>
                    </Link>
                    
            </div>
            </div>
            
        </div>

        
        
    )
}
