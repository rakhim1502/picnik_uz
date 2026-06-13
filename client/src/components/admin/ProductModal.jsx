import { useState, useMemo, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import axios from 'axios';
import ImageUpload from './ImageUpload';

export default function ProductModal({ isOpen, onClose, onSuccess, editProduct }) {
    const [loading, setLoading] = useState(false);
    const [imageError, setImageError] = useState('');

    const isEditMode = useMemo(() => !!editProduct, [editProduct]);

    const initialFormData = useMemo(() => {
        if (editProduct) {
            return {
                name_uz: editProduct.name_uz || '',
                name_ru: editProduct.name_ru || '',
                category: editProduct.category || 'Palatkalar',
                price: editProduct.price || '',
                oldPrice: editProduct.oldPrice || '',
                stock: editProduct.stock || '',
                image: editProduct.image || '',
                description: editProduct.description || ''
            };
        }
        return {
            name_uz: '', name_ru: '', category: 'Palatkalar', price: '',
            oldPrice: '', stock: '', image: '', description: ''
        };
    }, [editProduct]);

    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        if (isOpen) {
            setFormData(initialFormData);
            setImageError('');
        }
    }, [isOpen, initialFormData]);

    const categories = ["Palatkalar", "Mebel", "Idish-tovoq", "Kiyimlar", "Aksessuarlar"];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (url) => {
        setFormData(prev => ({ ...prev, image: url }));
        if (url) setImageError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.image) {
            setImageError('Rasm majburiy');
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('piknic_admin_token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const slug = formData.name_uz.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

            const payload = {
                ...formData,
                slug,
                price: Number(formData.price),
                oldPrice: formData.oldPrice ? Number(formData.oldPrice) : null,
                stock: Number(formData.stock) || 0
            };

            if (isEditMode && editProduct) {
                await axios.put(`http://localhost:5000/api/admin/products/${editProduct._id}`, payload, config);
            } else {
                await axios.post('http://localhost:5000/api/admin/products', payload, config);
            }

            onSuccess();
            onClose();
        } catch (error) {
            console.error('Xatolik:', error);
            alert(isEditMode ? "Mahsulotni yangilashda xatolik!" : "Mahsulotni qo'shishda xatolik!");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-4 md:pt-10 sm:pt-20 px-2 md:px-4 overflow-y-auto bg-black/50 backdrop-blur-sm">
            <div className="relative bg-white rounded-xl md:rounded-2xl shadow-2xl w-full max-w-3xl my-4 md:my-8 overflow-hidden">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b px-4 md:px-6 py-3 md:py-4 flex justify-between items-center z-10">
                    <div className="min-w-0 flex-1">
                        <h3 className="text-lg md:text-xl font-bold text-brand-dark">
                            {isEditMode ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot qo\'shish'}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-500 mt-0.5 hidden sm:block">
                            {isEditMode ? 'Mahsulot ma\'lumotlarini o\'zgartiring' : 'Yangi mahsulot qo\'shing'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition flex-shrink-0">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 md:space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
                    {/* Rasm Yuklash */}
                    <ImageUpload value={formData.image} onChange={handleImageChange} error={imageError} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="space-y-1">
                            <label className="text-xs md:text-sm font-semibold text-gray-700">Nomi (O'zbekcha) *</label>
                            <input required name="name_uz" value={formData.name_uz} onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition"
                                placeholder="Masalan: Naturehike Palatkasi" />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs md:text-sm font-semibold text-gray-700">Nomi (Ruscha) *</label>
                            <input required name="name_ru" value={formData.name_ru} onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition"
                                placeholder="Например: Палатка Naturehike" />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs md:text-sm font-semibold text-gray-700">Kategoriya *</label>
                            <select name="category" value={formData.category} onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition bg-white">
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs md:text-sm font-semibold text-gray-700">Joriy narx (so'm) *</label>
                            <input required type="number" name="price" value={formData.price} onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition"
                                placeholder="1250000" min="0" />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs md:text-sm font-semibold text-gray-700">Eski narx (so'm) <span className="text-gray-400 font-normal">(ixtiyoriy)</span></label>
                            <input type="number" name="oldPrice" value={formData.oldPrice} onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition"
                                placeholder="1450000" min="0" />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs md:text-sm font-semibold text-gray-700">Ombordagi qoldiq (dona) *</label>
                            <input required type="number" name="stock" value={formData.stock} onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition"
                                placeholder="10" min="0" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs md:text-sm font-semibold text-gray-700">Mahsulot haqida to'liq ma'lumot</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows="4"
                            className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition resize-none"
                            placeholder="Mahsulotning o'lchami, materiali, afzalliklari..."></textarea>
                    </div>

                    {/* Tugmalar */}
                    <div className="flex flex-col sm:flex-row justify-end gap-2 md:gap-3 pt-4 border-t sticky bottom-0 bg-white">
                        <button type="button" onClick={onClose} disabled={loading}
                            className="order-2 sm:order-1 px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition disabled:opacity-50 text-sm md:text-base">
                            Bekor qilish
                        </button>
                        <button type="submit" disabled={loading}
                            className="order-1 sm:order-2 px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-semibold text-white bg-brand-green hover:bg-brand-green/90 transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-sm md:text-base">
                            {loading ? (
                                <><Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" /> Saqlanmoqda...</>
                            ) : (
                                <>{isEditMode ? 'Yangilash' : 'Saqlash'}</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}