import fs from 'fs';
import ServiceModel from '../models/service';

export default class Service{
    constructor(){
        this.initialize();
    }

    //methode d'initialisation du fichier conteneur
    private async initialize(){
        const count = await ServiceModel.countDocuments();
        if (count === 0) {
            const initialServices = [
                { type: 1, category: 'caisse', id: 'C' },
                { type: 2, category: 'accueil', id: 'AC' },
                { type: 3, category: 'gestion de compte', id: 'GC' },
            ];
            await ServiceModel.insertMany(initialServices);
            console.log('Services initialized with new instance!');
        } else {
            console.log('Services already initialized.');
        }
    }

    //methode pour ajouter un nouveau service
    public async addService(cat: string, id: string): Promise<boolean> {
        const existingService = await ServiceModel.findOne({ category: cat });
        if (existingService) {
            return false;
        }

        const lastService = await ServiceModel.findOne().sort({ type: -1 });
        const newType = lastService?.type ? lastService.type + 1 : 1;

        const newService = new ServiceModel({
            type: newType,
            category: cat,
            id: id,
        });

        await newService.save();
        return true;
    }

    // Méthode pour modifier un service
    public async changeService(type: number, category: string, id: string) {
        await ServiceModel.updateOne({ type }, { category, id });
    }

    // Méthode pour supprimer un service
    public async deleteService(type: number): Promise<boolean> {
        const result = await ServiceModel.deleteOne({ type });
        return result.deletedCount > 0;
    }

    // Méthode pour récupérer tous les services
    public async getServices() {
        return await ServiceModel.find({});
    }

    // Méthode pour récupérer une catégorie spécifique par ID
    public async getCat(id: number) {
        return await ServiceModel.findOne({ type: id });
    }
}