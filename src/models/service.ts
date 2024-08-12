import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    type: Number,
    category: String,
    id: String,
});

const ServiceModel = mongoose.model('Service', serviceSchema);

export default ServiceModel;
