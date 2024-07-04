'use client'
import React, { useEffect, useState } from 'react'
import ModalContainer from '@/app/components/Modals/ModalContainer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';
import PlayListCarousel from './PlayListCarousel';


const PlayListMusicModal = ({ isOpen, onClose }: any) => {
    const [Playlists, setPlaylists] = useState<any>(null);

    useEffect(() => {
        const fetchGetPlayList = async () => {
            const response: any = await axios.post('/api/playlist');
            setPlaylists(response.data.Playlists)
        }
        if (isOpen) {
            fetchGetPlayList();
        }
    }, [])
    
    if (!isOpen) return null;


    return (
        <ModalContainer onClose={onClose}>
            <div className="bg-white dark:bg-dark-100 rounded-lg p-2 max-w-md w-full transition-all duration-300">
                {Playlists ? <p className="text-center text-green-600 font-bold" >{Playlists[0].owner.display_name}</p> : ''}
                <h3 className='text-green-600 text-center p-2'>
                    <FontAwesomeIcon size='1x' icon={faSpotify} color='#1DB954' />
                    &nbsp;
                    My Playlist on Spotify

                    {Playlists ?
                        (<PlayListCarousel data={Playlists} />) :
                        <>
                            <p className='text-center text-xs p-8'>Loading...</p>
                        </>
                    }
                </h3>
            </div>
        </ModalContainer>
    )
}

export default PlayListMusicModal
