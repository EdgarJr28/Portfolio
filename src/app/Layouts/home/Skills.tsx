'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faJs, faNode, faReact, faHtml5, faCss3Alt, faAws, faAngular, faDocker, faGithub } from '@fortawesome/free-brands-svg-icons';
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
    { id: 11, name: 'SQL', icon: faDatabase, className: "text-pink-400" },
];

const SkillItem = ({ skill }: { skill: typeof skills[number] }) => (
    <div className="flex flex-col items-center justify-center px-8 py-2 shrink-0">
        <div className="flex items-center justify-center h-16 w-16 text-5xl bg-transparent rounded-full drop-shadow-xl">
            <FontAwesomeIcon icon={skill.icon} className={skill.className} />
        </div>
        <p className="mt-1 text-sm font-semibold text-center text-gray-700 dark:text-white">
            {skill.name}
        </p>
    </div>
);

const SkillCarousel = () => {
    return (
        <div className="w-full overflow-hidden mt-10">
            <p className="text-2xl font-semibold text-center dark:text-white p-4">Skills</p>
            <div className="flex animate-marquee-loop w-max">
                {[...skills, ...skills].map((skill, i) => (
                    <SkillItem key={i} skill={skill} />
                ))}
            </div>
        </div>
    );
};

export default SkillCarousel;
