import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Importa los estilos de AOS

const ModalImageContainer = ({ onClose, children, className }: any) => {
    // Función para manejar el clic fuera del modal
    const handleOutsideClick = (e: any) => {
        if (!e.target.closest('.modal-content')) {
            onClose(); // Cerrar el modal
        }
    };

    // Función para manejar el evento de teclado
    const handleEscapeKey = (e: any) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    useEffect(() => {
        AOS.init({
            duration: 500, // Duración de la animación en milisegundos
            once: false, // Permitir que las animaciones se repitan
        });
    }, []);

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
                    <div data-aos="zoom-in-up" className="modal-content w-80 h-50 sm:w-3/4 sm:h-3/4 bg-gray-300 rounded-lg">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalImageContainer;
