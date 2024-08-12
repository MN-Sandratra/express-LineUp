import fs from 'fs';
import Video from '../models/video';

export default class VideoManager{
    private file = [
        {
            name : 'vide',
            link : 'vide'
        }
    ]

    constructor(){}
    
    public async addVideo(filename: string, filepath: string) {
        try {
            const newVideo = new Video({
                name: filename,
                link: filepath,
            });
            await newVideo.save();
        } catch (error) {
            console.log("error on add new video ")
        }  
    }

    private updateFile(){
        fs.writeFile('./videos.json',JSON.stringify(this.file),(err : any) => {
            if (err) throw err;
            console.log('\nVideos updated !');
        })
    }

    public async getVideo(){
        return await Video.find({ name: { $ne: 'vide' } });
    }

    public async delVideo(name : string){
        await Video.deleteOne({ name });
        fs.unlinkSync('./public/assets/'+name);
    }
}