"use client"
import { TbDeviceDesktopShare } from 'react-icons/tb';
import { PiLecternBold } from 'react-icons/pi';

export default function MenuTransfer() {
    return (
        <div className="flex justify-end gap-2">
            <div className="group relative inline-flex h-[50px] w-[70px] items-center justify-center rounded-md transition-all duration-200 ease-in hover:w-[130px] overflow-hidden">
                <span className="absolute left-[18px] flex items-center justify-center">
                    <TbDeviceDesktopShare className="w-7 h-7" />
                </span>
                <span
                    className="ml-[2.5rem] whitespace-nowrap opacity-0 translate-x-full transition-all duration-200 ease-in group-hover:translate-x-0 group-hover:opacity-100 hover:cursor-pointer"
                >
                    Pantalla
                </span>
                <span className="absolute inset-0 -z-10 translate-x-full group-hover:translate-x-0 transition-transform duration-200 ease-in bg-gray-200 rounded-md"></span>
            </div>
            <div className="group relative inline-flex h-[50px] w-[70px] items-center justify-center rounded-md transition-all duration-200 ease-in hover:w-[130px] overflow-hidden">
                <span className="absolute left-[18px] flex items-center justify-center">
                    <PiLecternBold className="w-7 h-7" />
                </span>
                <span
                    className="ml-[2.5rem] whitespace-nowrap opacity-0 translate-x-full transition-all duration-200 ease-in group-hover:translate-x-0 group-hover:opacity-100 hover:cursor-pointer"
                >
                    Atril
                </span>
                <span className="absolute inset-0 -z-10 translate-x-full group-hover:translate-x-0 transition-transform duration-200 ease-in bg-gray-200 rounded-md"></span>
            </div>
        </div>
    );
}