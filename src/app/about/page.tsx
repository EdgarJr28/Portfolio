import React from 'react'
import Bio from './bio'
import StatsCard from './stats/myStats'
import SpotifyProfileCard from './me/SpotifyProfileCard'
import Image from 'next/image'

const About = () => {
    return (
        <>
            <div className="pt-20">
                <Bio />
                <StatsCard />
            </div>
            <div className="container mx-auto py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Columna 1: SpotifyProfileCard */}
                    <div>
                        <SpotifyProfileCard />
                    </div>

                    {/* Columna 2: Imagen */}
                    <div className="flex justify-center items-center">
                        <div className="text-center">
                            <h1 className="text-4xl font-mono text-baseGray dark:text-white">"all that hard work gonna pay off"</h1>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default About
