'use client';
import { useEffect } from 'react';
import { motion } from 'motion/react';

const ModalImageContainer = ({ onClose, children, className }: any) => {
    const handleOutsideClick = (e: any) => {
        if (!e.target.closest('.modal-content')) {
            onClose();
        }
    };

    const handleEscapeKey = (e: any) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('keydown', handleEscapeKey);
        document.body.classList.add('no-scroll');
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('keydown', handleEscapeKey);
            document.body.classList.remove('no-scroll');
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-baseBlack bg-opacity-80">
            <div className="relative w-full h-full">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-4xl text-white hover:scale-110 z-50"
                >
                    &times;
                </button>
                <div className="flex items-center justify-center h-full">
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className={`modal-content w-80 h-50 sm:w-3/4 sm:h-3/4 bg-gray-300 rounded-lg ${className ?? ''}`}
                    >
                        {children}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ModalImageContainer;
