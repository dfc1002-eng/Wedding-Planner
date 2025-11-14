import React from 'react';
import { PaymentStatus } from '../../types';

interface PaymentFilterProps {
    currentFilter: PaymentStatus | 'all';
    onFilterChange: (status: PaymentStatus | 'all') => void;
}

const PaymentFilter: React.FC<PaymentFilterProps> = ({ currentFilter, onFilterChange }) => {
    const filterOptions: Array<PaymentStatus | 'all'> = ['all', ...Object.values(PaymentStatus)];

    return (
        <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm font-medium text-brand-gray-light dark:text-gray-400 mr-2">Filtrar por:</span>
            {filterOptions.map(status => (
                <button
                    key={status}
                    onClick={() => onFilterChange(status)}
                    className={`px-3 py-1 text-sm font-semibold rounded-full transition-all duration-200 ease-in-out ${
                        currentFilter === status
                            ? 'bg-brand-gold text-white shadow-md'
                            : 'bg-white dark:bg-gray-700 text-brand-gray dark:text-gray-300 hover:bg-brand-pink-light dark:hover:bg-gray-600'
                    }`}
                >
                    {status === 'all' ? 'Todos' : status}
                </button>
            ))}
        </div>
    );
};

export default PaymentFilter;
