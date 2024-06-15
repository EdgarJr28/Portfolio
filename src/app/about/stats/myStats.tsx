'use client'
import React from 'react';
import { Nested } from '@alptugidin/react-circular-progress-bar';

const StatsCard = () => {
    return (
        <div className="flex flex-col rounded-lg shadow-lg md:flex-row gap-4 max-w-[80%]  mdsm:max-w-[40%] mx-auto">
            {/* Frontend Stats */}
            <div className="bg-transparent  dark:text-white p-4 w-full md:w-1/2">
                <h3 className="text-xl font-semibold mb-4 text-center">Frontend Stats</h3>
                <div className="mb-6 dark:text-white rounded-lg">
                    <Nested
                        circles={[
                            { text: 'Javascript', value: 80, color: '#fde047' },
                            { text: 'Typescript', value: 60, color: '#0ea5e9' },
                            { text: 'HTML', value: 80, color: '#c2410c' },
                            { text: 'CSS', value: 80, color: '#7c3aed' }
                        ]}
                        sx={{
                            bgColor: '#cbd5e1',
                            fontWeight: 'bold',
                            fontFamily: 'Trebuchet MS',
                            strokeLinecap: 'round',
                            loadingTime: 3000,
                            valueAnimation: true,
                            intersectionEnabled: true,
                        }}
                    />
                </div>
            </div>

            {/* Backend Stats */}
            <div className="bg-transparent dark:text-white  p-4 w-full md:w-1/2">
                <h3 className="text-xl font-semibold mb-4 text-center">Backend Stats</h3>
                <div className="mb-6">
                    <Nested
                        circles={[
                            { text: 'REST', value: 100, color: '#b90004' },
                            { text: 'SQL', value: 80, color: '#a87b98' },
                            { text: 'NoSQL', value: 70, color: '#eff847' },
                            { text: 'JWT', value: 100, color: '#408080' }
                        ]}
                        sx={{
                            bgColor: '#cbd5e1',
                            fontWeight: 'bold',
                            fontFamily: 'Trebuchet MS',
                            strokeLinecap: 'round',
                            loadingTime: 3000,
                            valueAnimation: true,
                            intersectionEnabled: true
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
