import React from 'react';
import { formatCurrency } from '../../utils';
import Icon from '../ui/Icon';

interface PaymentSummaryCardProps {
    title: string;
    amount: number;
    count: number;
    icon: string;
    colorClassName: string;
}

const PaymentSummaryCard: React.FC<PaymentSummaryCardProps> = ({ title, amount, count, icon, colorClassName }) => (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md flex items-start gap-4">
        <div className={`p-2 rounded-full ${colorClassName.replace('text-', 'bg-')}/10`}>
            <Icon name={icon} className={`text-2xl ${colorClassName}`} />
        </div>
        <div>
            <p className="text-sm text-brand-gray-light dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-brand-gray dark:text-white mt-1">{formatCurrency(amount)}</p>
            <p className="text-xs text-brand-gray-light dark:text-gray-500 mt-1">
                {count} {count === 1 ? 'pagamento' : 'pagamentos'}
            </p>
        </div>
    </div>
);

export default PaymentSummaryCard;
