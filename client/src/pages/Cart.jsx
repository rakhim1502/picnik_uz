import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Trash2, Minus, Plus } from 'lucide-react';

export default function Cart() {
    const { cartItems, addToCart, removeFromCart, clearCart, totalPrice } = useCart();
    const navigate = useNavigate();

    const [customer, setCustomer] = useState({ name: '', phone: '+998', address: '' });
    const [paymentMethod, setPaymentMethod] = useState('Naqd (Yetkazib berganda)');
    const [loading, setLoading] = useState(false);

    const formatPrice = (price) => new Intl.NumberFormat('uz-UZ').format(price);

    const handleCheckout = async (e) => {
        e.preventDefault();
        if (cartItems.length === 0) return alert("Savatingiz bo'sh!");

        setLoading(true);
        try {
            const userData = JSON.parse(localStorage.getItem('piknic_user') || '{}');
            const userId = userData?.id || null;
            const orderData = {
                userId,
                customer,
                orderItems: cartItems.map(item => ({
                    product: item._id,
                    name: item.name_uz,
                    qty: item.qty,
                    price: item.price,
                    image: item.image
                })),
                totalPrice,
                paymentMethod
            };

            const { data } = await axios.post('http://localhost:5000/api/orders', orderData);

            if (data) {
                clearCart();
                alert("✅ Buyurtmangiz muvaffaqiyatli qabul qilindi! Operatorimiz tez orada siz bilan bog'lanadi.");
                navigate('/');
            }
        } catch (err) {
            console.error(err);
            alert("Buyurtma berishda xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring yoki Telegram orqali yozing.");
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                    <h2 className="text-2xl font-bold text-brand-dark mb-4">Savatingiz bo'sh</h2>
                    <p className="text-gray-600 mb-6">Tabiat quchog'iga chiqish uchun ajoyib anjomlarni tanlang!</p>
                    <button onClick={() => navigate('/')} className="bg-brand-green text-white px-6 py-3 rounded-full font-bold hover:bg-brand-green/90 transition">
                        Katalogga o'tish
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-12">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-brand-dark mb-8">Savat</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Savatdagi mahsulotlar */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map(item => (
                            <div key={item._id} className="flex gap-4 bg-white p-4 rounded-xl shadow-sm">
                                <img src={item.image} alt={item.name_uz} className="w-24 h-24 object-cover rounded-lg" />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-brand-dark">{item.name_uz}</h3>
                                    <p className="text-brand-green font-bold mt-1">{formatPrice(item.price)} so'm</p>

                                    <div className="flex items-center justify-between mt-3">
                                        <div className="flex items-center border rounded-lg">
                                            <button onClick={() => {
                                                if (item.qty > 1) addToCart({ ...item, qty: item.qty - 1 });
                                            }} className="px-3 py-1 hover:bg-gray-100"><Minus className="w-4 h-4" /></button>
                                            <span className="px-3 font-medium">{item.qty}</span>
                                            <button onClick={() => addToCart(item)} className="px-3 py-1 hover:bg-gray-100"><Plus className="w-4 h-4" /></button>
                                        </div>
                                        <button onClick={() => removeFromCart(item._id)} className="text-red-500 hover:text-red-700 p-2">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Checkout Formasi */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm h-fit sticky top-24">
                        <h2 className="text-xl font-bold text-brand-dark mb-4">Buyurtma ma'lumotlari</h2>
                        <form onSubmit={handleCheckout} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ismingiz</label>
                                <input required type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-green focus:outline-none"
                                    value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon raqam</label>
                                <input required type="tel" placeholder="+998 90 123 45 67" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-green focus:outline-none"
                                    value={customer.phone} onChange={e => setCustomer({ ...customer, phone: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Yetkazib berish manzili</label>
                                <textarea required rows="2" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-green focus:outline-none"
                                    value={customer.address} onChange={e => setCustomer({ ...customer, address: e.target.value })}></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">To'lov turi</label>
                                <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-green focus:outline-none"
                                    value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                                    <option value="Naqd (Yetkazib berganda)">Naqd pul (Yetkazib berganda)</option>
                                    <option value="Click / Payme">Click / Payme (Operator qo'ng'irog'idan so'ng)</option>
                                    <option value="Uzum Nasiya">Uzum Nasiya</option>
                                </select>
                            </div>

                            <div className="border-t pt-4 mt-4">
                                <div className="flex justify-between text-lg font-bold text-brand-dark mb-4">
                                    <span>Jami summa:</span>
                                    <span className="text-brand-green">{formatPrice(totalPrice)} so'm</span>
                                </div>
                                <button type="submit" disabled={loading}
                                    className="w-full bg-brand-green text-white font-bold py-3.5 rounded-xl hover:bg-brand-green/90 transition disabled:opacity-50 flex justify-center items-center gap-2">
                                    {loading ? 'Yuborilmoqda...' : 'Buyurtma berish'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}