import React from 'react';
import { format as formatDate } from 'date-fns';
// FIX: Changed import path for NextPayment from a hook file to the central types file.
import { NextPayment } from '../../types';
import { formatCurrency } from '../../utils';

interface NextPaymentCardProps {
    nextPayment: NextPayment | null;
}

const NextPaymentCard: React.FC<NextPaymentCardProps> = ({ nextPayment }) => {
    if (!nextPayment) {
        return (
             <div className="bg-brand-green/20 dark:bg-green-800/50 p-6 rounded-2xl shadow-sm flex flex-col justify-center items-center min-h-full">
                <h3 className="font-bold text-brand-gray dark:text-white text-lg">Todos os pagamentos estão em dia!</h3>
             </div>
        )
    }

    return (
        <div className="bg-brand-pink-light dark:bg-gray-700 p-6 rounded-2xl shadow-sm flex flex-col justify-center min-h-full">
            <h3 className="font-bold text-brand-gray dark:text-white text-lg mb-2">Próximo Pagamento</h3>
            <div className="flex justify-between items-center">
                <div>
                    <p className="font-bold text-brand-gray dark:text-gray-200">{nextPayment.vendorName}</p>
                    <p className="text-sm text-brand-gray-light dark:text-gray-400">{formatDate(nextPayment.dueDate, "dd/MM/yyyy")}</p>
                </div>
                <p className="text-xl font-bold text-brand-gray dark:text-white">{formatCurrency(nextPayment.parcelValue)}</p>
            </div>
        </div>
    );
};

export default NextPaymentCard;