const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name_uz: { type: String, required: true },
    name_ru: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    oldPrice: { type: Number },
    stock: { type: Number, default: 0 },
    image: { type: String, required: true }, // Asosiy rasm
    images: [{ type: String }], // ← YANGI: Qo'shimcha rasmlar massivi
    description: { type: String },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);