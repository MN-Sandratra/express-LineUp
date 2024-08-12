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
const service_1 = __importDefault(require("../models/service"));
class Service {
    constructor() {
        this.initialize();
    }
    //methode d'initialisation du fichier conteneur
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            const count = yield service_1.default.countDocuments();
            if (count === 0) {
                const initialServices = [
                    { type: 1, category: 'caisse', id: 'C' },
                    { type: 2, category: 'accueil', id: 'AC' },
                    { type: 3, category: 'gestion de compte', id: 'GC' },
                ];
                yield service_1.default.insertMany(initialServices);
                console.log('Services initialized with new instance!');
            }
            else {
                console.log('Services already initialized.');
            }
        });
    }
    //methode pour ajouter un nouveau service
    addService(cat, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingService = yield service_1.default.findOne({ category: cat });
            if (existingService) {
                return false;
            }
            const lastService = yield service_1.default.findOne().sort({ type: -1 });
            const newType = (lastService === null || lastService === void 0 ? void 0 : lastService.type) ? lastService.type + 1 : 1;
            const newService = new service_1.default({
                type: newType,
                category: cat,
                id: id,
            });
            yield newService.save();
            return true;
        });
    }
    // Méthode pour modifier un service
    changeService(type, category, id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield service_1.default.updateOne({ type }, { category, id });
        });
    }
    // Méthode pour supprimer un service
    deleteService(type) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield service_1.default.deleteOne({ type });
            return result.deletedCount > 0;
        });
    }
    // Méthode pour récupérer tous les services
    getServices() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield service_1.default.find({});
        });
    }
    // Méthode pour récupérer une catégorie spécifique par ID
    getCat(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield service_1.default.findOne({ type: id });
        });
    }
}
exports.default = Service;
//# sourceMappingURL=service.js.map