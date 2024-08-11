import express from "express";
import Manager from './manager';
import cors from 'cors';
import {Server} from 'socket.io';
import http from 'http';
import VideoManager from "./video";
import AnnonceManager from "./annonce";

export default class Servers{
    public app : any;
    public manager : Manager;
    public server : any;
    public io : any;
    private video : VideoManager;
    private annonce : AnnonceManager;

    //initialisation du serveur HTTP avec express
    constructor(){
        this.app = express();
        this.video = new VideoManager();
        this.manager = new Manager();
        this.annonce = new AnnonceManager();
        this.app.use(express.urlencoded({extended: true}));
        this.app.use(cors());        
        this.app.use(express.json({limit:'100mb'})); 
        this.app.use(express.static('public'));
        this.server = http.createServer(this.app);

        this.io = new Server(this.server,{
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
    private api(){

        //api pour prendre un numero
        this.app.get('/api/numero/:id',(req : any, res : any) => {
            res.send(this.manager.getNumber(parseInt(req.params.id)));
        })

        //api pour avoir les données des caisses
        this.app.get('/api/caisses/:id',(req : any, res : any) => {
            res.send(this.manager.getCaisse(req.params.id).content);
        })

        //api pour ajouter une caisse
        this.app.post('/api/addCaisse',(req : any, res : any) => {
            this.manager.addCaisse(req.body.num,parseInt(req.body.cat));
            res.send({return:'Ok'});
        })

        //api pour suivant
        this.app.get('/api/next/:id',(req : any, res : any) => {
            this.manager.removeNum(req.params.id);
            res.send();
        })

        //api avoir la liste des caisse
        this.app.get('/api/caisses',(req:any,res:any)=>{
            res.send(this.manager.getCaisses())
        })

        //api pour desactiver ou activer caisse
        this.app.get('/api/turnCaisse/:id',(req:any,res:any)=>{
            const rea = req.params.id.split('-');
            res.send(this.manager.turnCaisse(parseInt(rea[1]),parseInt(rea[0])));
        })

        //api pour se deconnecter
        this.app.get('/api/deconnexion/:id',(req:any,res:any)=>{
            const rea = req.params.id.split('-');
            this.manager.deconnexion(parseInt(rea[1]),parseInt(rea[0]));
            res.send();
        })

       

        //api pour envoyer annonce
        this.app.get('/api/annonce',(req : any,res : any)=>{
            res.send(this.annonce.getAnnonce());
            
        });

        //api get annonce by id
        this.app.get('/api/annonce/:id',(req : any,res : any)=>{
            res.send(this.annonce.getAnnonceByID(parseInt(req.params.id)));
            
        });

        //api get category
        this.app.get('/api/category',(req : any,res : any)=>{
            res.send(this.manager.getCategory());
            
        });

        //api get category
        this.app.get('/api/categoryName/:id',(req : any,res : any)=>{
            res.send(this.manager.getCatName(parseInt(req.params.id)));
            
        })

        //api get category connected
        this.app.get('/api/categoryConnected',(req : any,res : any)=>{
            res.send(this.manager.getCatConn());
            
        })

        //api add category
        this.app.post('/api/addCat',(req : any,res : any)=>{
            this.manager.services.addService(req.body.category,req.body.id);
            res.send({result:'ok'});
        })
        //api del category
        this.app.get('/api/delCat/:id',(req : any,res : any)=>{
            this.manager.services.deleteService(parseInt(req.params.id));
            res.send({result:'ok'});
        })
        //api modify category
        this.app.post('/api/modifCat',(req : any,res : any)=>{
            this.manager.services.changeService(req.body.type,req.body.category,req.body.id);
            res.send({result:'ok'});
        })

        //api get video
        this.app.get('/api/video',(req : any,res : any)=>{
            res.send(this.video.getVideo());
        })

        //api pour supprimer video
        this.app.post('/api/delVideo/',(req : any,res : any)=>{
            this.video.delVideo(req.body.name);
            res.send({result:'ok'});
        })

        //api pour ajouter annonces
        this.app.post('/api/addAnnonce/',(req : any,res : any)=>{
            this.annonce.addAnnonce(req.body.txt);
            res.send({result:'ok'});
        })

        //api pour supprimer annonces
        this.app.get('/api/delAnnonce/:id',(req : any,res : any)=>{
            res.send(this.annonce.removeAnnonce(parseInt(req.params.id)));
        })

        //api pour modifier annonces
        this.app.post('/api/editAnnonce/',(req : any,res : any)=>{
            this.annonce.modifAnnonce(req.body.id,req.body.txt);
            res.send({result:'ok'});
        })

        
    }

    //liste des sockets
    private ioInterface(){
        this.io.on('connection',(socket : any) => {
            console.log('Socket on : '+(socket.handshake.address).substring(7)+' connected');

            //socket speak
            socket.on('speak',(data:string)=>{
                console.log(data);
                socket.broadcast.emit('speakT',data)
            })

            //socket refresh user
            socket.on('addCaisse',()=>{
                socket.broadcast.emit('refreshUser');
            })

            //socket refresh video
            socket.on('loadVideo',()=>{
                this.io.emit('refreshVideo');
            })
            
            socket.on("disconnect", () => {
                console.log('Socket on : '+socket.handshake.address.substring(7)+' disconnected');
            });
        })
    }
}