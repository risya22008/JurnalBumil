const bcrypt = require("bcrypt");
const { db } = require("../firebaseClient");
const jwt = require("jsonwebtoken");
const { summarizeText } = require('../services/groqService');

class IbuService {
    async createIbu(ibu) {
        const hashedPassword = await bcrypt.hash(ibu.sandi_ibu, 10);
        const newIbu = {
            nama_ibu: ibu.nama_ibu,
            email_ibu: ibu.email_ibu,
            sandi_ibu: hashedPassword,
            usia_kehamilan: ibu.usia_kehamilan,
            bidan: ibu.bidan || null,
            tanggal_registrasi: new Date(),
            verifikasi_email: 0 // Belum diverifikasi
        };

        const emailExistsInIbu = await db.collection("Ibu").where("email_ibu", "==", ibu.email_ibu).get();
        const emailExistsInBidan = await db.collection("Bidan").where("email_bidan", "==", ibu.email_ibu).get();

        if (!emailExistsInIbu.empty || !emailExistsInBidan.empty) {
            throw new Error("Email sudah digunakan");
        }

        const ibuRef = await db.collection("Ibu").add(newIbu);
        return { id: ibuRef.id, ...newIbu };
    }

    async findByEmail(email) {
        const ibuSnapshot = await db.collection("Ibu").where("email_ibu", "==", email).get();
        return !ibuSnapshot.empty;
    }

    async getAllIbuByKodeBidan(kode_bidan) {
        const ibuSnapshot = await db.collection("Ibu").where("kode_bidan", "==", kode_bidan).select("nama_ibu", "usia_kehamilan").get();
        if (ibuSnapshot.empty) {
            console.log('No matching documents.');
            return;
        }

        const docs = ibuSnapshot.docs;
        const dataIbu = docs.map(doc => {
            return {
                id: doc.id, ...doc.data()
            };
        });

        return dataIbu;
    }

    async getAllIbuWithCatatanByNamaBidan(nama_bidan) {
        try {
            const ibuSnapshot = await db
                .collection("Ibu")
                .where("bidan", "==", nama_bidan)
                .select("nama_ibu", "email_ibu", "usia_kehamilan", "tanggal_registrasi", "verifikasi_email")
                .get();

            if (ibuSnapshot.empty) {
                return [];
            }

            const ibuDataWithCatatan = await Promise.all(
                ibuSnapshot.docs.map(async (ibuDoc) => {
                    const ibuData = ibuDoc.data();
                    const id_ibu = ibuDoc.id;

                    const tanggalRegistrasi = ibuData.tanggal_registrasi.toDate();
                    const usiaAwal = ibuData.usia_kehamilan || 0;
                    const sekarang = new Date();
                    const selisihHari = Math.floor((sekarang - tanggalRegistrasi) / (1000 * 60 * 60 * 24));
                    const mingguTambahan = Math.floor(selisihHari / 7);
                    const usiaKehamilanSekarang = usiaAwal + mingguTambahan;

                    const catatanSnapshot = await db
                        .collection("Catatan")
                        .where("id_ibu", "==", id_ibu)
                        .get();

                    catatanSnapshot.docs.forEach(doc => {
                        console.log("Isi catatan:", doc.data());
                    });

                    const catatanList = await Promise.all(
                        catatanSnapshot.docs.map(async (doc) => {
                            const data = doc.data();
                            const isi = data.catatan_kondisi || "";

                            let ringkasan = "";
                            if (isi.trim().length > 0) {
                                try {
                                    ringkasan = await summarizeText(isi);
                                } catch (err) {
                                    console.warn(`Gagal merangkum catatan ${doc.id}:`, err.message);
                                }
                            }

                            return {
                                id: doc.id,
                                ...data,
                                ringkasan_catatan: ringkasan
                            };
                        })
                    );

                    return {
                        id: id_ibu,
                        ...ibuData,
                        usia_kehamilan: usiaKehamilanSekarang,
                        catatan: catatanList
                    };
                })
            );

            return ibuDataWithCatatan;
        } catch (error) {
            console.error("Gagal mengambil data ibu & catatan:", error);
            throw new Error("Terjadi kesalahan saat mengambil data");
        }
    }

    async loginIbu(loginData) {
        const emailExistsInIbu = await db.collection("Ibu").where("email_ibu", "==", loginData.email_ibu).get();

        if (emailExistsInIbu.empty) {
            throw new Error("User belum terdaftar!");
        }

        const userData = emailExistsInIbu.docs[0].data();
        userData.id = emailExistsInIbu.docs[0].id;

        const isMatch = await bcrypt.compare(loginData.sandi_ibu, userData.sandi_ibu);

        if (isMatch) {
            if (userData.verifikasi_email !== 2) {
                throw new Error("Akun belum diverifikasi!");
            }
            const authToken = this.generateAuthToken(userData);
            return authToken;
        } else {
            throw new Error("Invalid credentials");
        }
    }

    generateAuthToken(userData) {
        const payload = {
            userId: userData._id || userData.id,
            email: userData.email_ibu,
            nama: userData.nama_ibu,
            role: "ibu",
            id: userData.id
        };

        const secretKey = process.env.JWT_SECRET;

        const options = {
            expiresIn: '1h',
        };

        return jwt.sign(payload, secretKey, options);
    }

    async getIbuById(id) {
        try {
            const ibuDoc = await db.collection("Ibu").doc(id).get();

            if (!ibuDoc.exists) {
                throw new Error("Data ibu tidak ditemukan");
            }

            return { id: ibuDoc.id, ...ibuDoc.data() };
        } catch (error) {
            console.error("Gagal mengambil data ibu:", error);
            throw new Error("Terjadi kesalahan saat mengambil data ibu");
        }
    }
}

module.exports = { IbuService };
