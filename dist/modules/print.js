"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const pdf_to_printer_1 = require("pdf-to-printer");
class Print {
    constructor() {
        this.pdf = require('html-pdf-node');
        this.template = `
            <p style='text-align: left;'>Nom de l'entreprise</p>
            <h1 style='text-align: center;font-size:50px;margin:0'>{{numero}}</h1>
            <h3 style='text-align: center;margin:0;'>Comptoir : {{id}}</h3>
            <h3 style='text-align: center;margin:0;'>{{titre}}</h3>
            <p style='text-align: center;margin:0;'>{{date}}</p>
        `;
    }
    printNumber(numero, id, titre, date) {
        const d = date.toLocaleDateString('fr-fr', { weekday: "long", year: "numeric", month: "short", day: "numeric", hour: '2-digit', minute: '2-digit' });
        const path = './pdfTemp.' + numero + '' + id + '' + titre + '.pdf';
        const option = {
            height: '5cm',
            width: '10cm'
        };
        const html = this.template.replace('{{numero}}', numero.toString()).replace('{{id}}', id).replace('{{titre}}', titre).replace('{{date}}', d);
        let file = { content: html };
        this.pdf.generatePdf(file, option).then((pdfBuffer) => {
            fs_1.default.writeFile(path, pdfBuffer, (err) => {
                if (err)
                    throw err;
                //getPrinters().then(console.log);
                //print to default Printer
                (0, pdf_to_printer_1.print)(path).then((res) => {
                    console.log(res);
                    fs_1.default.unlinkSync(path);
                });
            });
        });
    }
}
exports.default = Print;
//# sourceMappingURL=print.js.map