const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // ← YANGI QO'SHILDI
    customer: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        email: { type: String }
    },
    orderItems: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true }
    }],
    totalPrice: { type: Number, required: true },
    paymentMethod: { type: String, required: true, default: 'Naqd (Yetkazib berganda)' },
    status: { type: String, required: true, default: 'Jarayonda' },
    telegramChatId: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);