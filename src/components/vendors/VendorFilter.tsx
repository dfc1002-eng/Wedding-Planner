import React from 'react';
import { VendorStatus } from '../../types';

interface VendorFilterProps {
    currentFilter: VendorStatus | 'all';
    onFilterChange: (status: VendorStatus | 'all') => void;
}

const VendorFilter: React.FC<VendorFilterProps> = ({ currentFilter, onFilterChange }) => {
    const filterOptions: Array<VendorStatus | 'all'> = ['all', ...Object.values(VendorStatus)];
    
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

export default VendorFilter;