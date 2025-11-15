"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useWedding } from '../../context/WeddingDataContext';
import { format as formatDate, addDays } from 'date-fns';
import { formatCurrency } from '../../utils';
import Icon from '../ui/Icon';
import { Parcel } from '../../types';
import FormField from '../ui/FormField'; // Importar FormField

type PaymentMode = 'single' | 'two-installments' | 'custom';

interface PaymentSetupProps {
    contractedValue: number;
    onParcelsChange: (parcels: Parcel[], isValid: boolean) => void;
}

const PaymentSetup: React.FC<PaymentSetupProps> = ({ contractedValue, onParcelsChange }) => {
    const { weddingData } = useWedding();
    const [paymentMode, setPaymentMode] = useState<PaymentMode>('two-installments');
    const [parcels, setParcels] = useState<Parcel[]>([]);
    const [customInstallmentCount, setCustomInstallmentCount] = useState(2);

    const totalParceled = useMemo(() => parcels.reduce((acc, p) => acc + p.amount, 0), [parcels]);
    const difference = contractedValue - totalParceled;

    useEffect(() => {
        onParcelsChange(parcels, Math.abs(difference) < 0.01 && contractedValue > 0);
    }, [parcels, difference, contractedValue, onParcelsChange]);

    useEffect(() => {
        const weddingDateMinus15 = addDays(weddingData.weddingDate, -15);

        if (paymentMode === 'single') {
            setParcels([{ id: 'p1', dueDate: formatDate(new Date(), 'yyyy-MM-dd'), amount: contractedValue }]);
        } else if (paymentMode === 'two-installments') {
            const halfValue = contractedValue / 2;
            setParcels([
                { id: 'p1', dueDate: formatDate(new Date(), 'yyyy-MM-dd'), amount: halfValue },
                { id: 'p2', dueDate: formatDate(weddingDateMinus15, 'yyyy-MM-dd'), amount: halfValue },
            ]);
        } else if (paymentMode === 'custom') {
            const newParcels = Array.from({ length: customInstallmentCount }, (_, i) => {
                const existingParcel = parcels[i];
                const newDueDate = new Date();
                newDueDate.setMonth(newDueDate.getMonth() + i);
                return {
                    id: existingParcel?.id || `p${i + 1}`,
                    dueDate: existingParcel?.dueDate || formatDate(newDueDate, 'yyyy-MM-dd'),
                    amount: existingParcel?.amount || 0,
                };
            });
            setParcels(newParcels);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paymentMode, contractedValue, customInstallmentCount]);

    const handleParcelChange = (index: number, field: 'dueDate' | 'amount', value: string) => {
        const newParcels = [...parcels];
        if (field === 'amount') {
            newParcels[index].amount = parseFloat(value) || 0;
        } else {
            newParcels[index].dueDate = value;
        }
        setParcels(newParcels);
    };

    const handleDivideEqually = () => {
        if (parcels.length === 0) return;
        const equalAmount = contractedValue / parcels.length;
        setParcels(parcels.map(p => ({ ...p, amount: Number(equalAmount.toFixed(2)) })));
    };

    const handleCustomInstallmentCountChange = (count: number) => {
        const newCount = Math.max(2, count); // Ensure at least 2 installments
        setCustomInstallmentCount(newCount);
    };

    const renderParcelInputs = () => (
        <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
            {parcels.map((parcel, index) => (
                <div key={parcel.id} className="grid grid-cols-2 gap-3 items-center">
                    <FormField
                        id={`parcel-date-${index}`}
                        label="" // Label is empty as it's part of a group
                        type="date"
                        value={parcel.dueDate}
                        onChange={(e) => handleParcelChange(index, 'dueDate', e.target.value)}
                        required
                        labelClassName="sr-only" // Hide label visually
                    />
                    <FormField
                        id={`parcel-amount-${index}`}
                        label="" // Label is empty as it's part of a group
                        type="number"
                        min="0"
                        step="0.01"
                        value={parcel.amount}
                        onChange={(e) => handleParcelChange(index, 'amount', e.target.value)}
                        placeholder="Valor (R$)"
                        required
                        labelClassName="sr-only" // Hide label visually
                    />
                </div>
            ))}
        </div>
    );
    
    return (
        <div className="p-4 border rounded-md dark:border-gray-600 space-y-4 bg-gray-50 dark:bg-gray-800/50">
            <h4 className="font-semibold text-brand-gray dark:text-gray-200">Como deseja pagar este fornecedor?</h4>
            <div className="flex items-center space-x-4">
                {(['single', 'two-installments', 'custom'] as const).map(mode => (
                    <label key={mode} className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            name="paymentMode"
                            value={mode}
                            checked={paymentMode === mode}
                            onChange={() => setPaymentMode(mode)}
                            className="form-radio accent-brand-gold focus:ring-brand-gold"
                        />
                        <span className="ml-2 text-sm">
                            {mode === 'single' ? 'Pagamento Único' : mode === 'two-installments' ? 'Duas Parcelas' : 'Personalizado'}
                        </span>
                    </label>
                ))}
            </div>

            <div className="mt-4">
                {paymentMode === 'custom' && (
                    <div className="mb-4 grid grid-cols-2 gap-4 items-end">
                         <FormField
                            id="installments"
                            label="Nº de Parcelas"
                            type="number"
                            value={customInstallmentCount}
                            min="2"
                            onChange={(e) => handleCustomInstallmentCountChange(parseInt(e.target.value) || 2)}
                            labelClassName="block text-xs font-medium mb-1"
                        />
                        <button type="button" onClick={handleDivideEqually} className="py-2 px-4 text-sm rounded-lg text-brand-gray dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 flex items-center justify-center space-x-2">
                           <Icon name="splitscreen" className="text-base" /> <span>Dividir Valor Igualmente</span>
                        </button>
                    </div>
                )}
                {renderParcelInputs()}
            </div>
            
             <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-xs space-y-1">
                <div className="flex justify-between"><span>Total Contratado:</span> <span className="font-bold">{formatCurrency(contractedValue)}</span></div>
                <div className="flex justify-between"><span>Total Parcelado:</span> <span className="font-bold">{formatCurrency(totalParceled)}</span></div>
                <div className={`flex justify-between font-bold ${Math.abs(difference) > 0.01 ? 'text-red-500' : 'text-green-500'}`}>
                    <span>Diferença:</span> 
                    <span>{formatCurrency(difference)}</span>
                </div>
            </div>
        </div>
    );
};

export default PaymentSetup;