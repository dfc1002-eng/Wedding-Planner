// FIX: Created the full component content for EditVendorModal, which was missing.
import React, { useState, useEffect } from 'react';
import { Vendor, EditVendorData, Parcel, Payment } from '../../types';
import { VENDOR_CATEGORIES } from '../../constants';
import Icon from '../ui/Icon';
import PaymentSetup from '../vendors/PaymentSetup';

interface EditVendorModalProps {
    vendor: Vendor;
    payments: Payment[];
    onClose: () => void;
    onSave: (data: EditVendorData) => void;
}

const EditVendorModal: React.FC<EditVendorModalProps> = ({ vendor, onClose, onSave }) => {
    const [name, setName] = useState(vendor.name);
    const [category, setCategory] = useState(vendor.category);
    const [phone, setPhone] = useState(vendor.phone || '');
    const [email, setEmail] = useState(vendor.email || '');

    const [showAddendum, setShowAddendum] = useState(false);
    const [addendumAmount, setAddendumAmount] = useState(0);
    const [addendumReason, setAddendumReason] = useState('');
    const [addendumParcels, setAddendumParcels] = useState<Parcel[]>([]);
    const [isPaymentValid, setIsPaymentValid] = useState(true); // Default to true if no addendum

    const isSaveDisabled = showAddendum && (!isPaymentValid || addendumAmount <= 0 || !addendumReason.trim());

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isSaveDisabled) return;

        const dataToSave: EditVendorData = {
            id: vendor.id,
            name,
            category,
            phone,
            email,
        };

        if (showAddendum && addendumAmount > 0) {
            dataToSave.addendumAmount = addendumAmount;
            dataToSave.addendumReason = addendumReason;
            dataToSave.addendumParcels = addendumParcels;
        }

        onSave(dataToSave);
    };

    useEffect(() => {
        // if we are not showing addendum, payment is valid.
        if (!showAddendum) {
            setIsPaymentValid(true);
        }
    }, [showAddendum]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold font-title text-brand-gray dark:text-white">Editar Fornecedor</h2>
                            <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                <Icon name="close" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="edit-name" className="block text-sm font-medium mb-1">Nome do Fornecedor</label>
                                <input id="edit-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600" />
                            </div>

                            <div>
                                <label htmlFor="edit-category" className="block text-sm font-medium mb-1">Categoria</label>
                                <select id="edit-category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600">
                                    {VENDOR_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="edit-phone" className="block text-sm font-medium mb-1">Telefone (Opcional)</label>
                                    <input id="edit-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600" />
                                </div>
                                <div>
                                    <label htmlFor="edit-email" className="block text-sm font-medium mb-1">Email (Opcional)</label>
                                    <input id="edit-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600" />
                                </div>
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

                            {!showAddendum ? (
                                <button type="button" onClick={() => setShowAddendum(true)} className="w-full text-sm font-semibold py-2 px-4 rounded-lg border-2 border-dashed border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white transition-colors">
                                    Adicionar Aditivo ao Contrato
                                </button>
                            ) : (
                                <div className="space-y-4 p-4 border rounded-md dark:border-gray-600">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold text-brand-gray dark:text-white">Aditivo de Contrato</h3>
                                        <button type="button" onClick={() => { setShowAddendum(false); setAddendumAmount(0); }} className="text-xs text-brand-red hover:underline">
                                            Cancelar Aditivo
                                        </button>
                                    </div>
                                    <div>
                                        <label htmlFor="addendumAmount" className="block text-sm font-medium mb-1">Valor do Aditivo (R$)</label>
                                        <input type="number" id="addendumAmount" value={addendumAmount} onChange={(e) => setAddendumAmount(parseFloat(e.target.value) || 0)} required min="0" step="0.01" className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600" />
                                    </div>
                                    <div>
                                        <label htmlFor="addendumReason" className="block text-sm font-medium mb-1">Motivo do Aditivo</label>
                                        <textarea id="addendumReason" value={addendumReason} onChange={(e) => setAddendumReason(e.target.value)} required rows={2} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600"></textarea>
                                    </div>
                                    <PaymentSetup
                                        contractedValue={addendumAmount}
                                        onParcelsChange={(newParcels, isValid) => {
                                            setAddendumParcels(newParcels);
                                            setIsPaymentValid(isValid);
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 mt-2 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-b-xl">
                        <button type="button" onClick={onClose} className="py-2 px-6 rounded-lg text-brand-gray dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">Cancelar</button>
                        <button type="submit" disabled={isSaveDisabled} className="bg-brand-pink hover:opacity-90 text-brand-gray font-bold py-2 px-6 rounded-lg transition-colors dark:bg-brand-gold dark:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed">
                            Salvar Alterações
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditVendorModal;
