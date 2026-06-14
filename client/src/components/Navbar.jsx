import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, User, LogOut, X, ChevronDown, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const { cartItems } = useCart();
    const { wishlist } = useWishlist();
    const navigate = useNavigate();
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem('piknic_user');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (error) {
            console.error('User parse error:', error);
            return null;
        }
    });

    useEffect(() => {
        const handleStorage = (event) => {
            if (event.key === 'piknic_user') {
                try {
                    setUser(event.newValue ? JSON.parse(event.newValue) : null);
                } catch (error) {
                    console.error('User parse error:', error);
                }
            }
        };

        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowUserDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('piknic_user');
        localStorage.removeItem('piknic_token');
        localStorage.removeItem('piknic_admin_token');
        setShowUserDropdown(false);
        setShowMobileMenu(false);
        navigate('/');
        window.location.reload();
    };

    return (
        <motion.nav
            className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 md:h-20">
                    {/* Logo */}
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-brand-green rounded-xl flex items-center justify-center shadow-glow">
                                <img src="https://i.ibb.co/5Db4sY8/logo.jpg" alt="logo" style={{ borderRadius: '50%' }} />
                            </div>
                            <span className="text-xl md:text-2xl font-extrabold text-brand-green tracking-tight">
                                PIKNIC_UZ
                            </span>
                        </Link>
                    </motion.div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-brand-dark hover:text-brand-green font-medium transition">
                            Bosh sahifa
                        </Link>
                        <Link to="/shop" className="text-brand-dark hover:text-brand-green font-medium transition">
                            Katalog
                        </Link>
                        <Link to="/about" className="text-brand-dark hover:text-brand-green font-medium transition">
                            Biz haqimizda
                        </Link>
                        <Link to="/order-tracking" className="text-brand-dark hover:text-brand-green font-medium transition">
                            Buyurtma kuzatuvi
                        </Link>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-1 md:gap-3">
                        {/* Foydalanuvchi - faqat desktopda */}
                        {user ? (
                            <div className="hidden md:flex items-center gap-2 relative" ref={dropdownRef}>
                                <motion.button
                                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-brand-sand rounded-lg hover:bg-gray-200 transition"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <User className="w-4 h-4 text-brand-green" />
                                    <span className="text-sm font-medium text-brand-dark max-w-[120px] truncate">{user.name}</span>
                                    <motion.div
                                        animate={{ rotate: showUserDropdown ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <ChevronDown className="w-4 h-4 text-gray-500" />
                                    </motion.div>
                                </motion.button>

                                {/* Dropdown Menu with Animation */}
                                <AnimatePresence>
                                    {showUserDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
                                        >
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <p className="text-sm font-semibold text-brand-dark truncate">{user.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                            </div>

                                            <div className="py-1">
                                                <motion.button
                                                    onClick={() => {
                                                        navigate('/profile');
                                                        setShowUserDropdown(false);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-sand transition text-left"
                                                    whileHover={{ x: 5 }}
                                                >
                                                    <User className="w-4 h-4" />
                                                    Mening hisobim
                                                </motion.button>

                                                {user.isAdmin === true && (
                                                    <motion.button
                                                        onClick={() => {
                                                            navigate('/admin');
                                                            setShowUserDropdown(false);
                                                        }}
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-sand transition text-left"
                                                        whileHover={{ x: 5 }}
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        Admin panel
                                                    </motion.button>
                                                )}
                                            </div>

                                            <div className="border-t border-gray-100 pt-1">
                                                <motion.button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition text-left"
                                                    whileHover={{ x: 5 }}
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    Chiqish
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center gap-2">
                                <motion.button
                                    onClick={() => navigate('/login')}
                                    className="px-4 py-2 text-brand-dark font-medium hover:text-brand-green transition"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Kirish
                                </motion.button>
                                <motion.button
                                    onClick={() => navigate('/register')}
                                    className="px-4 py-2 bg-brand-green text-white font-medium rounded-lg hover:bg-brand-green/90 transition"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Ro'yxatdan o'tish
                                </motion.button>
                            </div>
                        )}

                        {/* Ikonlar */}
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Link to="/cart" className="p-2 hover:bg-brand-sand rounded-full relative transition">
                                <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-brand-dark" />
                                {cartCount > 0 && (
                                    <motion.span
                                        className="absolute -top-1 -right-1 w-5 h-5 bg-brand-accent text-white text-xs font-bold rounded-full flex items-center justify-center"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    >
                                        {cartCount}
                                    </motion.span>
                                )}
                            </Link>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Link to="/wishlist" className="p-2 hover:bg-brand-sand rounded-full relative transition">
                                <Heart className="w-5 h-5 md:w-6 md:h-6 text-brand-dark" />
                                {wishlist.length > 0 && (
                                    <motion.span
                                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    >
                                        {wishlist.length}
                                    </motion.span>
                                )}
                            </Link>
                        </motion.div>

                        {/* Mobile Menu Button */}
                        <motion.button
                            className="md:hidden p-2"
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <AnimatePresence mode="wait">
                                {showMobileMenu ? (
                                    <motion.div
                                        key="close"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <X className="w-6 h-6 text-brand-dark" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="menu"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Menu className="w-6 h-6 text-brand-dark" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </div>
                </div>

                {/* Mobile Menu with Animation */}
                <AnimatePresence>
                    {showMobileMenu && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="md:hidden py-4 border-t border-gray-200 overflow-hidden"
                        >
                            <div className="flex flex-col space-y-2">
                                <Link
                                    to="/"
                                    onClick={() => setShowMobileMenu(false)}
                                    className="px-4 py-3 text-brand-dark hover:bg-brand-sand rounded-lg font-medium"
                                >
                                    Bosh sahifa
                                </Link>
                                <Link
                                    to="/shop"
                                    onClick={() => setShowMobileMenu(false)}
                                    className="px-4 py-3 text-brand-dark hover:bg-brand-sand rounded-lg font-medium"
                                >
                                    Katalog
                                </Link>
                                <Link
                                    to="/about"
                                    onClick={() => setShowMobileMenu(false)}
                                    className="px-4 py-3 text-brand-dark hover:bg-brand-sand rounded-lg font-medium"
                                >
                                    Biz haqimizda
                                </Link>
                                <Link
                                    to="/order-tracking"
                                    onClick={() => setShowMobileMenu(false)}
                                    className="px-4 py-3 text-brand-dark hover:bg-brand-sand rounded-lg font-medium"
                                >
                                    Buyurtma kuzatuvi
                                </Link>

                                <div className="border-t border-gray-200 my-2"></div>

                                {!user ? (
                                    <div className="flex flex-col gap-2 px-2">
                                        <button
                                            onClick={() => {
                                                navigate('/login');
                                                setShowMobileMenu(false);
                                            }}
                                            className="px-4 py-3 text-left text-brand-dark hover:bg-brand-sand rounded-lg font-medium"
                                        >
                                            Kirish
                                        </button>
                                        <button
                                            onClick={() => {
                                                navigate('/register');
                                                setShowMobileMenu(false);
                                            }}
                                            className="px-4 py-3 bg-brand-green text-white rounded-lg text-left font-medium"
                                        >
                                            Ro'yxatdan o'tish
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2 px-2">
                                        <div className="px-4 py-3 bg-brand-sand rounded-lg">
                                            <div className="flex items-center gap-2 mb-1">
                                                <User className="w-4 h-4 text-brand-green" />
                                                <span className="font-medium text-brand-dark truncate">{user.name}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>

                                        <button
                                            onClick={() => {
                                                navigate('/profile');
                                                setShowMobileMenu(false);
                                            }}
                                            className="px-4 py-3 text-left text-brand-dark hover:bg-brand-sand rounded-lg flex items-center gap-2 font-medium"
                                        >
                                            <User className="w-4 h-4" />
                                            Mening hisobim
                                        </button>

                                        {user.isAdmin === true && (
                                            <button
                                                onClick={() => {
                                                    navigate('/admin');
                                                    setShowMobileMenu(false);
                                                }}
                                                className="px-4 py-3 text-left text-brand-dark hover:bg-brand-sand rounded-lg flex items-center gap-2 font-medium"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                Admin panel
                                            </button>
                                        )}

                                        <button
                                            onClick={handleLogout}
                                            className="px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 font-medium"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Chiqish
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
}