import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, Mail, Loader2 } from 'lucide-react';

export default function AdminLogin() {
    const [email, setEmail] = useState('admin@piknic.uz');
    const [password, setPassword] = useState('admin123');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            console.log('Admin login yuborilmoqda:', { email });
            const { data } = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password
            });

            console.log('Admin login javobi:', data);

            if (data.success) {
                // Token va foydalanuvchi ma'lumotlarini saqlash
                localStorage.setItem('piknic_admin_token', data.token);
                localStorage.setItem('piknic_admin_user', JSON.stringify(data.user));

                console.log('Admin token saqlandi:', data.token);
                console.log('Admin user:', data.user);

                // Dashboard ga yo'naltirish
                setTimeout(() => {
                    navigate('/admin');
                }, 100);
            } else {
                setError("Login muvaffaqiyatsiz");
            }
        } catch (err) {
            console.error('Admin login xatosi:', err);
            console.error('Response:', err.response);
            setError(err.response?.data?.message || "Kirishda xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-sand px-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-brand-green mb-2">PIKNIC_UZ</h1>
                    <p className="text-gray-600">Admin panelga kirish</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email manzil
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                // value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition"
                                placeholder="admin@piknic.uz"
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
                                type="password"
                                // value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition"
                                placeholder="••••••••"
                                required
                            />
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

                
            </div>
        </div>
    );
}