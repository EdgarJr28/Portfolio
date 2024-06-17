'use client'
import React, { useState, useCallback } from 'react';
import Button from '@/app/components/Buttons/Button';
import InputWithLabel from '@/app/components/Inputs/InputWithLabel';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Map from '@/app/components/Map/Map';
import PopUp from '@/app/components/PopUps/PopUp';

const ContactSection = () => {
    const [errors, setErrors] = useState<any>({});
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        message: ''
    });
    const [PopUpStatus, setPopUpStatus] = useState(false)
    const [propsPopUp, setPropsPopUp] = useState({
        status: false,
        message: ''
    })

    const handleChange = useCallback((e: any) => {
        setErrors({});
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }, []);



    const handleSend = async (e: any) => {
        try {
            e.preventDefault();
            const newErrors: any = {};
            if (formData.email === '') {
                newErrors.email = 'The email is required';
            }
            if (formData.name === '') {
                newErrors.name = 'The name is required';
            }
            if (formData.message === '') {
                newErrors.message = 'The message is required';
            }

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            } else {
                // Submit the form or perform further actions
                setErrors({}); // Clear errors if no errors found
            }

            /* const response = await fetch('/api/sendEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            await response.json();
            if (response.ok) {
                setFormData({ email: '', name: '', message: '' });
                setPopUpStatus(true);
                setPropsPopUp({ status: true, message: 'Message sent successfully' })
                setTimeout(() => {
                    setPopUpStatus(false)
                }, 4000);
            } */
        } catch (error: any) {
            setPopUpStatus(true);
            setPropsPopUp({ status: false, message: 'Error sending message' })
            setTimeout(() => {
                setPopUpStatus(false)
            }, 4000);
        }
    }

    const handleCloseModal = () => {
        setPopUpStatus(false);
    };


    return (
        <div className="flex flex-col md:flex-row items-center my-10 md:items-start md:justify-between p-6 bg-transparent dark:bg-dark-100">
            <div className="w-full md:w-1/2 mb-6 md:mb-0 pt-12">
                <Map />
                <div className="mt-4 dark:text-white">
                    <h2 className="text-xl font-semibold ">Hello! 👋🏻</h2>
                    <h3 className="text-md font-semibold mb-2 text-baseGray dark:text-white" >You can contact me here </h3>
                    <p>Phone: +57 3002752149</p>
                    <p>Email: Ed.dev28@gmail.com</p>
                </div>
            </div>
            <div id="contact" className="w-full my-6 md:w-1/2 mx-2 rounded-lg transition-all duration-300">
                <h2 className="text-lg pt-4 font-semibold mb-4 text-center text-baseBlack dark:text-white">Interested to work together? Let&apos;s talk</h2>
                {Object.keys(errors).length > 0 && (
                    <p className=" w-full ml-5 text-red-500 text-xs md:text-sm whitespace-nowrap">
                        🚨 Fields are required
                    </p>
                )}
                <form className="px-6 pb-6 pt-1 rounded-lg" onSubmit={handleSend}>
                    <div className="mb-4">
                        <InputWithLabel
                            onChange={handleChange}
                            type="text"
                            name="name"
                            placeholder="Introduce tu nombre"
                            label="Name"
                            value={formData.name}
                            className={`w-full p-2 mb-4 text-baseBlack border-baseGray dark:border-white ${errors.name ? 'border-2 border-red-400' : ''}`}
                        />
                    </div>
                    <div className="mb-4">
                        <InputWithLabel
                            onChange={handleChange}
                            type="email"
                            name="email"
                            placeholder="Introduce tu correo"
                            label="Email"
                            value={formData.email}
                            className={`w-full p-2 mb-4 text-baseBlack border-baseGray dark:border-white ${errors.email ? 'border-2 border-red-400' : ''}`}
                        />
                    </div>
                    <div className={`mb-4 border border-baseGray rounded-md focus:outline-none text-sm dark:border-white dark:text-white ${errors.message ? 'border-2 border-red-400 ' : ''}`}>
                        <label htmlFor="message" className="p-1 px-2 block text-sm text-baseBlack dark:text-white">Message</label>
                        <textarea
                            id="message"
                            onChange={handleChange}
                            value={formData.message}
                            name="message"
                            rows={4}
                            placeholder="Your message"
                            className={`w-full resize-none px-2 py-2 text-xs dark:bg-dark-100 focus-within:outline-none`}
                            maxLength={150}
                        />
                    </div>
                    <Button type="submit"
                        className="text-center
                         w-full border border-baseBlack
                       dark:border-white dark:text-white hover:bg-baseBlue 
                         hover:border-transparent hover:text-white 
                       dark:hover:bg-yellow-300
                         dark:hover:border-none
                       dark:hover:text-baseGray
                         transition-all duration-300"
                    >
                        Contact Me
                    </Button>
                </form>
                {PopUpStatus && (
                    <PopUp status={propsPopUp.status} message={`${propsPopUp.message}`} onClose={handleCloseModal} />
                )}
            </div>
        </div>
    );
};

export default ContactSection;
