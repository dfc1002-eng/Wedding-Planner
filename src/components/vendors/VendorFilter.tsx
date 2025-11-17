import React from 'react';
import { VendorStatus } from '../../types';

export type VendorFilterValue = VendorStatus | 'all' | 'essentials';

interface VendorFilterProps {
    currentFilter: VendorFilterValue;
    onFilterChange: (filter: VendorFilterValue) => void;
}

const VendorFilter: React.FC<VendorFilterProps> = ({ currentFilter, onFilterChange }) => {
    const filterOptions: VendorFilterValue[] = ['essentials', 'all', ...Object.values(VendorStatus)];
    
    const filterLabels: Record<VendorFilterValue, string> = {
        essentials: 'Essenciais ✨',
        all: 'Todos',
        [VendorStatus.Planned]: 'Contratado',
        [VendorStatus.PartiallyPaid]: 'Parcialmente Pago',
        [VendorStatus.Paid]: 'Pago',
        [VendorStatus.Overdue]: 'Vencido',
    };

    return (
        <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm font-medium text-brand-gray-light dark:text-gray-400 mr-2">Filtrar por:</span>
            {filterOptions.map(filter => (
                <button
                    key={filter}
                    onClick={() => onFilterChange(filter)}
                    className={`px-3 py-1 text-sm font-semibold rounded-full transition-all duration-200 ease-in-out ${
                        currentFilter === filter
                            ? 'bg-brand-gold text-white shadow-md'
                            : 'bg-white dark:bg-gray-700 text-brand-gray dark:text-gray-300 hover:bg-brand-pink-light dark:hover:bg-gray-600'
                    }`}
                >
                    {filterLabels[filter]}
                </button>
            ))}
        </div>
    );
};

export default VendorFilter;