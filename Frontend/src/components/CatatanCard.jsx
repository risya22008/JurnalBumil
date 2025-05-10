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

    const kondisiKesehatan = note.gejala
    .map((id) => gejalaMap[id] || `Gejala ID ${id}`)
    .join(", ");

        // Hitung usia kehamilan berdasarkan tanggal catatan (note.date)
    const hitungUsiaKehamilanPadaTanggal = (tanggalCatatan, tanggalRegistrasi, usiaAwal) => {
        if (!tanggalRegistrasi || usiaAwal == null) return "-";
        
        const tglCatatan = new Date(tanggalCatatan);
        const tglRegistrasi = new Date(tanggalRegistrasi._seconds * 1000); // jika pakai Firebase Timestamp
        
        const selisihHari = Math.floor((tglCatatan - tglRegistrasi) / (1000 * 60 * 60 * 24));
        const mingguTambahan = Math.floor(selisihHari / 7);

        return usiaAwal + mingguTambahan;
    };

    const usiaKehamilanSaatItu = hitungUsiaKehamilanPadaTanggal(
        note.date,
        mom.tanggal_registrasi,
        mom.usia_kehamilan
    );

    
    return (
        <div className='bg-white px-9 md:px-10 lg:px-14 xl:px-20 py-6 md:py-10 rounded-xl flex flex-col gap-4 items-start text-base md:text-2xl text-[#02467C] text-start'>
            <div className="grid grid-cols-[max-content_1fr] gap-x-3 gap-y-3 font-medium">
                <div>Tanggal</div>
                <div>: {new Date(note.date).toLocaleDateString('id-ID', {
                    day: '2-digit', 
                    month: 'long',
                    year: 'numeric'
                })}</div>

                <div>Usia Kehamilan</div>
                <div>: {usiaKehamilanSaatItu} Minggu</div>

                <div>Kondisi Kesehatan</div>
                <div>: {kondisiKesehatan || "Tidak ada gejala yang dipilih"}</div>

                <div className="self-start">Rating Kondisi</div>
                <div className="flex flex-col">
                    <span>:</span>
                    
                </div>
            
            </div>
            <div className='overflow-x-auto max-w-full mb-10'>
                <div className='flex gap-2 items-center whitespace-nowrap'>
                    {[...Array(5)].map((_, index) => (
                        <Star key={index} active={index < note.rating} />
                    ))}
                </div>
            </div>

            <Link to={`/bacaCatatan?id_ibu=${mom.id}&tanggal=${note.date}`}>
                <button className='text-base md:text-lg lg:text-xl bg-[#02467C] text-white py-3 px-6 rounded-2xl w-full sm:w-fit hover:bg-[#0368B5] hover:shadow-lg'>
                    Lihat Catatan
                </button>
            </Link>
            
            
        </div>
    )
}

export default CatatanCard
