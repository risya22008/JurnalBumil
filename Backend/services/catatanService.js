const bcrypt = require("bcrypt");
const { db } = require("../firebaseClient");
const jwt = require('jsonwebtoken');

class CatatanService {

    async addNewCatatan(catatanInfo){
        const docRef = await db.collection('Catatan').add({
            catatan_kondisi: catatanInfo.catatan_kondisi,
            catatan_konsumsi: catatanInfo.catatan_konsumsi,
            gejala: catatanInfo.gejala,
            rating: catatanInfo.rating,
            date: catatanInfo.date,
            id_ibu: catatanInfo.id_ibu,
          });


          console.log("Document written with ID: ", docRef.id);
          return docRef.id;
    }

    editCatatan(){

    }

    getCatatanByIdCatatan(){

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
                .get();

            if (snapshot.empty) {
                return null;
            }

            return snapshot.docs[0].data();
        } catch (error) {
            throw new Error("Gagal mengambil catatan: " + error.message);
        }
    };
    
}

module.exports = { CatatanService };