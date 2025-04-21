import React, { useEffect, useState } from 'react'
import Navbar from '../components/navbar'
import { decodeJwt } from '../utils/decode'

export default function Laporan() {
    const [token, setToken] = useState(null)
    const [decodedToken, setDecodedToken] = useState(null)
    const [formData, setFormData] = useState({
        beratBadan: "",
        tinggiBadan: "",
        lingkarLengan: "",
        tinggiRahim: "",
        posisiJanin: "",
        denyutNadiJanin: "",
        tekananDarah: "",
        tabletTambahDarah: "",
        tesHemoglobin: "",
        imunisasiTetanus: "",
        gulaDarah: "",
        golonganDarah: "",
        hiv: "",
        sifilis: "",
        hepatitis: "",
        hasilSkrining: "",
    });

    useEffect(() => {
        const storedToken = localStorage.getItem("token")
        if (!storedToken) {
            window.location.href = "/login"
            return
        }

        setToken(storedToken)
        try {
            const decoded = decodeJwt(storedToken)
            setDecodedToken(decoded)
        } catch (err) {
            console.error("Token tidak valid:", err.message)
            window.location.href = "/login"
        }
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitted Data:", formData);
    };

    const fields = [
        { label: "Berat Badan", name: "beratBadan", unit: "kg" },
        { label: "Tinggi Badan", name: "tinggiBadan", unit: "cm" },
        { label: "Lingkar Lengan", name: "lingkarLengan", unit: "cm" },
        { label: "Tinggi Rahim", name: "tinggiRahim", unit: "cm" },
        { label: "Posisi Janin", name: "posisiJanin" },
        { label: "Denyut Nadi Janin", name: "denyutNadiJanin", unit: "b/m" },
        { label: "Tekanan Darah", name: "tekananDarah", unit: "mmHg" },
        { label: "Tablet Tambah Darah", name: "tabletTambahDarah" },
        { label: "Tes Hemoglobin", name: "tesHemoglobin", unit: "g/dL" },
        { label: "Imunisasi Tetanus", name: "imunisasiTetanus" },
        { label: "Gula Darah", name: "gulaDarah", unit: "mg/dL" },
        { label: "Golongan Darah", name: "golonganDarah" },
    ];

    const fields2 = [
        { label: "HIV", name: "hiv" },
        { label: "Sifilis", name: "sifilis" },
        { label: "Hepatitis", name: "hepatitis" },
    ];

    return (
        <>
            <Navbar />
            <main className='container py-12 flex flex-col gap-16'>
                <div className='flex flex-row gap-2 md:gap-8 items-center'>
                    <img src='/avatar.png' />
                    <h2 className='text-3xl'>{decodedToken?.nama ?? ""}</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-16">
                        {fields.map((field) => (
                            <div key={field.name} className='flex flex-col items-start gap-2'>
                                <label className="block font-semibold text-base md:text-2xl mb-1">{field.label}</label>
                                <div className="relative w-full">
                                    <input
                                        type="text"
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        className="w-full border border-[#4FA0FF] rounded-md md:rounded-[20px] h-14 md:h-20 px-3 pr-12 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                    {field.unit && (
                                        <span className="absolute right-8 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                                            {field.unit}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-16 mt-8'>
                        {fields2.map((field) => (
                            <div key={field.name} className='flex flex-col items-start gap-2'>
                                <label className="block font-semibold text-base md:text-2xl mb-1">{field.label}</label>
                                <div className="relative w-full">
                                    <input
                                        type="text"
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        className="w-full border border-[#4FA0FF] rounded-md md:rounded-[20px] h-14 md:h-20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex flex-col items-start gap-2 md:p-10">
                        <label className="block font-semibold text-base md:text-2xl mb-1">Hasil Skrining</label>
                        <textarea
                            name="hasilSkrining"
                            value={formData.hasilSkrining}
                            onChange={handleChange}
                            placeholder="Komentar dan Saran Bidan"
                            cols={6}
                            className="w-full h-32 md:h-40 border border-[#4FA0FF] rounded-[20px] p-3"
                        />
                    </div>

                    <div className="mt-6 text-right">
                        <button
                            type="submit"
                            className="bg-[#4FA0FF] text-white px-6 py-2 rounded-md transition"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </main>
        </>
    )
}
