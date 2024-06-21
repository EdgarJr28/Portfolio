'use client'
import React, { useState } from 'react'
import SliderProjectGallery from './SliderGallery'
import ModalContainer from '@/app/components/Modals/ModalContainer';
import { useCtx } from '@/app/context/context';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

const ProjectGallerySection = () => {

    const { modalGalery, setModalGalery }: any = useCtx();

    const handleModal = () => {
        setModalGalery({
            status: !modalGalery.status,
            data: {}
        });
    }

    return (
        <div>
             <p className="text-2xl font-semibold text-center dark:text-white p-4">Project Gallery</p>
            <SliderProjectGallery />
            {/* Modal to see more info */}
            {modalGalery.status && (
                <>
                    <ModalContainer onClose={handleModal} >
                        <div className="p-6">
                            <div key={modalGalery.data.key} className="flex  justify-between items-center border-b pb-2 mb-4">
                                <h2 className="text-xl font-semibold">{modalGalery.data.title}</h2>
                            </div>
                            <div className="flex justify-center">
                                <div className="w-full max-w-lg">
                                    <Image
                                        width={500}
                                        height={300}
                                        src={modalGalery.data.image}
                                        alt={modalGalery.data.title}
                                        className="w-full rounded-md object-cover"
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                <p className="text-gray-800 dark:text-white text-sm">{modalGalery.data.description}</p>
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
            )
            }
        </div>
    )
}

export default ProjectGallerySection
