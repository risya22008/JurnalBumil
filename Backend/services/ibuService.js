const bcrypt = require("bcrypt");
const { db } = require("../firebaseClient");
const jwt = require("jsonwebtoken"); // Kalau kamu pakai JWT

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

    async loginIbu(loginData) {
        const emailExistsInIbu = await db.collection("Ibu").where("email_ibu", "==", loginData.email_ibu).get();

        if (emailExistsInIbu.empty) {
            throw new Error("User belum terdaftar!");
        }

        console.log(emailExistsInIbu) 

        const userData = emailExistsInIbu.docs[0].data();

        const isMatch = await bcrypt.compare(loginData.sandi_ibu, userData.sandi_ibu);

        if(isMatch) {
            const authToken = this.generateAuthToken(userData);
            return authToken;
        }else {
            throw new Error("Invalid credentials");
        }

    }

    generateAuthToken(user) {
        // Contoh menggunakan JWT
        const payload = {
            email: user.email_ibu,
            nama: user.nama_ibu,
            role: "ibu"
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
        return token;
    }
}

module.exports = { IbuService };