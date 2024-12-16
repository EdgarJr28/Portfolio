'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import SoundBars from './SoundBars';
import { FastAverageColor } from 'fast-average-color';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons/faSpotify';
import SkeletonLoader from './SkeletonLoader';

const SpotifyCard = ({ className }: any) => {
    const [currentItem, setCurrentItem] = useState<any>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [soundLevels, setSoundLevels] = useState([50, 70, 30, 85, 60]);
    const [barColor, setBarColor] = useState('#666');
    const [loading, setLoading] = useState(true);

    let currentInterval: any = null;

    const fetchCurrentItem = async () => {
        try {
            const response = await axios.post('/api/current-track');
            const item = response.data.track || response.data.episode;
            if (response.data.isPlaying) {
                if (item) {
                    localStorage.setItem('lastTrack', JSON.stringify(item));
                    setCurrentItem(item);
                    setIsPlaying(true);
                    setLoading(false);
                } else {
                    const lastTrack = response.data.lastTrack ?? getlastTrack();
                    localStorage.setItem('lastTrack', JSON.stringify(lastTrack));
                    setCurrentItem(lastTrack);
                    setIsPlaying(false);
                    setLoading(false);
                }
            } else {
                const lastTrack = response.data.lastTrack ?? getlastTrack();
                localStorage.setItem('lastTrack', JSON.stringify(lastTrack));
                setCurrentItem(lastTrack);
                setIsPlaying(false);
                setLoading(false);
                return; // Salimos sin configurar el intervalo si no se está reproduciendo
            }

            // Limpiar cualquier intervalo existente antes de configurar uno nuevo
            if (currentInterval) {
                clearInterval(currentInterval);
            }

            // Configurar el intervalo solo si isPlaying es true
            currentInterval = setInterval(async () => {
                try {
                    const response = await axios.post('/api/current-track');
                    const item = response.data.track || response.data.episode;
                    if (response.data.isPlaying) {
                        if (item) {
                            localStorage.setItem('lastTrack', JSON.stringify(item));
                            setCurrentItem(item);
                            setIsPlaying(true);
                            setLoading(false);
                        } else {
                            const lastTrack = response.data.lastTrack ?? getlastTrack();
                            localStorage.setItem('lastTrack', JSON.stringify(lastTrack));
                            setCurrentItem(lastTrack);
                            setIsPlaying(false);
                            setLoading(false);
                        }
                    } else {
                        const lastTrack = response.data.lastTrack ?? getlastTrack();
                        localStorage.setItem('lastTrack', JSON.stringify(lastTrack));
                        setCurrentItem(lastTrack);
                        setIsPlaying(false);
                        setLoading(false);
                        /*  clearInterval(currentInterval); */ // Limpiar el intervalo si ya no se está reproduciendo
                    }
                } catch (error) {
                    console.error('Error al obtener la canción actual:', error);
                    clearInterval(currentInterval); // Limpiar el intervalo en caso de error
                }
            }, 25000);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener la canción actual:', error);
            setCurrentItem(getlastTrack());
        }
    };

    const getlastTrack = () => {
        const locallastTrack = localStorage.getItem('lastTrack');
        if (locallastTrack && locallastTrack !== "undefined") {
            setLoading(false);
            return JSON.parse(locallastTrack);
        }
        setLoading(true);
        return null;
    };

    useEffect(() => {
        fetchCurrentItem();
        return () => {
            // Limpiar el intervalo cuando el componente se desmonte o se actualice
            if (currentInterval) {
                clearInterval(currentInterval);
            }
        };
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
        if (currentItem) {
            const imageUrl = currentItem.album?.images[0].url || currentItem.show?.images[0].url;
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
    }, [currentItem]);

    if (loading) {
        return <SkeletonLoader />;
    }

    // Validar si currentItem es nulo o indefinido
    if (!currentItem) {
        const lastTrack = getlastTrack();
        if (lastTrack) {
            setCurrentItem(lastTrack);
        } else {
            return null;
        }
    }

    const isTrack = currentItem.type === 'track';
    const isEpisode = currentItem.type === 'episode';

    const imageUrl = isTrack
        ? currentItem.album.images[0].url
        : currentItem.show.images[0].url;

    const name = isTrack
        ? currentItem.name
        : currentItem.show.name;

    const artistOrPublisher = isTrack
        ? currentItem.artists[0].name
        : currentItem.show.publisher;

    return (
        <div className={`${className} rounded-lg w-80 p-6`}>
            <div className='text-center'>
                <h1 className='text-green-600 text-center p-2'>
                    <FontAwesomeIcon size='1x' icon={faSpotify} color='#1DB954' />
                    &nbsp;
                    {isPlaying ? 'Now Playing' : 'Last Played'}
                </h1>
            </div>
            {currentItem && (
                <div className='flex w-full items-center justify-center rounded-lg'>
                    <div className="w-full">
                        <div className="flex">
                            {isPlaying && <SoundBars soundLevels={soundLevels} barColor={barColor} />}
                        </div>
                        <Image
                            width={320}
                            height={300}
                            src={imageUrl}
                            alt="Album Art"
                            className='rounded-b-lg w-full shadow-lg dark:shadow-dark-200'
                             
                            priority
                        />
                        <div className='w-full text-center text-black dark:text-white pt-1'>
                            <div className='w-full overflow-hidden relative'>
                                {currentItem.description && (
                                    <div className={`overflow-hidden whitespace-nowrap relative ${currentItem.name.length > 40 ? 'w-[360px] animate-marquee' : ''}`}>
                                        <h2 className='text-xs font-semibold inline-block'>
                                            {currentItem.name}
                                        </h2>
                                    </div>
                                )}
                                <div className={`overflow-hidden whitespace-nowrap relative ${name.length > 40 ? 'w-[360px] animate-marquee' : ''}`}>
                                    <h2 className='text-sm font-semibold inline-block'>
                                        {name}
                                    </h2>
                                </div>
                            </div>
                            <p className='text-xs text-baseGray dark:text-gray-400'>{artistOrPublisher}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SpotifyCard;
