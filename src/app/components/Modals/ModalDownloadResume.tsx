import React from 'react'
import ModalContainer from './ModalContainer'
import Image from 'next/image';
import Button from '../Buttons/Button';

const ModalDownloadResume = ({ isOpen, onClose }: any) => {
    if (!isOpen) return null;

    const handleDownload = (lg: any) => {
        const link = document.createElement('a');
        link.href = `/curriculum/resume${lg}.pdf`; // Ruta del recurso en el servidor
        link.setAttribute('download', 'Resume.pdf'); // Nombre con el que se descargará el archivo
        document.body.appendChild(link);
        link.click();
        link.remove();
        onClose();
    };
    return (
        <ModalContainer onClose={onClose}>
            <div className="bg-white dark:bg-dark-100 rounded-lg  p-8 max-w-md w-full transition-all duration-300">
                <h2 className="text-2xl font-semibold mb-1 text-center">Choose Language</h2>
                <p className='text-xs text-center mb-4 text-black dark:text-white'>
                    Select the language in which you want to download my resume
                </p>
                <div className="flex justify-around space-x-2">
                    <Button
                        onClick={() => handleDownload('ES')}
                        className="flex items-center
                         justify-center bg-transparent border
                         px-4 py-2 rounded-lg hover:border-transparent
                         dark:hover:border-transparent
                        border-black dark:border-white
                        text-black hover:text-white
                        dark:text-white hover:bg-baseBlue
                        dark:hover:text-dark-100 dark:hover:bg-yellow-300
                        
                        ">
                        <Image width={60} height={30} src="/images/esp.png" alt="ES" className="w-6 h-6 mr-2" />
                        Spanish
                    </Button>
                    <Button
                        onClick={() => handleDownload('EN')}
                        className="flex items-center
                         justify-center bg-transparent border
                         px-4 py-2 rounded-lg hover:border-transparent
                        border-black dark:border-white
                        text-black hover:text-white
                        dark:text-white hover:bg-baseBlue
                        dark:hover:text-dark-100 dark:hover:bg-yellow-300
                          dark:hover:border-transparent
                        ">
                        <Image width={60} height={30} src="/images/eng.png" alt="EN" className="w-6 h-6 mr-2" />
                        English
                    </Button>
                </div>
            </div>
        </ModalContainer>
    )
}

export default ModalDownloadResume
