import React from 'react';
import '@/app/embla.css';
import Posts from '@/ui/components/Posts';
import { useView } from '@/ui/context/ViewContext';
import { Card, CardContent } from '@/ui/components/ui/card';
import { BsCSquareFill } from "react-icons/bs";
import { GrCloudlinux } from "react-icons/gr";
import GoTo from '@/ui/components/GoTo';

export default function Dashboard() {
    const { recentSubViews, setSubView } = useView();

    return (
        <div className="flex flex-col animate-in fade-in slide-in-from-top-8 duration-900 items-center justify-center gap-5">
            <div className="p-3 relative w-full">
                <h2 className="text-lg font-semibold">Novedades</h2>
                <GoTo message='Accede al blog' link='https://www.pijaossalud.com/'/>
                <Posts />
            </div>
            <div className="grid sm:grid-cols-2 gap-2 w-full">
                <Card className="bg-white rounded-2xl shadow-lg border border-gray-100 w-full">
                    <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-4 relative">
                            <h2 className="text-lg font-bold">Más Recientes</h2>
                            <GoTo message='Todas las configuraciones' link=''/>
                        </div>

                        <div className="flex justify-between items-center p-4">
                        {recentSubViews.map((app, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-2">
                                <div className="relative">
                                    <button
                                    onClick={() => setSubView(app)}
                                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-secondary text-white text-2xl shadow hover:bg-secondary/70 transition hover:cursor-pointer"
                                    >
                                    <BsCSquareFill />
                                    </button>
                                </div>
                                <span className="text-sm font-medium text-gray-700">{app}</span>
                            </div>
                        ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-primary rounded-2xl shadow-lg border border-gray-100 w-full">
                    <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-4 relative">
                            <h2 className="text-lg font-bold">Más Aplicativos</h2>
                            <GoTo message='Todas las configuraciones' link='' />
                        </div>

                        <div className="flex justify-between items-center p-4">
                            <div  className="flex flex-col items-center gap-2">
                                <a className="relative" href="https://centrodeayuda.pijaossalud.com/">
                                    <button
                                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-chart-1 text-white text-2xl shadow hover:bg-chart-1/70 hover:cursor-pointer"
                                    >
                                    <GrCloudlinux />
                                    </button>
                                </a>
                                <span className="text-sm font-medium text-gray-700">Centro de ayuda</span>
                            </div>
                            <div  className="flex flex-col items-center gap-2">
                                <a className="relative" href="https://eps.gemanet.pijaossalud.com/gemanet/">
                                    <button
                                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-chart-1 text-white text-2xl shadow hover:bg-chart-1/70 hover:cursor-pointer"
                                    >
                                    <GrCloudlinux />
                                    </button>
                                </a>
                                <span className="text-sm font-medium text-gray-700">Portal administrativo Gema Net EPS</span>
                            </div>
                            <div  className="flex flex-col items-center gap-2">
                                <a className="relative" href="https://gemanet.pijaossalud.com/gemanet/">
                                    <button
                                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-chart-1 text-white text-2xl shadow hover:bg-chart-1/70 hover:cursor-pointer"
                                    >
                                    <GrCloudlinux />
                                    </button>
                                </a>
                                <span className="text-sm font-medium text-gray-700">Portal administrativo Gema Net IPS</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}