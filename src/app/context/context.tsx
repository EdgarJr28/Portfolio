'use client'
import { createContext, useState, useContext, useEffect, Dispatch } from "react";
import { ReactNode } from "react";

interface ContextValue {
    modalGalery: any;
    setModalGalery: Dispatch<any>;
    color: any;
    setColor: Dispatch<any>;
}

const Context = createContext<ContextValue>({ modalGalery: null, setModalGalery: () => { }, color: null, setColor: () => { } });
export const useCtx = () => useContext(Context);

/* 
Context es una hook propio de react para manejar el comportamiento de variales y componentes
en un entorno local.
*/


export function CtxProvider({ children }: { children: ReactNode }) {


    /*
    Instnaciamos los useStates de todos nuestros componentes que usaremos en el proyecto
    */
    const [color, setColor] = useState<any>();
    const [modalGalery, setModalGalery] = useState<any>({
        status: false,
        data: {}
    });
    useEffect(() => {
        localStorage.getItem('darkMode') === 'dark' ? setColor('white') : setColor('black');
        localStorage.getItem('darkMode') === 'dark' ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark');
    }, [])


    /* Devuelve componente de los hooks implementados en el context*/
    return (
        <Context.Provider value={{
            modalGalery,
            setModalGalery,
            color,
            setColor
        }}>
            {children}
        </Context.Provider>
    );
};