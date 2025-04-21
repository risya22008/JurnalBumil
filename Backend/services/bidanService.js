const bcrypt = require("bcrypt");
const { db } = require("../firebaseClient");
const jwt = require('jsonwebtoken');

class BidanService {
    async createBidan(bidan) {
        const hashedPassword = await bcrypt.hash(bidan.sandi_bidan, 10);
        const newBidan = { 
            nama_bidan: bidan.nama_bidan,
            email_bidan: bidan.email_bidan,
            sandi_bidan: hashedPassword,
            kode_lembaga: bidan.kode_lembaga,
            kode_bidan: bidan.kode_bidan,
            verifikasi: 0,
            verifikasi_email: 0
        };

        // Cek apakah email sudah digunakan di tabel bidan atau ibu
        const existing = await db.collection("Bidan").where("email_bidan", "==", bidan.email_bidan).get();


        if (!existing.empty) {
            throw new Error("Email sudah digunakan");
        }


        const bidanRef = await db.collection("Bidan").add(newBidan);
        return { id: bidanRef.id, ...newBidan };
    }

    async loginBidan(loginData) {
        const emailExistsInBidan = await db.collection("Bidan").where("email_bidan", "==", loginData.email_bidan).get();

        if (emailExistsInBidan.empty) {
            throw new Error("User belum terdaftar!");
        }

        console.log(emailExistsInBidan) 

        const userData = emailExistsInBidan.docs[0].data();
        const userId = emailExistsInBidan.docs[0].id;

        const isMatch = await bcrypt.compare(loginData.sandi_bidan, userData.sandi_bidan);

        if (isMatch) {
            // cek verifikasi = 1, verifikasi_email = 2
            if (userData.verifikasi !== 1 || userData.verifikasi_email !== 2) {
                throw new Error("Akun belum diverifikasi!");
            }
            const authToken = this.generateAuthToken({
                ...userData,
                id: userId,
                nama_bidan: userData.nama_bidan
            });
            return authToken;
        } else {
            throw new Error("Invalid credentials");
        }

    }
    
    async findByEmail(email) {
        const bidanSnapshot = await db.collection("Bidan").where("email_bidan", "==", email).get();
        return !bidanSnapshot.empty;
    }

    

    generateAuthToken (userData) {
        const payload = {
            userId: userData._id || userData.id,
            email: userData.email_bidan,
            id: userData.id,
            nama: userData.nama_bidan,
            role:"bidan",
        }

        const secretKey = process.env.JWT_SECRET; 

        const options = {
          expiresIn: '1h',
        };
      
        return jwt.sign(payload, secretKey, options); 
    }
}

module.exports = { BidanService };