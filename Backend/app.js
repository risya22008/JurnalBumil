require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { UserRoute } = require("./routes/userRoutes");
const { CatatanRoutes } = require("./routes/catatanRoutes");
const { LaporanRoutes } = require("./routes/laporanRoutes");

const port = process.env.PORT || 8080;
const corsOptions = {
    origin: process.env.FE_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};

class App {
    constructor() {
        this.server = express();
        this.configureMiddleware();
        this.configureRoutes();
        this.handleErrors();
    }

    configureMiddleware() {
        this.server.use(cors(corsOptions));
        this.server.use(express.json());
        this.server.use(express.urlencoded({ extended: true }));
    }

    configureRoutes() {
        const userRoute = new UserRoute();
        const catatanRoute = new CatatanRoutes();
        const laporanRoute = new LaporanRoutes();
        
        this.server.use("/api", userRoute.getRoutes());
        this.server.use("/api", catatanRoute.getRoutes());
        this.server.use("/api", laporanRoute.getRoutes()); 
    }

    handleErrors() {
        this.server.use((err, req, res, next) => {
            console.error("[ERROR]", err);
            res.status(500).json({ message: "Internal Server Error" });
        });
    }

    run() {
        this.server.listen(port, () => {
            console.log(`⚡️[server]: Server started at http://localhost:${port}`);
        });
    }
}

module.exports = { App };