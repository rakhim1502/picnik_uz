const axios = require('axios');

const BOT_TOKEN = '8838777387:AAFe87Y7209-ugkZPD4DQ4cgx64g4wr3JX0';
const ADMIN_CHAT_ID = 2067393923;

// Admin ga xabar yuborish
const sendAdminNotification = async (message) => {
    // Agar token yoki chat ID bo'lmasa, xato bermay chiqib ket
    if (!BOT_TOKEN || !ADMIN_CHAT_ID) {
        console.log('⚠️  Telegram sozlamalari .env da to\'liq emas - xabar yuborilmaydi');
        return Promise.resolve(); // Xato bermaslik uchun
    }

    try {
        await axios.post(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
            {
                chat_id: ADMIN_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            },
            { timeout: 3000 } // 3 soniya timeout
        );
        console.log('✅ Telegram xabari yuborildi');
    } catch (error) {
        console.error('❌ Telegram xatosi:', error.message);
        // Xato bo'lsa ham davom et
    }
};

// Yangi buyurtma kelganda
const sendNewOrderNotification = async (order) => {
    const itemsList = order.orderItems
        .map((item) => `• ${item.name} — ${item.qty} ta × ${item.price.toLocaleString('uz-UZ')} so'm`)
        .join('\n');

    const message = `
<b>🔔 YANGI BUYURTMA!</b>

📦 <b>Buyurtma raqami:</b> #${order._id.toString().slice(-8).toUpperCase()}
👤 <b>Mijoz:</b> ${order.customer.name}
📞 <b>Telefon:</b> ${order.customer.phone}
📍 <b>Manzil:</b> ${order.customer.address}
💳 <b>To'lov:</b> ${order.paymentMethod}

<b>📦 Mahsulotlar:</b>
${itemsList}

💰 <b>JAMI: ${order.totalPrice.toLocaleString('uz-UZ')} so'm</b>

🕐 ${new Date().toLocaleString('uz-UZ')}
  `.trim();

    return sendAdminNotification(message);
};

// Buyurtma holati o'zgarganda
const sendOrderStatusUpdate = async (order) => {
    const statusEmojis = {
        'Jarayonda': '⏳',
        'Tayyorlanmoqda': '📦',
        'Yo\'lga chiqdi': '🚚',
        'Yetkazildi': '✅',
        'Bekor qilindi': '❌'
    };

    const emoji = statusEmojis[order.status] || '📋';

    const message = `
${emoji} <b>BUYURTMA HOLATI O'ZGARDI</b>

 <b>Raqam:</b> #${order._id.toString().slice(-8).toUpperCase()}
👤 <b>Mijoz:</b> ${order.customer.name}
📞 <b>Telefon:</b> ${order.customer.phone}
📊 <b>Yangi holat:</b> ${order.status}
💰 <b>Summa:</b> ${order.totalPrice.toLocaleString('uz-UZ')} so'm

🕐 ${new Date().toLocaleString('uz-UZ')}
  `.trim();

    return sendAdminNotification(message);
};

module.exports = {
    sendNewOrderNotification,
    sendOrderStatusUpdate
};