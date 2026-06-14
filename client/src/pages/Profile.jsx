import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { User, Package, Mail, LogOut, Clock, CheckCircle, XCircle } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Profile() {
    const navigate = useNavigate();

    // User ni to'g'ridan-to'g'ri localStorage dan o'qish (useEffect o'rniga)
    const userData = JSON.parse(localStorage.getItem('piknic_user') || 'null');
    const [user] = useState(userData);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Agar user yo'q bo'lsa, login sahifasiga yo'naltirish
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    // Buyurtmalarni yuklash
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('piknic_token');
                const { data } = await api.get('/api/orders/my-orders', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(data);
            } catch (error) {
                console.error("Buyurtmalarni yuklashda xatolik", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchOrders();
        }
    }, [user]);

    const handleLogout = () => {
        localStorage.removeItem('piknic_user');
        localStorage.removeItem('piknic_token');
        navigate('/');
        window.location.reload();
    };

    const formatPrice = (price) => new Intl.NumberFormat('uz-UZ').format(price);
    const formatDate = (date) => new Date(date).toLocaleDateString('uz-UZ', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const getStatusInfo = (status) => {
        switch (status) {
            case 'Jarayonda':
                return { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' };
            case 'Yetkazildi':
                return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' };
            case 'Bekor qilindi':
                return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' };
            default:
                return { icon: Clock, color: 'text-gray-600', bg: 'bg-gray-100' };
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-brand-sand">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-brand-dark mb-8">Mening hisobim</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* User Info Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                            <div className="text-center mb-6">
                                <div className="w-20 h-20 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <User className="w-10 h-10 text-brand-green" />
                                </div>
                                <h2 className="text-xl font-bold text-brand-dark">{user.name}</h2>
                                <p className="text-sm text-gray-500 mt-1">{user.email}</p>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Mail className="w-4 h-4" />
                                    <span>{user.email}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition font-medium"
                            >
                                <LogOut className="w-4 h-4" />
                                Chiqish
                            </button>
                        </div>
                    </div>

                    {/* Orders History */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-xl font-bold text-brand-dark mb-6 flex items-center gap-2">
                                <Package className="w-5 h-5" />
                                Buyurtmalar tarixi
                            </h3>

                            {loading ? (
                                <div className="space-y-4">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse"></div>
                                    ))}
                                </div>
                            ) : orders.length === 0 ? (
                                <div className="text-center py-16">
                                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 mb-4">Sizda hali buyurtmalar yo'q</p>
                                    <button
                                        onClick={() => navigate('/shop')}
                                        className="px-6 py-2.5 bg-brand-green text-white rounded-lg font-medium hover:bg-brand-green/90 transition"
                                    >
                                        Katalogga o'tish
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {orders.map(order => {
                                        const statusInfo = getStatusInfo(order.status);
                                        const StatusIcon = statusInfo.icon;

                                        return (
                                            <div key={order._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <p className="text-xs text-gray-500">Buyurtma #{order._id.slice(-6)}</p>
                                                        <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                                                    </div>
                                                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${statusInfo.bg}`}>
                                                        <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
                                                        <span className={`text-sm font-medium ${statusInfo.color}`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="space-y-2 mb-3">
                                                    {order.orderItems.slice(0, 2).map((item, idx) => (
                                                        <div key={idx} className="flex items-center gap-3">
                                                            <img
                                                                src={item.image}
                                                                alt={item.name}
                                                                className="w-12 h-12 rounded-lg object-cover"
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium text-brand-dark truncate">{item.name}</p>
                                                                <p className="text-xs text-gray-500">{item.qty} ta × {formatPrice(item.price)} so'm</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {order.orderItems.length > 2 && (
                                                        <p className="text-xs text-gray-500 pl-15">
                                                            +{order.orderItems.length - 2} ta mahsulot
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between pt-3 border-t">
                                                    <span className="text-sm text-gray-600">
                                                        To'lov: {order.paymentMethod}
                                                    </span>
                                                    <span className="font-bold text-brand-green">
                                                        {formatPrice(order.totalPrice)} so'm
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}