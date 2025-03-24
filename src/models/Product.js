const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
    name: { type: String, required: true },
    description: { type: String, required: false },
    category: { type: String, required: false },
    price: { type: Number, required: true },
    minOrderQuantity: { type: Number, required: false },
    packaging: { type: String, required: false },
    weight: { type: Number, required: false },
    unit: { type: String, required: false },
    inStock: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', productSchema);