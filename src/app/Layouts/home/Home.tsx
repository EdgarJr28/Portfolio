import Image from 'next/image';

const Home = () => {
    return (
        <section className="bg-transparent pt-32 mdsm:pt-18 flex justify-center items-center transition-all">
            <div className="container mx-auto flex flex-col lg:flex-row items-center mdsm:mx-auto">
                <div className="p-4 text-center lg:text-left lg:w-1/2 lg:pr-12">
                    <p className="text-baseGray dark:text-white">¡Bienvenido al sitio web de mi portafolio! 🚀</p>
                    <h1 className="text-4xl font-bold my-4 dark:text-white">
                        Hola amigos, soy <span className="text-baseBlue dark:text-yellow-300">Ed</span>
                    </h1>
                    <p className="text-baseGray dark:text-white mb-6">
                        La creación de un producto exitoso es un proceso que demanda gran energía y dedicación. Me especializo en diseñar experiencias de usuario excepcionales, interfaces intuitivas y en desarrollo web de alta calidad.
                    </p>
                    <div className="flex justify-center lg:justify-start gap-4">
                        <button className="bg-transparen dark:text-white border dark:border-white dark:hover:border-transparent border-baseBlack text-black py-2 px-4 rounded hover:bg-baseBlue hover:text-white transition-colors duration-300 hover:border-transparent">
                            Descargar Currículum
                        </button>
                        <button className="bg-baseGray text-white py-2 px-4 rounded">
                            Contáctame
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
    );
}

export default Home;
