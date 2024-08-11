import fs from 'fs';
import {print,getPrinters} from 'pdf-to-printer';

export default class Print{
    private pdf : any;
    private template : string;
    constructor(){
        this.pdf = require('html-pdf-node');
        this.template = `
            <p style='text-align: left;'>Nom de l'entreprise</p>
            <h1 style='text-align: center;font-size:50px;margin:0'>{{numero}}</h1>
            <h3 style='text-align: center;margin:0;'>Comptoir : {{id}}</h3>
            <h3 style='text-align: center;margin:0;'>{{titre}}</h3>
            <p style='text-align: center;margin:0;'>{{date}}</p>
        `;
    }

    public printNumber(numero : number, id : string, titre : string, date : Date){
        const d = date.toLocaleDateString('fr-fr', { weekday:"long", year:"numeric", month:"short", day:"numeric",hour:'2-digit',minute:'2-digit'});
        const path = './pdfTemp.'+numero+''+id+''+titre+'.pdf';
        const option = {
            height : '5cm',
            width : '10cm'
        }
        const html = this.template.replace('{{numero}}',numero.toString()).replace('{{id}}',id).replace('{{titre}}',titre).replace('{{date}}',d);
        let file = { content: html };
        this.pdf.generatePdf(file, option).then((pdfBuffer : any) => {
            fs.writeFile(path,pdfBuffer,(err : any)=>{
                if (err) throw err;
                //getPrinters().then(console.log);

                //print to default Printer
                print(path).then((res : any)=>{
                    console.log(res);
                    fs.unlinkSync(path);
                });
            });
          });
    }

}
