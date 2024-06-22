'use client'
import React from 'react';
import Image from 'next/image';
import Typewriter from '@/app/components/extras/TypeWriter';

const ProfileModal = ({ isOpen, onClose }: any) => {
    if (!isOpen) return null;
    const phrases = [
        'Developing ideas, a moment...',
        "Hello, it's wonderful to see you!",
        'Wishing you a day full of positivity and joy!',
        'Turn ideas into reality. Happy coding!',
        'Hey! Nice to meet you.'];

    return (
        <div className="fixed backdrop-blur-md inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
            <div className="relative w-auto max-w-3xl mx-auto my-6">
                {/* Contenido del modal */}
                <div className="bg-white rounded-lg shadow-lg relative flex flex-col w-full py-6 mdsm:p-6 dark:bg-dark-100 dark:shadow-baseGray">
                    <button
                        className="absolute top-0 right-0 mt-4 mr-4 text-baseGray hover:text-gray-700 cursor-pointer"
                        onClick={onClose}
                    >
                        <svg className="w-6 h-6 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                    {/* Contenido del perfil */}
                    <div className="flex justify-center mb-2">
                        <img
                            src="/images/me.jpg"
                            alt="Perfil"
                            className="w-40 h-40 mdsm:w-40 mdsm:h-40 rounded-full shadow-lg object-cover hover:scale-110 transition-all duration-300"
                        />
                    </div>
                    <div className="text-center m-4 w-80">
                        <h2 className="text-2xl font-bold dark:text-white">Ed</h2>
                        <p className="text-baseGray text-base dark:text-white">Hello a pleasure, I am a cheerful and vibrant person, I really like music and art, I emphasize that I like quiet places and I have happiness as an engine of personal growth.</p>
                    </div>
                    <div className="">
                        <div className="bg-black text-green-400 px-1 rounded-lg max-w-64 mx-auto mb-4">
                            <div className="flex items-center">
                                <p className="text-green-400 text-lg mr-1">&gt;</p>
                                <Typewriter phrases={phrases} typingSpeed={100} pauseTime={3000} className={`text-xs text-balance pb-1`} />
                            </div>
                        </div>

                        <Image
                            src="/gifs/aeom.gif"
                            alt="Imagen"
                            width={200}
                            height={100}
                            className="w-20 h-16 mx-auto rounded-md shadow-lg transition-all duration-300"
                            unoptimized
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;
