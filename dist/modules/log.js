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
const log_1 = __importDefault(require("../models/log"));
class Log {
    constructor() {
        this.initializeLog();
    }
    initializeLog() {
        return __awaiter(this, void 0, void 0, function* () {
            const logExists = yield log_1.default.exists({});
            if (!logExists) {
                const newLog = new log_1.default({
                    iteration: 0,
                    data: [],
                    date: new Date()
                });
                yield newLog.save();
                console.log('\nLog initialized with new instance!');
            }
            else {
                console.log('\nLog initialized with previous instance!');
                const log = yield log_1.default.findOne({});
                if (log && !this.datesAreOnSameDay(new Date(log.date), new Date())) {
                    this.resetLog();
                }
            }
        });
    }
    resetLog() {
        return __awaiter(this, void 0, void 0, function* () {
            yield log_1.default.updateOne({}, {
                $set: {
                    iteration: 0,
                    data: [],
                    date: new Date()
                }
            });
            console.log('\nReset of the log system succeeded!');
        });
    }
    updateData(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield log_1.default.updateOne({}, {
                $set: {
                    data: data,
                    date: new Date()
                }
            });
            console.log('\nData updated!');
        });
    }
    updateIteration(iteration) {
        return __awaiter(this, void 0, void 0, function* () {
            yield log_1.default.updateOne({}, {
                $set: {
                    iteration: iteration,
                    date: new Date()
                }
            });
            console.log('\nIteration updated!');
        });
    }
    getData() {
        return __awaiter(this, void 0, void 0, function* () {
            const log = yield log_1.default.findOne({});
            return log ? log.data : null;
        });
    }
    getIteration() {
        return __awaiter(this, void 0, void 0, function* () {
            const log = yield log_1.default.findOne({});
            return log ? log.iteration : 0;
        });
    }
    datesAreOnSameDay(first, second) {
        return this.formatDate(first) === this.formatDate(second);
    }
    formatDate(obj) {
        return `${obj.getFullYear()}/${obj.getMonth() + 1}/${obj.getDate()}`;
    }
}
exports.default = Log;
//# sourceMappingURL=log.js.map