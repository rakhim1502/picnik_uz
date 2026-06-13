import { useEffect, useState } from 'react';
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

    return (
        <div className={`fixed top-24 right-4 z-50 max-w-sm animate-slide-up ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            } transition-all duration-300`}>
            <div className={`bg-white border ${bgColors[type]} rounded-xl shadow-large p-4 flex items-start gap-3`}>
                {icons[type]}
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{message}</p>
                </div>
                <button
                    onClick={() => {
                        setIsVisible(false);
                        setTimeout(onClose, 300);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}