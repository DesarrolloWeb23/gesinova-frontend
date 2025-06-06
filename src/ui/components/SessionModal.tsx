import { Dialog } from "@headlessui/react";

export const SessionModal = ({
    isOpen,
    onClose,
    onConfirm,
    }: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    }) => {
    return (
        <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0">
        <div className="flex items-center justify-center min-h-screen bg-gray-200 bg-opacity-0">
            <Dialog.Panel className="bg-white p-6 rounded shadow-xl w-96">
            <Dialog.Title>¿Deseas extender tu sesión?</Dialog.Title>
            <p className="mt-2 text-sm text-gray-600">
                Tu sesión está por expirar. ¿Quieres renovarla?
            </p>
            <div className="mt-4 flex justify-end gap-2">
                <button onClick={onClose} className="text-red-500">
                No
                </button>
                <button
                onClick={() => {
                    onConfirm();
                    onClose();
                }}
                className="bg-blue-500 text-white px-4 py-1 rounded"
                >
                Sí
                </button>
            </div>
            </Dialog.Panel>
        </div>
        </Dialog>
    );
};
