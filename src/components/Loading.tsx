import { motion } from 'framer-motion';

export const LoadingSpinner = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-white">
            <motion.div
                className="relative w-24 h-24"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: 'linear',
                }}
            >
                <div className="absolute inset-0 rounded-full border-t-4 border-indigo-600 border-opacity-100"></div>
                <div className="absolute inset-0 rounded-full border-l-4 border-indigo-300 border-opacity-50"></div>
                <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0.4 }}
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: 'easeInOut',
                    }}
                >
                    <div className="w-4 h-4 bg-indigo-600 rounded-full" />
                </motion.div>
            </motion.div>
        </div>
    );
};