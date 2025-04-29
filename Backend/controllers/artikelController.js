const { ArtikelService } = require('../services/artikelService');

class ArtikelController {
    constructor() {
        this.artikelService = new ArtikelService();
    }

    async getBerandaAwal(req, res) {
        try {
            const data = await this.artikelService.getArtikelByTrimester(1);
            res.status(200).json({ success: true, trimester: 1, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getBerandaIbu(req, res) {
        try {
            const { id } = req.user; 
            const usiaKehamilan = await this.artikelService.hitungUsiaKehamilan(id);

            const trimester = this.artikelService.mapUsiaToTrimester(usiaKehamilan);
            const data = await this.artikelService.getArtikelByTrimester(trimester);
            
            res.status(200).json({ success: true, trimester, data });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getByTrimester(req, res) {
        try {
            const trimester = parseInt(req.params.trimester);
            if (![1, 2, 3].includes(trimester)) {
                return res.status(400).json({ success: false, message: 'Trimester tidak valid' });
            }
            const data = await this.artikelService.getArtikelByTrimester(trimester);
            res.status(200).json({ success: true, trimester, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = { ArtikelController };