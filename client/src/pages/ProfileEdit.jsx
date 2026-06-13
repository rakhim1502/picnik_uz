import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Phone, Save, X, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function ProfileEdit() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState(() => {
        const user = JSON.parse(localStorage.getItem('piknic_user') || 'null');
        return {
            name: user?.name || '',
            email: user?.email || '',
            phone: '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        };
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('piknic_user') || 'null');
        if (!user) {
            navigate('/login');
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const token = localStorage.getItem('piknic_token');

            // Parolni o'zgartirish tekshiruvi
            if (formData.newPassword) {
                if (formData.newPassword !== formData.confirmPassword) {
                    throw new Error('Yangi parollar mos kelmadi');
                }
                if (formData.newPassword.length < 6) {
                    throw new Error('Parol kamida 6 ta belgidan iborat bo\'lishi kerak');
                }
                if (!formData.currentPassword) {
                    throw new Error('Joriy parolni kiriting');
                }
            }

            const updateData = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone
            };

            if (formData.newPassword) {
                updateData.currentPassword = formData.currentPassword;
                updateData.newPassword = formData.newPassword;
            }

            const { data } = await axios.put('http://localhost:5000/api/users/profile', updateData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Yangilangan ma'lumotlarni saqlash
            const updatedUser = { ...JSON.parse(localStorage.getItem('piknic_user')), ...data.user };
            localStorage.setItem('piknic_user', JSON.stringify(updatedUser));

            setSuccess('Profil muvaffaqiyatli yangilandi!');
            setTimeout(() => navigate('/profile'), 1500);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-sand">
            <Navbar />

            <div className="max-w-3xl mx-auto px-4 py-12">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h1 className="text-3xl font-bold text-brand-dark mb-2">Profilni tahrirlash</h1>
                    <p className="text-gray-600 mb-8">Shaxsiy ma'lumotlaringizni yangilang</p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Asosiy ma'lumotlar */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-brand-dark border-b pb-2">
                                Asosiy ma'lumotlar
                            </h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <User className="w-4 h-4 inline mr-1" />
                                    To'liq ism
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-green outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Mail className="w-4 h-4 inline mr-1" />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-green outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Phone className="w-4 h-4 inline mr-1" />
                                    Telefon raqam
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-green outline-none"
                                    placeholder="+998 90 123 45 67"
                                />
                            </div>
                        </div>

                        {/* Parolni o'zgartirish */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-brand-dark border-b pb-2">
                                Parolni o'zgartirish <span className="text-sm font-normal text-gray-500">(ixtiyoriy)</span>
                            </h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Joriy parol
                                </label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-green outline-none"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Yangi parol
                                </label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-green outline-none"
                                    placeholder="Kamida 6 ta belgi"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Yangi parolni tasdiqlang
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-green outline-none"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* Tugmalar */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-brand-green text-white font-bold py-3.5 rounded-lg hover:bg-brand-green/90 transition flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Saqlanmoqda...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        Saqlash
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate('/profile')}
                                className="px-6 py-3.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
                            >
                                <X className="w-5 h-5" />
                                Bekor qilish
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}