const { LaporanService } = require('../services/laporanService');

class LaporanController {
    constructor() {
        this.laporanService = new LaporanService();
    }


    bacaLaporanKunjungan = async (req, res) => {
      const { id_ibu, tanggal } = req.query;

      if (!id_ibu || !tanggal) {
        return res.status(400).json({ message: 'id_ibu dan tanggal wajib diisi' });
      }

      try {
        const laporan = await this.laporanService.getLaporanByIbuAndTanggal(id_ibu, tanggal);

        if (!laporan) {
          return res.status(404).json({ message: 'Laporan tidak ditemukan' });
        }

        res.status(200).json(laporan);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
      }
    };
}

module.exports = { LaporanController };
