"use client";

import React, { useState, useEffect } from 'react';
import { Gift, GiftFormData } from '../../types';
import Icon from '../ui/Icon';
import FormField from '../ui/FormField'; // Importar FormField

interface EditGiftModalProps {
    gift: Gift;
    onClose: () => void;
    onSave: (giftId: string, data: GiftFormData) => void;
}

const EditGiftModal: React.FC<EditGiftModalProps> = ({ gift, onClose, onSave }) => {
    const [amount, setAmount] = useState<number | string>(gift.amount === 0 ? '' : gift.amount); // Inicializa com string vazia se for 0
    const [description, setDescription] = useState(gift.description);
    const [thankYouSent, setThankYouSent] = useState(gift.thankYouSent);

    useEffect(() => {
        setAmount(gift.amount === 0 ? '' : gift.amount); // Também atualiza com string vazia se for 0
        setDescription(gift.description);
        setThankYouSent(gift.thankYouSent);
    }, [gift]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Garante que o valor salvo é um número, mesmo que o estado seja uma string vazia
        const finalAmount = typeof amount === 'string' && amount === '' ? 0 : parseFloat(amount as string) || 0;
        onSave(gift.id, { amount: finalAmount, description, thankYouSent });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold font-title text-brand-gray dark:text-white">Registrar Presente</h2>
                                <p className="text-brand-gray-light dark:text-gray-400">De: {gift.guestName}</p>
                            </div>
                            <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                <Icon name="close" />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <FormField
                                id="amount"
                                label="Valor do Presente (R$)"
                                type="number"
                                value={amount} // Agora o estado já trata o 0 como vazio
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setAmount(val === '' ? '' : parseFloat(val) || 0); // Define '' se vazio, ou número
                                }}
                                required
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                            />
                           
                            <FormField
                                id="description"
                                label="Descrição / Observações"
                                type="textarea"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                placeholder="Ex: Dinheiro via Pix, Jogo de Jantar, Cotas de Lua de Mel..."
                                required
                            />

                            <div className="flex items-center">
                                <input 
                                    id="thankYouSent" 
                                    type="checkbox" 
                                    checked={thankYouSent} 
                                    onChange={(e) => setThankYouSent(e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-brand-gold focus:ring-brand-gold"
                                />
                                <label htmlFor="thankYouSent" className="ml-2 text-sm font-medium">Já agradeceu?</label>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 mt-2 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-b-xl">
                        <button type="button" onClick={onClose} className="py-2 px-6 rounded-lg text-brand-gray dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">Cancelar</button>
                        <button type="submit" className="bg-brand-pink hover:opacity-90 text-brand-gray font-bold py-2 px-6 rounded-lg transition-colors dark:bg-brand-gold dark:text-gray-900">
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditGiftModal;