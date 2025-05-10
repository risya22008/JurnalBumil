import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const BacaLaporan = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const idIbu = queryParams.get("id_ibu");
  const tanggal = queryParams.get("tanggal");

  const [laporan, setLaporan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchLaporan = async () => {
      try {

        const res = await fetch(
          `http://localhost:8000/api/histori/laporan/baca?id_ibu=${idIbu}&tanggal=${tanggal}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Gagal mengambil data laporan.");
        const data = await res.json();
        setLaporan(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };


    if (idIbu && tanggal) {
      fetchLaporan();
    } else {
      setError("ID Ibu dan tanggal tidak ditemukan di URL.");
      setLoading(false);
    }
  }, [idIbu, tanggal]);

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center">Memuat data...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex justify-center items-center text-red-500">{error}</div>;
  }

  return (
    <>
      <Navbar />
      <main className="bg-gray-100 min-h-screen p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg p-6 shadow space-y-6">
          <h1 className="text-2xl font-bold text-center">Catatan Laporan Kunjungan</h1>
          <p className="text-center text-blue-600">{laporan.data.tanggal}</p>

          <div className="text-left space-y-1">
            <p className="text-blue-800 font-semibold">Nama Ibu: <span className="font-normal text-black">{laporan.data.nama_ibu}</span></p>
            <p className="text-blue-800 font-semibold">Usia Kehamilan: <span className="font-normal text-black">{laporan.data.usia_kehamilan} Minggu</span></p>
          </div>

          {/* Fisik Ibu */}
          <Section title="Fisik Ibu">
            <Field label="Berat badan" value={`${laporan.data.berat_badan} kg`} />
            <Field label="Tinggi badan" value={`${laporan.data.tinggi_badan} cm`} />
            <Field label="Lingkar lengan atas" value={`${laporan.data.lingkar_lengan} cm`} />
          </Section>

          {/* Kondisi Janin */}
          <Section title="Kondisi Janin">
            <Field label="Tinggi rahim" value={`${laporan.data.tinggi_rahim} cm`} />
            <Field label="Letak janin" value={laporan.data.posisi_janin} />
            <Field label="Denyut jantung janin" value={`${laporan.data.denyut_nadi_janin} bpm`} />
          </Section>

          {/* Kondisi Ibu */}
          <Section title="Kondisi Ibu">
            <Field label="Tekanan darah" value={`${laporan.data.tekanan_darah} mmHg`} />
            <Field label="Tablet tambah darah" value={`${laporan.data.tablet_tambah_darah}`} />
            <Field label="Tes hemoglobin" value={`${laporan.data.tes_hemoglobin} g/dL`} />
            <Field label="Golongan darah" value={laporan.data.golongan_darah} />
            <Field label="Gula darah" value={`${laporan.data.gula_darah} mg/dL`} />
          </Section>

          {/* Penyakit */}
          <Section title="Penyakit">
            <Field label="Imunisasi tetanus" value={laporan.data.imunisasi_tetanus} />
            <Field label="HIV" value={laporan.data.hiv ? "Positif" : "Negatif"} />
            <Field label="Sifilis" value={laporan.data.sifilis ? "Positif" : "Negatif"} />
            <Field label="Hepatitis" value={laporan.data.hepatitis ? "Positif" : "Negatif"} />
          </Section>

          {/* Skrining Bidan */}
          <Section title="Skrining Bidan">
            <p>{laporan.data.hasil_skrining}</p>
          </Section>

          {/* Tombol Kembali */}
          <div className="flex justify-end">
            <button
              onClick={() => navigate(-1)}
              className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition"
            >
              Kembali
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

// Komponen pembantu
const Section = ({ title, children }) => (
  <div className="space-y-1">
    <h2 className="text-xl font-semibold mb-1 text-left">{title}:</h2>
    <div className="border border-blue-400 rounded-lg p-4 text-left">
      {children}
    </div>
  </div>
);


const Field = ({ label, value }) => (
  <p className="flex gap-2">
    <span>{label}:</span> <span>{value}</span>
  </p>
);

export default BacaLaporan;
