'use client';

import React, { useState, useEffect } from 'react';
import LoaderLanding from './LoaderLanding';


const ClientOnlyWrapper = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return loading ? <LoaderLanding /> : <>{children}</>;
};

export default ClientOnlyWrapper;
