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

    async addNewLapkun(laporanInfo){
        const now = new Date();

        const docRef = await db.collection('kondisi_janin').add({
            berat_badan: laporanInfo.berat_badan,
            denyut_nadi_janin: laporanInfo.denyut_nadi_janin,
            golongan_darah: laporanInfo.golongan_darah,
            gula_darah: laporanInfo.gula_darah,
            hasil_skrining: laporanInfo.hasil_skrining,
            hiv: laporanInfo.hiv,
            imunisasi_tetanus: laporanInfo.imunisasi_tetanus,
            lingkar_lengan: laporanInfo.lingkar_lengan,
            posisi_janin: laporanInfo.posisi_janin,
            sifilis: laporanInfo.sifilis,
            tablet_tambah_darah: laporanInfo.tablet_tambah_darah,
            tekanan_darah: laporanInfo.tekanan_darah,
            tes_hemoglobin: laporanInfo.tes_hemoglobin,
            tes_hepatitis: laporanInfo.tes_hepatitis,
            tinggi_badan: laporanInfo.tinggi_badan,
            tinggi_rahim: laporanInfo.tinggi_rahim,
            id_ibu: laporanInfo.id_ibu,
            id_bidan: laporanInfo.id_bidan,
            tanggal: now.toISOString()
          });


          console.log("Document written with ID: ", docRef.id);
          return docRef.id;
    }

    async getAllLapkunByIdIbu(id_ibu) {
        const lapkunSnapshot = await db.collection("kondisi_janin").where("id_ibu", "==", id_ibu).get();
        
        if (lapkunSnapshot.empty) {
            console.log('No matching documents.');
            return [];
        }
    
        const lapkun = lapkunSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return lapkun;
    }

    // async getAllLapkunByIdBidan(id_bidan) {
    //     const lapkunSnapshot = await db.collection("kondisi_janin").where("id_bidan", "==", id_bidan).get();
        
    //     if (lapkunSnapshot.empty) {
    //         console.log('No matching documents.');
    //         return [];
    //     }
    
    //     const lapkun = lapkunSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    //     return lapkun;
    // }


}

module.exports = {LaporanService};