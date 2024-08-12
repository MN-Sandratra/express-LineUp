import express from "express";
import Manager from "./manager";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import VideoManager from "./video";
import AnnonceManager from "./annonce";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Charger les variables d'environnement

dotenv.config();
export default class Servers {
  public app: any;
  public manager: Manager;
  public server: any;
  public io: any;
  private video: VideoManager;
  private annonce: AnnonceManager;
  private port: number;

  //initialisation du serveur HTTP avec express
  constructor() {
    this.app = express();
    this.video = new VideoManager();
    this.manager = new Manager();
    this.annonce = new AnnonceManager();
    this.server = http.createServer(this.app);
    this.port = 7539;

    this.io = new Server(this.server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    this.config();
    this.api();
    this.ioInterface();

    //Specification du port d'ecoute
    this.server.listen(this.port, () =>
      console.log(`Listening on port ${this.port}`)
    );
  }

  //config
  private async config() {
    const mongoURI = process.env.MONGO_URI || "";
    const fileupload = require("express-fileupload");
    const bodyParser = require("body-parser");

    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json({ limit: "100mb" }));
    this.app.use(express.static("public"));
    this.app.use(fileupload());
    this.app.use(express.static("files"));

    await mongoose
      .connect(mongoURI)
      .then(() => console.log("connect to our database"))
      .catch(() => console.log("connection failed"));
  }

  //liste des API
  private api() {
    //api pour prendre un numero
    this.app.get("/api/numero/:id", async(req: any, res: any) => {
      try {
        let id= parseInt(req.params.id)
        res.send(await this.manager.getNumber(id));
      } catch (error) {
            console.log(error)
      }
    });

    //api pour avoir les données des caisses
    this.app.get("/api/caisses/:id", async (req: any, res: any) => {
      try {
        const caisseData = await this.manager.getCaisse(req.params.id);
        if (caisseData) {
          res.send(caisseData.content);
        } else {
          res.status(404).send({ error: "Caisse not found" });
        }
      } catch (error) {
        res
          .status(500)
          .send({ error: "An error occurred while retrieving the caisse" });
      }
    });

    //api pour ajouter une caisse
    this.app.post("/api/addCaisse", async (req: any, res: any) => {
      await this.manager.addCaisse(req.body.num, parseInt(req.body.cat));
      res.send({ return: "Ok" });
    });

    //api pour suivant
    this.app.get("/api/next/:id", async(req: any, res: any) => {
      await this.manager.removeNum(req.params.id);
      res.send({ return: "next client call" });
    });

    //api avoir la liste des caisse
    this.app.get("/api/caisses", async (req: any, res: any) => {
      res.send(await this.manager.getCaisses());
    });

    //api pour desactiver ou activer caisse
    this.app.get("/api/turnCaisse/:id", async (req: any, res: any) => {
      const rea = req.params.id.split("-");
      await res.send(this.manager.turnCaisse(parseInt(rea[1]), parseInt(rea[0])));
    });

    //api pour se deconnecter
    this.app.get("/api/deconnexion/:id", async(req: any, res: any) => {
      const rea = req.params.id.split("-");
      await this.manager.deconnexion(parseInt(rea[1]), parseInt(rea[0]));
      res.send();
    });

    //api pour envoyer annonce
    this.app.get("/api/annonce", async (req: any, res: any) => {
      res.send(await this.annonce.getAnnonce());
    });

    //api get annonce by id
    this.app.get("/api/annonce/:id", async (req: any, res: any) => {
      res.send(await this.annonce.getAnnonceByID(parseInt(req.params.id)));
    });

    //api get category
    this.app.get("/api/category", async (req: any, res: any) => {
      res.send(await this.manager.getCategory());
    });

    //api get category
    this.app.get("/api/categoryName/:id", async (req: any, res: any) => {
      res.send(await this.manager.getCatName(parseInt(req.params.id)));
    });

    //api get category connected
    this.app.get("/api/categoryConnected", async (req: any, res: any) => {
      res.send(await this.manager.getCatConn());
    });

    //api add category
    this.app.post("/api/addCat", async (req: any, res: any) => {
      const success = await this.manager.services.addService(
        req.body.category,
        req.body.id
      );
      if (success) {
        res.send({ result: "ok" });
      } else {
        res.status(400).send({ result: "Service already exists" });
      }
    });
    //api del category
    this.app.get("/api/delCat/:id", async (req: any, res: any) => {
      const success = await this.manager.services.deleteService(
        parseInt(req.params.id)
      );
      res.send({ result: success ? "ok" : "Service not found" });
    });

    //api modify category
    this.app.post("/api/modifCat", async (req: any, res: any) => {
      this.manager.services.changeService(
        req.body.type,
        req.body.category,
        req.body.id
      );
      res.send({ result: "ok" });
    });

    //api get video
    this.app.get("/api/video", async(req: any, res: any) => {
      res.send(await this.video.getVideo());
    });

    //api pour supprimer video
    this.app.post("/api/delVideo/", async(req: any, res: any) => {
      await this.video.delVideo(req.body.name);
      res.send({ result: "ok" });
    });

    //api pour ajouter annonces
    this.app.post("/api/addAnnonce/", async (req: any, res: any) => {
      await this.annonce.addAnnonce(req.body.txt);
      res.send({ result: "ajout d'une nouvelle annonce" });
    });

    //api pour supprimer annonces
    this.app.get("/api/delAnnonce/:id", async(req: any, res: any) => {
      res.send(await this.annonce.removeAnnonce(parseInt(req.params.id)));
    });

    //api pour modifier annonces
    this.app.post("/api/editAnnonce/", async(req: any, res: any) => {
      await this.annonce.modifAnnonce(req.body.id, req.body.txt);
      res.send({ result: "ok" });
    });

    this.app.post("/api/upload", async (req: any, res: any) => {
      try {
        const newpath = "./public/assets/";
        const file = req.files.file;
        const filename = file.name;

        file.mv(`${newpath}${filename}`, async (err: any) => {
          if (err) {
            return res
              .status(500)
              .send({ message: "File upload failed", code: 500 });
          }

          await this.video.addVideo(filename, "/assets/" + filename);
          res.status(200).send({ message: "File Uploaded", code: 200 });
        });
      } catch (error) {
        res.status(500).send({ message: "An error occurred", code: 500 });
      }
    });

    this.app.get("/api/video", async (req: any, res: any) => {
      try {
        const videos = await this.video.getVideo();
        res.status(200).send(videos);
      } catch (error) {
        res
          .status(500)
          .send({ message: "Failed to retrieve videos", code: 500 });
      }
    });

    this.app.post("/api/delVideo/", async (req: any, res: any) => {
      try {
        await this.video.delVideo(req.body.name);
        res.status(200).send({ result: "ok" });
      } catch (error) {
        res.status(500).send({ message: "Failed to delete video", code: 500 });
      }
    });
  }

  //api video manager

  //liste des sockets
  private ioInterface() {
    this.io.on("connection", (socket: any) => {
      console.log(
        "Socket on : " + socket.handshake.address.substring(7) + " connected"
      );

      //socket speak
      socket.on("speak", (data: string) => {
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
        console.log(
          "Socket on : " +
            socket.handshake.address.substring(7) +
            " disconnected"
        );
      });
    });
  }
}
