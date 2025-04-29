const { db } = require("../firebaseClient");

class ArtikelService {
    mapUsiaToTrimester(usia) {
        if (usia <= 13) return 1;
        if (usia <= 26) return 2;
        return 3;
    }

    async getArtikelByTrimester(trimester) {
        const artikelRef = db.collection('artikel').doc(trimester.toString());
        const doc = await artikelRef.get();
        if (!doc.exists) throw new Error('Artikel tidak ditemukan');

        const data = doc.data();
        return {
            gejala_parah: data.gejala_parah || [],
            ibu: data.ibu || [],
            janin: data.janin || [],
            perlu_dilakukan: data.perlu_dilakukan || [],
        };
    }

    async hitungUsiaKehamilan(userId) {
        const ibuDoc = await db.collection('Ibu').doc(userId).get();
        if (!ibuDoc.exists) throw new Error('Data ibu tidak ditemukan');

        const ibuData = ibuDoc.data();
        const tanggalRegistrasi = ibuData.tanggal_registrasi.toDate();
        const usiaAwal = (ibuData.usia_kehamilan || 0);

        const sekarang = new Date();
        const selisihHari = Math.floor((sekarang - tanggalRegistrasi) / (1000 * 60 * 60 * 24));
        const mingguTambahan = Math.floor(selisihHari / 7);

        const usiaKehamilanSekarang = usiaAwal + mingguTambahan;
        return usiaKehamilanSekarang;
    }
}

module.exports = { ArtikelService };
