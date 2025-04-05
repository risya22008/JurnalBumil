const { IbuService } = require("../services/ibuService");
const { BidanService } = require("../services/bidanService");

class BidanController {
    constructor() {
        this.bidanService = new BidanService();
        this.ibuService = new IbuService();
    }

    createNewBidan = async (req, res) => {
        try {
            const { nama_bidan, email_bidan, sandi_bidan, kode_lembaga, kode_bidan } = req.body;

            // Cek apakah email sudah digunakan di tabel bidan atau ibu
            const emailExistsInBidan = await this.bidanService.findByEmail(email_bidan);
            const emailExistsInIbu = await this.ibuService.findByEmail(email_bidan);

            if (emailExistsInBidan || emailExistsInIbu) {
                return res.status(403).json({ message: "Email sudah digunakan" });
            }

            // Buat akun bidan dengan kolom verifikasi default 0
            const newBidan = await this.bidanService.createBidan({
                nama_bidan,
                email_bidan,
                sandi_bidan,
                kode_lembaga,
                kode_bidan,
                verifikasi: 0
            });

            res.status(201).json({ bidanId: newBidan.id });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
}

module.exports = { BidanController };