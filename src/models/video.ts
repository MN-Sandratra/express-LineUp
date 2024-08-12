import mongoose, { Schema, Document } from 'mongoose';

interface IVideo extends Document {
    name: string;
    link: string;
}
const videoSchema = new Schema({
    name: String,
    link: String,
});

const Video = mongoose.model<IVideo>('Video', videoSchema);
export default Video;