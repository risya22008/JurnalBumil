import React, { useEffect, useState } from 'react'
import InitialAvatar from '../components/Avatar'
import SubmitButton from '../components/SubmitButton'
import Navbar from '../components/navbar'
import axios from 'axios'
import { decodeJwt } from '../utils/decode'
import DataIbuCard from '../components/DataIbuCard'

const DataIbu = () => {
    const [token, setToken] = useState(null)
    const [decodedToken, setDecodedToken] = useState(null)
    const [momDatas, setMomDatas] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

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
                const response = await axios.get(`http://localhost:8000/api/bidan/${decodedToken.nama}/ibu`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                setMomDatas(response.data.dataIbu)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [token, decodedToken])

    if (error) {
        return <div className='min-h-screen flex justify-center items-center'>Something went wrong, please try again</div>
    }

    return (
        <>
            <Navbar />
            <main className='bg-[#f0f0f0] w-full min-h-screen'>
                <section className='container flex flex-col py-14 gap-4'>
                    {!loading ? (
                        Array.isArray(momDatas) && momDatas.length > 0 ? (
                            momDatas.map((ibu, index) => (
                                <DataIbuCard key={index} ibu={ibu} />
                            ))
                        ) : (
                            <div className='min-h-screen flex justify-center items-center'>
                                Tidak ada data ibu pada akun bidan ini
                            </div>
                        )
                    ) : (
                        <div className='min-h-screen flex justify-center items-center'>Loading...</div>
                    )}

                </section>
            </main>
        </>
    )
}

export default DataIbu
