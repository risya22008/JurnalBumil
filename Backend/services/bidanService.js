const bcrypt = require("bcrypt");
const { db } = require("../firebaseClient");

class BidanService {
    async createBidan(bidan) {
        const hashedPassword = await bcrypt.hash(bidan.sandi_bidan, 10);
        const newBidan = { 
            nama_bidan: bidan.nama_bidan,
            email_bidan: bidan.email_bidan,
            sandi_bidan: hashedPassword,
            kode_lembaga: bidan.kode_lembaga,
            kode_bidan: bidan.kode_bidan,
            verifikasi: 0 // Tambahkan kolom verifikasi default 0
        };

        // Cek apakah email sudah digunakan di tabel bidan atau ibu
        const emailExistsInBidan = await db.collection("Bidan").where("email_bidan", "==", bidan.email_bidan).get();
        const emailExistsInIbu = await db.collection("Ibu").where("email_ibu", "==", bidan.email_bidan).get();

        if (!emailExistsInBidan.empty || !emailExistsInIbu.empty) {
            throw new Error("Email sudah digunakan");
        }

        const bidanRef = await db.collection("Bidan").add(newBidan);
        return { id: bidanRef.id, ...newBidan };
    }

    async findByEmail(email) {
        const bidanSnapshot = await db.collection("Bidan").where("email_bidan", "==", email).get();
        return !bidanSnapshot.empty;
    }
}

module.exports = { BidanService };