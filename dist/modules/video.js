"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
class VideoManager {
    constructor() {
        this.file = [
            {
                name: 'vide',
                link: 'vide'
            }
        ];
        this.initFile();
        this.init();
    }
    init() {
        const express = require("express");
        const fileupload = require("express-fileupload");
        const cors = require("cors");
        const bodyParser = require('body-parser');
        const app = express();
        app.use(cors());
        app.use(fileupload());
        app.use(express.static("files"));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.post("/api/upload", (req, res) => {
            this.updateLocal();
            const newpath = "./public/assets/";
            const file = req.files.file;
            const filename = file.name;
            file.mv(`${newpath}${filename}`, (err) => {
                if (err) {
                    res.status(500).send({ message: "File upload failed", code: 200 });
                }
                this.file.push({
                    name: filename,
                    link: '/assets/' + filename
                });
                this.updateFile();
                res.status(200).send({ message: "File Uploaded", code: 200 });
            });
        });
        app.listen(8080, () => {
            console.log("Server running successfully on 8080");
        });
    }
    initFile() {
        fs_1.default.appendFile('./videos.json', '', (err) => {
            if (err)
                throw err;
            fs_1.default.readFile('./videos.json', { encoding: 'utf-8' }, (err, data) => {
                if (data.trim() === '') {
                    fs_1.default.writeFileSync('./videos.json', JSON.stringify(this.file));
                    console.log('\nVideos with new instance !');
                }
                else {
                    this.file = JSON.parse(data);
                    console.log('\nVideos with previous instance !');
                }
            });
        });
    }
    updateLocal() {
        this.file = JSON.parse(fs_1.default.readFileSync('./videos.json', { encoding: 'utf-8' }));
    }
    updateFile() {
        fs_1.default.writeFile('./videos.json', JSON.stringify(this.file), (err) => {
            if (err)
                throw err;
            console.log('\nVideos updated !');
        });
    }
    getVideo() {
        this.updateLocal();
        return this.file.filter((e) => {
            return e.name !== 'vide' && e.link !== 'vide';
        });
    }
    delVideo(name) {
        this.updateLocal();
        fs_1.default.unlinkSync('./public/assets/' + name);
        for (let e in this.file) {
            if (this.file[e].name === name) {
                this.file.splice(parseInt(e), 1);
                break;
            }
        }
        this.updateFile();
    }
}
exports.default = VideoManager;
//# sourceMappingURL=video.js.map