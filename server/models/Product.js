const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name_uz: { type: String, required: true },
    name_ru: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    oldPrice: { type: Number },
    category: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String },
    stock: { type: Number, default: 0 },
    rating: { type: Number, default: 4.5 },
    reviews: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);