import React, { useEffect, useState, useRef } from 'react'
import Navbar from '../components/Navbar'
import { decodeJwt } from '../utils/decode'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Laporan() {
    const [token, setToken] = useState(null)
    const [decodedToken, setDecodedToken] = useState(null)
    const [momDatas, setMomDatas] = useState([])
    const [selectedMom, setSelectedMom] = useState("")
    const [loading, setLoading] = useState(true)
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
    })
    const navigate = useNavigate();

    const inputRefs = useRef([]);
    const totalInputCount = 16; // 12 + 3 + 1

    const handleKeyDown = (e, index) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const isLast = index === totalInputCount - 1;
            if (!isLast) {
                inputRefs.current[index + 1]?.focus();
            } else {
                handleSubmit(e);
            }
        }
    };

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

    useEffect(() => {
        const fetchData = async () => {
            if (!token || !decodedToken) return
            setLoading(true)
            try {
                const response = await axios.get(`${BASE_URL}/api/bidan/${decodedToken.nama}/ibu`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                setMomDatas(response.data.dataIbu)
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [token, decodedToken])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMom) {
        alert("Silakan pilih ibu terlebih dahulu.");
        return;
    }

    const requiredFields = [
        ...fields.map(f => f.name),
        ...fields2.map(f => f.name),
        "hasilSkrining"
    ];

    const emptyFields = requiredFields.filter((field) => !formData[field] || formData[field].trim() === "");

    if (emptyFields.length > 0) {
        alert("Harap lengkapi semua kolom sebelum mengirim.");
        return;
    }

    const todayDate = new Date().toLocaleDateString("sv-SE");

    try {
        const response = await axios.post(
            `${BASE_URL}/api/laporan-kunjungan`,
            {
                berat_badan: formData.beratBadan,
                tinggi_badan: formData.tinggiBadan,
                lingkar_lengan: formData.lingkarLengan,
                tinggi_rahim: formData.tinggiRahim,
                posisi_janin: formData.posisiJanin,
                denyut_nadi_janin: formData.denyutNadiJanin,
                tekanan_darah: formData.tekananDarah,
                tablet_tambah_darah: formData.tabletTambahDarah,
                tes_hemoglobin: formData.tesHemoglobin,
                imunisasi_tetanus: formData.imunisasiTetanus,
                gula_darah: formData.gulaDarah,
                golongan_darah: formData.golonganDarah,
                hiv: formData.hiv,
                sifilis: formData.sifilis,
                tes_hepatitis: formData.hepatitis,
                hasil_skrining: formData.hasilSkrining,
                id_ibu: selectedMom,
                date: todayDate,
                id_bidan: decodedToken?.id,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        alert('Laporan berhasil disimpan!');
        navigate(`/bacaLaporan?id_ibu=${selectedMom}&tanggal=${todayDate}`);
    } catch (error) {
        console.error('Gagal menyimpan laporan:', error);
        alert('Terjadi kesalahan saat menyimpan laporan');
    }
};


    const fields = [
        { label: "Berat Badan", name: "beratBadan", unit: "kg", type: "number" },
        { label: "Tinggi Badan", name: "tinggiBadan", unit: "cm", type: "number" },
        { label: "Lingkar Lengan", name: "lingkarLengan", unit: "cm", type: "number" },
        { label: "Tinggi Rahim", name: "tinggiRahim", unit: "cm", type: "number" },
        { label: "Posisi Janin", name: "posisiJanin", type: "text" },
        { label: "Denyut Nadi Janin", name: "denyutNadiJanin", unit: "b/m", type: "number" },
        { label: "Tekanan Darah", name: "tekananDarah", unit: "mmHg", type: "number" },
        { label: "Tablet Tambah Darah", name: "tabletTambahDarah", type: "number" },
        { label: "Tes Hemoglobin", name: "tesHemoglobin", unit: "g/dL", type: "number" },
        { label: "Imunisasi Tetanus", name: "imunisasiTetanus", type: "text" },
        { label: "Gula Darah", name: "gulaDarah", unit: "mg/dL", type: "number" },
        { label: "Golongan Darah", name: "golonganDarah", type: "select", options: ["A", "B", "AB", "O"] },
    ];

    const fields2 = [
        { label: "HIV", name: "hiv", type: "select", options: [{ label: "Ya", value: "true" }, { label: "Tidak", value: "false" }] },
        { label: "Sifilis", name: "sifilis", type: "select", options: [{ label: "Ya", value: "true" }, { label: "Tidak", value: "false" }] },
        { label: "Hepatitis", name: "hepatitis", type: "select", options: [{ label: "Ya", value: "true" }, { label: "Tidak", value: "false" }] },
    ];

    return (
        <>
            <Navbar />
            <main className='container py-12 flex flex-col gap-16'>
                <div className='flex flex-col sm:flex-row gap-4 sm:gap-8 items-center'>
                    <img src='/avatar.png' />
                    <h2 className='text-3xl'>{decodedToken?.nama ?? ""}</h2>
                </div>
                {!loading && (
                    <div className="mb-8 flex flex-col gap-4 items-start">
                        <label className="block font-semibold text-base md:text-2xl mb-2">Pilih Ibu</label>
                        <select
                            className="w-full max-w-xs md:max-w-md border border-[#4FA0FF] rounded-[20px] h-14 md:h-16 px-4"
                            value={selectedMom}
                            onChange={(e) => setSelectedMom(e.target.value)}
                        >
                            <option value="">Pilih Ibu</option>
                            {momDatas.map((mom) => (
                                <option key={mom.id} value={mom.id}>{mom.nama_ibu}</option>
                            ))}
                        </select>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-16">
                        {fields.map((field, index) => (
                            <div key={field.name} className='flex flex-col items-start gap-2'>
                                <label className="block font-semibold text-base md:text-2xl mb-1">{field.label}</label>
                                <div className="relative w-full ">
                                    {field.type === "select" ? (
                                        <select
                                            ref={(el) => (inputRefs.current[index] = el)}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                            name={field.name}
                                            value={formData[field.name]}
                                            onChange={handleChange}
                                            className="w-full border border-[#4FA0FF] rounded-md md:rounded-[20px] h-14 md:h-20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        >
                                            <option value="">Pilih</option>
                                            {field.options.map((opt) => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <>
                                            <input
                                                ref={(el) => (inputRefs.current[index] = el)}
                                                onKeyDown={(e) => handleKeyDown(e, index)}
                                                type={field.type}
                                                name={field.name}
                                                value={formData[field.name]}
                                                onChange={handleChange}
                                                className="w-full border border-[#4FA0FF] rounded-md md:rounded-[20px] h-14 md:h-20 px-3 pr-20 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                            />
                                            {field.unit && (
                                                <span className="absolute right-8 top-1/2 transform -translate-y-1/2  text-xs sm:text-sm text-gray-500">{field.unit}</span>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-16 mt-8'>
                        {fields2.map((field, index) => (
                            <div key={field.name} className='flex flex-col items-start gap-2'>
                                <label className="block font-semibold text-base md:text-2xl mb-1">{field.label}</label>
                                <div className="relative w-full">
                                    <select
                                        ref={(el) => (inputRefs.current[fields.length + index] = el)}
                                        onKeyDown={(e) => handleKeyDown(e, fields.length + index)}
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        className="w-full border border-[#4FA0FF] rounded-md md:rounded-[20px] h-14 md:h-20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    >
                                        <option value="">Pilih</option>
                                        {field.options.map((opt) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex flex-col items-start gap-2 md:p-10">
                        <label className="block font-semibold text-base md:text-2xl mb-1">Hasil Skrining</label>
                        <textarea
                            ref={(el) => (inputRefs.current[totalInputCount - 1] = el)}
                            onKeyDown={(e) => handleKeyDown(e, totalInputCount - 1)}
                            name="hasilSkrining"
                            value={formData.hasilSkrining}
                            onChange={handleChange}
                            placeholder="Komentar dan Saran Bidan"
                            cols={6}
                            className="w-full h-32 md:h-40 border border-[#4FA0FF] rounded-[20px] p-3"
                        />
                    </div>

                    <div className="mt-6 text-right">
                        <button type="submit" className="bg-[#4FA0FF] text-white px-6 py-2 rounded-md transition">
                            Submit
                        </button>
                    </div>
                </form>
            </main>
        </>
    )
}
