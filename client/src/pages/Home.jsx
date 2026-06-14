import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ArrowRight, Truck, ShieldCheck, RefreshCw, Heart } from 'lucide-react';
import Footer from '../components/Footer';
import { useWishlist } from '../context/WishlistContext';
import { motion } from 'framer-motion';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toggleWishlist, isInWishlist } = useWishlist();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);

                // Admin dashboard API dan top mahsulotlarni olish
                const token = localStorage.getItem('piknic_admin_token');

                let productsData = [];

                if (token) {
                    // Admin bo'lsa, top mahsulotlar API dan olish
                    try {
                        const { data } = await axios.get('http://localhost:5000/api/admin/dashboard', {
                            headers: { Authorization: `Bearer ${token}` }
                        });

                        // Top mahsulotlarni olish
                        if (data.topProducts && data.topProducts.length > 0) {
                            productsData = data.topProducts
                                .slice(0, 4)
                                .map(product => ({
                                    ...product,
                                    totalSold: product.totalQty || 0
                                }));
                        }
                    } catch (adminError) {
                        console.error('Admin API ishlamadi, oddiy mahsulotlarni olamiz');
                    }
                }

                // Agar top mahsulotlar bo'lmasa, oddiy mahsulotlarni olish
                if (productsData.length === 0) {
                    const { data } = await axios.get('http://localhost:5000/api/products?limit=4');
                    productsData = data.products || [];
                }

                setProducts(productsData);
            } catch (error) {
                console.error("Mahsulotlarni yuklashda xatolik", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const formatPrice = (price) => new Intl.NumberFormat('uz-UZ').format(price);

    // Animatsiya variantlari
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <div className="min-h-screen">
            <Navbar />

            {/* Hero Section */}
            <section className="relative h-[50vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
                <motion.div
                    className="absolute inset-0 z-0"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5 }}
                >
                    <img
                        src="https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=2000"
                        alt="Camping"
                        className="w-full h-full object-cover brightness-50"
                    />
                </motion.div>

                <motion.div
                    className="relative z-10 text-center px-4 max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <motion.h1
                        className="text-3xl md:text-6xl font-bold text-white mb-4 md:mb-6"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        Tabiat quchog'ida <span className="text-brand-accent">premium sifat.</span>
                    </motion.h1>
                    <motion.p
                        className="text-base md:text-xl text-white/90 mb-6 md:mb-8 max-w-2xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        O'zbekistonning go'zal tabiat qo'ynida o'zingizni qulay his qilishingiz uchun eng sifatli outdoor anjomlari.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link to="/shop" className="inline-flex items-center gap-2 bg-brand-green text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-bold text-base md:text-lg hover:bg-brand-green/90 transition shadow-lg hover:shadow-xl">
                            Katalogga o'tish <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                        </Link>
                    </motion.div>
                </motion.div>
            </section>

            {/* Benefits Section */}
            <motion.section
                className="py-8 md:py-16 px-4 max-w-7xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                    {[
                        { icon: ShieldCheck, title: "100% Original", desc: "Barcha mahsulotlar rasmiy kafolatga ega" },
                        { icon: Truck, title: "Tez yetkazib berish", desc: "Toshkent bo'ylab 24 soat ichida" },
                        { icon: RefreshCw, title: "14 kun qaytarish", desc: "Mahsulot yoqmasa, pulingizni qaytaramiz" }
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-sm flex items-start gap-3 md:gap-4 hover:shadow-lg transition-shadow"
                            variants={itemVariants}
                            whileHover={{ y: -5 }}
                        >
                            <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                            >
                                <item.icon className="w-6 h-6 md:w-8 md:h-8 text-brand-green flex-shrink-0" />
                            </motion.div>
                            <div>
                                <h3 className="font-bold text-brand-dark text-base md:text-lg">{item.title}</h3>
                                <p className="text-brand-dark/70 mt-1 text-sm md:text-base">{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Products Section - TOP MAHSULOTLAR */}
            <section className="py-8 md:py-16 px-4 max-w-7xl mx-auto">
                <motion.div
                    className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb-8 gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-brand-dark">Ommabop mahsulotlar</h2>
                        <p className="text-brand-dark/60 mt-1 md:mt-2 text-sm md:text-base">
                            Mijozlarimiz eng ko'p sotib oladigan anjomlar
                        </p>
                    </div>
                    <Link to="/shop" className="hidden md:flex items-center gap-2 text-brand-green font-semibold hover:gap-3 transition-all">
                        Barchasini ko'rish <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                        {[...Array(4)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="bg-white rounded-lg md:rounded-xl h-72 md:h-96"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-12 md:py-16">
                        <p className="text-gray-500 text-base md:text-lg mb-4">
                            Hozircha mahsulotlar yo'q
                        </p>
                        <Link
                            to="/shop"
                            className="inline-flex items-center gap-2 text-brand-green font-semibold hover:gap-3 transition-all"
                        >
                            Katalogga o'tish <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                ) : (
                    <motion.div
                        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                    >
                        {products.map((product, index) => (
                            <motion.div
                                key={product._id}
                                variants={itemVariants}
                                whileHover={{ y: -8 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Link
                                    to={`/product/${product.slug || product._id}`}
                                    className="group block bg-white rounded-lg md:rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition relative"
                                >
                                    {/* Top Seller Badge - Top 4 uchun */}
                                    {index < 4 && (
                                        <motion.div
                                            className="absolute top-2 left-2 z-20 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: index * 0.1 + 0.5 }}
                                        >
                                            <span>🏆</span>
                                            <span>#{index + 1}</span>
                                        </motion.div>
                                    )}

                                    {/* WISHLIST TUGMASI */}
                                    <motion.button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            toggleWishlist(product._id);
                                        }}
                                        className="absolute top-2 right-2 md:top-3 md:right-3 w-8 h-8 md:w-9 md:h-9 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-md z-10"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        title={isInWishlist(product._id) ? "Sevimlilardan o'chirish" : "Sevimlilarga qo'shish"}
                                    >
                                        <motion.div
                                            animate={isInWishlist(product._id) ? { scale: [1, 1.3, 1] } : {}}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Heart
                                                className={`w-3.5 h-3.5 md:w-4 md:h-4 transition ${isInWishlist(product._id)
                                                    ? 'fill-red-500 text-red-500'
                                                    : 'text-gray-400'
                                                    }`}
                                            />
                                        </motion.div>
                                    </motion.button>

                                    <div className="aspect-[4/5] overflow-hidden bg-gray-100 relative">
                                        <motion.img
                                            src={product.image}
                                            alt={product.name || product.name_uz}
                                            className="w-full h-full object-cover"
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ duration: 0.5 }}
                                        />
                                        {product.oldPrice && (
                                            <motion.span
                                                className="absolute top-2 left-2 md:top-3 md:left-3 bg-brand-accent text-white text-xs font-bold px-2 py-1 rounded"
                                                animate={{ scale: [1, 1.1, 1] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            >
                                                -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                                            </motion.span>
                                        )}
                                    </div>
                                    <div className="p-3 md:p-4">
                                        <span className="text-xs text-gray-500">{product.category}</span>
                                        <h3 className="font-semibold text-brand-dark mt-1 line-clamp-2 group-hover:text-brand-green transition text-sm md:text-base">
                                            {product.name || product.name_uz}
                                        </h3>

                                        {/* Sotilgan soni */}
                                        {product.totalSold > 0 && (
                                            <p className="text-xs text-brand-accent font-semibold mt-1 flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 bg-brand-accent rounded-full"></span>
                                                {product.totalSold} ta sotilgan
                                            </p>
                                        )}

                                        <div className="mt-2 md:mt-3 flex items-baseline gap-1 md:gap-2 flex-wrap">
                                            <span className="text-base md:text-lg font-bold text-brand-green">
                                                {formatPrice(product.price)} so'm
                                            </span>
                                            {product.oldPrice && (
                                                <span className="text-xs md:text-sm text-gray-400 line-through">
                                                    {formatPrice(product.oldPrice)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* Mobil uchun "Barchasini ko'rish" tugmasi */}
                <motion.div
                    className="mt-6 md:hidden text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <Link to="/shop" className="inline-flex items-center gap-2 text-brand-green font-semibold hover:gap-3 transition-all">
                        Barchasini ko'rish <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </section>
            <Footer />
        </div>
    );
}