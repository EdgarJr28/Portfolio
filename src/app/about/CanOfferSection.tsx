import { } from '@fortawesome/free-solid-svg-icons/faCode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDatabase, faCode, faServer, faClipboardList, faDesktop, faUserFriends, faHeart } from '@fortawesome/free-solid-svg-icons';
import React from 'react'
import CanOfferCard from '../components/Cards/CanOfferCard';


const CanOfferSection = () => {
    const cards = [
        {
            title: 'WEB DEVELOPMENT',
            description: 'Transforming your ideas into digital reality: Customised web development and design for each of your projects.',
            icon: <FontAwesomeIcon icon={faCode} className="text-4xl text-green-500" />,
        },
        {
            title: 'BACKEND DEVELOPMENT',
            description: 'Power your business logic with a robust and scalable backend to manage your services efficiently.',
            icon: <FontAwesomeIcon icon={faServer} className="text-4xl text-blue-500" />,
        },
        {
            title: 'DATABASES',
            description: 'Improving database design and optimisation for exceptional performance.',
            icon: <FontAwesomeIcon icon={faDatabase} className="text-4xl text-pink-500" />,
        },
        {
            title: 'REQUIREMENTS ANALYSIS',
            description: 'Transform your ideas into a functional and efficient product.',
            icon: <FontAwesomeIcon icon={faClipboardList} className="text-4xl text-amber-950 dark:text-amber-200" />,
        },
        {
            title: 'OFFICE APPLICATIONS',
            description: 'I am proficient in Office and other office applications to boost my daily productivity.',
            icon: <FontAwesomeIcon icon={faDesktop} className="text-4xl text-orange-500" />,
        },
        {
            title: 'FRIENDLY',
            description: 'Building relationships based on partnership and friendship, because together we achieve our greatest achievements.',
            icon: <FontAwesomeIcon icon={faHeart} className="text-4xl text-red-500" />,
        },
    ];
    return (
        <div className="flex flex-col items-center md:mt-10 p-14">
            <p className="text-2xl font-semibold text-center dark:text-white p-4">What can I offer to the team?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {cards.map((card, index) => (
                    <CanOfferCard key={index} title={card.title} description={card.description} icon={card.icon} />
                ))}
            </div>
        </div>
    )
}

export default CanOfferSection
