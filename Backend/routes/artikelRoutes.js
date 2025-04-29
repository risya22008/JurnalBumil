const { Router } = require("express");
const { ArtikelController } = require('../controllers/artikelController');
const { authMiddleware } = require('../middlewares/authMiddleware.js');

class ArtikelRoutes {
    constructor() {
        this.router = Router();
        this.artikelController = new ArtikelController();
    }

    getRoutes() {
        return this.router
        .get('/beranda/awal', (req, res) => this.artikelController.getBerandaAwal(req, res))
        .get('/beranda/ibu', authMiddleware, (req, res) => this.artikelController.getBerandaIbu(req, res))
        .get('/beranda/trimester/:trimester', authMiddleware, (req, res) => this.artikelController.getByTrimester(req, res)); 
    }
}

module.exports = { ArtikelRoutes };