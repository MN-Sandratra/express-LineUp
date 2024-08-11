//module pour gerer les log
import fs from 'fs';

export default class Log{
    private fileName = './Log.json';
    private fileContent = {
        itteration : 0,
        data : [],
        date : new Date()
    }

    //initialisation du fichier log en le créant s'il n'existe pas
    //ou en chargeant son contenu dans fileContent
    constructor(){
        fs.appendFile(this.fileName, '',(err : any) => {
            if (err) throw err;
            fs.readFile(this.fileName,{encoding:'utf-8'},(err : any, data : string) => {
                if (data.trim() === ''){
                    fs.writeFileSync(this.fileName,JSON.stringify(this.fileContent));
                    console.log('\nLog initialized with new instance !');
                }else{
                    this.fileContent = JSON.parse(data);
                    console.log('\nLog initialized with previous instance !');
                }
                if (!this.datesAreOnSameDay(new Date(this.fileContent.date),new Date())){
                    this.resetLog();
                }
            });
        });
    }

    //Methode pour réinitialiser le fichier log
    public resetLog(){
        const fileContent = {
            itteration : 0,
            data : [],
            date : new Date()
        }

        fs.writeFile(this.fileName,JSON.stringify(fileContent),(err : any) =>{
            if (err) throw err;
            console.log('\nReset of the log system successed !');
        });
    }

    //Methode pour mettre à jour le fichier log
    public updateLog(data : [], lastItteration : number){
        const fileContent = {
            itteration : lastItteration,
            data : data,
            date : new Date()
        }

        this.fileContent = fileContent;

        fs.writeFile(this.fileName,JSON.stringify(this.fileContent),(err : any) => {
            if (err) throw err;
            console.log('\nLog updated !');
        })
    }

    //Methode pour recuperer le contenue du fichier Log
    public getFileContent() : any{
        return this.fileContent;
    }

    //Methode pour comparer date
    private datesAreOnSameDay(first : Date, second : Date){
        return (this.formatDate(first) === this.formatDate(second));
    }
    
    private formatDate(obj : Date) : string{
        let s = '';
        s += obj.getFullYear()+'/'+obj.getMonth()+'/'+obj.getDate();
        return s;
    }
        
}