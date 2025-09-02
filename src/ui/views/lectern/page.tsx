import React from "react";
import { useView } from "@/ui/context/ViewContext";
import Trigger from "@/ui/subViews/transfer/trigger";
import { PiLecternBold } from "react-icons/pi";

export default function Lectern() {
  const { setView } = useView();

  return (
      <div className="flex flex-col gap-2 p-6">
        <div className="flex justify-end gap-2">
            <div className="group relative inline-flex h-[50px] w-[70px] items-center justify-center rounded-md transition-all duration-200 ease-in hover:w-[130px] overflow-hidden" onClick={() => setView("dashboard")}>
                <span className="absolute left-[18px] flex items-center justify-center">
                    <PiLecternBold className="w-7 h-7" />
                </span>
                <span
                  className="ml-[2.5rem] whitespace-nowrap opacity-0 translate-x-full transition-all duration-200 ease-in group-hover:translate-x-0 group-hover:opacity-100 hover:cursor-pointer"
                >
                    Cerrar
                </span>
                <span className="absolute inset-0 -z-10 translate-x-full group-hover:translate-x-0 transition-transform duration-200 ease-in bg-gray-200 rounded-md"></span>
            </div>
        </div>
        <div className="flex-1 outline-none grid-cols-1 flex flex-wrap md:flex-nowrap align-center justify-center">
          <Trigger />
        </div>
      </div>
  );
  }