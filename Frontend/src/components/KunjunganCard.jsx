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
        <div className='bg-white px-9 py-9 rounded-xl shadow-md flex flex-col gap-4 text-left'>
            <div className='text-[#02467C] grid grid-cols-[max-content_1fr] gap-x-3 gap-y-3 text-base md:text-2xl text-start'>
                <div>Tanggal Kunjungan</div>       <div>: {tanggal_kunjungan}</div>
                <div>Usia Kehamilan Saat Kunjungan</div> <div>: {data.usiaKehamilanSekarang} Minggu</div>
                <div>Berat Badan</div> <div>: {data.berat_badan ?? "-"} kg</div>
                <div>Kondisi Kesehatan</div> <div>: </div>
            </div>
            <p className='text-gray-700 text-base md:text-xl'>{hasil_skrinning}</p>

            <button 
                onClick={handleLaporanClick}
                className='mt-20 md:text-lg lg:text-xl py-3 px-6 w-fit bg-[#02467C] text-white rounded-2xl hover:bg-[#0368B5] hover:shadow-lg'
            >
                Laporan Kunjungan
            </button>
        </div>
    );
};

export default KunjunganCard;