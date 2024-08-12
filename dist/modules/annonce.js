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
const annonce_1 = __importDefault(require("../models/annonce"));
class AnnonceManager {
    constructor() { }
    getAnnonce() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield annonce_1.default.find();
            }
            catch (error) {
                console.error('Error getting annonces:', error);
                throw new Error('Could not retrieve annonces');
            }
        });
    }
    getAnnonceByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield annonce_1.default.findOne({ id });
            }
            catch (error) {
                console.error(`Error getting annonce with ID ${id}:`, error);
                throw new Error('Could not retrieve the annonce');
            }
        });
    }
    addAnnonce(txt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lastAnnonce = yield annonce_1.default.findOne().sort({ id: -1 });
                const newId = lastAnnonce ? lastAnnonce.id + 1 : 1;
                const newAnnonce = new annonce_1.default({
                    id: newId,
                    txt: txt,
                });
                yield newAnnonce.save();
            }
            catch (error) {
                console.error('Error adding new annonce:', error);
                throw new Error('Could not add the annonce');
            }
        });
    }
    removeAnnonce(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield annonce_1.default.deleteOne({ id });
            }
            catch (error) {
                console.error(`Error removing annonce with ID ${id}:`, error);
                throw new Error('Could not remove the annonce');
            }
        });
    }
    modifAnnonce(id, txt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield annonce_1.default.updateOne({ id }, { txt });
            }
            catch (error) {
                console.error(`Error modifying annonce with ID ${id}:`, error);
                throw new Error('Could not modify the annonce');
            }
        });
    }
}
exports.default = AnnonceManager;
//# sourceMappingURL=annonce.js.map