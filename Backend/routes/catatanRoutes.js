const { Router } = require("express");
const { CatatanController } = require("../controllers/catatanController.js");

class CatatanRoutes {
    constructor() {
        this.router = Router();
        this.catatanController = new CatatanController();
    }

    getRoutes() {
        return this.router
            .post("/catatan", this.catatanController.createNewCatatan)
            .get("/catatan/:idIbu", this.catatanController.viewAllCatatan)
            .get("/histori/catatan/baca", this.catatanController.bacaCatatan);
    }
}

module.exports = { CatatanRoutes };
