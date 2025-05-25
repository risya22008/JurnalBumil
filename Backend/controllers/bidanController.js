const { IbuService } = require("../services/ibuService");
const { BidanService } = require("../services/bidanService");
const { auth } = require("firebase-admin");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
require("dotenv").config();

const db = admin.firestore();

class BidanController {
    constructor() {
        this.bidanService = new BidanService();
        this.ibuService = new IbuService();
    }

    createNewBidan = async (req, res) => {
        try {
            const { nama_bidan, email_bidan, sandi_bidan, kode_lembaga, kode_bidan } = req.body;

            if (!nama_bidan || !email_bidan || !sandi_bidan || !kode_lembaga || !kode_bidan) {
                return res.status(400).json({ message: "Semua field wajib diisi" });
            }

            const emailInUseBidan = await this.bidanService.findByEmail(email_bidan);
            const emailInUseIbu = await this.ibuService.findByEmail(email_bidan);

            if (emailInUseBidan || emailInUseIbu) {
                return res.status(403).json({ message: "Email sudah digunakan" });
            }


            await auth().createUser({
                email: email_bidan,
                password: sandi_bidan,
                displayName: nama_bidan,
                emailVerified: false,
            });

            //FE_URL
const actionCodeSettings = {
  url: `${process.env.FE_URL}/after-verify?email=${encodeURIComponent(email_bidan)}&role=bidan`,
  handleCodeInApp: true, // agar frontend bisa applyActionCode
};




            const verificationLink = await auth().generateEmailVerificationLink(email_bidan, actionCodeSettings);


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
                to: email_bidan,
                subject: 'Verifikasi Email Anda',
                html: `<p>Halo ${nama_bidan},</p>
                       <h3>Verifikasi Email</h3>
                       <p>Klik tombol di bawah ini untuk memverifikasi email Anda:</p>
                        <a href="${verificationLink}" style="padding: 10px 20px; background-color:rgb(48, 51, 212); color: white; text-decoration: none; border-radius: 5px;">Verifikasi Email</a>
                        <p>Atau salin dan tempel link ini di browser Anda:</p>
                        <p>${verificationLink}</p>`
            };
            
            await transporter.sendMail(mailOptions);

            await this.bidanService.createBidan({
                nama_bidan,
                email_bidan,
                sandi_bidan,
                kode_lembaga,
                kode_bidan,
                verifikasi: 0,
                verifikasi_email: 0
            });

            res.status(201).json({
                email: email_bidan,
                message: "Email verifikasi telah dikirim",
                verificationLink
            });
        } catch (error) {
            console.error(error);
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

            // Cari data bidan di Firestore
            const bidanSnapshot = await db.collection("Bidan").where("email_bidan", "==", email).get();

            if (bidanSnapshot.empty) {
                return res.status(404).json({ message: "Pengguna tidak ditemukan di database" });
            }

            const bidanDoc = bidanSnapshot.docs[0];

            const verifikasiStatus = bidanDoc.data().verifikasi_email;
            if (verifikasiStatus === 2) {
                return res.status(200).json({ message: "Email sudah diverifikasi sebelumnya." });
            }

            await bidanDoc.ref.update({ verifikasi_email: 2 });

            res.status(200).json({ message: "Email berhasil diverifikasi!" });
        } catch (error) {
            console.error("Verifikasi gagal:", error);
            res.status(500).json({ message: "Verifikasi gagal: " + error.message });
        }
    };

    loginBidan = async (req, res) => {
        try {
            const { email_bidan, sandi_bidan } = req.body;

            if (!email_bidan || !sandi_bidan) {
                return res.status(403).json({ message: "email dan sandi tidak boleh kosong!" });
            }

            const emailExistsInBidan = await this.bidanService.findByEmail(email_bidan);

            if (!emailExistsInBidan) {
                return res.status(403).json({ message: "Email tidak terdaftar" });
            }


            const authToken = await this.bidanService.loginBidan({
                email_bidan,
                sandi_bidan
            });

            res.cookie('authToken', authToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 3600000,
            });


            res.status(200).json({ message: "login sukses", authToken: authToken });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };


    viewAllIbu = async (req, res) => {
        try {
            const namaBidan = req.params.namaBidan;

            const result = await this.ibuService.getAllIbuWithCatatanByNamaBidan(namaBidan);
            // console.log(result);
            res.status(200).json({ dataIbu: result });

        } catch (error) {
            res.status(500).json({ message: error.message });

        }
    }
}

module.exports = { BidanController };

