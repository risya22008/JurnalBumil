const { db } = require("../firebaseClient");

class LaporanService {
    getLaporanByIbuAndTanggal = async (idIbu, tanggal) => {
    try {
        const snapshot = await db.collection('kondisi_janin')
        .where('id_ibu', '==', idIbu)
        .where('tanggal', '==', tanggal)
        .limit(1)
        .get();

        if (snapshot.empty) {
        return null;
        }

        return snapshot.docs[0].data();
    } catch (error) {
        throw new Error('Gagal mengambil data laporan: ' + error.message);
    }
    };
}

module.exports = {LaporanService};