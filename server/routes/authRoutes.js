const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Foydalanuvchini topish
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Email yoki parol noto'g'ri", success: false });
        }

        // Faol emasligini tekshirish
        if (!user.isActive) {
            return res.status(403).json({ message: "Akkaunt bloklangan", success: false });
        }

        // Parolni tekshirish
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Email yoki parol noto'g'ri", success: false });
        }

        // JWT token yaratish
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                isAdmin: user.isAdmin
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Server xatosi", success: false, error: error.message });
    }
});

// Register endpoint
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Email allaqachon mavjudligini tekshirish
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Bu email allaqachon ro'yxatdan o'tgan",
                success: false
            });
        }

        // ⚠️ MUHIM: Yangi foydalanuvchi ODDIY FOYDALANUVCHI bo'lib yaratiladi (isAdmin: false)
        const user = new User({
            name,
            email,
            password, // Model'da avtomatik hash qilinadi
            isAdmin: false, // ← BU JUDA MUHIM! Yangi user admin bo'lmaydi!
            isActive: true
        });

        await user.save();

        // Token yaratish
        const token = jwt.sign(
            { userId: user._id, email: user.email, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin // false bo'ladi
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            message: "Server xatosi",
            success: false,
            error: error.message
        });
    }
});

module.exports = router;