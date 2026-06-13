const jwt = require('jsonwebtoken');

// Tokenni tekshirish va Admin ekanligini aniqlash
const protectAdmin = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Hozircha oddiy tekshiruv (keyinchalik User modeliga isAdmin qo'shish mumkin)
            if (decoded.isAdmin) {
                req.user = decoded;
                next();
            } else {
                res.status(403).json({ message: "Admin huquqi yo'q" });
            }
        } catch (error) {
            res.status(401).json({ message: "Token noto'g'ri yoki muddati tugagan" });
        }
    }
    if (!token) {
        res.status(401).json({ message: "Autentifikatsiya talab qilinadi" });
    }
};



module.exports = { protectAdmin };