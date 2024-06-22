import { useEffect } from 'react';

const ModalContainer = ({ children, className, onClose }: any) => {
  // Función para manejar el clic fuera del modal
  const handleOutsideClick = (e: any) => {
    if (!e.target.closest('.modal-content')) {
      onClose(); // Cerrar el modal
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div className={`fixed justify-center flex items-center h-screen top-0 bottom-0 mdsm:p-6 w-full bg-baseBlack/20 z-50 backdrop-blur-sm dark:text-white`}>
      <div className={`${className} bg-white dark:bg-dark-100 p-5 m-5 pb-0 relative rounded modal-content`}>
        <button onClick={onClose} className="absolute right-3 top-3 ">
          <svg className="w-6 h-6 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}

export default ModalContainer;
