import { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Download, Loader2, Calendar, Filter } from 'lucide-react';

export default function ExportButton({ type = 'orders' }) {
    const [loading, setLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        status: 'all'
    });

    const handleExport = async () => {
        setLoading(true);

        try {
            const token = localStorage.getItem('piknic_admin_token');

            // Query paramslar
            const params = new URLSearchParams();
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);
            if (filters.status !== 'all') params.append('status', filters.status);

            const { data } = await axios.get(
                `http://localhost:5000/api/admin/export/${type}?${params}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (data.success && data.data.length > 0) {
                // Excel fayl yaratish
                const worksheet = XLSX.utils.json_to_sheet(data.data);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, type === 'orders' ? 'Buyurtmalar' : 'Mahsulotlar');

                // Ustunlar kengligini sozlash
                const colWidths = Object.keys(data.data[0]).map(key => ({
                    wch: Math.max(key.length, 20)
                }));
                worksheet['!cols'] = colWidths;

                // Faylni yuklab olish
                const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
                const blob = new Blob([excelBuffer], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                });

                const fileName = `PIKNIC_UZ_${type}_${new Date().toISOString().split('T')[0]}.xlsx`;
                saveAs(blob, fileName);

                alert(`✅ ${data.count} ta ${type === 'orders' ? 'buyurtma' : 'mahsulot'} eksport qilindi!`);
            } else {
                alert('⚠️ Eksport qilish uchun ma\'lumot topilmadi');
            }
        } catch (error) {
            console.error('Eksport xatosi:', error);
            alert('❌ Eksport qilishda xatolik yuz berdi');
        } finally {
            setLoading(false);
            setShowFilters(false);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowFilters(!showFilters)}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
                {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Download className="w-4 h-4" />
                )}
                <span className="font-medium">
                    {loading ? 'Yuklanmoqda...' : 'Excel eksport'}
                </span>
            </button>

            {/* Filter Dropdown */}
            {showFilters && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-50">
                    <h4 className="font-semibold text-brand-dark mb-4 flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        Filtrlar
                    </h4>

                    {type === 'orders' && (
                        <div className="space-y-3">
                            {/* Sana filtri */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Boshlanish sanasi
                                </label>
                                <input
                                    type="date"
                                    value={filters.startDate}
                                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-green outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tugash sanasi
                                </label>
                                <input
                                    type="date"
                                    value={filters.endDate}
                                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-green outline-none"
                                />
                            </div>

                            {/* Status filtri */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Holati
                                </label>
                                <select
                                    value={filters.status}
                                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-green outline-none"
                                >
                                    <option value="all">Barchasi</option>
                                    <option value="Jarayonda">Jarayonda</option>
                                    <option value="Tayyorlanmoqda">Tayyorlanmoqda</option>
                                    <option value="Yo'lga chiqdi">Yo'lga chiqdi</option>
                                    <option value="Yetkazildi">Yetkazildi</option>
                                    <option value="Bekor qilindi">Bekor qilindi</option>
                                </select>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-2 mt-4 pt-4 border-t">
                        <button
                            onClick={() => {
                                setFilters({ startDate: '', endDate: '', status: 'all' });
                                setShowFilters(false);
                            }}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                        >
                            Tozalash
                        </button>
                        <button
                            onClick={handleExport}
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-brand-green/90 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Eksport
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}   