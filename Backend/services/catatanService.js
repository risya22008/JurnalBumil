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
            date: catatanInfo.date
          });


          console.log("Document written with ID: ", docRef.id);
          return docRef.id;
    }

    editCatatan(){

    }

    getCatatanByIdCatatan(){

    }

    async getAllCatatanByIdIbu(id_ibu){
        const ibuRef = await db.collection("Ibu").doc(id_ibu)
        const ibuSnapshot = await db.collection("Catatan").where("id_ibu", "==", ibuRef).get();
        
        if (ibuSnapshot.empty) {
            console.log('No matching documents.');
            return;
        }
    
        const catatanIbu = ibuSnapshot.docs.map(doc => { return {...doc.data()}; });

        return catatanIbu;
    }   

    
}

module.exports = { CatatanService };