import React from 'react'
import Bio from './bio'
import StatsCard from './stats/myStats'
import SpotifyProfileCard from './me/SpotifyProfileCard'
import Quote from './me/Quote'
import SpotifyCard from '../components/SpotifyCard/SpotifyCard'

const About = () => {

    return (
        <>
            <div className='mdsm:pb-20'>
                <div className="pt-20">
                    <Bio />
                    <StatsCard />
                </div>
                <div className="container mx-auto py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Columna 1: SpotifyCard */}
                        <div className='mx-auto'>
                            <SpotifyCard className={`bg-transparent`}/>
                        </div>
                        {/* Columna 2: Text */}
                        <div className="flex justify-center items-center">
                            <Quote />
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default About
