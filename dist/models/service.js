"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const serviceSchema = new mongoose_1.default.Schema({
    type: Number,
    category: String,
    id: String,
});
const ServiceModel = mongoose_1.default.model('Service', serviceSchema);
exports.default = ServiceModel;
//# sourceMappingURL=service.js.map