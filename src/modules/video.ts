import fs from 'fs';

export default class VideoManager{
    private file = [
        {
            name : 'vide',
            link : 'vide'
        }
    ]

    constructor(){
        this.initFile();
        this.init();
    }

    private init(){
        const express = require("express");
        const fileupload = require("express-fileupload");
        const cors = require("cors");
        const bodyParser = require('body-parser');
        
        const app = express();
        
        app.use(cors());
        app.use(fileupload());
        app.use(express.static("files"));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        
        app.post("/api/upload", (req : any, res: any) => {
            this.updateLocal();
            const newpath = "./public/assets/";
            const file = req.files.file;
            const filename = file.name;
            
            file.mv(`${newpath}${filename}`, (err : any) => {
                if (err) {
                    res.status(500).send({ message: "File upload failed", code: 200 });
                }   
                this.file.push({
                    name : filename,
                    link : '/assets/'+filename
                })
                this.updateFile();
                res.status(200).send({ message: "File Uploaded", code: 200 });
                
            });
        });
        
        app.listen(8080, () => {
        console.log("Server running successfully on 8080");
        });
    }

    private initFile(){
        fs.appendFile('./videos.json', '',(err : any) => {
            if (err) throw err;
            fs.readFile('./videos.json',{encoding:'utf-8'},(err : any, data : string) => {
                if (data.trim() === ''){
                    fs.writeFileSync('./videos.json',JSON.stringify(this.file));
                    console.log('\nVideos with new instance !');
                }else{
                    this.file = JSON.parse(data);
                    console.log('\nVideos with previous instance !');
                }
            });
        });
    }

    private updateLocal(){
        this.file= JSON.parse(fs.readFileSync('./videos.json',{encoding:'utf-8'}));
    }

    private updateFile(){
        fs.writeFile('./videos.json',JSON.stringify(this.file),(err : any) => {
            if (err) throw err;
            console.log('\nVideos updated !');
        })
    }

    public getVideo(){
        this.updateLocal();
        return this.file.filter((e : any)=>{
            return e.name !=='vide' && e.link!=='vide';
        });
    }

    public delVideo(name : string){
        this.updateLocal();
        fs.unlinkSync('./public/assets/'+name);
        for (let e in this.file){
            if (this.file[e].name === name){
                this.file.splice(parseInt(e),1);
                break;
            }
        }
        this.updateFile();
    }
}