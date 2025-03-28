const { Router } = require("express");
const { UserController } = require("../controllers/userController");
// const { AuthMiddleware } = require("../middlewares/authMiddleware");

class UserRoute {
    constructor() {
        this.router = Router();
        this.userController = new UserController();
        // this.authMiddleware = new AuthMiddleware();
    }

    getRoutes() {
        return this.router
            .post("/", 
                this.userController.createNewUser
            );
    }
}

module.exports = { UserRoute };