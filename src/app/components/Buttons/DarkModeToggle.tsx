'use client'
import { useCtx } from '@/app/context/context';
import { useEffect, useState } from 'react';

const DarkModeToggle = () => {
    const [darkMode, setDarkMode] = useState(false);
    const { setColor }: any = useCtx();

    useEffect(() => {
        localStorage.getItem('darkMode') === 'dark' ? setDarkMode(true) : setDarkMode(false);
        // Aplicar la clase 'dark' al body cuando el modo oscuro está activado
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const toggleDarkMode = () => {
        localStorage.getItem('darkMode') === 'dark' ? setColor('black') : setColor('white');
        setDarkMode((prevMode) => !prevMode);
        // Opcional: Guardar el estado en localStorage para persistencia
        localStorage.setItem('darkMode', !darkMode ? 'dark' : 'light');
    };

    return (
        <button
            className="bg-gray-300 dark:bg-dark-200 rounded-full w-12 h-6 flex items-center justify-center focus:outline-none"
            onClick={toggleDarkMode}
        >
            <div className={`p-1 w-12 h-8 rounded-full  flex items-center  transition-transform duration-300 transform ${darkMode ? 'translate-x-6' : ''}`}>
                <span className="text-xs">{darkMode ? '🌙' : '☀️'}</span>
            </div>
        </button>

    );
};

export default DarkModeToggle;
