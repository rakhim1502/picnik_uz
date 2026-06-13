const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protectAdmin } = require('../middleware/authMiddleware');
const { sendOrderStatusUpdate } = require('../utils/telegram');

// --- BUYURTMALARNI BOSHQARISH ---

// Barcha buyurtmalarni olish (Eng yangisi tepada)
router.get('/orders', protectAdmin, async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/dashboard', protectAdmin, async (req, res) => {
    try {
        // Jami buyurtmalar soni
        const totalOrders = await Order.countDocuments();

        // Bugungi buyurtmalar
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayOrders = await Order.countDocuments({
            createdAt: { $gte: today }
        });

        // Jami daromad - FAQAT YETKAZILGAN BUYURTMLAR
        const totalRevenue = await Order.aggregate([
            { $match: { status: 'Yetkazildi' } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);

        // Bugungi daromad - FAQAT BUGUN YETKAZILGAN
        const todayRevenue = await Order.aggregate([
            {
                $match: {
                    status: 'Yetkazildi',
                    createdAt: { $gte: today }
                }
            },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);

        // Buyurtmalar holati bo'yicha
        const ordersByStatus = await Order.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        // So'nggi buyurtmalar
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5);

        // Top mahsulotlar - FAQAT YETKAZILGAN BUYURTMLARDAN
        const topProducts = await Order.aggregate([
            { $match: { status: 'Yetkazildi' } },
            { $unwind: '$orderItems' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'orderItems.product',
                    foreignField: '_id',
                    as: 'productInfo'
                }
            },
            { $unwind: '$productInfo' },
            {
                $group: {
                    _id: '$productInfo._id',
                    name: { $first: '$productInfo.name_uz' },
                    image: { $first: '$productInfo.image' },
                    totalQty: { $sum: '$orderItems.qty' },
                    totalRevenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.qty'] } }
                }
            },
            { $sort: { totalQty: -1 } },
            { $limit: 5 }
        ]);

        res.json({
            totalOrders,
            todayOrders,
            totalRevenue: totalRevenue[0]?.total || 0,
            todayRevenue: todayRevenue[0]?.total || 0,
            ordersByStatus,
            recentOrders,
            topProducts
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ message: error.message });
    }
});


// --- GRAFIK MA'LUMOTLARI ---

