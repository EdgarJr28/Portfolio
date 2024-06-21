'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import BurguerButton from './burguerButton/BurguerButton.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faConnectdevelop } from '@fortawesome/free-brands-svg-icons';
import DarkModeToggle from '@/app/components/Buttons/DarkModeToggle';

const Navbar = () => {
  const [active, setActive] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    if (active) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    // Validar si el scroll está abajo al cargar la página
    const isScrolledToBottom = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      return scrollTop + windowHeight >= documentHeight;
    };

    if (isScrolledToBottom()) {
      setScrolled(true);
    }

    isScrolledToBottom();
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [active]);

  const handleClick = () => {
    setActive(!active);
  };

  return (
    <div>
      <nav className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 py-2 mdsm:py-4 ${scrolled ? 'backdrop-blur-md' : 'bg-transparent'} transition-colors duration-300`}>
        <Link href="/">
          <h2 className="text-xl font-medium text-baseBlack dark:text-white transition-all duration-700">
            <FontAwesomeIcon icon={faConnectdevelop} width={30} height={30} className="mr-2 hover:animate-spin transition-all duration-300" />
            EdDev
          </h2>
        </Link>
        <div className={`hidden md:flex items-center space-x-4 ${active ? 'fixed top-20 left-0 right-0 bg-gray-800 p-8 rounded-b-lg z-50' : 'md:relative'}`}>
          <Link href="/" className="text-baseBlack dark:text-white hover:text-baseBlue dark:hover:text-yellow-300 hover:scale-125 transition-all duration-300" >Home</Link>
          <Link href="/about" className="text-baseBlack dark:text-white hover:text-baseBlue dark:hover:text-yellow-300 hover:scale-125 transition-all duration-300">About</Link>
          <DarkModeToggle />
          {/* Add more links as needed */}
        </div>
        <div className={`flex md:hidden items-center justify-end space-x-2`}>
          <DarkModeToggle />
          <BurguerButton active={active} handleClick={handleClick} />
        </div>

      </nav>
      {active && (
        <div className="fixed top-20 left-0 right-0 h-screen bg-transparent bg-opacity-50 z-40 backdrop-blur-md transition-all duration-300">
          {/* Additional links for mobile menu */}
          <div className="flex flex-col items-center pt-8">
            <Link href="/" onClick={handleClick} className="text-baseBlack dark:text-white text-2xl mb-4">Home</Link>
            <Link href="/about" onClick={handleClick} className="text-baseBlack dark:text-white text-2xl mb-4">About</Link>
            {/* Add more links as needed */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
