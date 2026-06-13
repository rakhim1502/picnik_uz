import { useState, useEffect } from 'react';
import axios from 'axios';
import ExportButton from '../../components/admin/ExportButton';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('piknic_admin_token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/admin/orders', config);
                setOrders(data);
            } catch (error) {
                console.error("Buyurtmalarni yuklashda xatolik", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const updateStatus = async (orderId, newStatus) => {
        try {
            await axios.put(`http://localhost:5000/api/admin/orders/${orderId}`, { status: newStatus }, config);

            const { data } = await axios.get('http://localhost:5000/api/admin/orders', config);
            setOrders(data);
        } catch (error) {
            console.error("Holatni o'zgartirishda xatolik", error);
            alert("Holatni o'zgartirishda xatolik");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Jarayonda': return 'bg-yellow-100 text-yellow-800';
            case 'Tayyorlanmoqda': return 'bg-blue-100 text-blue-800';
            case 'Yo\'lga chiqdi': return 'bg-purple-100 text-purple-800';
            case 'Yetkazildi': return 'bg-green-100 text-green-800';
            case 'Bekor qilindi': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return <div className="text-center py-10">Yuklanmoqda...</div>;

    return (
        <div>
            {/* Header - RESPONSIVE */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-brand-dark">Barcha Buyurtmalar</h2>
                    <p className="text-xs md:text-sm text-gray-500 mt-1">Jami: {orders.length} ta buyurtma</p>
                </div>

                <ExportButton type="orders" />
            </div>

            {/* Desktop Jadval - faqat md va undan katta ekranlarda */}
            <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Buyurtma ID</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Mijoz</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Sana</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Summa</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">To'lov</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Holati</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Amallar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        #{order._id.slice(-8).toUpperCase()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-brand-dark">{order.customer.name}</div>
                                        <div className="text-sm text-gray-500">{order.customer.phone}</div>
                                        <div className="text-xs text-gray-400 truncate max-w-xs">{order.customer.address}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {new Date(order.createdAt).toLocaleDateString('uz-UZ')}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-brand-green whitespace-nowrap">
                                        {order.totalPrice.toLocaleString('uz-UZ')} so'm
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{order.paymentMethod}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateStatus(order._id, e.target.value)}
                                            className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-brand-green outline-none"
                                        >
                                            <option value="Jarayonda">Jarayonda</option>
                                            <option value="Tayyorlanmoqda">Tayyorlanmoqda</option>
                                            <option value="Yo'lga chiqdi">Yo'lga chiqdi</option>
                                            <option value="Yetkazildi">Yetkazildi</option>
                                            <option value="Bekor qilindi">Bekor qilindi</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {orders.length === 0 && (
                    <div className="text-center py-10 text-gray-500">Hozircha buyurtmalar yo'q</div>
                )}
            </div>

            {/* Mobile Kartalar - faqat mobil ekranlarda */}
            <div className="md:hidden space-y-3">
                {orders.length === 0 ? (
                    <div className="bg-white rounded-xl p-8 text-center text-gray-500">
                        Hozircha buyurtmalar yo'q
                    </div>
                ) : (
                    orders.map((order) => (
                        <div key={order._id} className="bg-white rounded-xl shadow-sm p-4">
                            {/* Yuqori qism: ID va Status */}
                            <div className="flex justify-between items-start mb-3 pb-3 border-b border-gray-100">
                                <div>
                                    <div className="text-xs text-gray-500 font-mono">
                                        #{order._id.slice(-8).toUpperCase()}
                                    </div>
                                    <div className="font-semibold text-brand-dark mt-1">
                                        {order.customer.name}
                                    </div>
                                    <div className="text-sm text-gray-500 mt-0.5">
                                        {order.customer.phone}
                                    </div>
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>

                            {/* Manzil */}
                            <div className="mb-3">
                                <div className="text-xs text-gray-500 mb-0.5">Manzil</div>
                                <div className="text-sm text-brand-dark">{order.customer.address}</div>
                            </div>

                            {/* Ma'lumotlar grid */}
                            <div className="grid grid-cols-2 gap-3 mb-3 pb-3 border-b border-gray-100">
                                <div>
                                    <div className="text-xs text-gray-500 mb-0.5">Sana</div>
                                    <div className="text-sm font-medium text-brand-dark">
                                        {new Date(order.createdAt).toLocaleDateString('uz-UZ')}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 mb-0.5">To'lov</div>
                                    <div className="text-sm font-medium text-brand-dark">
                                        {order.paymentMethod}
                                    </div>
                                </div>
                            </div>

                            {/* Summa */}
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-sm text-gray-600">Jami summa:</span>
                                <span className="text-lg font-bold text-brand-green">
                                    {order.totalPrice.toLocaleString('uz-UZ')} so'm
                                </span>
                            </div>

                            {/* Status o'zgartirish */}
                            <select
                                value={order.status}
                                onChange={(e) => updateStatus(order._id, e.target.value)}
                                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-brand-green outline-none bg-white"
                            >
                                <option value="Jarayonda">Jarayonda</option>
                                <option value="Tayyorlanmoqda">Tayyorlanmoqda</option>
                                <option value="Yo'lga chiqdi">Yo'lga chiqdi</option>
                                <option value="Yetkazildi">Yetkazildi</option>
                                <option value="Bekor qilindi">Bekor qilindi</option>
                            </select>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}