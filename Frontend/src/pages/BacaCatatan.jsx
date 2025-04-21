import React, { useState, useEffect } from 'react';

const Catatan = ({ id_ibu, tanggal }) => {
    // State untuk menyimpan data catatan
    const [catatan, setCatatan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fungsi untuk mengambil data catatan dari backend
        const fetchCatatan = async () => {
            try {
                // Membuat request ke API
                const response = await fetch(`/ibu/${id_ibu}/catatan?tanggal=${tanggal}`);
                
                // Mengecek jika response tidak OK
                if (!response.ok) {
                    throw new Error('Data tidak ditemukan atau terjadi kesalahan');
                }

                // Mengambil data JSON dari response
                const data = await response.json();

                // Menyimpan data catatan ke state
                setCatatan(data.dataCatatan);
                setLoading(false);  // Menandakan bahwa data sudah dimuat
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        // Memanggil fungsi fetch ketika komponen dimuat
        fetchCatatan();
    }, [id_ibu, tanggal]);  // Mengupdate setiap id_ibu dan tanggal berubah

    // Jika data masih dimuat, tampilkan loading spinner
    if (loading) {
        return <div>Loading...</div>;
    }

    // Jika terjadi error saat mengambil data
    if (error) {
        return <div>Error: {error}</div>;
    }

    // Jika tidak ada catatan ditemukan
    if (!catatan || catatan.length === 0) {
        return <div>Catatan tidak ditemukan untuk id_ibu dan tanggal yang diberikan.</div>;
    }

    // Menampilkan catatan
    return (
        <div>
            <h2>Catatan untuk Ibu {id_ibu} pada tanggal {tanggal}</h2>
            <ul>
                {catatan.map((item) => (
                    <li key={item.id}>
                        <h3>Catatan pada {item.date}</h3>
                        <p><strong>Kondisi:</strong> {item.catatan_kondisi}</p>
                        <p><strong>Konsumsi:</strong> {item.catatan_konsumsi}</p>
                        <p><strong>Gejala:</strong> {item.gejala.join(", ")}</p>
                        <p><strong>Rating:</strong> {item.rating}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Catatan;
