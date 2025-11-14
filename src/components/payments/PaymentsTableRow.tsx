import React from 'react';
// FIX: Corrected typo in import from 'fns' to 'date-fns'.
import { format as formatDate } from 'date-fns';
import { EnrichedPayment } from '../../screens/PaymentsScreen';
import { Payment, PaymentStatus } from '../../types';
import { formatCurrency } from '../../utils';
import StatusChip from '../ui/StatusChip';
import Icon from '../ui/Icon';

interface PaymentsTableRowProps {
    payment: EnrichedPayment;
    onRegisterPayment: (payment: Payment) => void;
    onDeletePayment: (paymentId: string) => void;
    isNextPayment: boolean;
    allVendorPayments: EnrichedPayment[];
    showVendorName?: boolean;
}

const PaymentsTableRow: React.FC<PaymentsTableRowProps> = ({ 
    payment, 
    onRegisterPayment, 
    onDeletePayment, 
    isNextPayment, 
    allVendorPayments,
    showVendorName = true 
}) => {
    
    const sortedVendorPayments = allVendorPayments.sort((a,b) => a.dueDate.getTime() - b.dueDate.getTime());
    const totalInstallments = sortedVendorPayments.length;
    const currentInstallment = sortedVendorPayments.findIndex(pay => pay.id === payment.id) + 1;

    return (
        <tr className={`transition-colors duration-150 ${isNextPayment ? 'bg-brand-pink-light/50 dark:bg-gray-700/50' : 'hover:bg-gray-50 dark:hover:bg-gray-900/50'}`}>
            {showVendorName && <td className="p-5 font-medium text-brand-gray dark:text-white whitespace-nowrap">{payment.vendorName}</td>}
            <td className="p-5 text-brand-gray dark:text-gray-300 whitespace-nowrap text-center">{formatDate(payment.dueDate, 'dd/MM/yyyy')}</td>
            <td className="p-5 text-brand-gray-light dark:text-gray-400 whitespace-nowrap text-center">{totalInstallments > 1 ? `Parcela ${currentInstallment} / ${totalInstallments}` : 'Única'}</td>
            <td className="p-5 font-medium text-brand-gray dark:text-white text-right whitespace-nowrap">{formatCurrency(payment.parcelValue)}</td>
            <td className="p-5 text-center">
                <StatusChip status={payment.status} />
                {payment.status === PaymentStatus.Paid && payment.paymentDate && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatDate(payment.paymentDate, 'dd/MM/yyyy')}
                    </div>
                )}
            </td>
            <td className="p-5">
                <div className="flex items-center justify-center space-x-1">
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
            </td>
        </tr>
    );
};

export default PaymentsTableRow;