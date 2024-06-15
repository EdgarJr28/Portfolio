import React, { useEffect, useState } from 'react';


const InputWhithToggleSwitch = ({ value, onChange, className, label, name }: any) => {
    const [isToggled, setIsToggled] = useState(false);
    useEffect(() => {
        setIsToggled(value || false);
    }, []);

    const handleToggle = () => {
        setIsToggled(!isToggled);
        onChange?.({ target: { name: `${name}`, value: !isToggled } });
    };

    return (
        <div className={`${className}  h-16 flex border-rounded border rounded-lg shadow-white  font-medium`}>
            <div className='flex-col w-[60%] mdsm:w-[70%] lg:w-[70%]'>
                <label htmlFor={name} className="text-white text-xs mx-4 ">{label}</label>
                {isToggled ? <p className="text-white text-base mx-4 font-semibold ">Sí</p> : <p className="text-white text-base mx-4 font-semibold ">No</p>}
            </div>

            <div className={`items-center`}>
                <button
                    type={'button'}
                    name={name}
                    className={`${className} m-4 w-14 h-8 flex items-center rounded-full p-1 transition-all duration-500 ease-in-out ${isToggled ? 'bg-green-400 transition-all duration-500 ease-in-out' : 'bg-red-400'}`}
                    onClick={handleToggle}
                >
                    <div
                        className={`w-6 h-6 rounded-full transform transition-all duration-500 ease-in-out ${isToggled ? 'translate-x-6' : ''}`}
                    >
                        <div className={`w-6 h-6 rounded-full center transition-all duration-500 ease-in-out ${isToggled ? 'bg-gray-100' : 'bg-baseBlack'}`}>

                        </div>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default InputWhithToggleSwitch;