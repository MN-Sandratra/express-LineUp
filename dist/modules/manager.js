"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = __importDefault(require("./log"));
const service_1 = __importDefault(require("./service"));
const print_1 = __importDefault(require("./print"));
class Manager {
    constructor() {
        this.itteration = 0;
        this.log = new log_1.default();
        this.service = new service_1.default();
        this.print = new print_1.default();
        this.evaluation = [];
        this.data = [];
    }
    //fonction pour evaluer la priorité du fil
    Evaluate() {
        this.itteration = this.log.getFileContent().itteration;
        this.data = this.log.getFileContent().data;
        let total = this.data.length;
        this.data.forEach((element, index) => {
            element.evaluation = element.content.length / total;
        });
    }
    //fonction pour avoir le plus libre des caisses
    getFree(cat) {
        this.itteration = this.log.getFileContent().itteration;
        this.data = this.log.getFileContent().data;
        let free = -1;
        if (this.data.length > 0) {
            this.Evaluate();
            let max = 99999;
            this.data.forEach((element, index) => {
                if (max > element.evaluation && element.free && element.type == cat) {
                    free = index;
                    max = element.evaluation;
                }
                ;
            });
        }
        return free;
    }
    //fonction d'ajout de caisse
    addCaisse(caisse, cat) {
        this.itteration = this.log.getFileContent().itteration;
        this.data = this.log.getFileContent().data;
        let test = true;
        this.data.forEach((element) => {
            if (element.caisse == caisse && element.type == cat) {
                test = false;
                element.free = true;
            }
        });
        if (test) {
            this.data.push({
                caisse: caisse,
                free: true,
                content: [],
                evaluation: 0,
                category: this.service.getCat(cat).category,
                type: this.service.getCat(cat).type,
                id: this.service.getCat(cat).id
            });
        }
        this.log.updateLog(this.data, this.itteration);
    }
    //fonction pour avoir les data
    getCaisses() {
        this.itteration = this.log.getFileContent().itteration;
        this.data = this.log.getFileContent().data;
        return this.data;
    }
    //fonction pour avoir les data d'une caisse
    getCaisse(caisse) {
        this.itteration = this.log.getFileContent().itteration;
        this.data = this.log.getFileContent().data;
        const tmp = caisse.split('-');
        for (let element of this.data) {
            if (element.caisse == parseInt(tmp[1]) && element.type == parseInt(tmp[0])) {
                this.log.updateLog(this.data, this.itteration);
                return element;
            }
        }
    }
    //fonction pour switch caisse
    turnCaisse(caisse, cat) {
        this.itteration = this.log.getFileContent().itteration;
        this.data = this.log.getFileContent().data;
        for (let element in this.data) {
            if (this.data[element].caisse == caisse && this.data[element].type == cat) {
                this.data[element].free = !this.data[element].free;
                this.log.updateLog(this.data, this.itteration);
                return this.data[element].free;
            }
        }
        ;
        this.log.updateLog(this.data, this.itteration);
        return false;
    }
    //fonction pour ajouter numero
    getNumber(cat) {
        this.itteration = this.log.getFileContent().itteration;
        this.data = this.log.getFileContent().data;
        if (this.getFree(cat) != -1) {
            this.itteration++;
            const numero = this.itteration;
            const caisse = this.getFree(cat);
            const date = new Date();
            this.data[caisse].content.push({
                numero: numero,
                date: date,
                type: this.service.getCat(cat).type
            });
            this.log.updateLog(this.data, numero);
            //this.print.printNumber(numero,this.service.getCat(cat).id+'-'+this.data[caisse].caisse,this.service.getCat(cat).category,new Date());
            return {
                Caisse: this.data[caisse].caisse,
                numero: numero,
                date: date,
                category: this.service.getCat(cat).category
            };
        }
        else {
            return {
                Caisse: 0,
                numero: 0,
                data: new Date(),
                category: 'null'
            };
        }
    }
    removeNum(caisse) {
        this.itteration = this.log.getFileContent().itteration;
        this.data = this.log.getFileContent().data;
        let s = caisse.split('-');
        this.data.forEach((element) => {
            if (element.caisse == parseInt(s[1]) && element.type == parseInt(s[0])) {
                element.content.shift();
                return;
            }
        });
        this.log.updateLog(this.data, this.itteration);
    }
    //fonction pour se deconnecter
    deconnexion(caisse, cat) {
        this.itteration = this.log.getFileContent().itteration;
        this.data = this.log.getFileContent().data;
        let tmp = [];
        let test = false;
        for (let element in this.data) {
            if (this.data[element].caisse == caisse && this.data[element].type == cat) {
                if (this.data.length > 1) {
                    test = true;
                    tmp = this.data[element];
                }
                this.data.splice(element, 1);
                break;
            }
        }
        if (test) {
            this.fillCaissse(tmp);
        }
        this.log.updateLog(this.data, this.itteration);
    }
    //Methode pour remplir les caisses de contenues
    fillCaissse(content) {
        const len = this.data.length;
        let i = 0;
        let exist = false;
        const cat = content.id;
        for (let en of this.data) {
            if (en.type == cat) {
                exist = true;
                break;
            }
        }
        if (exist) {
            for (let e in content.content) {
                while (this.data[i % len].type != cat) {
                    i++;
                }
                if (this.data[i % len].type == cat) {
                    this.data[i % len].content.push(content.content[e]);
                }
                i++;
            }
        }
        this.reOrderNumberContent();
    }
    //Methode pour réorganiser les numero
    reOrderNumberContent() {
        for (let id in this.data) {
            this.data[id].content = this.data[id].content.sort((a, b) => {
                return a.numero - b.numero;
            });
        }
    }
    //Methode category get
    getCategory() {
        return this.service.Services;
    }
    //get category Name by type
    getCatName(cat) {
        return this.service.getCat(cat);
    }
    //get category connected
    getCatConn() {
        let obj = [];
        for (let el of this.data) {
            if (el.free) {
                obj.push(el.type);
            }
        }
        const tmp = new Set(obj);
        const tmpRes = [...tmp];
        return tmpRes.map((e) => {
            return {
                type: this.service.getCat(e).type,
                category: this.service.getCat(e).category,
                id: this.service.getCat(e).id
            };
        });
    }
    get services() {
        return this.service;
    }
}
exports.default = Manager;
//# sourceMappingURL=manager.js.map