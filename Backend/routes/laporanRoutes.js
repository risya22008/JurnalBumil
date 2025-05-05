const { Router } = require("express");
const { LaporanController } = require('../controllers/laporanController');
const { authMiddleware } = require('../middlewares/authMiddleware.js');

class LaporanRoutes {
    constructor() {
        this.router = Router();
        this.laporanController = new LaporanController();
    }

    getRoutes() {
        return this.router
            .get('/histori/laporan/baca', authMiddleware, this.laporanController.bacaLaporanKunjungan)
            .get('/laporan-kunjungan/:id_ibu', this.laporanController.viewAllLaporanKunjunganByIbu)
            .post('/laporan-kunjungan', this.laporanController.addLaporanKunjungan)
            .get('/laporan/bidan/:idIbu', this.laporanController.getLapkunByIdIbu);

    }
}

module.exports = { LaporanRoutes };