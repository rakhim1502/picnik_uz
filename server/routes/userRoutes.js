const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Tokenni tekshirish (oddiy foydalanuvchi uchun)
const protectUser = (req, res, next) => {
    let token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Autentifikatsiya talab qilinadi" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token noto'g'ri" });
    }
};

// Sevimlilarni olish
router.get('/wishlist', protectUser, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).populate('wishlist');
        res.json(user.wishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Sevimlilarga qo'shish / o'chirish (Toggle)
router.post('/wishlist/:productId', protectUser, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        const productIndex = user.wishlist.indexOf(req.params.productId);

        if (productIndex > -1) {
            user.wishlist.splice(productIndex, 1); // O'chirish
        } else {
            user.wishlist.push(req.params.productId); // Qo'shish
        }

        await user.save();
        const updatedUser = await User.findById(user._id).populate('wishlist');
        res.json(updatedUser.wishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Profilni yangilash
router.put('/profile', protectUser, async (req, res) => {
    try {
        const { name, email, phone, currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.userId);

        if (name) user.name = name;
        if (email) user.email = email;
        if (phone) user.phone = phone;

        // Parolni yangilash
        if (newPassword) {
            const isMatch = await user.comparePassword(currentPassword);
            if (!isMatch) {
                return res.status(400).json({ message: "Joriy parol noto'g'ri" });
            }
            user.password = newPassword; // Model'da avtomatik hash qilinadi
        }

        await user.save();

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



module.exports = router;