import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Award, Heart, Target } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function About() {
    const stats = [
        { number: '136K+', label: 'Instagram obunachilar' },
        { number: '5000+', label: 'Mamnun mijozlar' },
        { number: '500+', label: 'Mahsulot turlari' },
        { number: '14', label: 'Kunlik kafolat' }
    ];

    const values = [
        {
            icon: ShieldCheck,
            title: '100% Original',
            description: 'Barcha mahsulotlar rasmiy distribyutorlardan olinadi va kafolatga ega.'
        },
        {
            icon: Truck,
            title: 'Tez yetkazib berish',
            description: 'Toshkent bo\'ylab 24 soat, viloyatlarga 2-3 kun ichida yetkazamiz.'
        },
        {
            icon: Award,
            title: 'Premium sifat',
            description: 'Faqat sinovdan o\'tgan, xalqaro brendlarning mahsulotlarini sotamiz.'
        },
        {
            icon: Heart,
            title: 'Mijozlarga g\'amxo\'rlik',
            description: 'Sotuvdan keyingi xizmat va maslahatlarimiz doimiy ravishda.'
        }
    ];

    return (
        <div className="min-h-screen bg-brand-sand">
            <Navbar />

            {/* Hero Section */}
            <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=2000"
                        alt="About PIKNIC_UZ"
                        className="w-full h-full object-cover brightness-50"
                    />
                </div>
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                        Biz haqimizda
                    </h1>
                    <p className="text-xl text-white/90">
                        O'zbekistonning eng ishonchli outdoor brendi
                    </p>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-16 px-4 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-brand-dark mb-6">
                            Bizning tariximiz
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            <strong>PIKNIC_UZ</strong> 2020-yilda tashkil etilgan bo'lib, O'zbekistonda outdoor va camping madaniyatini rivojlantirish maqsadida faoliyat yuritadi. Bizning asosiy maqsadimiz — har bir oila va sayohatchiga tabiat quchog'ida qulay va xavfsiz dam olish imkoniyatini yaratish.
                        </p>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Bugungi kunda biz 136,000+ Instagram obunachilarga ega bo'lib, O'zbekiston bo'ylab minglab mamnun mijozlarga xizmat ko'rsatmoqdamiz. Bizning mahsulotlarimiz orasida palatkalar, turistik mebel, idish-tovoq, outdoor kiyimlar va aksessuarlar mavjud.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            Biz faqat original va sifatli mahsulotlarni taklif qilamiz, chunki bizning mijozlarimizning xavfsizligi va qulayligi biz uchun birinchi o'rinda turadi.
                        </p>
                    </div>
                    <div className="relative">
                        <img
                            src="https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=800"
                            alt="Our team"
                            className="rounded-2xl shadow-xl"
                        />
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="text-center">
                                <div className="text-4xl md:text-5xl font-bold text-brand-green mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-gray-600">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 px-4 max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-brand-dark mb-4">
                        Nima uchun aynan PIKNIC_UZ?
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Bizning qadriyatlarimiz va mijozlarimizga bo'lgan munosabatimiz
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {values.map((value, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition">
                            <div className="w-14 h-14 bg-brand-green/10 rounded-xl flex items-center justify-center mb-4">
                                <value.icon className="w-7 h-7 text-brand-green" />
                            </div>
                            <h3 className="text-xl font-bold text-brand-dark mb-2">
                                {value.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {value.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 bg-brand-green text-white">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <Target className="w-16 h-16 mx-auto mb-6 opacity-80" />
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Bizning missiyamiz
                    </h2>
                    <p className="text-xl max-w-3xl mx-auto leading-relaxed opacity-90">
                        Har bir O'zbekiston oilasiga tabiat bilan yaqinlashish, sog'lom turmush tarzini targ'ib qilish va unutilmas sarguzashtlarni yaratish imkoniyatini taqdim etish.
                    </p>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4 max-w-7xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-brand-dark mb-4">
                    Bizning mahsulotlarni ko'ring
                </h2>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                    500+ turli xil outdoor anjomlari orasidan o'zingizga mosini tanlang
                </p>
                <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 bg-brand-green text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-green/90 transition"
                >
                    Katalogga o'tish
                </Link>
            </section>

            <Footer />
        </div>
    );
}