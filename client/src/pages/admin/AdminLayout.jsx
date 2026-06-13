import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('piknic_admin_token');
        localStorage.removeItem('piknic_admin_user');
        navigate('/admin/login');
    };

    const menuItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Boshqaruv paneli' },
        { path: '/admin/orders', icon: ShoppingCart, label: 'Buyurtmalar' },
        { path: '/admin/products', icon: Package, label: 'Mahsulotlar' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Header - faqat mobil ekranlarda */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-brand-dark text-white px-4 py-3 flex items-center justify-between shadow-lg">
                <h1 className="text-xl font-bold text-brand-green">PIKNIC_UZ</h1>
                <button
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    className="p-2 hover:bg-gray-800 rounded-lg transition"
                >
                    {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {showMobileMenu && (
                <div
                    className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                    onClick={() => setShowMobileMenu(false)}
                >
                    <div
                        className="fixed left-0 top-0 bottom-0 w-64 bg-brand-dark text-white"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-gray-700">
                            <h1 className="text-2xl font-bold text-brand-green">PIKNIC_UZ</h1>
                            <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
                        </div>

                        <nav className="p-4 space-y-2">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setShowMobileMenu(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${location.pathname === item.path
                                            ? 'bg-brand-green text-white'
                                            : 'text-gray-300 hover:bg-gray-800'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                        </nav>

                        <div className="p-4 border-t border-gray-700">
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setShowMobileMenu(false);
                                }}
                                className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-800 rounded-lg w-full transition"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Chiqish</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex">
                {/* Desktop Sidebar - faqat md va undan katta ekranlarda */}
                <aside className="hidden md:flex w-64 bg-brand-dark text-white flex-col fixed left-0 top-0 bottom-0">
                    <div className="p-6 border-b border-gray-700">
                        <h1 className="text-2xl font-bold text-brand-green">PIKNIC_UZ</h1>
                        <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
                    </div>

                    <nav className="flex-1 p-4 space-y-2">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${location.pathname === item.path
                                        ? 'bg-brand-green text-white'
                                        : 'text-gray-300 hover:bg-gray-800'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-gray-700">
                        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-800 rounded-lg w-full transition">
                            <LogOut className="w-5 h-5" />
                            <span>Chiqish</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content - RESPONSIVE */}
                <main className="flex-1 w-full md:ml-64 pt-16 md:pt-0 overflow-y-auto min-h-screen">
                    <div className="p-4 md:p-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}