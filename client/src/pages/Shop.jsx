import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useWishlist } from '../context/WishlistContext';

const categories = [
    { id: 'all', name: 'Barchasi' },
    { id: 'Palatkalar', name: 'Palatkalar' },
    { id: 'Mebel', name: 'Mebel' },
    { id: 'Idish-tovoq', name: 'Idish-tovoq' },
    { id: 'Kiyimlar', name: 'Kiyimlar' },
    { id: 'Aksessuarlar', name: 'Aksessuarlar' }
];

const sortOptions = [
    { value: 'newest', label: 'Eng yangilari' },
    { value: 'price-asc', label: 'Arzondan qimmatga' },
    { value: 'price-desc', label: 'Qimmatdan arzonga' },
    { value: 'rating', label: 'Reyting bo\'yicha' }
];

export default function Shop() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

    // Filter holatlari
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [showFilters, setShowFilters] = useState(false);

    // Wishlist
    const { toggleWishlist, isInWishlist } = useWishlist();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (selectedCategory !== 'all') params.append('category', selectedCategory);
                if (searchQuery) params.append('search', searchQuery);
                if (sortBy !== 'newest') params.append('sort', sortBy);
                params.append('page', pagination.page);

                const { data } = await axios.get(`http://localhost:5000/api/products?${params}`);
                setProducts(data.products);
                setPagination(data.pagination);
            } catch (error) {
                console.error("Mahsulotlarni yuklashda xatolik", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [selectedCategory, searchQuery, sortBy, pagination.page]);

    const handleCategoryChange = (cat) => {
        setSelectedCategory(cat);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const formatPrice = (price) => new Intl.NumberFormat('uz-UZ').format(price);

    return (
        <div className="min-h-screen bg-brand-sand">
            <Navbar />

            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-brand-dark mb-4">Katalog</h1>

                    {/* Qidiruv */}
                    <form onSubmit={handleSearch} className="relative max-w-2xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Mahsulot qidirish..."
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </form>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex gap-8">

                    {/* Sidebar - Kategoriyalar */}
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                            <h3 className="font-bold text-brand-dark mb-4 flex items-center gap-2">
                                <SlidersHorizontal className="w-5 h-5" />
                                Kategoriyalar
                            </h3>
                            <div className="space-y-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => handleCategoryChange(cat.id)}
                                        className={`w-full text-left px-4 py-2.5 rounded-lg transition ${selectedCategory === cat.id
                                            ? 'bg-brand-green text-white font-medium'
                                            : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Mobile Filter Button & Sort */}
                        <div className="flex items-center justify-between mb-6">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm"
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                                Filtrlar
                            </button>

                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none"
                            >
                                {sortOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Mobile Filters */}
                        {showFilters && (
                            <div className="lg:hidden mb-6 bg-white rounded-xl shadow-sm p-6">
                                <h3 className="font-bold text-brand-dark mb-4">Kategoriyalar</h3>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => {
                                                handleCategoryChange(cat.id);
                                                setShowFilters(false);
                                            }}
                                            className={`px-4 py-2 rounded-lg transition ${selectedCategory === cat.id
                                                ? 'bg-brand-green text-white'
                                                : 'bg-gray-100 text-gray-700'
                                                }`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Results Count */}
                        <div className="mb-6 text-sm text-gray-600">
                            {pagination.total} ta mahsulot topildi
                        </div>

                        {/* Products Grid */}
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-xl h-96 animate-pulse"></div>
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-20">
                                <p className="text-gray-500 text-lg">Hech narsa topilmadi</p>
                                <button
                                    onClick={() => {
                                        setSelectedCategory('all');
                                        setSearchQuery('');
                                    }}
                                    className="mt-4 text-brand-green font-semibold hover:underline"
                                >
                                    Filtrlarni tozalash
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map(product => (
                                    <Link
                                        key={product._id}
                                        to={`/product/${product.slug}`}
                                        className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition relative"
                                    >
                                        {/* WISHLIST TUGMASI */}
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                toggleWishlist(product._id);
                                            }}
                                            className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-md hover:scale-110 transition z-10"
                                            title={isInWishlist(product._id) ? "Sevimlilardan o'chirish" : "Sevimlilarga qo'shish"}
                                        >
                                            <Heart
                                                className={`w-4 h-4 transition ${isInWishlist(product._id)
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
                                                <span className="absolute top-3 left-3 bg-brand-accent text-white text-xs font-bold px-2 py-1 rounded">
                                                    -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                                                </span>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <span className="text-xs text-gray-500">{product.category}</span>
                                            <h3 className="font-semibold text-brand-dark mt-1 line-clamp-2 group-hover:text-brand-green transition">
                                                {product.name_uz}
                                            </h3>
                                            <div className="mt-3 flex items-baseline gap-2">
                                                <span className="text-lg font-bold text-brand-green">
                                                    {formatPrice(product.price)} so'm
                                                </span>
                                                {product.oldPrice && (
                                                    <span className="text-sm text-gray-400 line-through">
                                                        {formatPrice(product.oldPrice)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {pagination.pages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-12">
                                <button
                                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                    disabled={pagination.page === 1}
                                    className="p-2 bg-white rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>

                                {[...Array(pagination.pages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setPagination(prev => ({ ...prev, page: i + 1 }))}
                                        className={`w-10 h-10 rounded-lg font-medium transition ${pagination.page === i + 1
                                            ? 'bg-brand-green text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                    disabled={pagination.page === pagination.pages}
                                    className="p-2 bg-white rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}