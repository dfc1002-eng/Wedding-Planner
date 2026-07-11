import React from 'react';
import { format as formatDate } from 'date-fns';
import { EnrichedPayment } from '../../screens/PaymentsScreen';
import { Payment, PaymentStatus } from '../../types';
import { formatCurrency } from '../../utils';
import StatusChip from '../ui/StatusChip';
import Icon from '../ui/Icon';

interface PaymentCardProps {
    payment: EnrichedPayment;
    onRegisterPayment: (payment: Payment) => void;
    onDeletePayment: (paymentId: string) => void;
    isNextPayment: boolean;
    allVendorPayments: EnrichedPayment[];
}

const PaymentCard: React.FC<PaymentCardProps> = ({ payment, onRegisterPayment, onDeletePayment, isNextPayment, allVendorPayments }) => {
    const sortedVendorPayments = allVendorPayments.sort((a,b) => a.dueDate.getTime() - b.dueDate.getTime());
    const totalInstallments = sortedVendorPayments.length;
    const currentInstallment = sortedVendorPayments.findIndex(pay => pay.id === payment.id) + 1;

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 space-y-3 transition-all ${isNextPayment ? 'ring-2 ring-brand-gold' : ''}`}>
            {/* Top section: Vendor, Date, Value */}
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold text-brand-gray dark:text-white">{payment.vendorName}</p>
                    <p className="text-sm text-brand-gray-light dark:text-gray-400">
                        Venc.: {formatDate(payment.dueDate, 'dd/MM/yyyy')}
                        {payment.status === PaymentStatus.Paid && payment.paymentDate && (
                            <span className="block text-xs text-green-600 dark:text-green-400">
                                Pago em: {formatDate(payment.paymentDate, 'dd/MM/yyyy')}
                            </span>
                        )}
                    </p>
                </div>
                <p className="font-bold text-lg text-brand-gray dark:text-white">{formatCurrency(payment.parcelValue)}</p>
            </div>
            
            {/* Divider */}
            <div className="border-t border-gray-100 dark:border-gray-700"></div>

            {/* Bottom section: Status, Parcel Info, Actions */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <StatusChip status={payment.status} />
                    <p className="text-xs text-brand-gray-light dark:text-gray-400">{totalInstallments > 1 ? `Parcela ${currentInstallment}/${totalInstallments}` : 'Única'}</p>
                </div>
                <div className="flex items-center space-x-1">
                    {(payment.status === PaymentStatus.Open || payment.status === PaymentStatus.Overdue) && (
                        <button 
                            onClick={() => onRegisterPayment(payment)} 
                            className="bg-brand-pink-light hover:bg-brand-pink text-brand-gray text-xs font-bold py-2 px-3 rounded-md transition-colors"
                            aria-label={`Registrar pagamento para ${payment.vendorName}`}
                        >
                            Registrar
                        </button>
                    )}
                    <button 
                        onClick={() => onDeletePayment(payment.id)} 
                        className="text-gray-400 hover:text-brand-red p-2 rounded-full transition-colors"
                        aria-label={`Excluir pagamento para ${payment.vendorName}`}
                    >
                        <Icon name="delete_outline" className="text-xl"/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentCard;