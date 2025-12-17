import React from 'react';
import Icon from '../ui/Icon';

interface OnboardingModalProps {
    onClose: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-8 text-center animate-fadeIn">
                <div className="bg-brand-gold/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon name="celebration" className="text-4xl text-brand-gold" />
                </div>
                
                <h2 className="text-2xl font-bold text-brand-gray dark:text-white mb-3 font-title">
                    Vamos planejar o seu Grande Dia?
                </h2>
                
                <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                    Para dar o primeiro passo no planejamento do seu casamento, precisamos conhecer algumas informações básicas sobre o evento.
                </p>

                <button 
                    onClick={onClose}
                    className="w-full bg-brand-pink hover:opacity-90 text-brand-gray font-bold py-3.5 px-6 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg dark:bg-brand-gold dark:text-gray-900"
                >
                    Cadastrar Agora
                </button>
            </div>
        </div>
    );
};

export default OnboardingModal;