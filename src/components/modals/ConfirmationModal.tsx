import React from 'react';
import Icon from '../ui/Icon';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-sm p-8 text-center" onClick={e => e.stopPropagation()}>
                <Icon name="warning_amber" className="text-5xl text-brand-red mx-auto mb-4" />
                <h2 className="text-xl font-bold text-brand-gray dark:text-white">{title}</h2>
                <p className="text-brand-gray-light dark:text-gray-400 mt-2">{message}</p>
                <div className="flex justify-center space-x-4 mt-8">
                    <button onClick={onClose} className="py-2 px-6 rounded-lg text-brand-gray dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">Cancelar</button>
                    <button onClick={onConfirm} className="bg-brand-red hover:opacity-90 text-white font-bold py-2 px-6 rounded-lg transition-colors">Confirmar</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
