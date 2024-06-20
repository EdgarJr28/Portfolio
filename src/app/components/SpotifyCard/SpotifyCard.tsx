'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import SoundBars from './SoundBars';
import { FastAverageColor } from 'fast-average-color';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons/faSpotify';

const SpotifyCard = ({ className }: any) => {
    const [currentTrack, setCurrentTrack] = useState<any>(null);
    const [isPlaying, setIsPlaying] = useState<any>(false);
    const [soundLevels, setSoundLevels] = useState([50, 70, 30, 85, 60]);
    const [barColor, setBarColor] = useState('#666');

    const fetchCurrentTrack = async () => {
        try {
            const response = await axios.post('/api/current-track');
            localStorage.setItem('lastTrack', JSON.stringify(response.data.track));
            if (response.data.isPlaying) {
                setCurrentTrack(response.data.track);
                setIsPlaying(response.data.isPlaying);
            } else {
                const localLastTrack = localStorage.getItem('lastTrack') || ""
                const lastTrack = response.data.lastTrack || JSON.parse(localLastTrack)
                if (lastTrack) {
                    console.group(lastTrack)
                    setCurrentTrack(lastTrack);
                }
            }
        } catch (error) {
            console.error('Error al obtener la canción actual:', error);
        }
    };

    useEffect(() => {


        fetchCurrentTrack();
        const interval = setInterval(fetchCurrentTrack, 50000);
        return () => clearInterval(interval);

    }, []);

    // Función para actualizar las barras de sonido
    const actualizarBarras = (niveles: number[]) => {
        setSoundLevels(niveles);
    };

    useEffect(() => {
        // Simulación de cambios en los niveles de sonido cada segundo
        const interval = setInterval(() => {
            const newSoundLevels = soundLevels.map(() => Math.random() * 100);
            actualizarBarras(newSoundLevels);
        }, 1000);

        return () => clearInterval(interval);
    }, [soundLevels]);


    useEffect(() => {
        if (currentTrack) {
            const imageUrl = currentTrack.album.images[0].url;
            // Asegúrate de que la URL es válida
            if (imageUrl) {
                const fac = new FastAverageColor();
                fac.getColorAsync(imageUrl)
                    .then(color => {
                        setBarColor(color.hex);
                    })
                    .catch(error => console.error('Error al extraer el color:', error));
            } else {
                console.error('URL de la imagen no válida:', imageUrl);
            }
        }
    }, [currentTrack]);

    return (
        <>
            <div className={`${className} rounded-lg w-80 p-6 `} >
                <div className='text-center'>

                    <h1 className='text-green-600 text-center p-2'> <FontAwesomeIcon size='1x' icon={faSpotify} color='#1DB954' /> Now Playing</h1>
                </div>
                {currentTrack && (
                    <div className='flex w-full items-center justify-center backdrop-opacity-50 backdrop-blur-md rounded-lg'>

                        <div className="w-full">
                            <div className="flex">
                                {isPlaying && <SoundBars soundLevels={soundLevels} barColor={barColor} />}
                            </div>
                            {/* Aquí se agregan las barras de sonido */}
                            <Image
                                width={320}
                                height={300}
                                src={currentTrack.album.images[0].url}
                                alt="Album Art"
                                className='rounded-b-lg w-full shadow-lg dark:shadow-dark-200'
                                unoptimized
                                priority
                            />
                            <div className=' w-full text-center text-black dark:text-white pt-4 text-nowrap'>
                                <h2 className='text-base font-semibold'>{currentTrack.name}</h2>
                                <p className='text-sm text-baseGray dark:text-gray-400'>{currentTrack.artists[0].name}</p>
                                {/* <p className="text-gray-300">{isPlaying ? 'Reproduciendo' : 'En pausa'}</p> */}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default SpotifyCard;
