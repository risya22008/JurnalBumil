import React from 'react'
import InitialAvatar from './Avatar'
import { Link } from 'react-router-dom'

export default function DataIbuCard({ ibu }) {
    return (
        <div className='
            bg-white rounded-2xl py-4 md:py-6 px-4 
            flex flex-wrap md:flex-nowrap 
            text-base md:text-lg lg:text-xl xl:text-2xl 
            gap-6 md:gap-9
            w-full
        '>
            <div className="w-16 md:w-24 aspect-square flex-shrink-0">
                <InitialAvatar name={ibu.nama_ibu} />
            </div>

            <div className="flex-1 text-[#02467C] min-w-0">
                <div className='
                    grid grid-cols-[minmax(100px,_auto)_1fr] md:grid-cols-[250px_1fr]
                    gap-2 md:gap-4 text-start text-sm md:text-base lg:text-lg
                '>
                    <div>Nama Ibu</div><div className="truncate">: {ibu.nama_ibu}</div>
                    <div>Usia Kehamilan</div><div>: {ibu.usia_kehamilan} Minggu</div>
                    <div>Kondisi Kesehatan</div><div>:</div>
                    <p className="col-span-2 text-black mb-4 md:mb-10 lg:mb-12 break-words">
                    {ibu.ringkasan_catatan || "-"}
                    </p>


                </div>

                <div className='flex flex-col md:flex-row gap-4 md:gap-9 mt-2 md:mt-6'>
                    <Link to={`/history-catatan/${ibu.id}`} className='w-full md:w-auto'>
                        <button className='
                           text-sm sm:text-base md:text-lg lg:text-xl bg-[#02467C] text-white py-2 px-4 sm:py-3 sm:px-6 md:py-4 md:px-7 rounded-2xl hover:bg-[#0368B5] hover:shadow-lg w-full
                        '>
                            History Catatan
                        </button>
                    </Link>
                    <Link to={`/history-kunjungan/${ibu.id}`} className='w-full md:w-auto'>
                        <button className='
                           text-sm sm:text-base md:text-lg lg:text-xl bg-[#02467C] text-white py-2 px-4 sm:py-3 sm:px-6 md:py-4 md:px-7 rounded-2xl hover:bg-[#0368B5] hover:shadow-lg w-full
                        '>
                            History Kunjungan
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
