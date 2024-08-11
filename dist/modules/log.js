"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//module pour gerer les log
const fs_1 = __importDefault(require("fs"));
class Log {
    //initialisation du fichier log en le créant s'il n'existe pas
    //ou en chargeant son contenu dans fileContent
    constructor() {
        this.fileName = './Log.json';
        this.fileContent = {
            itteration: 0,
            data: [],
            date: new Date()
        };
        fs_1.default.appendFile(this.fileName, '', (err) => {
            if (err)
                throw err;
            fs_1.default.readFile(this.fileName, { encoding: 'utf-8' }, (err, data) => {
                if (data.trim() === '') {
                    fs_1.default.writeFileSync(this.fileName, JSON.stringify(this.fileContent));
                    console.log('\nLog initialized with new instance !');
                }
                else {
                    this.fileContent = JSON.parse(data);
                    console.log('\nLog initialized with previous instance !');
                }
                if (!this.datesAreOnSameDay(new Date(this.fileContent.date), new Date())) {
                    this.resetLog();
                }
            });
        });
    }
    //Methode pour réinitialiser le fichier log
    resetLog() {
        const fileContent = {
            itteration: 0,
            data: [],
            date: new Date()
        };
        fs_1.default.writeFile(this.fileName, JSON.stringify(fileContent), (err) => {
            if (err)
                throw err;
            console.log('\nReset of the log system successed !');
        });
    }
    //Methode pour mettre à jour le fichier log
    updateLog(data, lastItteration) {
        const fileContent = {
            itteration: lastItteration,
            data: data,
            date: new Date()
        };
        this.fileContent = fileContent;
        fs_1.default.writeFile(this.fileName, JSON.stringify(this.fileContent), (err) => {
            if (err)
                throw err;
            console.log('\nLog updated !');
        });
    }
    //Methode pour recuperer le contenue du fichier Log
    getFileContent() {
        return this.fileContent;
    }
    //Methode pour comparer date
    datesAreOnSameDay(first, second) {
        return (this.formatDate(first) === this.formatDate(second));
    }
    formatDate(obj) {
        let s = '';
        s += obj.getFullYear() + '/' + obj.getMonth() + '/' + obj.getDate();
        return s;
    }
}
exports.default = Log;
//# sourceMappingURL=log.js.map