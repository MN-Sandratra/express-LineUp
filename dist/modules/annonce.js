"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
class AnnonceManager {
    constructor() {
        this.annonces = [{
                id: 0,
                txt: ''
            }];
        this.init();
    }
    init() {
        fs_1.default.appendFile('./annonces.json', '', (err) => {
            if (err)
                throw err;
            fs_1.default.readFile('./annonces.json', { encoding: 'utf-8' }, (err, data) => {
                if (data.trim() === '') {
                    fs_1.default.writeFileSync('./annonces.json', JSON.stringify(this.annonces));
                    console.log('\nAnnonces initialized with new instance !');
                }
                else {
                    this.annonces = JSON.parse(data);
                    console.log('\nAnnonces initialized with previous instance !');
                }
            });
        });
    }
    getAnnonce() {
        this.updateLocal();
        return this.annonces.filter((e) => {
            return e.txt.trim() !== '';
        });
    }
    getAnnonceByID(id) {
        let annonce = {};
        for (let e of this.annonces) {
            if (e.id == id) {
                annonce = e;
                break;
            }
        }
        return annonce;
    }
    addAnnonce(txt) {
        this.updateLocal();
        this.annonces.push({
            id: this.annonces[this.annonces.length - 1].id + 1,
            txt: txt
        });
        this.updateFile();
    }
    removeAnnonce(id) {
        this.updateLocal();
        for (let e in this.annonces) {
            if (this.annonces[e].id == id) {
                this.annonces.splice(parseInt(e), 1);
                break;
            }
        }
        this.updateFile();
    }
    modifAnnonce(id, txt) {
        for (let e in this.annonces) {
            if (this.annonces[e].id == id) {
                this.annonces[e].txt = txt;
                break;
            }
        }
        this.updateFile();
    }
    updateLocal() {
        this.annonces = JSON.parse(fs_1.default.readFileSync('./annonces.json', { encoding: 'utf-8' }));
    }
    updateFile() {
        fs_1.default.writeFile('./annonces.json', JSON.stringify(this.annonces), (err) => {
            if (err)
                throw err;
            console.log('\nVideos updated !');
        });
    }
}
exports.default = AnnonceManager;
//# sourceMappingURL=annonce.js.map