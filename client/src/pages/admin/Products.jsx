import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Plus, Trash2, Edit, Package } from 'lucide-react';
import ProductModal from '../../components/admin/ProductModal';
import { motion } from 'framer-motion';

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const token = localStorage.getItem('piknic_admin_token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/api/admin/products', config);
            setProducts(data);
        } catch (error) {
            console.error("Mahsulotlarni yuklashda xatolik", error);
            alert("Mahsulotlarni yuklashda xatolik");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product) => {
        setEditProduct(product);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Rostdan ham bu mahsulotni o'chirmoqchimisiz?")) return;

        setDeletingId(id);
        try {
            await api.delete(`/api/admin/products/${id}`, config);
            setProducts(products.filter(p => p._id !== id));
            alert("✅ Mahsulot o'chirildi");
        } catch (error) {
            console.error('O\'chirishda xatolik:', error);
            alert("❌ O'chirishda xatolik yuz berdi");
        } finally {
            setDeletingId(null);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditProduct(null);
    };

    const formatPrice = (price) => new Intl.NumberFormat('uz-UZ').format(price);

    return (
        <div>
            {/* Header - RESPONSIVE */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-brand-dark flex items-center gap-2">
                        <Package className="w-6 h-6 md:w-7 md:h-7 text-brand-green" />
                        Mahsulotlar
                    </h2>
                    <p className="text-xs md:text-sm text-gray-500 mt-1">Jami: {products.length} ta mahsulot</p>
                </div>
                <button
                    onClick={() => {
                        setEditProduct(null);
                        setIsModalOpen(true);
                    }}
                    className="w-full sm:w-auto bg-brand-green text-white px-4 md:px-5 py-2.5 rounded-xl font-semibold hover:bg-brand-green/90 transition flex items-center justify-center gap-2 shadow-sm text-sm md:text-base"
                >
                    <Plus className="w-4 h-4 md:w-5 md:h-5" />
                    Yangi mahsulot qo'shish
                </button>
            </div>

            {loading ? (
                /* Loading - RESPONSIVE */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl h-64 animate-pulse"></div>
                    ))}
                </div>
            ) : products.length === 0 ? (
                /* Empty State - RESPONSIVE */
                <div className="bg-white rounded-2xl p-6 md:p-12 text-center">
                    <Package className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg md:text-xl font-semibold text-brand-dark mb-2">Mahsulotlar yo'q</h3>
                    <p className="text-sm md:text-base text-gray-500 mb-6">Birinchi mahsulotingizni qo'shing</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-brand-green text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-semibold hover:bg-brand-green/90 transition inline-flex items-center gap-2 text-sm md:text-base"
                    >
                        <Plus className="w-4 h-4 md:w-5 md:h-5" />
                        Mahsulot qo'shish
                    </button>
                </div>
            ) : (
                <>
                    {/* Desktop Jadval - faqat md va undan katta ekranlarda */}
                    <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Rasm</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Nomi</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Kategoriya</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Narxi</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Ombor</th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Amallar</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {products.map((product) => (
                                        <tr key={product._id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4">
                                                <div className="relative">
                                                    <img
                                                        src={product.image}
                                                        alt={product.name_uz}
                                                        className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                                                    />
                                                    {/* Rasmlar soni badge */}
                                                    {product.images && product.images.length > 1 && (
                                                        <motion.span
                                                            className="absolute -top-2 -right-2 bg-brand-green text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-md"
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                        >
                                                            {product.images.length}
                                                        </motion.span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-brand-dark">{product.name_uz}</div>
                                                <div className="text-xs text-gray-500 mt-0.5">{product.name_ru}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="bg-brand-sand text-brand-dark text-xs font-medium px-2.5 py-1 rounded-md whitespace-nowrap">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-brand-green whitespace-nowrap">{formatPrice(product.price)} so'm</div>
                                                {product.oldPrice && (
                                                    <div className="text-xs text-gray-400 line-through whitespace-nowrap">{formatPrice(product.oldPrice)}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-sm font-medium whitespace-nowrap ${product.stock < 5 ? 'text-red-600' : 'text-gray-700'}`}>
                                                    {product.stock} dona
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(product)}
                                                        disabled={deletingId === product._id}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition disabled:opacity-50"
                                                        title="Tahrirlash"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product._id)}
                                                        disabled={deletingId === product._id}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                                                        title="O'chirish"
                                                    >
                                                        {deletingId === product._id ? (
                                                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                                        ) : (
                                                            <Trash2 className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile Kartalar - faqat mobil ekranlarda */}
                    <div className="md:hidden space-y-3">
                        {products.map((product) => (
                            <div key={product._id} className="bg-white rounded-xl shadow-sm p-4">
                                <div className="relative flex-shrink-0">
                                    <img
                                        src={product.image}
                                        alt={product.name_uz}
                                        className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                                    />
                                    {product.images && product.images.length > 1 && (
                                        <span className="absolute -top-2 -right-2 bg-brand-green text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                                            {product.images.length}
                                        </span>
                                    )}
                                </div>

                                {/* Amallar tugmalari */}
                                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                                    <button
                                        onClick={() => handleEdit(product)}
                                        disabled={deletingId === product._id}
                                        className="flex-1 py-2 text-blue-600 bg-blue-50 rounded-lg font-medium text-sm hover:bg-blue-100 transition disabled:opacity-50 flex items-center justify-center gap-1"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Tahrirlash
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product._id)}
                                        disabled={deletingId === product._id}
                                        className="flex-1 py-2 text-red-600 bg-red-50 rounded-lg font-medium text-sm hover:bg-red-100 transition disabled:opacity-50 flex items-center justify-center gap-1"
                                    >
                                        {deletingId === product._id ? (
                                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <Trash2 className="w-4 h-4" />
                                                O'chirish
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Modal */}
            <ProductModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSuccess={fetchProducts}
                editProduct={editProduct}
            />
        </div>
    );
}