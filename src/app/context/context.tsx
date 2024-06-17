import { createContext, useState, useContext, useEffect } from "react";
import { ReactNode } from "react";

const Context = createContext("");
export const useCtx = () => useContext(Context);

/* 
Context es una hook propio de react para manejar el comportamiento de variales y componentes
en un entorno local.
*/


export function CtxProvider({ children }: { children: ReactNode }) {


    /*
    Instnaciamos los useStates de todos nuestros componentes que usaremos en el proyecto
    */

    useEffect(() => {
        localStorage.getItem('darkMode') === 'dark' ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark');
    }, [])


    /* Devuelve componente de los hooks implementados en el context*/
    return (
        <Context.Provider value="">
            {children}
        </Context.Provider>
    );
};