import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ProductCard({ product }) {
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { addToCart } = useCart();
    const [isAdding, setIsAdding] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const formatPrice = (price) => new Intl.NumberFormat('uz-UZ').format(price);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsAdding(true);
        addToCart(product);
        setTimeout(() => setIsAdding(false), 1000);
    };

    const handleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product._id);
    };

    const discount = product.oldPrice
        ? Math.round((1 - product.price / product.oldPrice) * 100)
        : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
        >
            <Link
                to={`/product/${product.slug}`}
                className="group block bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-large transition-all duration-500"
            >
                {/* Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                    <motion.img
                        src={product.image}
                        alt={product.name_uz}
                        onLoad={() => setImageLoaded(true)}
                        className={`w-full h-full object-cover ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                    />

                    {/* Gradient Overlay on Hover */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    />

                    {/* Discount Badge */}
                    {discount > 0 && (
                        <motion.div
                            className="absolute top-4 left-4 bg-brand-accent text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            -{discount}%
                        </motion.div>
                    )}

                    {/* Wishlist Button */}
                    <motion.button
                        onClick={handleWishlist}
                        className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                    >
                        <motion.div
                            animate={isInWishlist(product._id) ? { scale: [1, 1.3, 1] } : {}}
                            transition={{ duration: 0.3 }}
                        >
                            <Heart
                                className={`w-5 h-5 transition-all duration-300 ${isInWishlist(product._id)
                                    ? 'fill-red-500 text-red-500'
                                    : 'text-gray-600'
                                    }`}
                            />
                        </motion.div>
                    </motion.button>

                    {/* Quick Add Button */}
                    <motion.button
                        onClick={handleAddToCart}
                        className={`absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm text-brand-dark font-semibold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 ${isAdding ? 'bg-brand-green text-white' : ''}`}
                        initial={{ opacity: 0, y: 20 }}
                        whileHover={{ opacity: 1, y: 0 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                    >
                        {isAdding ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity }}
                            >
                                <ShoppingCart className="w-5 h-5" />
                            </motion.div>
                        ) : (
                            <ShoppingCart className="w-5 h-5" />
                        )}
                        {isAdding ? 'Qo\'shildi!' : 'Savatga qo\'shish'}
                    </motion.button>
                </div>

                {/* Content */}
                <div className="p-5">
                    {/* Category */}
                    <span className="text-xs font-semibold text-brand-green uppercase tracking-wider">
                        {product.category}
                    </span>

                    {/* Title */}
                    <h3 className="font-bold text-brand-dark mt-2 line-clamp-2 group-hover:text-brand-green transition-colors duration-300 text-base leading-tight">
                        {product.name_uz}
                    </h3>

                    {/* Rating */}
                    {product.rating > 0 && (
                        <div className="flex items-center gap-1.5 mt-3">
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`}
                                    />
                                ))}
                            </div>
                            <span className="text-xs text-gray-500 font-medium">
                                {product.rating} ({product.reviews})
                            </span>
                        </div>
                    )}

                    {/* Price */}
                    <div className="mt-4 flex items-baseline gap-3">
                        <span className="text-xl font-bold text-brand-green">
                            {formatPrice(product.price)} <span className="text-sm font-normal">so'm</span>
                        </span>
                        {product.oldPrice && (
                            <span className="text-sm text-gray-400 line-through font-medium">
                                {formatPrice(product.oldPrice)}
                            </span>
                        )}
                    </div>

                    {/* Installment */}
                    {product.price > 100000 && (
                        <p className="text-xs text-brand-accent font-semibold mt-2 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-brand-accent rounded-full"></span>
                            Nasiya: {formatPrice(Math.round(product.price / 12))} so'm/oy
                        </p>
                    )}
                </div>
            </Link>
        </motion.div>
    );
}