import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';

export default function ImageUpload({ value, onChange, error }) {
    const [preview, setPreview] = useState(value || null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Fayl turini tekshirish
        if (!file.type.startsWith('image/')) {
            alert('Faqat rasm fayllari yuklash mumkin');
            return;
        }

        // Fayl hajmini tekshirish (5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Rasm hajmi 5MB dan oshmasligi kerak');
            return;
        }

        // Preview ko'rsatish
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result;
            setPreview(base64);
            onChange(base64);
        };
        reader.readAsDataURL(file);
    };

    const handleRemove = () => {
        setPreview(null);
        onChange('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
                Mahsulot rasmi *
                {error && <span className="text-red-500 ml-1">({error})</span>}
            </label>

            {!preview ? (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-brand-green hover:bg-brand-green/5 transition"
                >
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center">
                            <Upload className="w-8 h-8 text-brand-green" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700">Rasm yuklash uchun bosing</p>
                            <p className="text-xs text-gray-500 mt-1">JPEG, PNG, WEBP (max 5MB)</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="relative group">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition rounded-lg flex items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition"
                        >
                            O'zgartirish
                        </button>
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    );
}