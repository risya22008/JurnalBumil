const { Router } = require("express");
const { CatatanController } = require("../controllers/catatanController.js");
const { authMiddleware } = require("../middlewares/authMiddleware.js");

class CatatanRoutes {
    constructor() {
        this.router = Router();
        this.catatanController = new CatatanController();
    }

    getRoutes() {
        return this.router
            .post("/catatan", authMiddleware, this.catatanController.createNewCatatan)
            .get("/catatan/:idIbu", authMiddleware, this.catatanController.viewAllCatatan)
            .get("/histori/catatan/baca", authMiddleware, this.catatanController.bacaCatatan);
    }
}

module.exports = { CatatanRoutes };
