'use client'
import InputWithLabel from '@/app/components/Inputs/InputWithLabel'
import { faConnectdevelop } from '@fortawesome/free-brands-svg-icons'
import { faGithubSquare } from '@fortawesome/free-brands-svg-icons/faGithubSquare'
import { faSquareFacebook } from '@fortawesome/free-brands-svg-icons/faSquareFacebook'
import { faSquareInstagram } from '@fortawesome/free-brands-svg-icons/faSquareInstagram'
import { faSquareXTwitter } from '@fortawesome/free-brands-svg-icons/faSquareXTwitter'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import React, { useState } from 'react'

const Footer = () => {
    const [formData, setFormData] = useState({
        email: ''
    });


    const handleChange = ({ target: { name, value } }: any) => {
        setFormData({ ...formData, [name]: value })
    }
    return (
        <footer className="bg-transparent text-baseBlack dark:text-white pt-10 mdsm:pt-4 pb-1 transition-all">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Logo and Social Media */}
                    <div className="flex flex-col md:flex-col md:items-start items-center">
                        <h2 className="text-center dark:text-white font-bold lg:py-10 w-32 mb-4 lg:blur-md text-2xl text-baseBlack hover:blur-0 transition-all duration-500 ease-in-out hover:scale-105 cursor-pointer">
                            <FontAwesomeIcon icon={faConnectdevelop} width={30} height={30} />
                            EdDev
                        </h2>
                        <div className="flex space-x-2">
                            <a target="_blank" rel="noopener noreferrer">
                                <FontAwesomeIcon
                                    icon={faSquareFacebook}
                                    width={30} height={30}
                                    className="text-4xl hover:text-blue-500 hover:scale-105 transition duration-300"
                                />
                            </a>
                            <a target="_blank" rel="noopener noreferrer">
                                <FontAwesomeIcon
                                    icon={faSquareXTwitter}
                                    width={30} height={30}
                                    className="text-4xl hover:text-baseGray hover:scale-105 transition duration-300"
                                />
                            </a>
                            <a target="_blank" rel="noopener noreferrer">
                                <FontAwesomeIcon
                                    icon={faSquareInstagram}
                                    width={30}
                                    height={30}
                                    className="text-4xl  hover:text-red-300 hover:scale-105 transition duration-300"
                                />
                            </a>
                            <a target="_blank" rel="noopener noreferrer">
                                <FontAwesomeIcon
                                    icon={faGithubSquare}
                                    width={30}
                                    height={30}
                                    className="text-4xl hover:text-purple-950 hover:scale-105 transition duration-300"
                                />
                            </a>
                        </div>
                    </div>
                    {/* Navigation Links */}
                    <div className='text-center'>
                        <h2 className="text-lg font-bold mb-4">Enlaces Rápidos</h2>
                        <ul className="space-y-2">
                            <li><Link className='hover:text-baseBlue' href="/">Home</Link></li>
                            <li><Link className='hover:text-baseBlue' href="#">About</Link></li>
                        </ul>
                    </div>
                    {/* Newsletter Subscription */}
                    <div>
                        <h2 className="text-lg text-center font-bold mb-4">Suscríbete al boletín</h2>
                        <form>
                            <InputWithLabel onChange={handleChange} type={"email"} name="email" placeholder={"Introduce tu correo"} label="E-mail" value={formData.email} className="w-full p-2 mb-4 text-baseBlack border-baseGray dark:border-white" />
                            <button
                                type="submit"
                                className="w-full bg-transparent text-baseBlack border dark:text-white dark:hover:text-baseBlack dark:border-white border-baseBlack py-2 hover:scale-105 transition-transform duration-300 ease-in-out hover:bg-white hover:text-black"
                            >
                                Suscribirse
                            </button>
                        </form>
                    </div>
                </div>
                <div className="text-center mt-8">
                    <p className='text-xs text-baseGray dark:dark:text-white dark:font-light font-semibold transition-all duration-300'>&copy; 2024 EdDev, Inc. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer >
    )
}

export default Footer
