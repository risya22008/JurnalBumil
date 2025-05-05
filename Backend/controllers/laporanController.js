const { LaporanService } = require('../services/laporanService');

class LaporanController {
    constructor() {
        this.laporanService = new LaporanService();
    }

    viewAllLaporanKunjunganByIbu = async (req, res) => {
      const { id_ibu } = req.params;

      if (!id_ibu) {
        return res.status(400).json({ message: 'id_ibu wajib diisi' });
      }

      try {
        const laporan = await this.laporanService.getAllLapkunByIdIbu(id_ibu);

        if (!laporan) {
          return res.status(404).json({ message: 'Laporan tidak ditemukan' });
        }

        res.status(200).json(laporan);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
      }
    };


    addLaporanKunjungan = async (req, res) => {
      const lapkunData = req.body;

      if (!lapkunData) {
        return res.status(400).json({ message: 'body wajib diisi' });
      }

      try {
        const laporan = await this.laporanService.addNewLapkun(lapkunData);

        if (!laporan) {
          return res.status(404).json({ message: 'Laporan tidak ditemukan' });
        }

        res.status(200).json({id: laporan});
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
      }
    };

    bacaLaporanKunjungan = async (req, res) => {
      const { id_ibu, tanggal } = req.query;
    
      // Validasi input
      if (!id_ibu || !tanggal || isNaN(Date.parse(tanggal))) {
        return res.status(400).json({
          status: 'error',
          message: 'Parameter id_ibu dan tanggal (dalam format valid) wajib diisi',
        });
      }
    
      try {
        const laporan = await this.laporanService.getLaporanByIbuAndTanggal(id_ibu, tanggal);
    
        if (!laporan) {
          return res.status(404).json({
            status: 'not_found',
            message: 'Laporan tidak ditemukan untuk ID Ibu dan tanggal tersebut',
          });
        }
    
        return res.status(200).json({
          status: 'success',
          message: 'Laporan berhasil diambil',
          data: laporan,
        });
      } catch (error) {
        console.error('Error saat membaca laporan kunjungan:', error.message);
        return res.status(500).json({
          status: 'error',
          message: 'Terjadi kesalahan pada server',
        });
      }
    };

    getLapkunByIdIbu = async (req, res) => {
      const idIbu = req.params.idIbu;
    
      try {
        const data = await this.laporanService.getLapkunByIdIbu(idIbu);
    
        res.status(200).json({ success: true, data });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    };    
}

module.exports = { LaporanController };
