"use client";

import React, { useState, useEffect } from 'react';
import { Vendor, EditVendorData, Parcel, Payment } from '../../types';
import { VENDOR_CATEGORIES } from '../../constants';
import Icon from '../ui/Icon';
import PaymentSetup from '../vendors/PaymentSetup';
import FormField from '../ui/FormField';

interface EditVendorModalProps {
    vendor: Vendor;
    payments: Payment[];
    onClose: () => void;
    onSave: (data: EditVendorData) => void;
}

const EditVendorModal: React.FC<EditVendorModalProps> = ({ vendor, onClose, onSave }) => {
    // Estados dos Dados Principais
    const [name, setName] = useState(vendor.name);
    const [category, setCategory] = useState(vendor.category);
    const [phone, setPhone] = useState(vendor.phone || '');
    const [email, setEmail] = useState(vendor.email || '');

    // Estados do Aditivo
    const [showAddendum, setShowAddendum] = useState(false);
    const [addendumAmount, setAddendumAmount] = useState<number | string>(''); 
    const [addendumReason, setAddendumReason] = useState('');
    const [addendumParcels, setAddendumParcels] = useState<Parcel[]>([]);
    const [isPaymentValid, setIsPaymentValid] = useState(true);

    // Validação - AJUSTE AQUI: Removida a obrigatoriedade do addendumReason
    const isSaveDisabled = showAddendum && (!isPaymentValid || typeof addendumAmount !== 'number' || addendumAmount <= 0);

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

        if (showAddendum && typeof addendumAmount === 'number' && addendumAmount > 0) {
            dataToSave.addendumAmount = addendumAmount;
            dataToSave.addendumReason = addendumReason; // Pode ir vazio agora
            dataToSave.addendumParcels = addendumParcels;
        }

        onSave(dataToSave);
    };

    useEffect(() => {
        if (!showAddendum) {
            setIsPaymentValid(true);
        }
    }, [showAddendum]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-end md:items-center z-50 p-0 md:p-4" onClick={onClose}>
            <div 
                className="bg-white dark:bg-gray-800 shadow-xl w-full flex flex-col 
                           h-[100dvh] rounded-none 
                           md:h-auto md:max-h-[90vh] md:max-w-lg md:rounded-xl transition-all" 
                onClick={e => e.stopPropagation()}
            >
                <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
                    
                    {/* CABEÇALHO */}
                    <div className="p-6 flex-shrink-0 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                {showAddendum && (
                                    <button 
                                        type="button" 
                                        onClick={() => setShowAddendum(false)}
                                        className="p-1 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-brand-gray dark:text-gray-300 transition-colors"
                                    >
                                        <Icon name="arrow_back" />
                                    </button>
                                )}
                                <h2 className="text-xl md:text-2xl font-bold font-title text-brand-gray dark:text-white">
                                    {showAddendum ? 'Novo Aditivo' : 'Editar Fornecedor'}
                                </h2>
                            </div>
                            <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                <Icon name="close" />
                            </button>
                        </div>
                    </div>

                    {/* CORPO DO MODAL */}
                    <div className="p-6 flex-grow overflow-y-auto bg-white dark:bg-gray-800">
                        
                        {/* MODO 1: DADOS DO FORNECEDOR */}
                        {!showAddendum && (
                            <div className="space-y-4 animate-fadeIn">
                                <FormField
                                    id="edit-name"
                                    label="Nome do Fornecedor"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />

                                <FormField
                                    id="edit-category"
                                    label="Categoria"
                                    type="select"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    options={VENDOR_CATEGORIES.map(cat => ({ value: cat, label: cat }))}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        id="edit-phone"
                                        label="Telefone (Opcional)"
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="+55..."
                                    />
                                    <FormField
                                        id="edit-email"
                                        label="Email (Opcional)"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <button 
                                        type="button" 
                                        onClick={() => setShowAddendum(true)} 
                                        className="w-full py-3 px-4 rounded-lg border border-brand-gold text-brand-gold bg-brand-gold/5 hover:bg-brand-gold/10 font-semibold transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Icon name="post_add" />
                                        Adicionar Aditivo Financeiro
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* MODO 2: ADITIVO */}
                        {showAddendum && (
                            <div className="space-y-5 animate-fadeIn">
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md text-sm text-blue-800 dark:text-blue-200 mb-2">
                                    Use esta opção para adicionar valores extras ao contrato original (ex: horas extras, itens adicionais).
                                </div>

                                <FormField
                                    id="addendumAmount"
                                    label="Valor do Aditivo (R$)"
                                    type="number"
                                    value={addendumAmount}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setAddendumAmount(val === '' ? '' : parseFloat(val));
                                    }}
                                    required
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    autoFocus
                                />
                                {/* AJUSTE AQUI: Rótulo atualizado e required removido */}
                                <FormField
                                    id="addendumReason"
                                    label="Motivo do Aditivo (Opcional)"
                                    type="textarea"
                                    value={addendumReason}
                                    onChange={(e) => setAddendumReason(e.target.value)}
                                    rows={2}
                                    placeholder="Ex: 2 horas extras de fotografia..."
                                />
                                <PaymentSetup
                                    contractedValue={typeof addendumAmount === 'number' ? addendumAmount : 0}
                                    onParcelsChange={(newParcels, isValid) => {
                                        setAddendumParcels(newParcels);
                                        setIsPaymentValid(isValid);
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* RODAPÉ */}
                    <div className="flex justify-end space-x-4 p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex-shrink-0 md:rounded-b-xl">
                        <button type="button" onClick={onClose} className="py-2 px-6 rounded-lg text-brand-gray dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            disabled={isSaveDisabled} 
                            className="bg-brand-pink hover:opacity-90 text-brand-gray font-bold py-2 px-6 rounded-lg transition-colors dark:bg-brand-gold dark:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {showAddendum ? 'Salvar Aditivo' : 'Salvar Alterações'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditVendorModal;