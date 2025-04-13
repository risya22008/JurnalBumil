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
                       <p>Silakan klik link berikut untuk memverifikasi email Anda:</p>
                       <a href="${verificationLink}">${verificationLink}</a>`
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
            const { oobCode, email } = req.body;

            if (!oobCode || !email) {
                return res.status(400).json({ message: "Kode verifikasi atau email tidak ditemukan" });
            }

            await auth().applyActionCode(oobCode);

            // Cari data ibu berdasarkan email
            const ibuSnapshot = await db.collection("Ibu").where("email_ibu", "==", email).get();

            if (ibuSnapshot.empty) {
                return res.status(404).json({ message: "Pengguna tidak ditemukan" });
            }

            const ibuDoc = ibuSnapshot.docs[0];
            const verifikasiStatus = ibuDoc.data().verifikasi_email;

            if (verifikasiStatus === 2) {
                return res.status(200).json({ message: "Email sudah diverifikasi sebelumnya." });
            }

            await ibuDoc.ref.update({ verifikasi_email: 2 });

            res.status(200).json({ message: "Email berhasil diverifikasi!" });
        } catch (error) {
            console.error("Verifikasi gagal:", error);
            res.status(500).json({ message: "Verifikasi gagal: " + error.message });
        }
    };
}

module.exports = { IbuController };