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
            .get('/laporan-kunjungan/:id_ibu', authMiddleware, this.laporanController.viewAllLaporanKunjunganByIbu)
            .post('/laporan-kunjungan', authMiddleware, this.laporanController.addLaporanKunjungan);
    }
}

module.exports = { LaporanRoutes };