import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-brand-sand flex items-center justify-center px-4">
            <div className="text-center max-w-2xl">
                {/* Katta 404 raqami */}
                <div className="relative mb-8">
                    <h1 className="text-9xl font-bold text-brand-green/20">404</h1>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Search className="w-24 h-24 text-brand-green" />
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-brand-dark mb-4">
                    Sahifa topilmadi
                </h2>

                <p className="text-gray-600 mb-8 text-lg">
                    Uzr, siz qidirgan sahifa mavjud emas yoki ko'chirilgan.
                    Balki qidiruv yordam beradi?
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 bg-brand-green text-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-green/90 transition"
                    >
                        <Home className="w-5 h-5" />
                        Bosh sahifa
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center justify-center gap-2 bg-white text-brand-dark border-2 border-brand-green px-8 py-3 rounded-lg font-semibold hover:bg-brand-green/5 transition"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Orqaga qaytish
                    </button>
                </div>

                {/* Qidiruv */}
                <div className="mt-12 pt-12 border-t border-gray-300">
                    <p className="text-sm text-gray-500 mb-4">Yoki qidiring:</p>
                    <div className="max-w-md mx-auto">
                        <input
                            type="text"
                            placeholder="Mahsulot qidirish..."
                            className="w-full px-6 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    window.location.href = `/shop?search=${e.target.value}`;
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}