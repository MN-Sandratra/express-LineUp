"use strict";
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
class Servers {
    //initialisation du serveur HTTP avec express
    constructor() {
        this.app = (0, express_1.default)();
        this.video = new video_1.default();
        this.manager = new manager_1.default();
        this.annonce = new annonce_1.default();
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json({ limit: '100mb' }));
        this.app.use(express_1.default.static('public'));
        this.server = http_1.default.createServer(this.app);
        this.io = new socket_io_1.Server(this.server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });
        this.api();
        this.ioInterface();
        //Specification du port d'ecoute
        this.server.listen(7539, () => console.log(`Listening on port 7539`));
    }
    //liste des API
    api() {
        //api pour prendre un numero
        this.app.get('/api/numero/:id', (req, res) => {
            res.send(this.manager.getNumber(parseInt(req.params.id)));
        });
        //api pour avoir les données des caisses
        this.app.get('/api/caisses/:id', (req, res) => {
            res.send(this.manager.getCaisse(req.params.id).content);
        });
        //api pour ajouter une caisse
        this.app.post('/api/addCaisse', (req, res) => {
            this.manager.addCaisse(req.body.num, parseInt(req.body.cat));
            res.send({ return: 'Ok' });
        });
        //api pour suivant
        this.app.get('/api/next/:id', (req, res) => {
            this.manager.removeNum(req.params.id);
            res.send();
        });
        //api avoir la liste des caisse
        this.app.get('/api/caisses', (req, res) => {
            res.send(this.manager.getCaisses());
        });
        //api pour desactiver ou activer caisse
        this.app.get('/api/turnCaisse/:id', (req, res) => {
            const rea = req.params.id.split('-');
            res.send(this.manager.turnCaisse(parseInt(rea[1]), parseInt(rea[0])));
        });
        //api pour se deconnecter
        this.app.get('/api/deconnexion/:id', (req, res) => {
            const rea = req.params.id.split('-');
            this.manager.deconnexion(parseInt(rea[1]), parseInt(rea[0]));
            res.send();
        });
        //api pour envoyer annonce
        this.app.get('/api/annonce', (req, res) => {
            res.send(this.annonce.getAnnonce());
        });
        //api get annonce by id
        this.app.get('/api/annonce/:id', (req, res) => {
            res.send(this.annonce.getAnnonceByID(parseInt(req.params.id)));
        });
        //api get category
        this.app.get('/api/category', (req, res) => {
            res.send(this.manager.getCategory());
        });
        //api get category
        this.app.get('/api/categoryName/:id', (req, res) => {
            res.send(this.manager.getCatName(parseInt(req.params.id)));
        });
        //api get category connected
        this.app.get('/api/categoryConnected', (req, res) => {
            res.send(this.manager.getCatConn());
        });
        //api add category
        this.app.post('/api/addCat', (req, res) => {
            this.manager.services.addService(req.body.category, req.body.id);
            res.send({ result: 'ok' });
        });
        //api del category
        this.app.get('/api/delCat/:id', (req, res) => {
            this.manager.services.deleteService(parseInt(req.params.id));
            res.send({ result: 'ok' });
        });
        //api modify category
        this.app.post('/api/modifCat', (req, res) => {
            this.manager.services.changeService(req.body.type, req.body.category, req.body.id);
            res.send({ result: 'ok' });
        });
        //api get video
        this.app.get('/api/video', (req, res) => {
            res.send(this.video.getVideo());
        });
        //api pour supprimer video
        this.app.post('/api/delVideo/', (req, res) => {
            this.video.delVideo(req.body.name);
            res.send({ result: 'ok' });
        });
        //api pour ajouter annonces
        this.app.post('/api/addAnnonce/', (req, res) => {
            this.annonce.addAnnonce(req.body.txt);
            res.send({ result: 'ok' });
        });
        //api pour supprimer annonces
        this.app.get('/api/delAnnonce/:id', (req, res) => {
            res.send(this.annonce.removeAnnonce(parseInt(req.params.id)));
        });
        //api pour modifier annonces
        this.app.post('/api/editAnnonce/', (req, res) => {
            this.annonce.modifAnnonce(req.body.id, req.body.txt);
            res.send({ result: 'ok' });
        });
    }
    //liste des sockets
    ioInterface() {
        this.io.on('connection', (socket) => {
            console.log('Socket on : ' + (socket.handshake.address).substring(7) + ' connected');
            //socket speak
            socket.on('speak', (data) => {
                console.log(data);
                socket.broadcast.emit('speakT', data);
            });
            //socket refresh user
            socket.on('addCaisse', () => {
                socket.broadcast.emit('refreshUser');
            });
            //socket refresh video
            socket.on('loadVideo', () => {
                this.io.emit('refreshVideo');
            });
            socket.on("disconnect", () => {
                console.log('Socket on : ' + socket.handshake.address.substring(7) + ' disconnected');
            });
        });
    }
}
exports.default = Servers;
//# sourceMappingURL=server.js.map