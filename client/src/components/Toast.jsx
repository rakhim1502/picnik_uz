import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-green-500" />,
        error: <XCircle className="w-5 h-5 text-red-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />
    };

    const bgColors = {
        success: 'bg-green-50 border-green-200',
        error: 'bg-red-50 border-red-200',
        info: 'bg-blue-50 border-blue-200'
    };

    const progressColors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500'
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, x: 100, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 100, scale: 0.8 }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25
                    }}
                    className="fixed top-24 right-4 z-50 max-w-sm"
                >
                    <motion.div
                        className={`bg-white border ${bgColors[type]} rounded-xl shadow-2xl p-4 flex items-start gap-3 relative overflow-hidden`}
                        whileHover={{ scale: 1.02 }}
                        layout
                    >
                        {/* Icon with animation */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 20,
                                delay: 0.1
                            }}
                        >
                            {icons[type]}
                        </motion.div>

                        {/* Message */}
                        <motion.div
                            className="flex-1"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <p className="text-sm font-medium text-gray-900">{message}</p>
                        </motion.div>

                        {/* Close button */}
                        <motion.button
                            onClick={() => {
                                setIsVisible(false);
                                setTimeout(onClose, 300);
                            }}
                            className="text-gray-400 hover:text-gray-600 transition"
                            whileHover={{ scale: 1.2, rotate: 90 }}
                            whileTap={{ scale: 0.8 }}
                        >
                            <X className="w-4 h-4" />
                        </motion.button>

                        {/* Progress bar */}
                        <motion.div
                            className={`absolute bottom-0 left-0 h-1 ${progressColors[type]}`}
                            initial={{ width: '100%' }}
                            animate={{ width: '0%' }}
                            transition={{ duration: 3, ease: "linear" }}
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}