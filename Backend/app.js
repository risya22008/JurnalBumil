require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { UserRoute } = require("./routes/userRoutes");

const port = process.env.PORT || 8080;
const corsOptions = {
    origin: process.env.FE_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};

class App {
    constructor() {
        const userRoute = new UserRoute();

        this.server = express();
        this.server.options("*", cors(corsOptions));
        this.server.use(cors(corsOptions));
        this.server.use(express.json());
        this.server.use(express.urlencoded({ extended: true }));

        this.server.use("/api/user", userRoute.getRoutes());
    }

    run() {
        this.server.listen(port, () => {
            console.log(`⚡️[server]: Server started at http://localhost:${port}`);
        });
    }
}

module.exports = { App };
