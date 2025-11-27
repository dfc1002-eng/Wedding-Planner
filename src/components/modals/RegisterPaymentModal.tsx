"use client";

import React, { useState, useEffect } from 'react';
import { Vendor, Payment } from '../../types';
import { formatCurrency } from '../../utils';
import { format as formatDate } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import Icon from '../ui/Icon';
import FormField from '../ui/FormField';

interface RegisterPaymentModalProps {
  modalData: { vendor: Vendor; payment: Payment };
  onClose: () => void;
  onConfirm: (data: { vendorId: string, vendorName: string, paidAmount: number, paymentDate: Date, paymentId: string }) => void;
}

const RegisterPaymentModal: React.FC<RegisterPaymentModalProps> = ({ modalData, onClose, onConfirm }) => {
    const { vendor, payment } = modalData;
    const [paymentDate, setPaymentDate] = useState(formatDate(new Date(), 'yyyy-MM-dd'));

    useEffect(() => {
        console.log("RegisterPaymentModal mounted with:", { vendor, payment });
        if (!payment?.id) {
            console.error("RegisterPaymentModal: Payment ID is missing!", payment);
        }
    }, [vendor, payment]);
    
    const handleConfirm = () => {
        console.log("RegisterPaymentModal: Confirming with paymentId:", payment.id);
        
        if (!payment.id) {
            alert("Erro: ID do pagamento não encontrado. Veja o console.");
            return;
        }

        onConfirm({
            vendorId: vendor.id,
            vendorName: vendor.name,
            paidAmount: payment.parcelValue,
            paymentDate: new Date(paymentDate + 'T00:00:00'),
            paymentId: payment.id
        });
    };

    if (!payment) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-8" onClick={e => e.stopPropagation()}>
                <div className="text-center">
                    <Icon name="check_circle_outline" className="text-5xl text-brand-green mx-auto mb-4" />
                    <h2 className="text-2xl font-bold font-title text-brand-gray dark:text-white">Confirmar Pagamento</h2>
                </div>

                <div className="mt-6 space-y-3 text-sm border-y dark:border-gray-700 py-4">
                    <div className="flex justify-between items-center">
                        <span className="text-brand-gray-light dark:text-gray-400">Fornecedor:</span>
                        <span className="font-bold text-right text-brand-gray dark:text-gray-200">{vendor.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-brand-gray-light dark:text-gray-400">Valor da Parcela:</span>
                        <span className="font-bold text-right text-brand-gray dark:text-gray-200">{formatCurrency(payment.parcelValue)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-brand-gray-light dark:text-gray-400">Data de Vencimento:</span>
                        <span className="font-bold text-right text-brand-gray dark:text-gray-200">{formatDate(payment.dueDate, 'dd/MM/yyyy', { locale: ptBR })}</span>
                    </div>
                    {/* DEBUG INFO - REMOVE IN PRODUCTION */}
                    <div className="text-xs text-gray-400 pt-2 text-center">
                        ID Pagamento: {payment.id}
                    </div>
                </div>

                <div className="mt-6 text-left">
                    <FormField
                        id="paymentDate"
                        label="Data em que o pagamento foi realizado"
                        type="date"
                        value={paymentDate}
                        onChange={(e) => setPaymentDate(e.target.value)}
                        required
                    />
                </div>

                <div className="flex justify-center space-x-4 mt-8">
                    <button type="button" onClick={onClose} className="py-2 px-6 rounded-lg text-brand-gray dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">Cancelar</button>
                    <button type="button" onClick={handleConfirm} className="bg-brand-green hover:opacity-90 text-white font-bold py-2 px-6 rounded-lg transition-colors">Confirmar Pagamento</button>
                </div>
            </div>
        </div>
    );
};

export default RegisterPaymentModal;