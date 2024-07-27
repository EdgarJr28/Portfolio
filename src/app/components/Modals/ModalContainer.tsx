import { useEffect } from 'react';

const ModalContainer = ({ children, className, onClose }: any) => {
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
    <div className={`fixed p-0 justify-center flex items-center h-screen top-0 bottom-0 mdsm:p-6 w-full bg-baseBlack/20 z-50 backdrop-blur-sm dark:text-white`}>
      <div className={`${className} bg-white dark:bg-dark-100 sm:px-5 sm:pb-5 m-5 pb-0 relative rounded-lg modal-content transition-all ease-in-out duration-300`}>
        <div className='w-full px-4 sm:px-0 flex justify-end'>
          <button onClick={onClose} className="text-4xl z-10 dark:text-white hover:scale-110">
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default ModalContainer;
