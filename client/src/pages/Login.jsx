import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/login', formData);

            if (data.success) {
                // Foydalanuvchi ma'lumotlarini saqlash
                localStorage.setItem('piknic_user', JSON.stringify(data.user));
                localStorage.setItem('piknic_token', data.token);

                // Hamma foydalanuvchilar (admin ham) bosh sahifaga yo'naltiriladi
                navigate('/');
                window.location.reload();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Kirishda xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-sand">
            <Navbar />
            <div className="flex items-center justify-center px-4 py-12">
                <div className="max-w-md w-full">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-brand-green mb-2">PIKNIC_UZ</h1>
                        <p className="text-gray-600">Hisobingizga kiring</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email manzil
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition"
                                        placeholder="email@example.com yoki telefon"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Parol
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg pl-10 pr-12 py-3 focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-brand-green text-white font-bold py-3.5 rounded-lg hover:bg-brand-green/90 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Tekshirilmoqda...
                                    </>
                                ) : (
                                    'Kirish'
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                Hisobingiz yo'qmi?{' '}
                                <Link to="/register" className="text-brand-green font-semibold hover:underline">
                                    Ro'yxatdan o'tish
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}