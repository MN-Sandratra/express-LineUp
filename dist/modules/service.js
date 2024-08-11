"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
class Service {
    constructor() {
        this.services = {
            content: [
                {
                    type: 1,
                    category: 'caisse',
                    id: 'C'
                },
                {
                    type: 2,
                    category: 'accueil',
                    id: 'AC'
                },
                {
                    type: 3,
                    category: 'gestion de compte',
                    id: 'GC'
                }
            ]
        };
        this.initialize();
    }
    //methode d'initialisation du fichier conteneur
    initialize() {
        fs_1.default.appendFile('./services.json', '', (err) => {
            if (err)
                throw err;
            fs_1.default.readFile('./services.json', { encoding: 'utf-8' }, (err, data) => {
                if (data.trim() === '') {
                    fs_1.default.writeFileSync('./services.json', JSON.stringify(this.services));
                    console.log('\nServices with new instance !');
                }
                else {
                    this.services = JSON.parse(data);
                    console.log('\nServices with previous instance !');
                }
            });
        });
    }
    //methode pour ajouter un nouveau service
    addService(cat, id) {
        let final = true;
        this.updateLocalService();
        for (let i of this.services.content) {
            if (i.category === cat) {
                final = false;
                break;
            }
        }
        if (final) {
            this.services.content.push({
                type: this.services.content[this.services.content.length - 1].type + 1,
                category: cat,
                id: id
            });
        }
        this.updateService();
        return final;
    }
    //methode pour modifier
    changeService(type, txt, text) {
        this.updateLocalService();
        for (let el of this.services.content) {
            if (el.type == type) {
                el.category = txt;
                el.id = text;
                break;
            }
        }
        this.updateService();
    }
    //methode pour supprimer un service
    deleteService(type) {
        let final = false;
        this.updateLocalService();
        for (let element in this.services.content) {
            if (this.services.content[element].type == type) {
                this.services.content.splice(parseInt(element), 1);
                final = true;
                break;
            }
        }
        this.updateService();
        return final;
    }
    //methode pour mettre a jour le fichier conteneur
    updateService() {
        fs_1.default.writeFile('./services.json', JSON.stringify(this.services), (err) => {
            if (err)
                throw err;
            console.log('\nService updated !');
        });
    }
    //methode pour mettre a jour le conteneur local (this.services)
    updateLocalService() {
        this.services = JSON.parse(fs_1.default.readFileSync('./services.json', { encoding: 'utf-8' }));
    }
    get Services() {
        this.updateLocalService();
        return this.services;
    }
    //Methode get Category specifique
    getCat(id) {
        this.updateLocalService();
        let result = {
            category: '',
            type: 0,
            id: ''
        };
        for (let i of this.services.content) {
            if (i.type == id) {
                result = {
                    category: i.category,
                    type: i.type,
                    id: i.id
                };
                break;
            }
        }
        return result;
    }
}
exports.default = Service;
//# sourceMappingURL=service.js.map