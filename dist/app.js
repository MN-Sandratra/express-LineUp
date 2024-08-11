"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./modules/server"));
class Main {
    constructor() {
        const server = new server_1.default();
    }
}
const main = new Main();
//# sourceMappingURL=app.js.map