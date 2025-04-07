const { Router } = require("express");
const { IbuController } = require("../controllers/ibuController");
const { BidanController } = require("../controllers/bidanController");

class UserRoute {
    constructor() {
        this.router = Router();
        this.ibuController = new IbuController();
        this.bidanController = new BidanController();
    }

    getRoutes() {
        return this.router
            .post("/ibu", this.ibuController.createNewIbu)
            .post("/bidan", this.bidanController.createNewBidan)
            .post("/login/bidan", this.bidanController.loginBidan)
            .post("/login/ibu", this.bidanController.loginBidan);
    }
}

module.exports = { UserRoute };
