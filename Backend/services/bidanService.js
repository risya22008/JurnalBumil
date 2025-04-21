const bcrypt = require("bcrypt");
const { db } = require("../firebaseClient");
const jwt = require("jsonwebtoken");
const { auth } = require("firebase-admin");
const nodemailer = require("nodemailer");

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
        await this.sendVerificationEmail(bidan.email_bidan);
        return { id: bidanRef.id, ...newBidan };
    }

    async sendVerificationEmail(email) {
        const actionCodeSettings = {
            url: 'https://yourfrontend.com/verify', // frontend akan handle oobCode dari query string
            handleCodeInApp: true
        };

        const verificationLink = await auth().generateEmailVerificationLink(email, actionCodeSettings);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_SENDER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        await transporter.sendMail({
            from: `Tim Kesehatan <${process.env.EMAIL_SENDER}>`,
            to: email,
            subject: 'Verifikasi Email Anda',
            html: `
                <h3>Verifikasi Email</h3>
                <p>Klik tombol di bawah ini untuk memverifikasi email Anda:</p>
                <a href="${verificationLink}" style="padding: 10px 20px; background-color:rgb(48, 51, 212); color: white; text-decoration: none; border-radius: 5px;">Verifikasi Email</a>
                <p>Atau salin dan tempel link ini di browser Anda:</p>
                <p>${verificationLink}</p>
            `
        });

        return verificationLink;
    }

    async updateVerifikasiEmail(email) {
        const bidanSnapshot = await db.collection("Bidan").where("email_bidan", "==", email).get();
        if (bidanSnapshot.empty) {
            throw new Error("Pengguna tidak ditemukan");
        }

        const bidanDoc = bidanSnapshot.docs[0];
        await bidanDoc.ref.update({ verifikasi_email: 2 });
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