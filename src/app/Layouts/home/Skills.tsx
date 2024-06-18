'use client'
import Slider from 'react-slick';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faJs, faNode, faReact, faHtml5, faCss3Alt, faAws, faAngular, faDocker, faGithub } from '@fortawesome/free-brands-svg-icons';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { faDatabase } from '@fortawesome/free-solid-svg-icons';

const skills = [
    { id: 1, name: 'JavaScript', icon: faJs, className: "text-yellow-300" },
    { id: 2, name: 'Node.js', icon: faNode, className: "text-green-400" },
    { id: 3, name: 'React', icon: faReact, className: "text-baseBlue" },
    { id: 4, name: 'HTML5', icon: faHtml5, className: "text-orange-500" },
    { id: 5, name: 'CSS3', icon: faCss3Alt, className: "text-blue-400" },
    { id: 7, name: 'Git', icon: faGithub, className: "text-black dark:text-white" },
    { id: 8, name: 'Angular', icon: faAngular, className: "text-red-500" },
    { id: 9, name: 'AWS', icon: faAws, className: "dark:text-white" },
    { id: 10, name: 'Docker', icon: faDocker, className: "text-blue-400" },
    { id: 11, name: 'Sql', icon: faDatabase, className: "text-pink-400" },
];

const SkillCarousel = () => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        autoplay: true,
        slidesToScroll: 1,
        arrows: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <div className="w-full max-w-xs mdsm:max-w-lg mx-auto mt-10">
            <p className="text-lg text-center dark:text-white " >Skills</p>
            <Slider {...settings}>
                {skills.map((skill) => (
                    <div key={skill.id} className="flex flex-col items-center justify-center p-4">
                        <div className="flex w-full items-center justify-center h-24 text-6xl text-gray-700 bg-transparent rounded-full drop-shadow-xl">
                            <FontAwesomeIcon icon={skill.icon} className={skill.className} />
                        </div>
                        <p className="mt-1 text-sm font-semibold text-center text-gray-700 dark:text-white">
                            {skill.name}
                        </p>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default SkillCarousel;
