"use client";

import React, { useState, useEffect } from 'react';
import { VENDOR_CATEGORIES } from '../../constants';
import Icon from '../ui/Icon';
import PaymentSetup from '../vendors/PaymentSetup';
import { NewVendorFormData, Parcel } from '../../types';
import FormField from '../ui/FormField';

interface AddVendorModalProps {
    onClose: () => void;
    onSave: (data: NewVendorFormData) => void;
    prefilledCategory?: string;
}

const AddVendorModal: React.FC<AddVendorModalProps> = ({ onClose, onSave, prefilledCategory }) => {
    // 1. Controle de Etapas (1 = Dados, 2 = Financeiro)
    const [currentStep, setCurrentStep] = useState(1);

    // Estados do Formulário (Dados mantidos ao navegar entre etapas)
    const [name, setName] = useState('');
    const [category, setCategory] = useState(prefilledCategory || VENDOR_CATEGORIES[0]);
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [contractedValue, setContractedValue] = useState<number | string>('');
    const [parcels, setParcels] = useState<Parcel[]>([]);
    const [isPaymentValid, setIsPaymentValid] = useState(false);
    
    useEffect(() => {
        if (prefilledCategory) {
            setCategory(prefilledCategory);
        }
    }, [prefilledCategory]);

    // --- LÓGICA DE VALIDAÇÃO ---
    
    // Passo 1: Obrigatório ter Nome e Categoria
    const isStep1Valid = name.trim() !== '' && category.trim() !== '';

    // Passo 2: Obrigatório valor > 0 e parcelas configuradas corretamente
    const isStep2Valid = isPaymentValid && typeof contractedValue === 'number' && contractedValue > 0;

    // --- NAVEGAÇÃO ---
    const handleNext = () => {
        if (isStep1Valid) setCurrentStep(2);
    };

    const handleBack = () => {
        setCurrentStep(1);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isStep2Valid) return;
        
        onSave({
            name,
            category,
            phone,
            email,
            contractedValue: typeof contractedValue === 'number' ? contractedValue : 0,
            parcels,
        });
    };

    return (
        /* OVERLAY:
           - Mobile: items-end (para simular uma folha que sobe) ou items-center.
           - Desktop: items-center (centralizado).
        */
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-end md:items-center p-0 md:p-4" 
            onClick={onClose}
        >
            {/* CARD ÚNICO (FORM):
                A grande correção está aqui. Unificamos o container e o form.
                
                MOBILE (Classes base):
                - h-[100dvh]: Força altura total da viewport (resolve o botão sumido).
                - w-full: Largura total.
                - rounded-none: Sem cantos arredondados (tela cheia).
                
                DESKTOP (md:...):
                - md:h-auto: A altura se ajusta ao conteúdo...
                - md:max-h-[90vh]: ...até um limite máximo de 90% da tela.
                - md:max-w-lg: Limita a largura.
                - md:rounded-xl: Cantos arredondados no desktop.
                
                - flex flex-col: Essencial para o layout interno (Header - Body - Footer).
                - overflow-hidden: Garante que o scroll aconteça APENAS no body, não no form todo.
            */}
            <form 
                onSubmit={handleSubmit} 
                className="bg-white dark:bg-gray-800 shadow-xl w-full flex flex-col overflow-hidden
                           h-[100dvh] rounded-none 
                           md:h-auto md:max-h-[90vh] md:max-w-lg md:rounded-xl"
                onClick={e => e.stopPropagation()}
            >
                
                {/* CABEÇALHO COM STEPS */}
                <div className="p-6 flex-shrink-0 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold font-title text-brand-gray dark:text-white">
                                {currentStep === 1 ? 'Dados do Fornecedor' : 'Valor e Pagamento'}
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Etapa {currentStep} de 2
                            </p>
                        </div>
                        <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                            <Icon name="close" />
                        </button>
                    </div>

                    {/* Barra de Progresso Visual */}
                    <div className="flex gap-2 h-1.5">
                        <div className={`flex-1 rounded-full transition-colors duration-300 ${currentStep >= 1 ? 'bg-brand-pink dark:bg-brand-gold' : 'bg-gray-200'}`}></div>
                        <div className={`flex-1 rounded-full transition-colors duration-300 ${currentStep >= 2 ? 'bg-brand-pink dark:bg-brand-gold' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                    </div>
                </div>
                    
                {/* CORPO DO MODAL (Conteúdo Variável) */}
                <div className="p-6 flex-grow overflow-y-auto bg-white dark:bg-gray-800">
                    
                    {/* --- CONTEÚDO ETAPA 1 ---
                    */}
                    {currentStep === 1 && (
                        <div className="space-y-5 animate-fadeIn">
                            <FormField
                                id="name"
                                label="Nome do Fornecedor *"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ex: Buffet Delicioso"
                                required
                            />
                           
                            <FormField
                                id="category"
                                label="Categoria *"
                                type="select"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                options={VENDOR_CATEGORIES.map(cat => ({ value: cat, label: cat }))}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    id="phone"
                                    label="Telefone"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+55..."
                                />
                                <FormField
                                    id="email"
                                    label="Email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="email@exemplo.com"
                                />
                            </div>
                        </div>
                    )}

                    {/* --- CONTEÚDO ETAPA 2 ---
                    */}
                    {currentStep === 2 && (
                        <div className="space-y-5 animate-fadeIn">
                            <FormField
                                id="contractedValue"
                                label="Valor Total do Contrato (R$) *"
                                type="number"
                                value={contractedValue === 0 ? '' : contractedValue}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setContractedValue(value === '' ? '' : parseFloat(value));
                                }}
                                required
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                autoFocus // Foca automaticamente ao entrar nesta tela
                            />

                            <PaymentSetup
                                contractedValue={typeof contractedValue === 'number' ? contractedValue : 0}
                                onParcelsChange={(newParcels, isValid) => {
                                    setParcels(newParcels);
                                    setIsPaymentValid(isValid);
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* RODAPÉ (Botões Dinâmicos) */}
                <div className="flex justify-between items-center p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex-shrink-0 md:rounded-b-xl">
                    
                    {/* Botão Esquerdo: Cancelar ou Voltar */}
                    {currentStep === 1 ? (
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="py-2.5 px-6 rounded-lg font-medium text-brand-gray dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            Cancelar
                        </button>
                    ) : (
                        <button 
                            type="button" 
                            onClick={handleBack} 
                            className="py-2.5 px-6 rounded-lg font-medium text-brand-gray dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
                        >
                            <Icon name="arrow_back" className="text-lg" /> 
                            Voltar
                        </button>
                    )}

                    {/* Botão Direito: Próximo ou Salvar */}
                    {currentStep === 1 ? (
                        <button 
                            type="button" 
                            onClick={handleNext} 
                            disabled={!isStep1Valid}
                            className="bg-brand-pink hover:opacity-90 text-brand-gray font-bold py-2.5 px-6 rounded-lg transition-colors dark:bg-brand-gold dark:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            Próximo 
                            <Icon name="arrow_forward" className="text-lg" />
                        </button>
                    ) : (
                        <button 
                            type="submit" 
                            disabled={!isStep2Valid} 
                            className="bg-brand-pink hover:opacity-90 text-brand-gray font-bold py-2.5 px-6 rounded-lg transition-colors dark:bg-brand-gold dark:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                        >
                            Salvar Fornecedor
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default AddVendorModal;