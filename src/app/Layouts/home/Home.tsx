import Image from 'next/image';
import ContactSection from './ContactSection';
import Timeline from './Timeline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines } from '@fortawesome/free-solid-svg-icons/faFileLines';

const Home = () => {
    return (
        <>
            <section className="bg-transparent pt-32 mdsm:pt-18 flex justify-center items-center transition-all">
                <div className="container mx-auto flex flex-col lg:flex-row items-center mdsm:mx-auto">
                    <div className="p-4 text-center lg:text-left lg:w-1/2 lg:pr-12">
                        <p className="text-baseGray dark:text-white">Welcome to my portfolio website! 🚀</p>
                        <h1 className="text-4xl font-bold my-4 dark:text-white">
                            Hello friends, I&apos;m <span className="text-baseBlue dark:text-yellow-300">Ed</span>
                        </h1>
                        <p className="text-baseGray dark:text-white mb-6">
                            Creating a successful product is a process that requires great energy and dedication. I specialize in designing exceptional user experiences, intuitive interfaces and high quality web development.
                        </p>
                        <div className="flex justify-center lg:justify-start gap-4">
                            <button className="bg-transparen dark:text-white border dark:border-white dark:hover:border-transparent border-baseBlack text-black py-2 px-4 rounded hover:bg-baseBlue hover:text-white transition-colors duration-300 hover:border-transparent">
                                <FontAwesomeIcon icon={faFileLines} className='py-[0.5%] px-1'/>
                                Dowload Resume
                            </button>
                            <button className="bg-baseGray text-white py-2 px-4 rounded">
                               Contact me
                            </button>
                        </div>
                    </div>
                    <div className="mt-8 lg:mt-0 w-full lg:w-1/2 flex justify-center rounded-lg">
                        <div className="relative h-0 w-full pb-[66.67%]">
                            <Image
                                src="/gifs/developer.gif"
                                alt="Illustration of a person at a desk"
                                layout="fill"
                                objectFit="cover"
                                className="rounded drop-shadow-xl mdsm:hover:scale-105 transition-all duration-300"
                                unoptimized={true}
                            />
                        </div>
                    </div>
                </div>
            </section>
            <section>
                <Timeline />
            </section>
            <section>
                <ContactSection />
            </section>
        </>
    );
}

export default Home;
