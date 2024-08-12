"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const manager_1 = __importDefault(require("./manager"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const video_1 = __importDefault(require("./video"));
const annonce_1 = __importDefault(require("./annonce"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
// Charger les variables d'environnement
dotenv_1.default.config();
class Servers {
    //initialisation du serveur HTTP avec express
    constructor() {
        this.app = (0, express_1.default)();
        this.video = new video_1.default();
        this.manager = new manager_1.default();
        this.annonce = new annonce_1.default();
        this.server = http_1.default.createServer(this.app);
        this.port = 7539;
        this.io = new socket_io_1.Server(this.server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
            },
        });
        this.config();
        this.api();
        this.ioInterface();
        //Specification du port d'ecoute
        this.server.listen(this.port, () => console.log(`Listening on port ${this.port}`));
    }
    //config
    config() {
        return __awaiter(this, void 0, void 0, function* () {
            const mongoURI = process.env.MONGO_URI || "";
            const fileupload = require("express-fileupload");
            const bodyParser = require("body-parser");
            this.app.use((0, cors_1.default)());
            this.app.use(bodyParser.json());
            this.app.use(bodyParser.urlencoded({ extended: false }));
            this.app.use(express_1.default.urlencoded({ extended: true }));
            this.app.use(express_1.default.json({ limit: "100mb" }));
            this.app.use(express_1.default.static("public"));
            this.app.use(fileupload());
            this.app.use(express_1.default.static("files"));
            yield mongoose_1.default
                .connect(mongoURI)
                .then(() => console.log("connect to our database"))
                .catch(() => console.log("connection failed"));
        });
    }
    //liste des API
    api() {
        //api pour prendre un numero
        this.app.get("/api/numero/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let id = parseInt(req.params.id);
                res.send(yield this.manager.getNumber(id));
            }
            catch (error) {
                console.log(error);
            }
        }));
        //api pour avoir les données des caisses
        this.app.get("/api/caisses/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const caisseData = yield this.manager.getCaisse(req.params.id);
                if (caisseData) {
                    res.send(caisseData.content);
                }
                else {
                    res.status(404).send({ error: "Caisse not found" });
                }
            }
            catch (error) {
                res
                    .status(500)
                    .send({ error: "An error occurred while retrieving the caisse" });
            }
        }));
        //api pour ajouter une caisse
        this.app.post("/api/addCaisse", (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.manager.addCaisse(req.body.num, parseInt(req.body.cat));
            res.send({ return: "Ok" });
        }));
        //api pour suivant
        this.app.get("/api/next/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.manager.removeNum(req.params.id);
            res.send({ return: "next client call" });
        }));
        //api avoir la liste des caisse
        this.app.get("/api/caisses", (req, res) => __awaiter(this, void 0, void 0, function* () {
            res.send(yield this.manager.getCaisses());
        }));
        //api pour desactiver ou activer caisse
        this.app.get("/api/turnCaisse/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const rea = req.params.id.split("-");
            yield res.send(this.manager.turnCaisse(parseInt(rea[1]), parseInt(rea[0])));
        }));
        //api pour se deconnecter
        this.app.get("/api/deconnexion/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const rea = req.params.id.split("-");
            yield this.manager.deconnexion(parseInt(rea[1]), parseInt(rea[0]));
            res.send();
        }));
        //api pour envoyer annonce
        this.app.get("/api/annonce", (req, res) => __awaiter(this, void 0, void 0, function* () {
            res.send(yield this.annonce.getAnnonce());
        }));
        //api get annonce by id
        this.app.get("/api/annonce/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            res.send(yield this.annonce.getAnnonceByID(parseInt(req.params.id)));
        }));
        //api get category
        this.app.get("/api/category", (req, res) => __awaiter(this, void 0, void 0, function* () {
            res.send(yield this.manager.getCategory());
        }));
        //api get category
        this.app.get("/api/categoryName/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            res.send(yield this.manager.getCatName(parseInt(req.params.id)));
        }));
        //api get category connected
        this.app.get("/api/categoryConnected", (req, res) => __awaiter(this, void 0, void 0, function* () {
            res.send(yield this.manager.getCatConn());
        }));
        //api add category
        this.app.post("/api/addCat", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const success = yield this.manager.services.addService(req.body.category, req.body.id);
            if (success) {
                res.send({ result: "ok" });
            }
            else {
                res.status(400).send({ result: "Service already exists" });
            }
        }));
        //api del category
        this.app.get("/api/delCat/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const success = yield this.manager.services.deleteService(parseInt(req.params.id));
            res.send({ result: success ? "ok" : "Service not found" });
        }));
        //api modify category
        this.app.post("/api/modifCat", (req, res) => __awaiter(this, void 0, void 0, function* () {
            this.manager.services.changeService(req.body.type, req.body.category, req.body.id);
            res.send({ result: "ok" });
        }));
        //api get video
        this.app.get("/api/video", (req, res) => __awaiter(this, void 0, void 0, function* () {
            res.send(yield this.video.getVideo());
        }));
        //api pour supprimer video
        this.app.post("/api/delVideo/", (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.video.delVideo(req.body.name);
            res.send({ result: "ok" });
        }));
        //api pour ajouter annonces
        this.app.post("/api/addAnnonce/", (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.annonce.addAnnonce(req.body.txt);
            res.send({ result: "ajout d'une nouvelle annonce" });
        }));
        //api pour supprimer annonces
        this.app.get("/api/delAnnonce/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            res.send(yield this.annonce.removeAnnonce(parseInt(req.params.id)));
        }));
        //api pour modifier annonces
        this.app.post("/api/editAnnonce/", (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.annonce.modifAnnonce(req.body.id, req.body.txt);
            res.send({ result: "ok" });
        }));
        this.app.post("/api/upload", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const newpath = "./public/assets/";
                const file = req.files.file;
                const filename = file.name;
                file.mv(`${newpath}${filename}`, (err) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        return res
                            .status(500)
                            .send({ message: "File upload failed", code: 500 });
                    }
                    yield this.video.addVideo(filename, "/assets/" + filename);
                    res.status(200).send({ message: "File Uploaded", code: 200 });
                }));
            }
            catch (error) {
                res.status(500).send({ message: "An error occurred", code: 500 });
            }
        }));
        this.app.get("/api/video", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const videos = yield this.video.getVideo();
                res.status(200).send(videos);
            }
            catch (error) {
                res
                    .status(500)
                    .send({ message: "Failed to retrieve videos", code: 500 });
            }
        }));
        this.app.post("/api/delVideo/", (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.video.delVideo(req.body.name);
                res.status(200).send({ result: "ok" });
            }
            catch (error) {
                res.status(500).send({ message: "Failed to delete video", code: 500 });
            }
        }));
    }
    //api video manager
    //liste des sockets
    ioInterface() {
        this.io.on("connection", (socket) => {
            console.log("Socket on : " + socket.handshake.address.substring(7) + " connected");
            //socket speak
            socket.on("speak", (data) => {
                console.log(data);
                socket.broadcast.emit("speakT", data);
            });
            //socket refresh user
            socket.on("addCaisse", () => {
                socket.broadcast.emit("refreshUser");
            });
            //socket refresh video
            socket.on("loadVideo", () => {
                this.io.emit("refreshVideo");
            });
            socket.on("disconnect", () => {
                console.log("Socket on : " +
                    socket.handshake.address.substring(7) +
                    " disconnected");
            });
        });
    }
}
exports.default = Servers;
//# sourceMappingURL=server.js.map