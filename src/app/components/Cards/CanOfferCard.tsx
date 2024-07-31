import React from 'react';

interface CardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
}

const CanOfferCard: React.FC<CardProps> = ({ title, description, icon }) => {
    return (
        <div className="flex flex-col justify-center h-52 items-center p-4 border text-baseBlack select-none dark:text-white rounded-lg shadow-sm hover:bg-slate-100 dark:hover:bg-dark-200">
            <div className="mb-4 ">{icon}</div>
            <h3 className="text-lg font-bold mb-2">{title}</h3>
            <p className="text-center text-sm text-baseGray dark:text-gray-200">{description}</p>
        </div>
    );
};

export default CanOfferCard;
