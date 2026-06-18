'use client';
import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import CardGallery from './CardGallery';

const proyects = [
    {
        id: 1, title: 'M3DAR',
        shortDescription: 'It is a mobile application for visualization of medical devices in Augmented Reality.',
        description: 'Be part of the team working on the development of this application that allows users to interact with different 3D models allowing you to know in detail each of its features by offering a panoramic view from different angles each medical piece, using technologies such as Angular and NodeJS in the web environment. The rest of the app was made using Unreal Engine.',
        image: '/images/projects_galery/m3dar.png',
        date: '29/11/2020',
        link: "https://www.m3d-ar.com/#/home",
        link2: "https://apps.apple.com/us/app/m3dar/id1500221165"
    },
    {
        id: 2,
        title: 'Sports App',
        shortDescription: 'Sports is a web application that offers a booking service for sports facilities. This application has been created as part of the academic project.',
        description: 'Different web technologies were applied, React, Firebase Auth (role management), Firestore and responsive web.',
        image: '/images/projects_galery/sportweb.png',
        date: '20/05/2024',
        link: "https://sport-page-murex.vercel.app/"
    },
    {
        id: 3,
        title: 'Belena',
        shortDescription: 'App (in development) focused on connecting hosts (people who have space to rent) with guests (people looking for temporary accommodation).',
        description: 'App (in development) focused on connecting hosts (people who have space to rent) with guests (people looking for temporary accommodation).',
        image: '/images/projects_galery/belena.png',
        date: '1/10/2023',
        link: ""
    },
    {
        id: 4,
        title: 'Black Ops',
        shortDescription: 'App recreated in my spare time and planned for the long term, using 3D technologies, HTML and CSS for layout.',
        description: 'I developed this page as a hobbit while I was reinforcing my knowledge for a furute idea of creating a videogame, the idea is to learn the different areas of development to reach that goal.',
        image: '/images/projects_galery/blackops.png',
        date: '12/04/2024',
        link: 'https://black-ops-t2.vercel.app/index.html'
    },
    {
        id: 5,
        title: 'API Rating Videos',
        shortDescription: 'REST API with role-based oAuth handling simulating a video library using Amazon RDS service to instantiate a relational database. ',
        description: 'It is a backend REST API project with role-based oAuth management simulating a video library using the amazon RDS service to instantiate a relational database, which is responsible for rating the videos uploaded to the api and which also has protected paths to view public and private videos with registered and unregistered users.',
        image: '/images/projects_galery/APIvideo.png',
        date: '2023/01/28',
        link: 'https://test-production-2d4b.up.railway.app/docs'
    },
    {
        id: 6,
        title: 'Backend Projects',
        shortDescription: 'I have a lot of knowledge in the backend, possibly my forte, I have participated in many projects but due to privacy policies I can not show it, however I can specify my knowledge, hit me on more info and I\'ll tell you a little 😁.',
        description: 'As a backend I have participated in many projects taking care of SQL and NoSQL database management, also made use of technologies such as web socket and Rest, all this with JavaScript/Node, I invite you to review my public repos, the ones I have been able to share all are for personal development either by hobbit or technical testing. ',
        image: '/images/me-icon.png',
        date: '2019 - Current',
        link: 'https://github.com/EdgarJr28'
    },
];

const SliderProjectGallery = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [current, setCurrent] = useState(0);
    const total = proyects.length;

    const scrollTo = (index: number) => {
        if (!scrollRef.current) return;
        const width = scrollRef.current.clientWidth;
        scrollRef.current.scrollTo({ left: index * width, behavior: 'smooth' });
        setCurrent(index);
    };

    const prev = () => scrollTo(Math.max(current - 1, 0));
    const next = () => scrollTo(Math.min(current + 1, total - 1));

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '-60px' }}
            transition={{ duration: 0.7 }}
            className="w-full max-w-xs mdsm:max-w-5xl mx-auto"
        >
            <div
                ref={scrollRef}
                className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide rounded-lg"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {proyects.map((proyect) => (
                    <div key={proyect.id} className="snap-center shrink-0 w-full max-h-96">
                        <CardGallery data={proyect} />
                    </div>
                ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-4">
                <button
                    onClick={prev}
                    disabled={current === 0}
                    className="w-8 h-8 rounded-full bg-baseGreen/20 hover:bg-baseGreen/40 disabled:opacity-30 transition-colors text-white font-bold flex items-center justify-center"
                    aria-label="Previous"
                >
                    ‹
                </button>
                <div className="flex gap-2">
                    {proyects.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => scrollTo(i)}
                            className={`w-2 h-2 rounded-full transition-colors ${i === current ? 'bg-baseGreen' : 'bg-gray-400/50'}`}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
                <button
                    onClick={next}
                    disabled={current === total - 1}
                    className="w-8 h-8 rounded-full bg-baseGreen/20 hover:bg-baseGreen/40 disabled:opacity-30 transition-colors text-white font-bold flex items-center justify-center"
                    aria-label="Next"
                >
                    ›
                </button>
            </div>
        </motion.div>
    );
};

export default SliderProjectGallery;
