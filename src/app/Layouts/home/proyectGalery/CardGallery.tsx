'use client'
import Button from '@/app/components/Buttons/Button'
import ModalContainer from '@/app/components/Modals/ModalContainer';
import { useCtx } from '@/app/context/context';
import Image from 'next/image'
import React from 'react'

const CardGallery = ({ key, data }: any) => {
    const { modalGalery, setModalGalery }: any = useCtx();


    const handleModal = () => {
        setModalGalery({
            status: !modalGalery.status,
            data: data
        });

    }

    return (
        <>
            <div key={key} className="bg-white m-2 rounded-lg shadow-lg overflow-hidden mx-auto max-w-[90%]  mdsm:max-w-full dark:bg-dark-200 dark:text-white">
                <div className="md:flex h-full">
                    {/* Columna de la imagen y la fecha */}
                    <div className="md:w-2/3 mdsm:p-4">
                        <div className="relative hover:scale-105 h-48 mdsm:h-72">
                            <Image
                                width={500}
                                height={300}
                                className="w-full h-full object-cover rounded-lg"
                                src={data.image}
                                alt="Descripción de la imagen"
                            />
                            <div className="absolute inset-0 bg-baseGray rounded-lg opacity-40"></div>
                            <p className="absolute bottom-0 right-0 m-4 text-yellow-200 mdsm:text-sm text-xs p-1 shadow-lg rounded-lg drop-shadow-md backdrop-blur-lg">
                                {data.date}
                            </p>
                        </div>
                    </div>

                    {/* Columna del título y la descripción */}
                    <div className="md:w-2/4 p-4 m-auto h-full flex flex-col">
                        <div className="mb-2">
                            <h2 className="text-2xl font-semibold text-center">{data.title}</h2>
                        </div>
                        <div className="overflow-auto flex-grow">
                            <p
                                dangerouslySetInnerHTML={{ __html: data.shortDescription }}
                                className="text-gray-700 dark:text-white text-sm mdsm:text-base"
                                style={{ maxHeight: "8rem" }}
                            ></p>
                        </div>
                        <div className="w-full mx-auto border-t p-1 border-gray-200">
                            <Button
                                onClick={handleModal}
                                className="w-2/4 mx-[25%] 
                                 mt-2 mdsm:mt-4 border 
                                 text-sm hover:border-transparent
                               border-black dark:border-white
                               text-black hover:text-white
                               dark:text-white hover:bg-baseBlue
                               dark:hover:text-dark-100 dark:hover:bg-yellow-300
                                dark:hover:border-transparent
                                 transition-colors duration-300
                                "
                            >
                                More info
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default CardGallery
