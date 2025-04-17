const { CatatanService } = require('../services/catatanService');

class CatatanController {
    constructor() {
        this.catatanService = new CatatanService();
    }


    createNewCatatan = async (req, res) => {
        try{
            const catatanInfo = req.body;
            console.log(catatanInfo);

            const catatanId = await this.catatanService.addNewCatatan(catatanInfo);

            // console.log(queryInfo)
            res.status(201).json({ catatanId });

        }catch (error) {
            res.status(500).json({ message: error.message });

        }
    }

    viewAllCatatan = async (req, res) => {
        try{
            const idIbu = req.params.idIbu;
            // console.log(id_ibu)

            const catatanIbu = await this.catatanService.getAllCatatanByIdIbu(idIbu);

            res.status(201).json({ data: catatanIbu });


        }catch (error) {
            res.status(500).json({ message: error.message });

        }
    }


}

module.exports = { CatatanController }