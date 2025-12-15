import React, { useState, useMemo } from 'react';
import { useWedding } from '../context/WeddingDataContext';
import { Vendor, VendorStatus } from '../types';
import Icon from '../components/ui/Icon';
import VendorCard from '../components/vendors/VendorCard';
import VendorFilter from '../components/vendors/VendorFilter';

interface VendorsScreenProps {
    onAddVendor: () => void;
    onEditVendor: (vendor: Vendor) => void;
    onDeleteVendor: (vendorId: string) => void;
    statusFilter: VendorStatus | 'all';
    onFilterChange: (status: VendorStatus | 'all') => void;
}

const VendorsScreen: React.FC<VendorsScreenProps> = ({ onAddVendor, onEditVendor, onDeleteVendor, statusFilter, onFilterChange }) => {
    const { vendors, payments } = useWedding();
    const [expandedVendor, setExpandedVendor] = useState<string | null>(null);

    const filteredVendors = useMemo(() => {
        if (statusFilter === 'all') return vendors;
        return vendors.filter(v => v.status === statusFilter);
    }, [vendors, statusFilter]);

    const handleToggleExpand = (vendorId: string) => {
        setExpandedVendor(prev => (prev === vendorId ? null : vendorId));
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h2 className="text-3xl font-title text-brand-gray dark:text-white">Meus Fornecedores</h2>
                <button
                    onClick={onAddVendor}
                    className="w-full md:w-auto justify-center bg-brand-pink-light hover:bg-brand-pink text-brand-gray dark:bg-brand-gold dark:hover:bg-opacity-80 dark:text-gray-900 font-bold py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors"
                >
                    <Icon name="add" />
                    <span>Novo Fornecedor</span>
                </button>
            </div>
            
            <VendorFilter
                currentFilter={statusFilter}
                onFilterChange={onFilterChange}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVendors.map(vendor => (
                    <VendorCard
                        key={vendor.id}
                        vendor={vendor}
                        payments={payments.filter(p => p.vendorId === vendor.id)}
                        isExpanded={expandedVendor === vendor.id}
                        onToggleExpand={() => handleToggleExpand(vendor.id)}
                        onEdit={onEditVendor}
                        onDelete={onDeleteVendor}
                    />
                ))}
            </div>
        </div>
    );
};

export default VendorsScreen;