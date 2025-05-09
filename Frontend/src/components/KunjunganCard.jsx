import React from 'react';
import { useNavigate } from "react-router-dom";

const KunjunganCard = ({ data, momId }) => {
    const { tanggal_kunjungan, hasil_skrinning } = data;
    const navigate = useNavigate();

    const formatTanggalToISO = (tanggalString) => {
        const [tanggal, bulan, tahun] = tanggalString.split(" ");
        const bulanMap = {
            Januari: "01",
            Februari: "02",
            Maret: "03",
            April: "04",
            Mei: "05",
            Juni: "06",
            Juli: "07",
            Agustus: "08",
            September: "09",
            Oktober: "10",
            November: "11",
            Desember: "12",
        };
        const bulanISO = bulanMap[bulan];
        return `${tahun}-${bulanISO}-${tanggal.padStart(2, "0")}`;
    };

    const calculateUsiaKehamilan = () => {
        const tanggalFormatted = formatTanggalToISO(tanggal_kunjungan);
        const tanggalKunjunganDate = new Date(tanggalFormatted);
        const today = new Date();

        const selisihHari = Math.floor((today - tanggalKunjunganDate) / (1000 * 60 * 60 * 24));
        const mingguTambahan = Math.floor(selisihHari / 7);

        const usiaKehamilanSaatItu = data.usiaKehamilanSekarang + mingguTambahan;

        return usiaKehamilanSaatItu;
    };

    const handleLaporanClick = () => {
        if (momId) {
            const formattedDate = formatTanggalToISO(tanggal_kunjungan);
            navigate(`/bacaLaporan?id_ibu=${momId}&tanggal=${formattedDate}`);
        } else {
            console.error('Mom ID is missing!');
        }
    };

    return (
        <div className='bg-white px-6 py-6 rounded-xl shadow-md flex flex-col gap-4 text-left'>
            <p className='text-[#02467C] text-base md:text-2xl font-medium'>
                Tanggal Kunjungan: {tanggal_kunjungan}
            </p>
            <p className='text-[#02467C] text-base md:text-2xl'>
                  Usia Kehamilan Saat Kunjungan: {data.usiaKehamilanSekarang} Minggu
            </p>
            <p className='text-[#02467C] text-base md:text-2xl'>
            Berat Badan: {data.berat_badan ?? "-"} kg
            </p>

            <p className='text-[#02467C] text-base md:text-2xl'>Kondisi Kesehatan:</p>
            <p className='text-gray-700 text-base md:text-xl'>{hasil_skrinning}</p>

            <button 
                onClick={handleLaporanClick}
                className='mt-20 py-2 px-4 w-fit bg-[#02467C] text-white rounded-md '
            >
                Laporan Kunjungan
            </button>
        </div>
    );
};

export default KunjunganCard;
