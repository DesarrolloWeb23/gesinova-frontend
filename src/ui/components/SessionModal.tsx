import { useEffect } from "react";
import { Dialog } from "@headlessui/react";

export const SessionModal = ({
    isOpen,
    onClose,
    onConfirm,
    timeout = 10000, // tiempo en ms (10 segundos por defecto)
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    timeout?: number;
}) => {

    useEffect(() => {
        if (!isOpen) return;

        // inicia temporizador al abrir el modal
        const timer = setTimeout(() => {
        onClose(); // cierra automáticamente
        }, timeout);

        // limpia el temporizador si el modal se cierra antes
        return () => clearTimeout(timer);
    }, [isOpen, onClose, timeout]);

    return (
        <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
        <div className="flex min-h-screen items-center justify-center bg-gray-200 bg-opacity-0">
            <Dialog.Panel className="w-96 rounded bg-white p-6 shadow-xl">
            <Dialog.Title className="text-lg font-medium">
                ¿Deseas extender tu sesión?
            </Dialog.Title>

            <p className="mt-2 text-sm text-gray-600">
                Tu sesión está por expirar. ¿Quieres renovarla?
            </p>

            <div className="mt-4 flex justify-end gap-2">
                <button
                onClick={onClose}
                className="rounded px-4 py-1 text-red-500 hover:bg-red-50"
                >
                No
                </button>

                <button
                onClick={() => {
                    onConfirm();
                    onClose();
                }}
                className="rounded bg-blue-500 px-4 py-1 text-white hover:bg-blue-600"
                >
                Sí
                </button>
            </div>
            </Dialog.Panel>
        </div>
        </Dialog>
    );
};
