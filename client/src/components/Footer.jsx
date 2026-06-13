import { Link } from 'react-router-dom';
// import { MapPin, Phone, Mail, Instagram, Send} from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-brand-dark text-white">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* Brand Info */}
                    <div>
                        <h3 className="text-2xl font-bold text-brand-green mb-4">PIKNIC_UZ</h3>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            O'zbekistondagi eng yirik outdoor va camping anjomlari do'koni. Tabiat quchog'ida premium sifatni his qiling.
                        </p>
                        <div className="flex space-x-3">
                            <a href="https://instagram.com/piknic_uz" target="_blank" rel="noopener noreferrer"
                                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-brand-green transition">
                                {/* <Instagram className="w-5 h-5" /> */}
                            </a>
                            <a href="https://t.me/piknic_uz" target="_blank" rel="noopener noreferrer"
                                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-brand-green transition">
                                {/* <Send className="w-5 h-5" /> */}
                            </a>
                            <a href="#" target="_blank" rel="noopener noreferrer"
                                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-brand-green transition">
                                
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Tezkor linklar</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/shop" className="text-gray-400 hover:text-brand-green transition">
                                    Katalog
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-gray-400 hover:text-brand-green transition">
                                    Biz haqimizda
                                </Link>
                            </li>
                            <li>
                                <Link to="/delivery" className="text-gray-400 hover:text-brand-green transition">
                                    Yetkazib berish
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-gray-400 hover:text-brand-green transition">
                                    Kontakt
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Kategoriyalar</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/shop?category=Palatkalar" className="text-gray-400 hover:text-brand-green transition">
                                    Palatkalar
                                </Link>
                            </li>
                            <li>
                                <Link to="/shop?category=Mebel" className="text-gray-400 hover:text-brand-green transition">
                                    Turistik mebel
                                </Link>
                            </li>
                            <li>
                                <Link to="/shop?category=Idish-tovoq" className="text-gray-400 hover:text-brand-green transition">
                                    Idish-tovoq
                                </Link>
                            </li>
                            <li>
                                <Link to="/shop?category=Kiyimlar" className="text-gray-400 hover:text-brand-green transition">
                                    Outdoor kiyimlar
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Kontakt</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                {/* <MapPin className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" /> */}
                                <span className="text-gray-400">Toshkent sh., Chilonzor tumani</span>
                            </li>
                            <li className="flex items-center gap-3">
                                {/* <Phone className="w-5 h-5 text-brand-green flex-shrink-0" /> */}
                                <a href="tel:+998901234567" className="text-gray-400 hover:text-brand-green transition">
                                    +998 90 123 45 67
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                {/* <Mail className="w-5 h-5 text-brand-green flex-shrink-0" /> */}
                                <a href="mailto:info@piknic.uz" className="text-gray-400 hover:text-brand-green transition">
                                    info@piknic.uz
                                </a>
                            </li>
                        </ul>

                        {/* Payment Methods */}
                        <div className="mt-6">
                            <h5 className="text-sm font-semibold mb-3 text-gray-300">To'lov usullari:</h5>
                            <div className="flex gap-2">
                                <div className="px-3 py-1.5 bg-white/10 rounded text-xs font-medium">Payme</div>
                                <div className="px-3 py-1.5 bg-white/10 rounded text-xs font-medium">Click</div>
                                <div className="px-3 py-1.5 bg-white/10 rounded text-xs font-medium">Uzum</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-400 text-sm">
                            © {currentYear} PIKNIC_UZ. Barcha huquqlar himoyalangan.
                        </p>
                        <div className="flex gap-6 text-sm">
                            <a href="#" className="text-gray-400 hover:text-brand-green transition">
                                Maxfiylik siyosati
                            </a>
                            <a href="#" className="text-gray-400 hover:text-brand-green transition">
                                Foydalanish shartlari
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}