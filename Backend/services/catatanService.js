const bcrypt = require("bcrypt");
const { db } = require("../firebaseClient");
const jwt = require('jsonwebtoken');

class CatatanService {

    async addNewCatatan(catatanInfo) {
      // Cari apakah sudah ada catatan dengan tanggal dan id_ibu yang sama
      const existingSnapshot = await db.collection('Catatan')
          .where('id_ibu', '==', catatanInfo.id_ibu)
          .where('date', '==', catatanInfo.date)
          .limit(1)
          .get();

      // Jika ada, hapus dokumen yang lama
      if (!existingSnapshot.empty) {
          const docIdToDelete = existingSnapshot.docs[0].id;
          await db.collection('Catatan').doc(docIdToDelete).delete();
          console.log(`Catatan lama dengan ID ${docIdToDelete} dihapus.`);
      }

      // Tambahkan catatan baru
      const docRef = await db.collection('Catatan').add({
          catatan_kondisi: catatanInfo.catatan_kondisi,
          catatan_konsumsi: catatanInfo.catatan_konsumsi,
          gejala: catatanInfo.gejala,
          rating: catatanInfo.rating,
          date: catatanInfo.date,
          id_ibu: catatanInfo.id_ibu,
      });

      console.log("Document baru ditulis dengan ID: ", docRef.id);
      return docRef.id;
  }


    async getSummaryCatatan(id_ibu, sevenDaysAgoStr){
      const ibuSnapshot = await db.collection("Catatan").where("id_ibu", "==", id_ibu)
                        .where("date", ">=", sevenDaysAgoStr)
                        .get();

      const recentNotes = ibuSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      return recentNotes;

    }

    async getAllCatatanByIdIbu(id_ibu) {
        const ibuSnapshot = await db.collection("Catatan").where("id_ibu", "==", id_ibu).get();
        
        if (ibuSnapshot.empty) {
            console.log('No matching documents.');
            return [];
        }
    
        const catatanIbu = ibuSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return catatanIbu;
    }


    getCatatanByTanggal = async (id_ibu, tanggal) => {
        try {
          const snapshot = await db.collection("Catatan")
            .where("id_ibu", "==", id_ibu)
            .where("date", "==", tanggal)
            .limit(1)
            .get();
      
          if (snapshot.empty) {
            return null;
          }
      
          const catatanData = snapshot.docs[0].data();
      
          const ibuDoc = await db.collection("Ibu").doc(id_ibu).get();
      
          if (!ibuDoc.exists) {
            throw new Error("Data ibu tidak ditemukan");
          }
      
          const ibuData = ibuDoc.data();
      
          const tanggalRegistrasi = ibuData.tanggal_registrasi.toDate();
          const usiaAwal = ibuData.usia_kehamilan || 0;
      
          const sekarang = new Date(tanggal);
          const selisihHari = Math.floor((sekarang - tanggalRegistrasi) / (1000 * 60 * 60 * 24));
          const mingguTambahan = Math.floor(selisihHari / 7);
          const usiaKehamilanSekarang = usiaAwal + mingguTambahan;
      
          return {
            ...catatanData,
            nama_ibu: ibuData.nama_ibu,
            usia_kehamilan: usiaKehamilanSekarang,
          };
      
        } catch (error) {
          throw new Error("Gagal mengambil catatan: " + error.message);
        }
      };      
    
}

module.exports = { CatatanService };