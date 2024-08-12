import mongoose, { Schema, Document } from 'mongoose';

interface ILog extends Document {
    iteration: number;
    data: any[];
    date: Date;
}

const LogSchema: Schema = new Schema({
    iteration: { type: Number, required: true },
    data: { type: Array, required: true },
    date: { type: Date, required: true }
});

const LogModel = mongoose.model<ILog>('Log', LogSchema);

export default LogModel;
