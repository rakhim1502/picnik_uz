const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Barcha mahsulotlarni olish (filtrlar, qidiruv, pagination bilan)
router.get('/', async (req, res) => {
    try {
        const {
            category,
            search,
            minPrice,
            maxPrice,
            sort,
            page = 1,
            limit = 12
        } = req.query;

        // Filter obyekti yaratish
        const filter = {};

        // Kategoriya bo'yicha filtrlash
        if (category && category !== 'all') {
            filter.category = category;
        }

        // Qidiruv (nom bo'yicha)
        if (search) {
            filter.$or = [
                { name_uz: { $regex: search, $options: 'i' } },
                { name_ru: { $regex: search, $options: 'i' } }
            ];
        }

        // Narx diapazoni
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        // Sortlash
        let sortOption = { createdAt: -1 }; // Default: eng yangisi
        if (sort === 'price-asc') sortOption = { price: 1 };
        if (sort === 'price-desc') sortOption = { price: -1 };
        if (sort === 'rating') sortOption = { rating: -1 };

        // Pagination
        const skip = (Number(page) - 1) * Number(limit);
        const total = await Product.countDocuments(filter);

        const products = await Product.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(Number(limit));

        res.json({
            products,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
                limit: Number(limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Bitta mahsulotni slug orqali olish
router.get('/:slug', async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug });
        if (!product) return res.status(404).json({ message: "Mahsulot topilmadi" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Eng ko'p sotilgan mahsulotlar (popular)
router.get('/popular', async (req, res) => {
    try {
        const { limit = 8 } = req.query;

        // Buyurtmalardan eng ko'p sotilgan mahsulotlarni topish
        const popularProducts = await Order.aggregate([
            { $match: { status: { $ne: 'Bekor qilindi' } } }, // Bekor qilinganlarni hisoblamaslik
            { $unwind: '$orderItems' },
            {
                $group: {
                    _id: '$orderItems.product',
                    totalQty: { $sum: '$orderItems.qty' },
                    totalRevenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.qty'] } }
                }
            },
            { $sort: { totalQty: -1 } }, // Eng ko'p sotilgan birinchi
            { $limit: parseInt(limit) }
        ]);

        // Mahsulot ID larini olish
        const productIds = popularProducts.map(p => p._id);

        // Mahsulotlarni to'liq ma'lumotlari bilan olish
        const products = await Product.find({ _id: { $in: productIds } })
            .sort({
                createdAt: -1
            });

        // Popularlik ma'lumotlarini qo'shish
        const productsWithPopularity = products.map(product => {
            const popularData = popularProducts.find(p => p._id.toString() === product._id.toString());
            return {
                ...product.toObject(),
                totalSold: popularData?.totalQty || 0,
                totalRevenue: popularData?.totalRevenue || 0
            };
        });

        res.json({
            success: true,
            products: productsWithPopularity,
            count: productsWithPopularity.length
        });
    } catch (error) {
        console.error('Popular mahsulotlarni olishda xatolik:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;