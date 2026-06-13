const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const jwt = require('jsonwebtoken');

// Yangi buyurtma yaratish
router.post('/', async (req, res) => {
    try {
        const { customer, orderItems, totalPrice, paymentMethod, userId } = req.body;

        // Validatsiya
        if (!customer || !customer.name || !customer.phone || !customer.address) {
            return res.status(400).json({ message: "Mijoz ma'lumotlari to'liq emas" });
        }

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: "Buyurtmada mahsulotlar yo'q" });
        }

        if (!totalPrice || totalPrice <= 0) {
            return res.status(400).json({ message: "Narx noto'g'ri" });
        }

        const newOrder = new Order({
            userId: userId || null, // ← YANGI QO'SHILDI
            customer,
            orderItems,
            totalPrice,
            paymentMethod: paymentMethod || 'Naqd (Yetkazib berganda)'
        });

        const createdOrder = await newOrder.save();

        console.log('✅ Yangi buyurtma yaratildi:', createdOrder._id);

        // Telegram xabari
        try {
            const { sendNewOrderNotification } = require('../utils/telegram');
            await sendNewOrderNotification(createdOrder);
        } catch (telegramError) {
            console.log('⚠️  Telegram xabari yuborilmadi:', telegramError.message);
        }

        res.status(201).json(createdOrder);
    } catch (error) {
        console.error('❌ Buyurtma yaratishda xatolik:', error);
        res.status(500).json({
            message: "Buyurtma yaratishda xatolik",
            error: error.message
        });
    }
});

// Foydalanuvchining buyurtmalarini olish (userId bo'yicha)
router.get('/my-orders', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: "Token talab qilinadi" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // userId bo'yicha qidirish (eng ishonchli)
        const orders = await Order.find({ userId: decoded.userId })
            .sort({ createdAt: -1 });

        // Agar userId bo'yicha topilmasa, email bo'yicha qidirish
        if (orders.length === 0) {
            const User = require('../models/User');
            const user = await User.findById(decoded.userId);

            if (user) {
                const ordersByEmail = await Order.find({ 'customer.email': user.email })
                    .sort({ createdAt: -1 });

                if (ordersByEmail.length > 0) {
                    return res.json(ordersByEmail);
                }
            }
        }

        res.json(orders);
    } catch (error) {
        console.error('My orders error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Barcha buyurtmalarni olish (Admin uchun)
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().populate('orderItems.product').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Buyurtmani ID orqali qidirish (Tracking uchun)
router.get('/track', async (req, res) => {
    try {
        const { orderId, phone } = req.query;

        let order;

        if (orderId) {
            order = await Order.findById(orderId).populate('orderItems.product');
        } else if (phone) {
            order = await Order.findOne({ 'customer.phone': phone })
                .populate('orderItems.product')
                .sort({ createdAt: -1 });
        }

        if (!order) {
            return res.status(404).json({ message: "Buyurtma topilmadi" });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;