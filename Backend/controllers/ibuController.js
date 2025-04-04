const { IbuService } = require("../services/ibuService");
const { BidanService } = require("../services/bidanService");

class IbuController {
    constructor() {
        this.ibuService = new IbuService();
        this.bidanService = new BidanService();
    }

    createNewIbu = async (req, res) => {
        try {
            const { nama_ibu, email_ibu, sandi_ibu, usia_kehamilan, bidan } = req.body;
            const tanggal_registrasi = new Date();

            // Cek apakah email sudah digunakan di tabel ibu atau bidan
            const emailExistsInIbu = await this.ibuService.findByEmail(email_ibu);
            const emailExistsInBidan = await this.bidanService.findByEmail(email_ibu);

            if (emailExistsInIbu || emailExistsInBidan) {
                return res.status(403).json({ message: "Email sudah digunakan" });
            }

            const newIbu = await this.ibuService.createIbu({
                nama_ibu,
                email_ibu,
                sandi_ibu,
                usia_kehamilan,
                bidan,
                tanggal_registrasi
            });

            res.status(201).json({ ibuId: newIbu.id });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
}

module.exports = { IbuController };