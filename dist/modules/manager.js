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
const log_1 = __importDefault(require("./log"));
const service_1 = __importDefault(require("./service"));
const print_1 = __importDefault(require("./print"));
class Manager {
    constructor() {
        this.log = new log_1.default();
        this.service = new service_1.default();
        this.print = new print_1.default();
        this.evaluation = [];
        this.iteration = 0;
        this.data = [];
        this.initialize();
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            this.data = yield this.log.getData();
            this.iteration = yield this.log.getIteration();
            this.Evaluate();
        });
    }
    Evaluate() {
        return __awaiter(this, void 0, void 0, function* () {
            let total = this.data.length;
            this.data.forEach((element) => {
                element.evaluation = element.content.length / total;
            });
        });
    }
    getFree(cat) {
        return __awaiter(this, void 0, void 0, function* () {
            let free = -1;
            if (this.data.length > 0) {
                this.Evaluate();
                let max = 99999;
                this.data.forEach((element, index) => {
                    if (max > element.evaluation && element.free && element.type == cat) {
                        free = index;
                        max = element.evaluation;
                    }
                });
            }
            return free;
        });
    }
    addCaisse(caisse, cat) {
        return __awaiter(this, void 0, void 0, function* () {
            let test = true;
            const category = yield this.service.getCat(cat);
            this.data.forEach((element) => {
                if (element.caisse === caisse && element.type === cat) {
                    test = false;
                    element.free = true;
                }
            });
            if (test && category) {
                this.data.push({
                    caisse: caisse,
                    free: true,
                    content: [],
                    evaluation: 0,
                    category: category.category,
                    type: category.type,
                    id: category.id
                });
            }
            yield this.log.updateData(this.data);
        });
    }
    getCaisses() {
        return __awaiter(this, void 0, void 0, function* () {
            this.data = yield this.log.getData();
            return this.data;
        });
    }
    getCaisse(caisse) {
        return __awaiter(this, void 0, void 0, function* () {
            const tmp = caisse.split('-');
            this.data = yield this.log.getData();
            for (let element of this.data) {
                if (element.caisse == parseInt(tmp[1]) && element.type == parseInt(tmp[0])) {
                    yield this.log.updateData(this.data);
                    return element;
                }
            }
        });
    }
    turnCaisse(caisse, cat) {
        return __awaiter(this, void 0, void 0, function* () {
            this.data = yield this.log.getData();
            for (let element in this.data) {
                if (this.data[element].caisse == caisse && this.data[element].type == cat) {
                    this.data[element].free = !this.data[element].free;
                    yield this.log.updateData(this.data);
                    return this.data[element].free;
                }
            }
            ;
            yield this.log.updateData(this.data);
            return false;
        });
    }
    getNumber(cat) {
        return __awaiter(this, void 0, void 0, function* () {
            const freeCaisseIndex = yield this.getFree(cat);
            this.data = yield this.log.getData();
            this.iteration = yield this.log.getIteration();
            if (freeCaisseIndex != -1) {
                this.iteration++;
                const numero = this.iteration;
                const caisse = this.data[freeCaisseIndex];
                const date = new Date();
                const category = yield this.service.getCat(cat);
                if (category) {
                    caisse.content.push({
                        numero: numero,
                        date: date,
                        type: category.type
                    });
                    yield this.log.updateData(this.data);
                    yield this.log.updateIteration(this.iteration);
                    // this.print.printNumber(numero, category.id + '-' + this.data[freeCaisseIndex].caisse, category.category, new Date());
                    return {
                        Caisse: this.data[freeCaisseIndex].caisse,
                        numero: numero,
                        date: date,
                        category: category.category
                    };
                }
            }
            else {
                return {
                    Caisse: 0,
                    numero: 0,
                    data: new Date(),
                    category: 'null'
                };
            }
            return {};
        });
    }
    removeNum(caisse) {
        return __awaiter(this, void 0, void 0, function* () {
            this.data = yield this.log.getData();
            let s = caisse.split('-');
            this.data.forEach((element) => {
                if (element.caisse == parseInt(s[1]) && element.type == parseInt(s[0])) {
                    element.content.shift();
                    return;
                }
            });
            yield this.log.updateData(this.data);
        });
    }
    deconnexion(caisse, cat) {
        return __awaiter(this, void 0, void 0, function* () {
            this.data = yield this.log.getData();
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
            yield this.log.updateData(this.data);
        });
    }
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
    reOrderNumberContent() {
        for (let id in this.data) {
            this.data[id].content = this.data[id].content.sort((a, b) => {
                return a.numero - b.numero;
            });
        }
    }
    getCategory() {
        return this.service.getServices();
    }
    getCatName(cat) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.service.getCat(cat);
        });
    }
    getCatConn() {
        return __awaiter(this, void 0, void 0, function* () {
            let obj = [];
            for (let el of this.data) {
                if (el.free) {
                    obj.push(el.type);
                }
            }
            const tmp = new Set(obj);
            const tmpRes = [...tmp];
            return yield Promise.all(tmpRes.map((e) => __awaiter(this, void 0, void 0, function* () {
                const cat = yield this.service.getCat(e);
                return {
                    type: cat === null || cat === void 0 ? void 0 : cat.type,
                    category: cat === null || cat === void 0 ? void 0 : cat.category,
                    id: cat === null || cat === void 0 ? void 0 : cat.id
                };
            })));
        });
    }
    get services() {
        return this.service;
    }
}
exports.default = Manager;
//# sourceMappingURL=manager.js.map