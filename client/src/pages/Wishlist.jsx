import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowRight, Package } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
export default function Wishlist() {
    const navigate = useNavigate();
    const { wishlist, toggleWishlist, isInWishlist } = useWishlist();
    const { addToCart } = useCart();
    const [addingToCart, setAddingToCart] = useState(null);

    const formatPrice = (price) => new Intl.NumberFormat('uz-UZ').format(price);

    const handleAddToCart = (product) => {
        setAddingToCart(product._id);
        addToCart(product);

        setTimeout(() => {
            setAddingToCart(null);
            if (window.confirm('Mahsulot savatga qo\'shildi! Savatga o\'tishni xohlaysizmi?')) {
                navigate('/cart');
            }
        }, 500);
    };

    const handleRemoveFromWishlist = (productId) => {
        if (window.confirm('Sevimlilardan o\'chirishni xohlaysizmi?')) {
            toggleWishlist(productId);
        }
    };

    return (
        <div className="min-h-screen bg-brand-sand">
            <Navbar />

            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-brand-dark">Mening sevimlilarim</h1>
                            <p className="text-gray-600 mt-1">
                                {wishlist.length} ta mahsulot saqlandi
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {wishlist.length === 0 ? (
                    // Bo'sh holat
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-12 h-12 text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-brand-dark mb-3">
                            Sevimlilaringiz bo'sh
                        </h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Yoqtirgan mahsulotlaringizni yurakcha tugmasini bosib saqlab qo'ying.
                            Keyinroq osongina topasiz!
                        </p>
                        <Link
                            to="/shop"
                            className="inline-flex items-center gap-2 bg-brand-green text-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-green/90 transition"
                        >
                            Katalogga o'tish
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                ) : (
                    // Mahsulotlar ro'yxati
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {wishlist.map((product) => (
                            <div
                                key={product._id}
                                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition group"
                            >
                                {/* Rasm */}
                                <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                                    <Link to={`/product/${product.slug}`}>
                                        <img
                                            src={product.image}
                                            alt={product.name_uz}
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                        />
                                    </Link>

                                    {/* Kategoriya badge */}
                                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-xs font-semibold px-2 py-1 rounded">
                                        {product.category}
                                    </span>

                                    {/* O'chirish tugmasi */}
                                    <button
                                        onClick={() => handleRemoveFromWishlist(product._id)}
                                        className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 hover:text-red-500 transition"
                                        title="O'chirish"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>

                                    {/* Chegirma badge */}
                                    {product.oldPrice && (
                                        <span className="absolute bottom-3 left-3 bg-brand-accent text-white text-xs font-bold px-2 py-1 rounded">
                                            -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                                        </span>
                                    )}
                                </div>

                                {/* Ma'lumotlar */}
                                <div className="p-4">
                                    <Link to={`/product/${product.slug}`}>
                                        <h3 className="font-semibold text-brand-dark line-clamp-2 hover:text-brand-green transition mb-2">
                                            {product.name_uz}
                                        </h3>
                                    </Link>

                                    {/* Reyting */}
                                    <div className="flex items-center gap-1 mb-3">
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <svg
                                                    key={i}
                                                    className={`w-3 h-3 ${i < Math.floor(product.rating || 0) ? 'fill-current' : 'text-gray-300'}`}
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <span className="text-xs text-gray-500">
                                            {product.rating || 0} ({product.reviews || 0})
                                        </span>
                                    </div>

                                    {/* Narx */}
                                    <div className="flex items-baseline gap-2 mb-4">
                                        <span className="text-lg font-bold text-brand-green">
                                            {formatPrice(product.price)} so'm
                                        </span>
                                        {product.oldPrice && (
                                            <span className="text-sm text-gray-400 line-through">
                                                {formatPrice(product.oldPrice)}
                                            </span>
                                        )}
                                    </div>

                                    {/* Tugmalar */}
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            disabled={addingToCart === product._id}
                                            className="w-full bg-brand-green text-white font-semibold py-2.5 rounded-lg hover:bg-brand-green/90 transition flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {addingToCart === product._id ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Qo'shilmoqda...
                                                </>
                                            ) : (
                                                <>
                                                    <ShoppingCart className="w-4 h-4" />
                                                    Savatga
                                                </>
                                            )}
                                        </button>

                                        <Link
                                            to={`/product/${product.slug}`}
                                            className="w-full block text-center border-2 border-gray-300 text-gray-700 font-semibold py-2.5 rounded-lg hover:border-brand-green hover:text-brand-green transition"
                                        >
                                            Batafsil
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Barcha mahsulotlar */}
                {wishlist.length > 0 && (
                    <div className="mt-12 text-center">
                        <Link
                            to="/shop"
                            className="inline-flex items-center gap-2 text-brand-green font-semibold hover:gap-3 transition"
                        >
                            Boshqa mahsulotlarni ko'rish
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}