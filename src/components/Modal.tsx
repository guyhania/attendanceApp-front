import { ReactNode } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">

                <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl">
                    ✖
                </button>

                {/* Content */}
                {children}
            </div>
        </div>
    );
};
export default Modal;
