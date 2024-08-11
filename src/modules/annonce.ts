import fs from 'fs';

export default class AnnonceManager{
    private annonces = [{
        id : 0,
        txt : ''
    }];
    constructor(){
        this.init();
    }

    private init(){
        fs.appendFile('./annonces.json', '',(err : any) => {
            if (err) throw err;
            fs.readFile('./annonces.json',{encoding:'utf-8'},(err : any, data : string) => {
                if (data.trim() === ''){
                    fs.writeFileSync('./annonces.json',JSON.stringify(this.annonces));
                    console.log('\nAnnonces initialized with new instance !');
                }else{
                    this.annonces = JSON.parse(data);
                    console.log('\nAnnonces initialized with previous instance !');
                }
            });
        });
    }

    public getAnnonce(){
        this.updateLocal();
        return this.annonces.filter((e : any)=>{
            return e.txt.trim() !== '';
        });
    }

    public getAnnonceByID(id : number){
        let annonce = {};
        for (let e of this.annonces){
            if (e.id == id){
                annonce = e;
                break;
            }
        }
        return annonce;
    }

    public addAnnonce(txt : string){
        this.updateLocal();
        this.annonces.push({
            id : this.annonces[this.annonces.length-1].id + 1,
            txt : txt
        });
        this.updateFile();
    }

    public removeAnnonce(id : number){
        this.updateLocal();
        for (let e in this.annonces){
            if (this.annonces[e].id==id){
                this.annonces.splice(parseInt(e),1);
                break;
            }
        }
        this.updateFile();
    }

    public modifAnnonce(id : number, txt : string){
        for (let e in this.annonces){
            if (this.annonces[e].id==id){
                this.annonces[e].txt = txt;
                break;
            }
        }
        this.updateFile();
    }

    private updateLocal(){
        this.annonces= JSON.parse(fs.readFileSync('./annonces.json',{encoding:'utf-8'}));
    }

    private updateFile(){
        fs.writeFile('./annonces.json',JSON.stringify(this.annonces),(err : any) => {
            if (err) throw err;
            console.log('\nVideos updated !');
        })
    }
}