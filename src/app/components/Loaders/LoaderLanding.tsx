import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faConnectdevelop } from '@fortawesome/free-brands-svg-icons';

const LoaderLanding = () => {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
            <FontAwesomeIcon
                icon={faConnectdevelop}
                width={90}
                height={90}
                size='5x'
                className="animate-spin transition-all duration-300 mb-4 box-shadow-lg"
            />
            <h2 className="text-xl font-semibold">EdDev</h2>
        </div>
    )
}

export default LoaderLanding
