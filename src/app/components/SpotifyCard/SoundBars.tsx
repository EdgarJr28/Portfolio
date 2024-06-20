import React from 'react';


const SoundBars = ({ barColor }: any) => {
    const numberOfBars = Math.floor(218 / 3);

    const bars = Array.from({ length: numberOfBars }, (_, index) => {
        const left = index * 4 + 1;
        const animationDuration = 200 + index * 8;

        return (
            <div
                key={index}
                className={'bar'}
                style={{
                    left: `${left}px`,
                    animationDuration: `${animationDuration}ms`,
                    backgroundColor: barColor
                }}
            ></div>
        );
    });

    return (
        <div className={'bars w-full overflow-hidden bg-transparent'}>
            {bars}
        </div>
    );
};

export default SoundBars;
