const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    whatsappNumber: { type: String, required: true, unique: true },
    businessName: { type: String, required: true },
    address: { type: String, required: true },
    gstin: { type: String, required: false },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    verified: { type: Boolean, default: false },
    onboardingComplete: { type: Boolean, default: false },
    onboardingStep: { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Seller', sellerSchema);