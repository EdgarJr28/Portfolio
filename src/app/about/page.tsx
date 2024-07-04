'use client'
import React, { useState } from 'react'
import Bio from './bio'
import StatsCard from './stats/myStats'
import SpotifyProfileCard from './me/SpotifyProfileCard'
import Quote from './me/Quote'
import SpotifyCard from '../components/SpotifyCard/SpotifyCard'
import CanOfferSection from './CanOfferSection'
import PlayListMusicModal from './me/PlayListMusicModal'

const About = () => {

    const [modalOpen, setModalOpen] = useState(false);
    const handleModal = () => {
        setModalOpen(!modalOpen);
    }
    return (
        <>
            <div className='mdsm:pb-20'>
                <div className="pt-20">
                    <Bio />
                    <StatsCard />
                </div>
                <div className="container mx-auto py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                        {/* Columna 1: SpotifyCard */}
                        <div className='mx-auto'>
                            <a onClick={handleModal}>
                                <p className='text-center text-xs cursor-pointer text-green-600 hover:underline'>See more music</p>
                            </a>
                            <SpotifyCard className={`bg-transparent`} />
                        </div>
                        {/* Columna 2: Text */}
                        <div className="flex justify-center items-center">
                            <Quote />
                        </div>
                    </div>
                </div>
            </div>
            <PlayListMusicModal isOpen={modalOpen} onClose={handleModal} />
        </>
    )
}

export default About
