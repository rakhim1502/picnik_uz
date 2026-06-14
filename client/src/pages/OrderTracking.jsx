import { useState } from 'react';
import api from '../utils/api';
import { Search, Package, Truck, CheckCircle, Clock, XCircle, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function OrderTracking() {
    const [searchType, setSearchType] = useState('orderId');
    const [searchValue, setSearchValue] = useState('');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchValue.trim()) return;

        setLoading(true);
        setError('');
        setOrder(null);

        try {
            const params = searchType === 'orderId'
                ? { orderId: searchValue }
                : { phone: searchValue };

            const { data } = await api.get('/api/orders/track', { params });
            setOrder(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Buyurtma topilmadi');
        } finally {
            setLoading(false);
        }
    };

    const getStatusInfo = (status) => {
        const statuses = {
            'Jarayonda': { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100', step: 1 },
            'Tayyorlanmoqda': { icon: Package, color: 'text-blue-600', bg: 'bg-blue-100', step: 2 },
            'Yo\'lda': { icon: Truck, color: 'text-purple-600', bg: 'bg-purple-100', step: 3 },
            'Yetkazildi': { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', step: 4 },
            'Bekor qilindi': { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', step: 0 }
        };
        return statuses[status] || statuses['Jarayonda'];
    };

    const formatPrice = (price) => new Intl.NumberFormat('uz-UZ').format(price);
    const formatDate = (date) => new Date(date).toLocaleDateString('uz-UZ', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div className="min-h-screen bg-brand-sand">
            <Navbar />

            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-4xl mx-auto px-4 py-12">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Truck className="w-8 h-8 text-brand-green" />
                        </div>
                        <h1 className="text-3xl font-bold text-brand-dark mb-2">
                            Buyurtma holatini kuzatish
                        </h1>
                        <p className="text-gray-600">
                            Buyurtma raqami yoki telefon raqamingizni kiriting
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Qidiruv Formasi */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
                    <form onSubmit={handleSearch} className="space-y-4">
                        {/* Qidiruv turi */}
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="orderId"
                                    checked={searchType === 'orderId'}
                                    onChange={(e) => setSearchType(e.target.value)}
                                    className="w-4 h-4 text-brand-green"
                                />
                                <span className="text-sm font-medium">Buyurtma raqami</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    value="phone"
                                    checked={searchType === 'phone'}
                                    onChange={(e) => setSearchType(e.target.value)}
                                    className="w-4 h-4 text-brand-green"
                                />
                                <span className="text-sm font-medium">Telefon raqam</span>
                            </label>
                        </div>

                        {/* Input */}
                        <div className="flex gap-3">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={searchType === 'phone' ? 'tel' : 'text'}
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    placeholder={searchType === 'orderId' ? 'Masalan: 65a3f2b8c9d1e2f3' : '+998 90 123 45 67'}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 bg-brand-green text-white font-semibold rounded-lg hover:bg-brand-green/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Qidirilmoqda...' : 'Qidirish'}
                            </button>
                        </div>
                    </form>

                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}
                </div>

                {/* Buyurtma Ma'lumotlari */}
                {order && (
                    <div className="space-y-6">
                        {/* Progress Bar */}
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h3 className="text-lg font-bold text-brand-dark mb-6">Buyurtma holati</h3>

                            <div className="relative">
                                {/* Progress chizig'i */}
                                <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded-full">
                                    <div
                                        className="h-full bg-brand-green rounded-full transition-all duration-500"
                                        style={{
                                            width: order.status === 'Bekor qilindi'
                                                ? '0%'
                                                : `${(getStatusInfo(order.status).step / 4) * 100}%`
                                        }}
                                    ></div>
                                </div>

                                {/* Qadamlar */}
                                <div className="relative flex justify-between">
                                    {['Jarayonda', 'Tayyorlanmoqda', 'Yo\'lda', 'Yetkazildi'].map((status, idx) => {
                                        const statusInfo = getStatusInfo(status);
                                        const StatusIcon = statusInfo.icon;
                                        const isActive = getStatusInfo(order.status).step >= idx + 1;
                                        const isCurrent = order.status === status;

                                        return (
                                            <div key={status} className="flex flex-col items-center">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${isActive
                                                        ? `${statusInfo.bg} ${statusInfo.color} border-current`
                                                        : 'bg-white border-gray-300 text-gray-400'
                                                    } ${isCurrent ? 'ring-4 ring-opacity-20 ring-current' : ''}`}>
                                                    <StatusIcon className="w-6 h-6" />
                                                </div>
                                                <span className={`mt-2 text-xs font-medium text-center ${isActive ? 'text-brand-dark' : 'text-gray-400'
                                                    }`}>
                                                    {status}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Buyurtma Tafsilotlari */}
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h3 className="text-lg font-bold text-brand-dark mb-4">Buyurtma tafsilotlari</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Buyurtma raqami</p>
                                    <p className="font-semibold text-brand-dark">#{order._id.slice(-8).toUpperCase()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Sana</p>
                                    <p className="font-semibold text-brand-dark">{formatDate(order.createdAt)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Mijoz</p>
                                    <p className="font-semibold text-brand-dark">{order.customer.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Telefon</p>
                                    <p className="font-semibold text-brand-dark">{order.customer.phone}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <p className="text-sm text-gray-500 mb-1">Manzil</p>
                                    <p className="font-semibold text-brand-dark flex items-start gap-2">
                                        <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                                        {order.customer.address}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Mahsulotlar */}
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h3 className="text-lg font-bold text-brand-dark mb-4">Mahsulotlar</h3>

                            <div className="space-y-4">
                                {order.orderItems.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-20 h-20 rounded-lg object-cover"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-brand-dark">{item.name}</h4>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {item.qty} ta × {formatPrice(item.price)} so'm
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-brand-green">
                                                {formatPrice(item.qty * item.price)} so'm
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Jami */}
                            <div className="mt-6 pt-6 border-t">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-brand-dark">Jami summa:</span>
                                    <span className="text-2xl font-bold text-brand-green">
                                        {formatPrice(order.totalPrice)} so'm
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">
                                    To'lov usuli: {order.paymentMethod}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}