"use client";

import React from 'react';
import Icon from '../ui/Icon';

interface OnboardingModalProps {
    onClose: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-8 text-center" onClick={e => e.stopPropagation()}>
                <Icon name="waving_hand" className="text-5xl text-brand-gold mx-auto mb-4" />
                <h2 className="text-2xl font-bold font-title text-brand-gray dark:text-white">Bem-vindo(a) ao Wedding Planner!</h2>
                <p className="text-brand-gray-light dark:text-gray-400 mt-4">
                    Para começar, personalize os detalhes do seu casamento. Acesse o menu <span className="font-bold text-brand-gold">'Ajustes'</span> para inserir os nomes do casal, a data, o orçamento e mais.
                </p>
                <div className="flex justify-center mt-8">
                    <button 
                        onClick={onClose} 
                        className="bg-brand-pink hover:opacity-90 text-brand-gray font-bold py-3 px-8 rounded-lg transition-colors dark:bg-brand-gold dark:text-gray-900"
                    >
                        Vamos Começar!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OnboardingModal;