import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, GripVertical, Plus, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';

export default function ImageGallery({ value = [], onChange, maxImages = 5 }) {
    const [dragActive, setDragActive] = useState(false);
    const [previewImages, setPreviewImages] = useState(value || []);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    // Rasm qo'shish
    const handleFiles = (files) => {
        setError('');
        const fileArray = Array.from(files);

        // Validatsiya
        if (previewImages.length + fileArray.length > maxImages) {
            setError(`Maksimum ${maxImages} ta rasm yuklash mumkin`);
            return;
        }

        const newPreviews = [];
        let processedCount = 0;

        fileArray.forEach((file) => {
            // Fayl turi tekshiruvi
            if (!file.type.startsWith('image/')) {
                setError('Faqat rasm fayllari yuklash mumkin');
                return;
            }

            // Fayl hajmi (5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError(`Rasm hajmi 5MB dan oshmasligi kerak: ${file.name}`);
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                newPreviews.push({
                    id: Date.now() + Math.random(),
                    url: reader.result,
                    name: file.name,
                    file: file
                });
                processedCount++;

                if (processedCount === fileArray.length) {
                    const updated = [...previewImages, ...newPreviews];
                    setPreviewImages(updated);
                    onChange(updated.map(img => img.url));
                }
            };
            reader.readAsDataURL(file);
        });
    };

    // Drag & Drop
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    // Rasm o'chirish
    const removeImage = (id) => {
        const updated = previewImages.filter(img => img.id !== id);
        setPreviewImages(updated);
        onChange(updated.map(img => img.url));
    };

    // Tartibni o'zgartirish
    const handleReorder = (newOrder) => {
        setPreviewImages(newOrder);
        onChange(newOrder.map(img => img.url));
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700">
                    Mahsulot rasmlari * (Maksimum {maxImages} ta)
                </label>
                <span className="text-xs text-gray-500">
                    {previewImages.length} / {maxImages}
                </span>
            </div>

            {/* Error */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm"
                    >
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Upload Area */}
            {previewImages.length < maxImages && (
                <motion.div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${dragActive
                            ? 'border-brand-green bg-brand-green/5 scale-[1.02]'
                            : 'border-gray-300 hover:border-brand-green hover:bg-brand-green/5'
                        }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                >
                    <motion.div
                        animate={dragActive ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 1, repeat: Infinity }}
                    >
                        <Upload className={`w-10 h-10 mx-auto mb-3 ${dragActive ? 'text-brand-green' : 'text-gray-400'}`} />
                    </motion.div>
                    <p className="text-sm font-medium text-gray-700">
                        Rasmlarni bu yerga tashlang yoki <span className="text-brand-green font-semibold">tanlang</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        JPEG, PNG, WEBP (har biri max 5MB)
                    </p>
                </motion.div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFiles(e.target.files)}
                className="hidden"
            />

            {/* Images Grid with Reorder */}
            {previewImages.length > 0 && (
                <div className="space-y-3">
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                        <GripVertical className="w-3 h-3" />
                        Rasmlarni sudrab tartibini o'zgartiring
                    </p>

                    <Reorder.Group
                        axis="y"
                        values={previewImages}
                        onReorder={handleReorder}
                        className="space-y-2"
                    >
                        <AnimatePresence>
                            {previewImages.map((image, index) => (
                                <Reorder.Item
                                    key={image.id}
                                    value={image}
                                    className="bg-white rounded-lg border border-gray-200 p-3 flex items-center gap-3 cursor-grab active:cursor-grabbing"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    whileDrag={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                                >
                                    {/* Drag Handle */}
                                    <GripVertical className="w-5 h-5 text-gray-400 flex-shrink-0" />

                                    {/* Preview */}
                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                        <img
                                            src={image.url}
                                            alt={image.name}
                                            className="w-full h-full object-cover"
                                        />
                                        {index === 0 && (
                                            <div className="absolute top-0 left-0 bg-brand-green text-white text-[10px] font-bold px-1.5 py-0.5">
                                                Asosiy
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {image.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {index === 0 ? 'Asosiy rasm' : `${index + 1}-rasm`}
                                        </p>
                                    </div>

                                    {/* Remove Button */}
                                    <motion.button
                                        onClick={() => removeImage(image.id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition flex-shrink-0"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <X className="w-4 h-4" />
                                    </motion.button>
                                </Reorder.Item>
                            ))}
                        </AnimatePresence>
                    </Reorder.Group>
                </div>
            )}

            {/* Empty State */}
            {previewImages.length === 0 && (
                <div className="text-center py-4 text-gray-400 text-sm">
                    <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    Hali rasm qo'shilmagan
                </div>
            )}
        </div>
    );
}