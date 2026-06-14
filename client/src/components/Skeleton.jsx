import { motion } from 'framer-motion';

export default function Skeleton({ className }) {
    return (
        <motion.div
            className={`bg-gray-200 rounded ${className}`}
            animate={{
                background: [
                    'rgba(229, 231, 235, 1)',
                    'rgba(200, 200, 200, 1)',
                    'rgba(229, 231, 235, 1)'
                ]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
        />
    );
}