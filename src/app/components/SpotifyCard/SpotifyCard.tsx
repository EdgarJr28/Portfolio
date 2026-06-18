'use client';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import SoundBars from './SoundBars';
import { FastAverageColor } from 'fast-average-color';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons/faSpotify';
import SkeletonLoader from './SkeletonLoader';

const getStoredTrack = () => {
    try {
        const stored = localStorage.getItem('lastTrack');
        if (stored && stored !== 'undefined') return JSON.parse(stored);
    } catch {}
    return null;
};

const SpotifyCard = ({ className }: any) => {
    const [currentItem, setCurrentItem] = useState<any>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [soundLevels, setSoundLevels] = useState([50, 70, 30, 85, 60]);
    const [barColor, setBarColor] = useState('#666');
    const [loading, setLoading] = useState(true);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        const fetchCurrentItem = async () => {
            try {
                const response = await axios.post('/api/current-track');
                const item = response.data.track || response.data.episode;

                if (response.data.isPlaying && item) {
                    localStorage.setItem('lastTrack', JSON.stringify(item));
                    setCurrentItem(item);
                    setIsPlaying(true);

                    intervalRef.current = setInterval(async () => {
                        try {
                            const r = await axios.post('/api/current-track');
                            const i = r.data.track || r.data.episode;
                            if (r.data.isPlaying && i) {
                                localStorage.setItem('lastTrack', JSON.stringify(i));
                                setCurrentItem(i);
                                setIsPlaying(true);
                            } else {
                                const last = r.data.lastTrack ?? getStoredTrack();
                                if (last) localStorage.setItem('lastTrack', JSON.stringify(last));
                                setCurrentItem(last);
                                setIsPlaying(false);
                            }
                        } catch {
                            if (intervalRef.current) clearInterval(intervalRef.current);
                        }
                    }, 25000);
                } else {
                    const lastTrack = response.data.lastTrack ?? getStoredTrack();
                    if (lastTrack) localStorage.setItem('lastTrack', JSON.stringify(lastTrack));
                    setCurrentItem(lastTrack);
                    setIsPlaying(false);
                }
            } catch {
                setCurrentItem(getStoredTrack());
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentItem();
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    // Sound bars — only animate when playing, no soundLevels dependency to avoid interval churn
    useEffect(() => {
        if (!isPlaying) return;
        const interval = setInterval(() => {
            setSoundLevels([...Array(5)].map(() => Math.random() * 100));
        }, 1000);
        return () => clearInterval(interval);
    }, [isPlaying]);

    // Extract dominant color from album/show art
    useEffect(() => {
        if (!currentItem) return;
        const imageUrl = currentItem.album?.images[0]?.url || currentItem.show?.images[0]?.url;
        if (!imageUrl) return;
        const fac = new FastAverageColor();
        fac.getColorAsync(imageUrl)
            .then(color => setBarColor(color.hex))
            .catch(() => {});
    }, [currentItem]);

    if (loading) return <SkeletonLoader />;
    if (!currentItem) return null;

    const isTrack = currentItem.type === 'track';
    const imageUrl = isTrack
        ? currentItem.album.images[0].url
        : currentItem.show.images[0].url;
    const name = isTrack ? currentItem.name : currentItem.show.name;
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
            <div className='flex w-full items-center justify-center rounded-lg'>
                <div className='w-full'>
                    <div className='flex'>
                        {isPlaying && <SoundBars soundLevels={soundLevels} barColor={barColor} />}
                    </div>
                    <Image
                        width={320}
                        height={300}
                        src={imageUrl}
                        alt='Album Art'
                        className='rounded-b-lg w-full shadow-lg dark:shadow-dark-200'
                        priority
                    />
                    <div className='w-full text-center text-black dark:text-white pt-1'>
                        <div className='w-full overflow-hidden relative'>
                            {currentItem.description && (
                                <div className={`overflow-hidden whitespace-nowrap relative ${currentItem.name.length > 40 ? 'w-90 animate-marquee' : ''}`}>
                                    <h2 className='text-xs font-semibold inline-block'>
                                        {currentItem.name}
                                    </h2>
                                </div>
                            )}
                            <div className={`overflow-hidden whitespace-nowrap relative ${name.length > 40 ? 'w-90 animate-marquee' : ''}`}>
                                <h2 className='text-sm font-semibold inline-block'>
                                    {name}
                                </h2>
                            </div>
                        </div>
                        <p className='text-xs text-baseGray dark:text-gray-400'>{artistOrPublisher}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpotifyCard;
