const { IbuService } = require("../services/ibuService");
const { BidanService } = require("../services/bidanService");
const { auth } = require("firebase-admin");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
require("dotenv").config();

const db = admin.firestore();

class IbuController {
    constructor() {
        this.ibuService = new IbuService();
        this.bidanService = new BidanService();
    }

    createNewIbu = async (req, res) => {
        try {
            const { nama_ibu, email_ibu, sandi_ibu, usia_kehamilan, bidan } = req.body;
            const tanggal_registrasi = new Date();

            const requiredFields = { nama_ibu, email_ibu, sandi_ibu, usia_kehamilan };
            for (const [key, value] of Object.entries(requiredFields)) {
                if (!value || value.toString().trim() === "") {
                    return res.status(400).json({ message: `${key} wajib diisi` });
                }
            }

            const emailExistsInIbu = await this.ibuService.findByEmail(email_ibu);
            const emailExistsInBidan = await this.bidanService.findByEmail(email_ibu);

            if (emailExistsInIbu || emailExistsInBidan) {
                return res.status(403).json({ message: "Email sudah digunakan" });
            }

            // Buat akun pengguna di Firebase Authentication
            await auth().createUser({
                email: email_ibu,
                password: sandi_ibu,
                displayName: nama_ibu,
                emailVerified: false,
            });

            // Generate link verifikasi email
            const verificationLink = await auth().generateEmailVerificationLink(email_ibu);

            // Kirim email verifikasi
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_SENDER,
                    pass: process.env.EMAIL_PASSWORD,
                },
                debug: true,
            });

            const mailOptions = {
                from: process.env.EMAIL_SENDER,
                to: email_ibu,
                subject: 'Verifikasi Email Anda',
                html: `<p>Halo ${nama_ibu},</p>
                       <h3>Verifikasi Email</h3>
                        <p>Klik tombol di bawah ini untuk memverifikasi email Anda:</p>
                        <a href="${verificationLink}" style="padding: 10px 20px; background-color:rgb(48, 51, 212); color: white; text-decoration: none; border-radius: 5px;">Verifikasi Email</a>
                        <p>Atau salin dan tempel link ini di browser Anda:</p>
                        <p>${verificationLink}</p>`
            };

            await transporter.sendMail(mailOptions);

            // Simpan data ibu ke Firestore
            const newIbu = await this.ibuService.createIbu({
                nama_ibu,
                email_ibu,
                sandi_ibu,
                usia_kehamilan,
                bidan: bidan || null,
                tanggal_registrasi,
                verifikasi_email: 0 // Belum diverifikasi
            });

            res.status(201).json({
                email: email_ibu,
                message: "Email verifikasi telah dikirim",
                verificationLink
            });
        } catch (error) {
            console.error("Gagal membuat akun ibu:", error);
            res.status(500).json({ message: error.message });
        }
    };

    verifyEmail = async (req, res) => {
        try {
            const { email } = req.body;
    
            if (!email) {
                return res.status(400).json({ message: "Email tidak ditemukan" });
            }
    
            // Ambil data user dari Firebase Auth
            const userRecord = await auth().getUserByEmail(email);
    
            if (!userRecord.emailVerified) {
                return res.status(400).json({ message: "Email belum diverifikasi. Silakan klik link dari email." });
            }
    
            // Cari data ibu di Firestore
            const ibuSnapshot = await db.collection("Ibu").where("email_ibu", "==", email).get();
    
            if (ibuSnapshot.empty) {
                return res.status(404).json({ message: "Pengguna tidak ditemukan di database" });
            }
    
            const ibuDoc = ibuSnapshot.docs[0];
    
            const verifikasiStatus = ibuDoc.data().verifikasi_email;
            if (verifikasiStatus === 2) {
                return res.status(200).json({ message: "Email sudah diverifikasi sebelumnya." });
            }
    
            // Update verifikasi email menjadi 2 (sudah diverifikasi)
            await ibuDoc.ref.update({ verifikasi_email: 2 });
    
            res.status(200).json({ message: "Email berhasil diverifikasi!" });
        } catch (error) {
            console.error("Verifikasi gagal:", error);
            res.status(500).json({ message: "Verifikasi gagal: " + error.message });
        }
    };
    
    loginIbu = async (req, res) => {
        try{
            const { email_ibu, sandi_ibu } = req.body;

            if(!email_ibu || !sandi_ibu) {
                return res.status(403).json({ message: "email dan sandi tidak boleh kosong!" });
            }
            const emailExistsInIbu = await this.ibuService.findByEmail(email_ibu);    
            
            if (!emailExistsInIbu) {
                return res.status(403).json({ message: "Email tidak terdaftar" });
            }

            const authToken = await this.ibuService.loginIbu({
                email_ibu,
                sandi_ibu
            });

            res.cookie('authToken', authToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 3600000, 
            });
        
    
            res.status(200).json({ message: "login sukses", authToken: authToken });
        }catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
}

module.exports = { IbuController };