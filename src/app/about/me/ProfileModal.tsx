'use client'
import React, { useEffect } from 'react';
import Image from 'next/image';
import Typewriter from '@/app/components/extras/TypeWriter';
import ModalContainer from '@/app/components/Modals/ModalContainer';
const ProfileModal = ({ isOpen, onClose }: any) => {
    if (!isOpen) return null;
    const phrases = [
        'Developing ideas, a moment...',
        "Hello, it's wonderful to see you!",
        'Wishing you a day full of positivity and joy!',
        'Turn ideas into reality. Happy coding!',
        'Hey! Nice to meet you.'];





    return (
        <ModalContainer className={`sm:w-96`} onClose={onClose}>
            <div className="w-full h-full flex justify-center items-center rounded-lg">
                <div className="relative z-10 p-6 rounded-lg">

                    {/* Contenido del perfil */}
                    <div className="flex justify-center mb-2">
                        <Image
                            src="/images/me.jpg"
                            alt="Me"
                            width={200}
                            height={100}
                            className="w-36 h-36 mdsm:w-36 mdsm:h-36 rounded-xl shadow-lg object-cover"
                             
                        />
                    </div>
                    <div className="text-center p-2 w-full backdrop-blur-sm rounded-lg">
                        <h2 className="text-2xl font-bold dark:text-white">Ed</h2>
                        <p className="text-base dark:text-white">Hello a pleasure, I am a cheerful and vibrant person, I really like music and art, I emphasize that I like quiet places and I have happiness as an engine of personal growth.</p>
                    </div>
                    <div className="">
                        <div className="bg-black text-green-400 px-1 rounded-lg max-w-64 mx-auto mb-4">
                            <div className="flex items-center">
                                <p className="text-green-400 text-xs mr-1">&gt;</p>
                                <Typewriter phrases={phrases} typingSpeed={100} pauseTime={3000} className={`text-xs text-balance pb-1`} />
                            </div>
                        </div>

                        <Image
                            src="/gifs/aeom.gif"
                            alt="Imagen"
                            width={200}
                            height={100}
                            className="w-20 h-16 mx-auto rounded-md shadow-lg transition-all duration-300"
                             
                        />
                    </div>
                </div >
            </div>
        </ModalContainer>
    );
};

export default ProfileModal;

/* 
 
*/