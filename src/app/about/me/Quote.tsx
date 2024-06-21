'use client'
import React, { useEffect, useState } from 'react'
import Blessed from '../../../../public/svg/blessed'
import { useCtx } from '@/app/context/context';

const Quote = () => {
    const { color }: any = useCtx();
    useEffect(() => {
    }, [])
    return (
        <div className="text-center mdsm:pt-20">
            <p className="text-2xl mdsm:text-4xl font-mono text-baseGray dark:text-white">"all that hard work gonna pay off"</p>
            <div className="flex justify-center items-center mt-4">
                <div className="h-28 mdsm:h-32 mdw-40 mdsm:w-52 flex justify-center items-center relative">
                    <Blessed color={color} className="w-32 h-32 mdsm:w-40 mdsm:h-40" />
                </div>
            </div>
        </div>
    )
}

export default Quote
