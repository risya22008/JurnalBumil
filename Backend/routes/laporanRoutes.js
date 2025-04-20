const { Router } = require("express");
const { LaporanController } = require('../controllers/laporanController');

class LaporanRoutes {
    constructor() {
        this.router = Router();
        this.laporanController = new LaporanController();
    }

    getRoutes() {
        return this.router
            .get('/histori/laporan/baca', this.laporanController.bacaLaporanKunjungan);
    }
}

module.exports = { LaporanRoutes };