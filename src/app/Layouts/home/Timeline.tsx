import React from 'react';

const experiences = [
    {
        position: "Jr Developer",
        company: "Soluciona Ingeinería SAS",
        year: "2019 - 2020"
    },
    {
        position: "Developer Freelancer",
        company: "",
        year: "2021 - 2022"
    },
    {
        position: "Developer",
        company: "Intra Technology",
        year: "2022 - 2023"
    }
];

const educations = [
    {
        title: "Systems Analyst",
        university: "SENA",
        year: "2020"
    },
    {
        title: "Systems Engineer",
        university: "CUC University",
        year: "2021 - Current"
    },
];

const Timeline = () => {
    return (
        <div className="flex items-center justify-center h-screen space-x-12">
            <div className="rounded-sm p-2 dark:text-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Experiences Section */}
                    <div className={`mx-12 mdsm:mx-20`}>
                        <h2 className="text-xl font-bold mb-4">Experiences</h2>
                        <div className="relative">
                            {experiences.map((experience, index) => (
                                <div key={index} className="relative">
                                    <div className="absolute top-0 left-5 h-full border-l-2 border-gray-300"></div>
                                    <div className="flex items-center mb-2 2-full relative z-10">
                                        <span className="bg-baseGray text-white dark:bg-white dark:text-black rounded-full h-10 w-10 flex items-center justify-center">
                                            {experience.year.split(' ')[0]}
                                        </span>
                                        <h3 className="ml-4 text-lg  font-semibold text-nowrap">{experience.position}</h3>
                                    </div>
                                    <div className="ml-14 relative z-10">
                                        <p className="font-normal text-nowrap">{experience.company}</p>
                                        <p className="font-light text-sm text-nowrap">{experience.year}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Education Section */}
                    <div className={`mx-12 mx-20`}>
                        <h2 className="text-xl font-bold mb-4">Educations</h2>
                        <div className="relative">
                            {educations.map((education, index) => (
                                <div key={index} className=" relative">
                                    <div className="absolute top-0 left-5 h-full border-l-2 border-gray-300"></div>
                                    <div className="flex items-center mb-2 relative z-10">
                                        <span className="bg-baseGray text-white dark:bg-white dark:text-black rounded-full h-10 w-10 flex items-center justify-center">
                                            {education.year.split(' ')[0]}
                                        </span>
                                        <h3 className="ml-4 text-lg font-semibold">{education.title}</h3>
                                    </div>
                                    <div className="ml-14 relative z-10">
                                        <p className="font-normal text-nowrap">{education.university}</p>
                                        <p className="font-light text-sm text-nowrap">{education.year}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Timeline;
