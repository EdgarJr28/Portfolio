'use client'
import Image from 'next/image';
import React, { useState } from 'react';
import ProfileModal from './me/ProfileModal';

const Bio = () => {
    const [modalOpen, setModalOpen] = useState<boolean>();
    const handleOpenModal = () => {
        setModalOpen(true)
    }
    const handleClose = () => {
        setModalOpen(false)
    }
    return (
        <div className="w-full mx-auto px-4 py-8 md:flex dark:text-white mdsm:p-20">
            <div className="md:w-1/2 p-4 mdsm:py-20">
                <div className="inline-flex items-center">
                    <Image src="/gifs/Hi.gif"
                        alt="Hi"
                        width={45}
                        height={30}
                        quality={100}
                        unoptimized={true}
                    />
                    <h2 className="text-2xl font-semibold mt-2">About me</h2>
                </div>

                <p className="text-baseGray text-lg dark:text-white">
                    I&apos;m a technology enthusiast with strong web development skills. My meticulous approach blends seamlessly with a fervent passion for solving complex problems. With a background in data analytics and teamwork, I am eager to contribute to innovative projects where I can apply my attention to detail and unwavering commitment to continuous learning.&nbsp;
                    <span className='text-xs text-baseBlue dark:text-yellow-300 cursor-pointer hover:text-base transition-all duration-300' onClick={handleOpenModal}>See more</span>
                </p>

            </div>
            <div className="md:w-1/2 mt-4 md:mt-0">
                <Image
                    width={200}
                    height={250}
                    src="/images/developer_banner.jpg"
                    alt="Imagen"
                    layout="responsive"
                    className="object-cover w-full h-auto md:h-full rounded-lg"
                    quality={100}  // Ajusta la calidad según sea necesario, valor entre 1 y 100
                />
            </div>
            <ProfileModal isOpen={modalOpen} onClose={handleClose} />
        </div>

    );
};

export default Bio;
