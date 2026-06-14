import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';

import {
    Truck, ShieldCheck, Star, ShoppingCart,
    MessageCircle, Heart, Minus, Plus, Loader2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

export default function ProductDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [reviews, setReviews] = useState([]);
    const [addingToCart, setAddingToCart] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0); // ← YANGI

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/api/products/${slug}`);
                setProduct(data);
                setSelectedImage(0); // Rasmni reset qilish

                const reviewsRes = await api.get(`/api/reviews/${data._id}`);
                setReviews(reviewsRes.data);
            } catch (error) {
                console.error("Mahsulotni yuklashda xatolik", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [slug]);

    const formatPrice = (price) => new Intl.NumberFormat('uz-UZ').format(price);

    // Barcha rasmlar massivi
    const allImages = product?.images?.length > 0
        ? product.images
        : (product?.image ? [product.image] : []);

    const handleAddToCart = async () => {
        if (!product) return;
        setAddingToCart(true);
        const productWithQty = { ...product, qty: quantity };
        addToCart(productWithQty);
        setTimeout(() => {
            setAddingToCart(false);
            if (window.confirm('Mahsulot savatga qo\'shildi! Savatga o\'tishni xohlaysizmi?')) {
                navigate('/cart');
            }
        }, 500);
    };

    const handleBuyNow = () => {
        if (!product) return;
        const productWithQty = { ...product, qty: quantity };
        addToCart(productWithQty);
        navigate('/cart');
    };

    const handleTelegramOrder = () => {
        if (!product) return;
        const message = encodeURIComponent(
            `Salom! Men quyidagi mahsulotni buyurtma qilmoqchiman:\n\n` +
            `📦 *${product.name_uz}*\n` +
            `💰 Narxi: ${formatPrice(product.price)} so'm\n` +
            `🔢 Miqdori: ${quantity} ta\n` +
            `🔗 Link: ${window.location.href}\n\n` +
            `Iltimos, buyurtmani rasmiylashtirishda yordam bering.`
        );
        window.open(`https://t.me/piknic_uz_manager?text=${message}`, '_blank');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-brand-sand">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-gray-200 rounded-2xl h-96"></div>
                        <div className="space-y-4">
                            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-12 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-brand-sand">
                <Navbar />
                <div className="text-center py-20">
                    <h2 className="text-2xl font-bold text-brand-dark">Mahsulot topilmadi</h2>
                    <button
                        onClick={() => navigate('/shop')}
                        className="mt-4 px-6 py-3 bg-brand-green text-white rounded-lg"
                    >
                        Katalogga qaytish
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-sand pb-24">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

                    {/* 🖼️ RASM GALEREYASI - YANGI */}
                    <div className="space-y-4">
                        {/* Asosiy rasm */}
                        <motion.div
                            className="bg-white rounded-2xl overflow-hidden shadow-sm aspect-square relative"
                            layout
                        >
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={selectedImage}
                                    src={allImages[selectedImage]}
                                    alt={product.name_uz}
                                    className="w-full h-full object-cover"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </AnimatePresence>

                            {/* Chegirma badge */}
                            {product.oldPrice && (
                                <motion.div
                                    className="absolute top-4 left-4 bg-brand-accent text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg"
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                                </motion.div>
                            )}

                            {/* Rasm hisoblagich */}
                            {allImages.length > 1 && (
                                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                                    {selectedImage + 1} / {allImages.length}
                                </div>
                            )}
                        </motion.div>

                        {/* Kichik rasmlar (thumbnail) */}
                        {allImages.length > 1 && (
                            <div className="grid grid-cols-5 gap-2">
                                {allImages.map((img, idx) => (
                                    <motion.button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx
                                                ? 'border-brand-green ring-2 ring-brand-green/20 scale-105'
                                                : 'border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100'
                                            }`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <img
                                            src={img}
                                            alt={`Rasm ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </motion.button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Mahsulot ma'lumotlari */}
                    <div className="space-y-6">
                        <span className="text-brand-accent font-semibold text-sm uppercase tracking-wider">
                            {product.category}
                        </span>

                        <h1 className="text-3xl md:text-4xl font-bold text-brand-dark">
                            {product.name_uz}
                        </h1>

                        <div className="flex items-center gap-2">
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-5 h-5 ${i < Math.floor(product.rating || 0) ? 'fill-current' : 'text-gray-300'}`}
                                    />
                                ))}
                            </div>
                            <span className="text-gray-600">
                                {product.rating || 0} ({product.reviews || 0} ta sharh)
                            </span>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-baseline gap-3 mb-2 flex-wrap">
                                <span className="text-4xl font-bold text-brand-green">
                                    {formatPrice(product.price)} so'm
                                </span>
                                {product.oldPrice && (
                                    <span className="text-xl text-gray-400 line-through">
                                        {formatPrice(product.oldPrice)}
                                    </span>
                                )}
                            </div>
                            <p className="text-brand-accent font-medium flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" />
                                Nasiya mavjud
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Miqdor:
                            </label>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-12 h-12 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-brand-green transition"
                                >
                                    <Minus className="w-5 h-5" />
                                </button>
                                <span className="text-2xl font-bold text-brand-dark w-12 text-center">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-12 h-12 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-brand-green transition"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-start gap-3 mb-3">
                                <Truck className="w-5 h-5 text-brand-green mt-1" />
                                <div>
                                    <h4 className="font-semibold text-brand-dark">Yetkazib berish</h4>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Toshkent: 1 kun (Bepul)<br />
                                        Viloyatlar: 2-3 kun
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <motion.button
                                onClick={handleAddToCart}
                                disabled={addingToCart}
                                className="w-full bg-brand-green text-white font-bold py-4 rounded-xl hover:bg-brand-green/90 transition flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-brand-green/30"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {addingToCart ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        Qo'shilmoqda...
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="w-6 h-6" />
                                        Savatga qo'shish
                                    </>
                                )}
                            </motion.button>

                            <div className="grid grid-cols-2 gap-3">
                                <motion.button
                                    onClick={handleBuyNow}
                                    className="bg-brand-accent text-white font-bold py-4 rounded-xl hover:bg-brand-accent/90 transition flex items-center justify-center gap-2"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Hozir sotib olish
                                </motion.button>

                                <motion.button
                                    onClick={handleTelegramOrder}
                                    className="bg-[#0088cc] text-white font-bold py-4 rounded-xl hover:bg-[#0077b5] transition flex items-center justify-center gap-2"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <MessageCircle className="w-6 h-6" />
                                    Telegram orqali
                                </motion.button>
                            </div>

                            <motion.button
                                onClick={() => toggleWishlist(product._id)}
                                className={`w-full border-2 font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 ${isInWishlist(product._id)
                                    ? 'border-red-500 text-red-500 bg-red-50'
                                    : 'border-gray-300 text-gray-700 hover:border-red-300'
                                    }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Heart className={`w-5 h-5 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
                                {isInWishlist(product._id) ? 'Sevimlilarda' : 'Sevimlilarga qo\'shish'}
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Tavsif va Sharhlar */}
                <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-sm">
                        <h3 className="text-2xl font-bold text-brand-dark mb-4">Mahsulot haqida</h3>
                        <p className="text-gray-700 leading-relaxed">
                            {product.description || 'Bu mahsulot haqida to\'liq ma\'lumot tez orada qo\'shiladi.'}
                        </p>

                        <div className="mt-6 pt-6 border-t">
                            <h4 className="font-semibold text-brand-dark mb-4">Xususiyatlar:</h4>
                            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <dt className="text-sm text-gray-500">Kategoriya</dt>
                                    <dd className="font-medium text-brand-dark">{product.category}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm text-gray-500">Omborda</dt>
                                    <dd className="font-medium text-brand-dark">
                                        {product.stock > 0 ? `${product.stock} ta` : 'Tugagan'}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-8 shadow-sm">
                        <h3 className="text-xl font-bold text-brand-dark mb-4">
                            Sharhlar ({reviews.length})
                        </h3>
                        {reviews.length === 0 ? (
                            <p className="text-gray-500">Hali sharhlar yo'q</p>
                        ) : (
                            <div className="space-y-4">
                                {reviews.slice(0, 3).map((review) => (
                                    <div key={review._id} className="border-b border-gray-100 pb-4 last:border-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-8 h-8 bg-brand-green/10 rounded-full flex items-center justify-center font-bold text-brand-green text-sm">
                                                {review.userName?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm">{review.userName}</p>
                                                <div className="flex text-yellow-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-700">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}