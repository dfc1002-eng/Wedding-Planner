import React, { useState } from 'react';
import { Vendor, Payment, NextPayment } from '../../types';
import { EnrichedPayment } from '../../screens/PaymentsScreen';
import { formatCurrency } from '../../utils';
import Icon from '../ui/Icon';
import SortableHeader, { SortConfig } from '../ui/SortableHeader';
import PaymentsTableRow from './PaymentsTableRow';
import PaymentCard from './PaymentCard';

interface VendorPaymentsCardProps {
    vendor: Vendor;
    payments: EnrichedPayment[];
    onRegisterPayment: (payment: Payment) => void;
    onDeletePayment: (paymentId: string) => void;
    nextPayment: NextPayment | null;
    sortConfig: SortConfig<EnrichedPayment> | null;
    requestSort: (key: keyof EnrichedPayment) => void;
}

const VendorPaymentsCard: React.FC<VendorPaymentsCardProps> = ({ vendor, payments, onRegisterPayment, onDeletePayment, nextPayment, sortConfig, requestSort }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const remainingToPay = vendor.contractedValue - vendor.amountPaid;
    const paidPercentage = vendor.contractedValue > 0 ? (vendor.amountPaid / vendor.contractedValue) * 100 : 0;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            {/* Header */}
            <div className="p-5 bg-gray-50/50 dark:bg-gray-900/50 cursor-pointer border-b border-gray-200 dark:border-gray-700/50" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-xl text-brand-gray dark:text-white">{vendor.name}</h3>
                    <Icon name={isExpanded ? 'expand_less' : 'expand_more'} className="text-2xl text-brand-gray-light dark:text-gray-400" />
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center mt-4 text-sm">
                    <div>
                        <p className="text-brand-gray-light dark:text-gray-400 text-xs uppercase">Contratado</p>
                        <p className="font-bold text-brand-gray dark:text-gray-200">{formatCurrency(vendor.contractedValue)}</p>
                    </div>
                     <div>
                        <p className="text-brand-gray-light dark:text-gray-400 text-xs uppercase">Pago</p>
                        <p className="font-bold text-green-600 dark:text-green-400">{formatCurrency(vendor.amountPaid)}</p>
                    </div>
                     <div>
                        <p className="text-brand-gray-light dark:text-gray-400 text-xs uppercase">A Pagar</p>
                        <p className="font-bold text-yellow-600 dark:text-yellow-400">{formatCurrency(remainingToPay)}</p>
                    </div>
                </div>
                 
                 <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-3">
                    <div
                        className="h-2 bg-brand-green rounded-full"
                        style={{ width: `${paidPercentage}%` }}
                    ></div>
                </div>
            </div>

            {/* Collapsible Content */}
            {isExpanded && (
                <div>
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-900/50">
                                <tr>
                                    <SortableHeader<EnrichedPayment> label="Vencimento" sortKey="dueDate" sortConfig={sortConfig} requestSort={requestSort} className="text-center" />
                                    <th className="p-5 text-xs font-semibold text-brand-gray-light dark:text-gray-400 uppercase tracking-wider text-center">Parcela</th>
                                    <SortableHeader<EnrichedPayment> label="Valor" sortKey="parcelValue" sortConfig={sortConfig} requestSort={requestSort} className="text-right" />
                                    <SortableHeader<EnrichedPayment> label="Status" sortKey="status" sortConfig={sortConfig} requestSort={requestSort} className="text-center" />
                                    <th className="p-5 text-xs font-semibold text-brand-gray-light dark:text-gray-400 uppercase tracking-wider text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {payments.map(payment => (
                                    <PaymentsTableRow 
                                        key={payment.id}
                                        payment={payment}
                                        onRegisterPayment={onRegisterPayment}
                                        onDeletePayment={onDeletePayment}
                                        isNextPayment={nextPayment?.id === payment.id}
                                        allVendorPayments={payments}
                                        showVendorName={false}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Mobile Cards */}
                    <div className="md:hidden p-4 space-y-3 bg-gray-50 dark:bg-gray-800/50">
                       {payments.map(payment => (
                            <PaymentCard 
                                key={payment.id}
                                payment={payment}
                                onRegisterPayment={onRegisterPayment}
                                onDeletePayment={onDeletePayment}
                                isNextPayment={nextPayment?.id === payment.id}
                                allVendorPayments={payments}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendorPaymentsCard;
