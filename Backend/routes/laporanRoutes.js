const { Router } = require("express");
const { LaporanController } = require('../controllers/laporanController');

class LaporanRoutes {
    constructor() {
        this.router = Router();
        this.laporanController = new LaporanController();
    }

    getRoutes() {
        return this.router
            .get('/histori/laporan/baca', this.laporanController.bacaLaporanKunjungan)
            .get('/laporan-kunjungan/:id_ibu', this.laporanController.viewAllLaporanKunjunganByIbu)
            .post('/laporan-kunjungan', this.laporanController.addLaporanKunjungan);
    }
}

module.exports = { LaporanRoutes };