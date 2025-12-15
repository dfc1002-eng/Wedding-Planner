"use client";

import React, { useState, useEffect } from 'react';
import { VENDOR_CATEGORIES } from '../../constants';
import Icon from '../ui/Icon';
import PaymentSetup from '../vendors/PaymentSetup';
import { NewVendorFormData, Parcel } from '../../types';
import FormField from '../ui/FormField'; // Importar FormField

interface AddVendorModalProps {
    onClose: () => void;
    onSave: (data: NewVendorFormData) => void;
    prefilledCategory?: string;
}

const AddVendorModal: React.FC<AddVendorModalProps> = ({ onClose, onSave, prefilledCategory }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState(prefilledCategory || VENDOR_CATEGORIES[0]);
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [contractedValue, setContractedValue] = useState(0);
    const [parcels, setParcels] = useState<Parcel[]>([]);
    const [isPaymentValid, setIsPaymentValid] = useState(false);
    
    useEffect(() => {
        if (prefilledCategory) {
            setCategory(prefilledCategory);
        }
    }, [prefilledCategory]);

    const isSaveDisabled = !isPaymentValid || contractedValue <= 0;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isSaveDisabled) return;
        
        onSave({
            name,
            category,
            phone,
            email,
            contractedValue,
            parcels,
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg max-h-[90dvh] flex flex-col" onClick={e => e.stopPropagation()}> {/* Adicionado max-h-[90dvh] e flex flex-col */}
                <form onSubmit={handleSubmit} className="flex flex-col flex-grow"> {/* Adicionado flex flex-col flex-grow */}
                    <div className="p-6 flex-shrink-0"> {/* Header fixo */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold font-title text-brand-gray dark:text-white">Novo Fornecedor</h2>
                            <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                <Icon name="close" />
                            </button>
                        </div>
                    </div>
                        
                    <div className="px-6 overflow-y-auto max-h-[70vh] pb-24 flex-grow"> {/* Adicionado px-6, overflow-y-auto, max-h-[70vh], pb-24 e flex-grow */}
                        <div className="space-y-4">
                            <FormField
                                id="name"
                                label="Nome do Fornecedor"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                           
                            <FormField
                                id="category"
                                label="Categoria"
                                type="select"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                options={VENDOR_CATEGORIES.map(cat => ({ value: cat, label: cat }))}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    id="phone"
                                    label="Telefone (Opcional)"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                                <FormField
                                    id="email"
                                    label="Email (Opcional)"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <FormField
                                id="contractedValue"
                                label="Valor Total do Contrato (R$)"
                                type="number"
                                value={contractedValue}
                                onChange={(e) => setContractedValue(parseFloat(e.target.value) || 0)}
                                required
                                min="0"
                                step="0.01"
                            />

                            <PaymentSetup
                                contractedValue={contractedValue}
                                onParcelsChange={(newParcels, isValid) => {
                                    setParcels(newParcels);
                                    setIsPaymentValid(isValid);
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 mt-2 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-b-xl flex-shrink-0"> {/* Footer fixo */}
                        <button type="button" onClick={onClose} className="py-2 px-6 rounded-lg text-brand-gray dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">Cancelar</button>
                        <button type="submit" disabled={isSaveDisabled} className="bg-brand-pink hover:opacity-90 text-brand-gray font-bold py-2 px-6 rounded-lg transition-colors dark:bg-brand-gold dark:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed">
                            Salvar Fornecedor
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddVendorModal;