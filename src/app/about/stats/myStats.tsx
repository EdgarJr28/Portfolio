'use client'
import React from 'react';
import { Nested } from '@alptugidin/react-circular-progress-bar';

const StatsCard = () => {
    return (
        <div className="flex flex-col rounded-lg md:flex-row gap-4 max-w-[80%] py-12 mdsm:max-w-[40%] mx-auto text-white">
            {/* Frontend Stats */}
            <div className="bg-transparent dark:text-white p-4 w-full md:w-1/2">
                <h3 className="text-xl font-semibold mb-4 text-center">Frontend Stats</h3>
                <div className="mb-6 dark:text-white rounded-lg">
                    <Nested
                        circles={[
                            { text: 'Javascript', value: 90, color: '#037db8' },
                            { text: 'Typescript', value: 80, color: '#037db8' },
                            { text: 'HTML', value: 80, color: '#037db8' },
                            { text: 'CSS', value: 70, color: '#037db8' }
                        ]}
                        sx={{
                            bgColor: '#cbd5e1',
                            fontWeight: 'bold',
                            fontFamily: 'Webdings',
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
                            { text: 'REST', value: 100, color: '#037db8' },
                            { text: 'SQL', value: 80, color: '#037db8' },
                            { text: 'NoSQL', value: 70, color: '#037db8' },
                            { text: 'JWT', value: 90, color: '#037db8' }
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
