import React from 'react';
import EmblaCarousel from '@/ui/components/EmblaCarousel';
import '@/app/embla.css';

const OPTIONS = { loop: true }
const SLIDES = [
    "/images/foto1.jpg",
    "/images/foto2.jpg",
    "/images/foto3.jpg",
    "/images/foto4.jpg",
]

export default function Dashboard() {

    return (
        <div className="flex flex-col animate-in fade-in slide-in-from-top-8 duration-900 items-center justify-center">
            <EmblaCarousel slides={SLIDES} options={OPTIONS} />
        </div>
    );
}