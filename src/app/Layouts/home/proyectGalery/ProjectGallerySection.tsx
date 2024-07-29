'use client'
import React, { useState } from 'react'
import SliderProjectGallery from './SliderGallery'
import ModalContainer from '@/app/components/Modals/ModalContainer';
import { useCtx } from '@/app/context/context';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import ModalImageContainer from '@/app/components/Modals/ModalImageContainer';

const ProjectGallerySection = () => {

    const { modalGalery, setModalGalery, modalImage, setModalImage }: any = useCtx();

    const handleModal = () => {
        setModalGalery({
            status: !modalGalery.status,
            data: {}
        });
    }
    const handleModalImage = () => {
        setModalImage({
            status: !modalImage.status,
            data: {}
        });
    }

    return (
        <div className='mt-40 mdsm:mt-20'>
            <p className="text-2xl font-semibold text-center dark:text-white m-2">Project Gallery</p>
            <SliderProjectGallery />
            {/* Modal to see more info */}
            {modalGalery.status && (
                <>
                    <ModalContainer className={`sm:w-1/2 sm:mx-auto`} onClose={handleModal} >
                        <div className="p-6 sm:w-full mx-auto">
                            <div key={modalGalery.data.key} className="flex justify-between items-center border-b pb-2 mb-4">
                                <h2 className="text-xl font-semibold">{modalGalery.data.title}</h2>
                            </div>
                            <div className="flex justify-center">
                                <div className="flex justify-center w-full max-w-lg">
                                    <Image
                                        width={500}
                                        height={300}
                                        src={modalGalery.data.image}
                                        alt={modalGalery.data.title}
                                        className="sm:w-4/5 sm:h-60 rounded-md object-fill"
                                    />
                                </div>
                            </div>

                            <div className=" w-full text-balance p-4 flex mx-auto">
                                <p className="text-gray-800 dark:text-white text-sm text-wrap">{modalGalery.data.description}</p>
                            </div>

                            <div className="flex justify-between mt-4 space-x-1">
                                <a
                                    href={modalGalery.data.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex text-xs mdsm:text-sm items-center text-blue-500 hover:underline"
                                >
                                    <FontAwesomeIcon icon={faExternalLinkAlt} className="mr-1" />
                                    Visit Website
                                </a>
                                {modalGalery.data.link2 &&
                                    <a
                                        href={modalGalery.data.link2}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex text-xs mdsm:text-sm items-center text-blue-500 hover:underline"
                                    >
                                        <FontAwesomeIcon icon={faDownload} className="mr-1" />
                                        Download
                                    </a>
                                }
                            </div>
                        </div>
                    </ModalContainer>
                </>
            )}
            {modalImage.status && (
                <>
                    <ModalImageContainer onClose={handleModalImage}>
                        <Image
                            width={500}
                            height={300}
                            className="w-full h-full object-fill rounded-lg sm:mx-auto"
                            src={modalImage.data.image}
                            alt="Project Image full"
                            quality={100}
                            unoptimized={true}
                        />
                    </ModalImageContainer>
                </>
            )}
        </div>
    )
}

export default ProjectGallerySection
