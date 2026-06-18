'use client'
import Image from 'next/image';
import dynamic from 'next/dynamic';
import ContactSection from './ContactSection';
import Timeline from './Timeline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines } from '@fortawesome/free-solid-svg-icons/faFileLines';
import SkillCarousel from './Skills';
import { useEffect, useState } from 'react';
import ProjectGallerySection from './proyectGalery/ProjectGallerySection';
import ModalDownloadResume from '@/app/components/Modals/ModalDownloadResume';
import CanOfferSection from '@/app/about/CanOfferSection';

const Hero3D = dynamic(() => import('@/app/components/Hero3D'), {
    ssr: false,
    loading: () => (
        <div className="absolute inset-0 -z-10 bg-linear-to-br from-zinc-950 to-zinc-900" />
    ),
});

const Home = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const scrollToSection = (id: any) => {
        const section = document.getElementById(id);
        if (section) {
            const headerOffset = 80;
            window.scrollTo({
                top: section.offsetTop - headerOffset,
                behavior: 'smooth'
            });
        }
    };


    const handleModal = () => {
        setModalOpen(!modalOpen);
    }

    return (
        <>
            <section className="relative bg-transparent pt-32 mdsm:pt-16 mdsm:px-12 flex justify-center items-center transition-all">
                <Hero3D />
                <div className="container mx-auto flex flex-col lg:flex-row items-center mdsm:mx-auto">
                    <div className="p-4 text-center lg:text-left lg:w-1/2 lg:pr-12">
                        <p className="text-baseGray dark:text-white">Welcome to my portfolio website! 🚀</p>
                        <h1 className="text-4xl font-bold my-4 dark:text-white">
                            Hello friends, I&apos;m <span className="text-baseBlue dark:text-yellow-300">Ed</span>
                        </h1>
                        <p className="text-baseGray dark:text-white mb-6">
                            Creating a successful product is a process that requires great energy and dedication. I specialize in designing exceptional user experiences, intuitive interfaces and high quality web development.
                        </p>
                        <div className="flex justify-center lg:justify-start gap-4">
                            <button
                                className="flex-inline bg-transparen dark:text-white border dark:border-white dark:hover:text-black dark:hover:bg-yellow-300 dark:hover:border-transparent border-baseBlack text-black py-2 px-4 rounded hover:bg-baseBlue hover:text-white transition-colors duration-300 hover:border-transparent"
                                onClick={handleModal}
                            >
                                <FontAwesomeIcon icon={faFileLines} className='w-4 h-4 py-[0.5%] px-1' />
                                Dowload Resume
                            </button>
                            <button
                                className="bg-baseGray text-white py-2 px-4 rounded"
                                onClick={() => scrollToSection('contact')}
                            >
                                Contact me
                            </button>
                        </div>
                    </div>
                    <div className="mdsm:mt-8 lg:mt-0 w-full lg:w-1/2 flex justify-center rounded-lg">
                        <div className="relative h-0 w-full pb-[60%]">
                            <div className="relative w-full h-96">
                                <Image
                                    src="/gifs/developer.gif"
                                    alt="Illustration of a person at a desk"
                                    fill
                                    className="rounded object-cover drop-shadow-xl transition-all duration-300"
                                     
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="pt-14 mdsm:pt-0 my-4 mdsm:my-1" >
                <SkillCarousel />
            </div>
            <section>
                <CanOfferSection />
            </section>
            <section>
                <Timeline />
            </section>
            <section>
                <ProjectGallerySection />
            </section>
            <section >
                <ContactSection />
            </section>
            <ModalDownloadResume isOpen={modalOpen} onClose={handleModal} />
        </>
    );
}

export default Home;
