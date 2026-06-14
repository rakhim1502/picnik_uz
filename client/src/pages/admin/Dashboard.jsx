import { useState, useEffect } from 'react';
import api from '../../utils/api';
import {
    ShoppingCart, DollarSign, Package, TrendingUp,
    Clock, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RevenueChart from '../../components/admin/RevenueChart';
import CategoryChart from '../../components/admin/CategoryChart';
import WeeklyOrdersChart from '../../components/admin/WeeklyOrdersChart';


export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const token = localStorage.getItem('piknic_admin_token');

                if (!token) {
                    navigate('/admin/login');
                    return;
                }

                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };

                const { data } = await api.get('/api/admin/dashboard', config);
                setStats(data);
            } catch (error) {
                if (error.response?.status === 401) {
                    localStorage.removeItem('piknic_admin_token');
                    navigate('/admin/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, [navigate]);

    const formatPrice = (price) => {
        if (!price && price !== 0) return '0';
        return new Intl.NumberFormat('uz-UZ').format(price);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green"></div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Ma'lumotlar yuklanmadi</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 md:space-y-6">
            {/* Sarlavha - RESPONSIVE */}
            <div>
                <h2 className="text-xl md:text-2xl font-bold text-brand-dark">Boshqaruv paneli</h2>
                <p className="text-xs md:text-sm text-gray-500 mt-1">PIKNIC_UZ do'koni statistikasi</p>
            </div>

            {/* Statistika Kartalari */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                <StatCard
                    title="Jami buyurtmalar"
                    value={stats.totalOrders || 0}
                    icon={<ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Bugungi buyurtmalar"
                    value={stats.todayOrders || 0}
                    icon={<TrendingUp className="w-5 h-5 md:w-6 md:h-6" />}
                    color="bg-brand-green"
                    highlight
                />
                <StatCard
                    title="Jami daromad"
                    value={`${formatPrice(stats.totalRevenue || 0)} so'm`}
                    icon={<DollarSign className="w-5 h-5 md:w-6 md:h-6" />}
                    color="bg-brand-accent"
                />
                <StatCard
                    title="Bugungi daromad"
                    value={`${formatPrice(stats.todayRevenue || 0)} so'm`}
                    icon={<DollarSign className="w-5 h-5 md:w-6 md:h-6" />}
                    color="bg-purple-500"
                    highlight
                />
            </div>

            {/* GRAFIKLAR - RESPONSIVE */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {/* Oylik daromad grafigi */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 lg:col-span-2">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-2">
                        <div>
                            <h3 className="text-base md:text-lg font-bold text-brand-dark">Oylik daromad</h3>
                            <p className="text-xs md:text-sm text-gray-500">So'nggi 12 oy</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs md:text-sm text-brand-green bg-brand-green/10 px-2 md:px-3 py-1 md:py-1.5 rounded-lg">
                            <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
                            <span>+12.5%</span>
                        </div>
                    </div>
                    <div className="h-64 md:h-80">
                        <RevenueChart />
                    </div>
                </div>

                {/* Kategoriyalar bo'yicha */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
                    <div className="mb-4 md:mb-6">
                        <h3 className="text-base md:text-lg font-bold text-brand-dark">Kategoriyalar bo'yicha sotuv</h3>
                        <p className="text-xs md:text-sm text-gray-500">Umumiy daromad ulushi</p>
                    </div>
                    <div className="h-64 md:h-80">
                        <CategoryChart />
                    </div>
                </div>

                {/* Haftalik buyurtmalar */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
                    <div className="mb-4 md:mb-6">
                        <h3 className="text-base md:text-lg font-bold text-brand-dark">Haftalik buyurtmalar</h3>
                        <p className="text-xs md:text-sm text-gray-500">So'nggi 7 kun</p>
                    </div>
                    <div className="h-64 md:h-80">
                        <WeeklyOrdersChart />
                    </div>
                </div>
            </div>

            {/* So'nggi buyurtmalar va Top mahsulotlar - RESPONSIVE */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
                    <div className="flex justify-between items-center mb-3 md:mb-4">
                        <h3 className="text-base md:text-lg font-bold text-brand-dark">So'nggi buyurtmalar</h3>
                        <span className="text-xs text-gray-500">{stats.recentOrders?.length || 0} ta</span>
                    </div>

                    {(!stats.recentOrders || stats.recentOrders.length === 0) ? (
                        <div className="text-center py-8 md:py-10 text-sm md:text-base text-gray-500">Hozircha buyurtmalar yo'q</div>
                    ) : (
                        <div className="space-y-2 md:space-y-3">
                            {stats.recentOrders.map(order => (
                                <div key={order._id} className="flex items-center justify-between p-2 md:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                    <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                                        <div className="w-8 h-8 md:w-10 md:h-10 bg-brand-green/10 rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-brand-green font-bold text-xs md:text-sm">
                                                {order.customer?.name?.charAt(0).toUpperCase() || 'M'}
                                            </span>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="font-semibold text-xs md:text-sm text-brand-dark truncate">{order.customer?.name || 'Noma\'lum'}</div>
                                            <div className="text-xs text-gray-500 truncate">{order.customer?.phone || ''}</div>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0 ml-2">
                                        <div className="font-bold text-xs md:text-sm text-brand-green">{formatPrice(order.totalPrice)} so'm</div>
                                        <div className="text-xs text-gray-500">{order.status}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-4 md:space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
                        <h3 className="text-base md:text-lg font-bold text-brand-dark mb-3 md:mb-4">Buyurtmalar holati</h3>
                        <div className="space-y-2 md:space-y-3">
                            {['Jarayonda', 'Yetkazildi', 'Bekor qilindi'].map(status => {
                                const count = stats.ordersByStatus?.find(s => s._id === status)?.count || 0;
                                const percentage = stats.totalOrders > 0 ? (count / stats.totalOrders) * 100 : 0;

                                return (
                                    <div key={status}>
                                        <div className="flex justify-between text-xs md:text-sm mb-1">
                                            <span className="text-gray-700">{status}</span>
                                            <span className="font-semibold text-brand-dark">{count}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${status === 'Jarayonda' ? 'bg-yellow-500' :
                                                    status === 'Yetkazildi' ? 'bg-green-500' : 'bg-red-500'
                                                    }`}
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
                        <h3 className="text-base md:text-lg font-bold text-brand-dark mb-3 md:mb-4">🏆 Top mahsulotlar</h3>
                        {(!stats.topProducts || stats.topProducts.length === 0) ? (
                            <div className="text-center py-4 md:py-6 text-gray-500 text-xs md:text-sm">Ma'lumot yo'q</div>
                        ) : (
                            <div className="space-y-2 md:space-y-3">
                                {stats.topProducts.map((product, idx) => (
                                    <div key={product._id || idx} className="flex items-center gap-2 md:gap-3">
                                        <div className="w-6 h-6 md:w-8 md:h-8 bg-brand-accent/10 rounded-lg flex items-center justify-center font-bold text-brand-accent text-xs md:text-sm flex-shrink-0">
                                            #{idx + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs md:text-sm font-semibold text-brand-dark truncate">{product.name || 'Noma\'lum'}</div>
                                            <div className="text-xs text-gray-500">{product.totalQty || 0} ta sotildi</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color, highlight }) {
    return (
        <div className={`bg-white rounded-xl shadow-sm border p-4 md:p-6 ${highlight ? 'border-brand-green/30' : 'border-gray-100'}`}>
            <div className="flex items-center justify-between mb-2 md:mb-3">
                <div className={`${color} text-white p-2 md:p-2.5 rounded-lg`}>
                    {icon}
                </div>
                {highlight && (
                    <span className="text-xs font-semibold text-brand-green bg-brand-green/10 px-2 py-1 rounded">
                        Bugun
                    </span>
                )}
            </div>
            <div className="text-lg md:text-2xl font-bold text-brand-dark truncate">{value}</div>
            <div className="text-xs md:text-sm text-gray-500 mt-1">{title}</div>
        </div>
    );
}