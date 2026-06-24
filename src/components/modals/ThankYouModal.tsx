
import React, { useState, useEffect } from 'react';
import Icon from '../ui/Icon';

interface ThankYouModalProps {
    isOpen: boolean;
    onClose: () => void;
    guestName: string;
    phoneNumber?: string;
    coupleNames: [string, string];
}

const ThankYouModal: React.FC<ThankYouModalProps> = ({ isOpen, onClose, guestName, phoneNumber, coupleNames }) => {
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (isOpen && phoneNumber) {
            const guestFirstName = guestName.split(' ')[0];
            const initialMessage = `Oi ${guestFirstName}, muito obrigado pelo presente! Fiquei muito feliz com essa lembrança que fará parte do nosso dia especial.`;
            setMessage(initialMessage);
        }
    }, [isOpen, guestName, phoneNumber]);

    const handleSend = () => {
        if (!phoneNumber) return;
        const cleanPhone = phoneNumber.replace(/\D/g, '');
        const encodedMessage = encodeURIComponent(message);
        const url = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
        window.open(url, '_blank');
        onClose();
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold font-title text-brand-gray dark:text-white">Escrever Mensagem de Agradecimento</h2>
                        <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                            <Icon name="close" />
                        </button>
                    </div>

                    {phoneNumber ? (
                        <div className="space-y-4">
                            <p className="text-sm text-brand-gray-light dark:text-gray-400">
                                Para: <span className="font-semibold text-brand-gray dark:text-gray-200">{guestName}</span>
                            </p>
                            <div>
                                <label htmlFor="thankYouMessage" className="block text-sm font-medium mb-1">Mensagem</label>
                                <textarea
                                    id="thankYouMessage"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    rows={6}
                                    className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 focus:ring-brand-gold focus:border-brand-gold"
                                ></textarea>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center p-4">
                             <Icon name="error_outline" className="text-4xl text-brand-red mx-auto mb-3" />
                             <p className="text-brand-gray dark:text-gray-200">Número de telefone não cadastrado para este convidado.</p>
                        </div>
                    )}
                </div>

                <div className="flex justify-end space-x-4 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-b-xl">
                    <button type="button" onClick={onClose} className="py-2 px-6 rounded-lg text-brand-gray dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">
                        {phoneNumber ? 'Cancelar' : 'Fechar'}
                    </button>
                    {phoneNumber && (
                        <button type="button" onClick={handleSend} className="bg-brand-green hover:opacity-90 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center space-x-2">
                            <Icon name="whatsapp" className="text-lg" />
                            <span>Enviar via WhatsApp</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ThankYouModal;
