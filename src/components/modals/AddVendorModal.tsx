import React, { useState, useEffect } from 'react';
import { VENDOR_CATEGORIES } from '../../constants';
import Icon from '../ui/Icon';
import PaymentSetup from '../vendors/PaymentSetup';
import { NewVendorFormData, Parcel } from '../../types';

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
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold font-title text-brand-gray dark:text-white">Novo Fornecedor</h2>
                            <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                <Icon name="close" />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                             <div>
                                <label htmlFor="name" className="block text-sm font-medium mb-1">Nome do Fornecedor</label>
                                <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600" />
                            </div>
                           
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium mb-1">Categoria</label>
                                <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600">
                                    {VENDOR_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium mb-1">Telefone (Opcional)</label>
                                    <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium mb-1">Email (Opcional)</label>
                                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600" />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="contractedValue" className="block text-sm font-medium mb-1">Valor Total do Contrato (R$)</label>
                                <input type="number" id="contractedValue" value={contractedValue} onChange={(e) => setContractedValue(parseFloat(e.target.value) || 0)} required min="0" step="0.01" className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600" />
                            </div>

                            <PaymentSetup
                                contractedValue={contractedValue}
                                onParcelsChange={(newParcels, isValid) => {
                                    setParcels(newParcels);
                                    setIsPaymentValid(isValid);
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 mt-2 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-b-xl">
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