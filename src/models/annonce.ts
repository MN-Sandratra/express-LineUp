import mongoose, { Schema, Document } from "mongoose";

export interface IAnnonce extends Document {
  id: number;
  txt: string;
}

const AnnonceSchema: Schema = new Schema({
  id: { type: Number, required: true, unique: true },
  txt: { type: String, required: true },
});

const Annonce = mongoose.model<IAnnonce>("Annonce", AnnonceSchema);
export default Annonce;
