import React from 'react';
import '@/app/embla.css';
import Posts from '@/ui/components/Posts';
import { FaLongArrowAltRight } from 'react-icons/fa';

export default function Dashboard() {

    return (
        <div className="flex flex-col animate-in fade-in slide-in-from-top-8 duration-900 items-center justify-center">
            <div className="mt-4 relative">
                <h2 className="text-lg font-semibold">Novedades</h2>
                <div className="flex items-center justify-center gap-2 absolute top-2 right-4 cursor-pointer">
                    <a href="https://www.pijaossalud.com/" target="_blank" className='text-sm text-foreground'>Accede al blog</a>
                    <FaLongArrowAltRight />
                </div>
                <Posts />
            </div>
        </div>
    );
}