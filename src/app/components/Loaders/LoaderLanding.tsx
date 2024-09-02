import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faConnectdevelop } from '@fortawesome/free-brands-svg-icons';

const LoaderLanding = () => {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen dark:text-white spin space-y-2">
            <div className="relative pulsating">
                <FontAwesomeIcon
                    icon={faConnectdevelop}
                    width={64}
                    height={64}
                    size="4x"
                    className="pulsating"
                />
            </div>
            <h2 className="text-xl font-semibold pulsatingText">EdDev</h2>
        </div>
    );
};

export default LoaderLanding;