// Oylik daromad grafigi (so'nggi 12 oy)
// Oylik daromad grafigi - FAQAT YETKAZILGAN
router.get('/charts/revenue', protectAdmin, async (req, res) => {
    try {
        const months = [];
        const revenueData = [];

        for (let i = 11; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);

            const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
            const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            const monthName = date.toLocaleDateString('uz-UZ', { month: 'short' });
            months.push(monthName);

            const result = await Order.aggregate([
                {
                    $match: {
                        status: 'Yetkazildi',
                        createdAt: { $gte: startDate, $lte: endDate }
                    }
                },
                { $group: { _id: null, total: { $sum: '$totalPrice' } } }
            ]);

            revenueData.push(result[0]?.total || 0);
        }

        res.json({ months, revenueData });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Kategoriyalar bo'yicha sotuv - FAQAT YETKAZILGAN
router.get('/charts/categories', protectAdmin, async (req, res) => {
    try {
        const result = await Order.aggregate([
            { $match: { status: 'Yetkazildi' } },
            { $unwind: '$orderItems' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'orderItems.product',
                    foreignField: '_id',
                    as: 'productInfo'
                }
            },
            { $unwind: '$productInfo' },
            {
                $group: {
                    _id: '$productInfo.category',
                    total: { $sum: { $multiply: ['$orderItems.price', '$orderItems.qty'] } },
                    count: { $sum: '$orderItems.qty' }
                }
            },
            { $sort: { total: -1 } }
        ]);

        const labels = result.map(r => r._id);
        const data = result.map(r => r.total);
        const counts = result.map(r => r.count);

        res.json({ labels, data, counts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Kategoriyalar bo'yicha sotuv
router.get('/charts/categories', protectAdmin, async (req, res) => {
    try {
        const result = await Order.aggregate([
            { $match: { status: { $ne: 'Bekor qilindi' } } },
            { $unwind: '$orderItems' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'orderItems.product',
                    foreignField: '_id',
                    as: 'productInfo'
                }
            },
            { $unwind: '$productInfo' },
            {
                $group: {
                    _id: '$productInfo.category',
                    total: { $sum: { $multiply: ['$orderItems.price', '$orderItems.qty'] } },
                    count: { $sum: '$orderItems.qty' }
                }
            },
            { $sort: { total: -1 } }
        ]);

        const labels = result.map(r => r._id);
        const data = result.map(r => r.total);
        const counts = result.map(r => r.count);

        res.json({ labels, data, counts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// --- EXCEL EXPORT ---

// Barcha buyurtmalarni eksport qilish
router.get('/export/orders', protectAdmin, async (req, res) => {
    try {
        const { startDate, endDate, status } = req.query;

        // Filter yaratish
        const filter = {};

        if (startDate && endDate) {
            filter.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        if (status && status !== 'all') {
            filter.status = status;
        }

        // Buyurtmalarni olish
        const orders = await Order.find(filter)
            .populate('orderItems.product')
            .sort({ createdAt: -1 });

        // Excel uchun ma'lumotlarni tayyorlash
        const exportData = orders.map(order => ({
            'Buyurtma ID': order._id.toString().slice(-8).toUpperCase(),
            'Sana': new Date(order.createdAt).toLocaleDateString('uz-UZ'),
            'Mijoz': order.customer.name,
            'Telefon': order.customer.phone,
            'Manzil': order.customer.address,
            'Mahsulotlar': order.orderItems.map(item =>
                `${item.name} (${item.qty} ta)`
            ).join(', '),
            'Jami summa': order.totalPrice,
            'To\'lov usuli': order.paymentMethod,
            'Holati': order.status,
            'Yaratilgan': new Date(order.createdAt).toLocaleString('uz-UZ')
        }));

        res.json({
            success: true,
            data: exportData,
            count: exportData.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Mahsulotlarni eksport qilish
router.get('/export/products', protectAdmin, async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });

        const exportData = products.map(product => ({
            'Mahsulot ID': product._id.toString().slice(-8).toUpperCase(),
            'Nomi (UZ)': product.name_uz,
            'Nomi (RU)': product.name_ru,
            'Kategoriya': product.category,
            'Joriy narx': product.price,
            'Eski narx': product.oldPrice || '',
            'Ombordagi qoldiq': product.stock,
            'Reyting': product.rating,
            'Sharhlar soni': product.reviews,
            'Rasm URL': product.image,
            'Yaratilgan': new Date(product.createdAt).toLocaleString('uz-UZ')
        }));

        res.json({
            success: true,
            data: exportData,
            count: exportData.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Haftalik buyurtmalar (so'nggi 7 kun)
router.get('/charts/weekly-orders', protectAdmin, async (req, res) => {
    try {
        const days = [];
        const ordersData = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);

            const dayName = date.toLocaleDateString('uz-UZ', { weekday: 'short' });
            days.push(dayName);

            const count = await Order.countDocuments({
                createdAt: { $gte: date, $lt: nextDate }
            });

            ordersData.push(count);
        }

        res.json({ days, ordersData });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Buyurtma holatini o'zgartirish
router.put('/orders/:id', protectAdmin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Buyurtma topilmadi" });
        }

        const oldStatus = order.status;
        order.status = req.body.status || order.status;

        const updatedOrder = await order.save();

        // ⭐ Agar holat o'zgargan bo'lsa, admin ga xabar yuborish
        if (oldStatus !== updatedOrder.status) {
            sendOrderStatusUpdate(updatedOrder);
        }

        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/products/:id', protectAdmin, async (req, res) => {
    try {
        const { name_uz, name_ru, category, price, oldPrice, stock, image, description } = req.body;

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Mahsulot topilmadi" });
        }

        // Yangilanadigan maydonlar
        product.name_uz = name_uz || product.name_uz;
        product.name_ru = name_ru || product.name_ru;
        product.category = category || product.category;
        product.price = price !== undefined ? price : product.price;
        product.oldPrice = oldPrice !== undefined ? oldPrice : product.oldPrice;
        product.stock = stock !== undefined ? stock : product.stock;
        product.image = image || product.image;
        product.description = description !== undefined ? description : product.description;

        // Slug ni yangilash agar name_uz o'zgargan bo'lsa
        if (name_uz && name_uz !== product.name_uz) {
            product.slug = name_uz.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        }

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- MAHSULOTLARNI BOSHQARISH ---

// Barcha mahsulotlarni olish
router.get('/products', protectAdmin, async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Bitta mahsulotni olish
router.get('/products/:id', protectAdmin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Mahsulot topilmadi" });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Yangi mahsulot qo'shish
router.post('/products', protectAdmin, async (req, res) => {
    try {
        const { name_uz, name_ru, category, price, oldPrice, stock, image, description } = req.body;

        // Validatsiya
        if (!name_uz || !name_ru || !category || !price || !image) {
            return res.status(400).json({ message: "Barcha majburiy maydonlarni to'ldiring" });
        }

        // Slug yaratish
        const slug = name_uz.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

        const product = new Product({
            name_uz,
            name_ru,
            category,
            price: Number(price),
            oldPrice: oldPrice ? Number(oldPrice) : null,
            stock: Number(stock) || 0,
            image,
            description: description || '',
            slug
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error('Mahsulot qo\'shishda xatolik:', error);
        res.status(500).json({ message: "Mahsulot qo'shishda xatolik", error: error.message });
    }
});

// Mahsulotni tahrirlash
router.put('/products/:id', protectAdmin, async (req, res) => {
    try {
        const { name_uz, name_ru, category, price, oldPrice, stock, image, description } = req.body;

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Mahsulot topilmadi" });
        }

        // Yangilanadigan maydonlar
        if (name_uz) product.name_uz = name_uz;
        if (name_ru) product.name_ru = name_ru;
        if (category) product.category = category;
        if (price) product.price = Number(price);
        if (oldPrice !== undefined) product.oldPrice = oldPrice ? Number(oldPrice) : null;
        if (stock !== undefined) product.stock = Number(stock);
        if (image) product.image = image;
        if (description !== undefined) product.description = description;

        // Slug ni yangilash agar name_uz o'zgargan bo'lsa
        if (name_uz && name_uz !== product.name_uz) {
            product.slug = name_uz.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
        }

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        console.error('Mahsulotni yangilashda xatolik:', error);
        res.status(500).json({ message: "Mahsulotni yangilashda xatolik", error: error.message });
    }
});

// Mahsulotni o'chirish
router.delete('/products/:id', protectAdmin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Mahsulot topilmadi" });
        }

        await Product.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Mahsulot muvaffaqiyatli o'chirildi"
        });
    } catch (error) {
        console.error('Mahsulotni o\'chirishda xatolik:', error);
        res.status(500).json({ message: "Mahsulotni o'chirishda xatolik", error: error.message });
    }
});

module.exports = router;