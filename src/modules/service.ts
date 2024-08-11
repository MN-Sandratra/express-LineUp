import fs from 'fs';

export default class Service{
    private services = {
        content : [
            {
                type : 1,
                category : 'caisse',
                id : 'C'
            },
            {
                type : 2,
                category : 'accueil',
                id : 'AC'
            },
            {
                type : 3,
                category : 'gestion de compte',
                id : 'GC'
            }
        ]
    }

    constructor(){
        this.initialize();
    }

    //methode d'initialisation du fichier conteneur
    private initialize(){
        fs.appendFile('./services.json', '',(err : any) => {
            if (err) throw err;
            fs.readFile('./services.json',{encoding:'utf-8'},(err : any, data : string) => {
                if (data.trim() === ''){
                    fs.writeFileSync('./services.json',JSON.stringify(this.services));
                    console.log('\nServices with new instance !');
                }else{
                    this.services = JSON.parse(data);
                    console.log('\nServices with previous instance !');
                }
            });
        });
    }

    //methode pour ajouter un nouveau service
    public addService(cat : string, id : string) : boolean{
        let final = true;
        this.updateLocalService();
        for (let i of this.services.content){
            if (i.category === cat){
                final = false;
                break;
            }
        }
        if (final){
            this.services.content.push({
                type : this.services.content[this.services.content.length-1].type + 1,
                category : cat,
                id : id
            });
        }
        this.updateService();
        return final;
    }

    //methode pour modifier
    public changeService(type : number,txt : string,text : string){
        this.updateLocalService();
        for (let el of this.services.content){
            if (el.type == type){
                el.category = txt;
                el.id = text;
                break;
            }
        }
        this.updateService();
    }

    //methode pour supprimer un service
    public deleteService(type : number) : boolean{
        let final = false;
        this.updateLocalService();
        for (let element in this.services.content){
            if (this.services.content[element].type == type){
                this.services.content.splice(parseInt(element),1);
                final = true;
                break;
            }
        }
        this.updateService();
        return final;
    }

    //methode pour mettre a jour le fichier conteneur
    private updateService(){
        fs.writeFile('./services.json',JSON.stringify(this.services),(err : any) => {
            if (err) throw err;
            console.log('\nService updated !');
        })
    }

    //methode pour mettre a jour le conteneur local (this.services)
    private updateLocalService(){
        this.services= JSON.parse(fs.readFileSync('./services.json',{encoding:'utf-8'}));
    }

    get Services() : any{
        this.updateLocalService();
        return this.services;
    }

    //Methode get Category specifique
    public getCat(id : number) : any{
        this.updateLocalService();
        let result = {
            category : '',
            type : 0,
            id : ''
        };
        for (let i of this.services.content){
            if (i.type == id){
                result = {
                    category : i.category,
                    type : i.type,
                    id : i.id
                };
                break;
            }
        }
        return result;
    }
}