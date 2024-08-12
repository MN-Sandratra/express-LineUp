import Annonce from '../models/annonce';

export default class AnnonceManager {
    constructor() {}

    public async getAnnonce() {
        try {
            return await Annonce.find();
        } catch (error) {
            console.error('Error getting annonces:', error);
            throw new Error('Could not retrieve annonces');
        }
    }

    public async getAnnonceByID(id: number) {
        try {
            return await Annonce.findOne({ id });
        } catch (error) {
            console.error(`Error getting annonce with ID ${id}:`, error);
            throw new Error('Could not retrieve the annonce');
        }
    }

    public async addAnnonce(txt: string) {
        try {
            const lastAnnonce = await Annonce.findOne().sort({ id: -1 });
            const newId = lastAnnonce ? lastAnnonce.id + 1 : 1;

            const newAnnonce = new Annonce({
                id: newId,
                txt: txt,
            });

            await newAnnonce.save();
        } catch (error) {
            console.error('Error adding new annonce:', error);
            throw new Error('Could not add the annonce');
        }
    }

    public async removeAnnonce(id: number) {
        try {
            await Annonce.deleteOne({ id });
        } catch (error) {
            console.error(`Error removing annonce with ID ${id}:`, error);
            throw new Error('Could not remove the annonce');
        }
    }

    public async modifAnnonce(id: number, txt: string) {
        try {
            await Annonce.updateOne({ id }, { txt });
        } catch (error) {
            console.error(`Error modifying annonce with ID ${id}:`, error);
            throw new Error('Could not modify the annonce');
        }
    }
}
