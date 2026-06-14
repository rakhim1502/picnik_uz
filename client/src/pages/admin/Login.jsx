import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import api from '../../utils/api';

export default function AdminLogin() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [storageAvailable, setStorageAvailable] = useState(true);
    const navigate = useNavigate();

    // LocalStorage mavjudligini tekshirish
    useEffect(() => {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            setStorageAvailable(true);
        } catch (e) {
            console.error('LocalStorage ishlamayapti:', e);
            setStorageAvailable(false);
            setError('Brauzer xotirasi ishlamayapti. Iltimos, boshqa brauzer ishlatib ko\'ring.');
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            console.log('📤 Login request:', formData.email);

            const { data } = await api.post('/api/auth/login', formData);

            console.log('📥 Login response:', data);

            if (data.success) {
                if (data.user.isAdmin) {
                    console.log('✅ Admin login successful');

                    // Token va user ni saqlash
                    try {
                        localStorage.setItem('piknic_admin_token', data.token);
                        localStorage.setItem('piknic_admin_user', JSON.stringify(data.user));

                        // Tekshirish
                        const savedToken = localStorage.getItem('piknic_admin_token');
                        console.log(' Token saved:', savedToken ? 'Yes' : 'No');

                        if (!savedToken) {
                            throw new Error('Token saqlanmadi');
                        }

                        // Admin panelga yo'naltirish
                        navigate('/admin');
                    } catch (storageError) {
                        console.error('Storage error:', storageError);
                        setError('Ma\'lumotlarni saqlab bo\'lmadi. Iltimos, brauzer sozlamalarini tekshiring.');
                    }
                } else {
                    console.log('❌ User is not admin');
                    setError('Siz admin emassiz. Oddiy foydalanuvchi sifatida kiring.');
                }
            } else {
                console.log(' Login failed:', data.message);
                setError(data.message || 'Kirishda xatolik yuz berdi');
            }
        } catch (err) {
            console.error('❌ Login error:', err);

            if (err.response) {
                setError(err.response.data?.message || 'Email yoki parol noto\'g\'ri');
            } else if (err.request) {
                setError('Server javob bermadi. Internet aloqasini tekshiring.');
            } else {
                setError('Kirishda xatolik yuz berdi. Qayta urinib ko\'ring.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-sand flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-brand-green mb-2">PIKNIC_UZ</h1>
                    <p className="text-gray-600">Admin panelga kirish</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <div>{error}</div>
                        </div>
                    )}

                    {!storageAvailable && (
                        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg text-sm">
                            ⚠️ Brauzer xotirasi ishlamayapti. Iltimos, Chrome yoki Safari brauzerini ishlatib ko'ring.
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
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition"
                                    placeholder="admin@piknic.uz"
                                    required
                                    autoComplete="email"
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
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition"
                                    placeholder="••••••••"
                                    required
                                    autoComplete="current-password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !storageAvailable}
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

                    

                    <div className="mt-4 text-center">
                        <button
                            onClick={() => navigate('/')}
                            className="text-sm text-brand-green hover:underline"
                        >
                            ← Bosh sahifaga qaytish
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}