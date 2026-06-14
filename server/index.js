const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();
const app = express();

// Middleware - LIMIT QO'SHILDI!
app.use(cors({
    origin: [
        'http://localhost:5173', // Local development
        'https://picnik-uz.vercel.app'
    ],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));  // ← 10MB gacha
app.use(express.urlencoded({ limit: '10mb', extended: true }));  // ← 10MB gacha

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Database connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB ga muvaffaqiyatli ulandi');
        seedDatabase();
    })
    .catch((err) => console.error('❌ MongoDB ulanish xatosi:', err));

async function seedDatabase() {
    const Product = mongoose.model('Product');
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
        await Product.create({
            name_uz: "Naturehike Cloud Up 2 Palatkasi",
            name_ru: "Палатка Naturehike Cloud Up 2",
            slug: "naturehike-cloud-up-2",
            price: 1250000,
            oldPrice: 1450000,
            category: "Palatkalar",
            image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=800",
            description: "Yengil, suv o'tkazmaydigan, 2 kishilik premium palatka.",
            stock: 15,
            rating: 4.8,
            reviews: 24
        });
        console.log('🌱 Test mahsulot bazaga qo\'shildi');
    }

}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server ${PORT} portda ishlayapti`));