
import Image from 'next/image';
import React from 'react';

const Bio = () => {
    return (
        <div className="container mx-auto px-4 py-8 md:flex md:space-x-8 dark:text-white">
            <div className="md:w-1/2">
                <div className="inline-flex items-center">
                    <Image src="/gifs/Hi.gif" alt="Hi" width={45} height={30} />
                    <h2 className="text-3xl font-bold mt-2 ml-2">Note</h2>
                </div>

                <p className="text-baseGray dark:text-white">
                    "I'm a technology enthusiast with strong skills in web development. My meticulous approach blends seamlessly with a fervent passion for solving complex problems. Experienced in data analysis, I am eager to contribute to innovative projects where I can apply my attention to detail and unwavering commitment to continuous learning."
                </p>
            </div>
            <div className="md:w-1/2 mt-4 md:mt-0">
                <Image
                    width={200}
                    height={250}
                    src="/images/developer_banner.jpg"
                    alt="Imagen"
                    layout="responsive"
                    className="object-cover w-full h-auto md:h-full rounded-lg"
                    quality={100}  // Ajusta la calidad según sea necesario, valor entre 1 y 100
                />
            </div>
        </div>
    );
};

export default Bio;
