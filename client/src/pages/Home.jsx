import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ArrowRight, Truck, ShieldCheck, RefreshCw, Heart } from 'lucide-react';
import Footer from '../components/Footer';
import { useWishlist } from '../context/WishlistContext';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toggleWishlist, isInWishlist } = useWishlist();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/products?limit=8');
                setProducts(data.products || []);
            } catch (error) {
                console.error("Mahsulotlarni yuklashda xatolik", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const formatPrice = (price) => new Intl.NumberFormat('uz-UZ').format(price);

    return (
        <div className="min-h-screen">
            <Navbar />

            {/* Hero Section - RESPONSIVE */}
            <section className="relative h-[50vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=2000"
                        alt="Camping"
                        className="w-full h-full object-cover brightness-50"
                    />
                </div>
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <h1 className="text-3xl md:text-6xl font-bold text-white mb-4 md:mb-6">
                        Tabiat quchog'ida <span className="text-brand-accent">premium sifat.</span>
                    </h1>
                    <p className="text-base md:text-xl text-white/90 mb-6 md:mb-8 max-w-2xl mx-auto">
                        O'zbekistonning go'zal tabiat qo'ynida o'zingizni qulay his qilishingiz uchun eng sifatli outdoor anjomlari.
                    </p>
                    <Link to="/shop" className="inline-flex items-center gap-2 bg-brand-green text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-bold text-base md:text-lg hover:bg-brand-green/90 transition mt-4">
                        Katalogga o'tish <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                    </Link>
                </div>
            </section>

            {/* Benefits Section - RESPONSIVE */}
            <section className="py-8 md:py-16 px-4 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                    {[
                        { icon: ShieldCheck, title: "100% Original", desc: "Barcha mahsulotlar rasmiy kafolatga ega" },
                        { icon: Truck, title: "Tez yetkazib berish", desc: "Toshkent bo'ylab 24 soat ichida" },
                        { icon: RefreshCw, title: "14 kun qaytarish", desc: "Mahsulot yoqmasa, pulingizni qaytaramiz" }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-sm flex items-start gap-3 md:gap-4">
                            <item.icon className="w-6 h-6 md:w-8 md:h-8 text-brand-green flex-shrink-0" />
                            <div>
                                <h3 className="font-bold text-brand-dark text-base md:text-lg">{item.title}</h3>
                                <p className="text-brand-dark/70 mt-1 text-sm md:text-base">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Products Section - RESPONSIVE */}
            <section className="py-8 md:py-16 px-4 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb-8 gap-3">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-brand-dark">Ommabop mahsulotlar</h2>
                        <p className="text-brand-dark/60 mt-1 md:mt-2 text-sm md:text-base">Mijozlarimiz eng ko'p tanlaydigan anjomlar</p>
                    </div>
                    <Link to="/shop" className="hidden md:flex items-center gap-2 text-brand-green font-semibold hover:gap-3 transition-all">
                        Barchasini ko'rish <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white rounded-lg md:rounded-xl h-72 md:h-96 animate-pulse"></div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-12 md:py-16">
                        <p className="text-gray-500 text-base md:text-lg">Hozircha mahsulotlar yo'q</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                        {products.map(product => (
                            <Link
                                key={product._id}
                                to={`/product/${product.slug}`}
                                className="group block bg-white rounded-lg md:rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition relative"
                            >
                                {/* WISHLIST TUGMASI */}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        toggleWishlist(product._id);
                                    }}
                                    className="absolute top-2 right-2 md:top-3 md:right-3 w-8 h-8 md:w-9 md:h-9 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-md hover:scale-110 transition z-10"
                                    title={isInWishlist(product._id) ? "Sevimlilardan o'chirish" : "Sevimlilarga qo'shish"}
                                >
                                    <Heart
                                        className={`w-3.5 h-3.5 md:w-4 md:h-4 transition ${isInWishlist(product._id)
                                            ? 'fill-red-500 text-red-500'
                                            : 'text-gray-400'
                                            }`}
                                    />
                                </button>

                                <div className="aspect-[4/5] overflow-hidden bg-gray-100 relative">
                                    <img
                                        src={product.image}
                                        alt={product.name_uz}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                    />
                                    {product.oldPrice && (
                                        <span className="absolute top-2 left-2 md:top-3 md:left-3 bg-brand-accent text-white text-xs font-bold px-2 py-1 rounded">
                                            -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                                        </span>
                                    )}
                                </div>
                                <div className="p-3 md:p-4">
                                    <span className="text-xs text-gray-500">{product.category}</span>
                                    <h3 className="font-semibold text-brand-dark mt-1 line-clamp-2 group-hover:text-brand-green transition text-sm md:text-base">
                                        {product.name_uz}
                                    </h3>
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
                        ))}
                    </div>
                )}

                {/* Mobil uchun "Barchasini ko'rish" tugmasi */}
                <div className="mt-6 md:hidden text-center">
                    <Link to="/shop" className="inline-flex items-center gap-2 text-brand-green font-semibold hover:gap-3 transition-all">
                        Barchasini ko'rish <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>
            <Footer />
        </div>
    );
}