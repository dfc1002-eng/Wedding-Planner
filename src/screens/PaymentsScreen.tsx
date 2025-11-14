import React, { useMemo, useState } from 'react';
import { useWedding } from '../context/WeddingDataContext';
import { Payment, PaymentStatus, Vendor } from '../types';
import PaymentFilter from '../components/payments/PaymentFilter';
import SortableHeader, { SortConfig, SortDirection } from '../components/ui/SortableHeader';
import Icon from '../components/ui/Icon';
import PaymentSummaryCard from '../components/payments/PaymentSummaryCard';
import VendorPaymentsCard from '../components/payments/VendorPaymentsCard';

export interface EnrichedPayment extends Payment {
  vendorName: string;
}

interface PaymentsScreenProps {
  onRegisterPayment: (payment: Payment) => void;
  onDeletePayment: (paymentId: string) => void;
}

const PaymentsScreen: React.FC<PaymentsScreenProps> = ({ onRegisterPayment, onDeletePayment }) => {
  const { payments, vendors, nextPayment } = useWedding();
  const [filter, setFilter] = useState<PaymentStatus | 'all'>('all');
  const [sortConfig, setSortConfig] = useState<SortConfig<EnrichedPayment> | null>({ key: 'dueDate', direction: 'ascending' });

  const enrichedPayments = useMemo((): EnrichedPayment[] => {
    const vendorMap = new Map(vendors.map((v: Vendor) => [v.id, v.name]));
    return payments.map((p: Payment) => ({
      ...p,
      vendorName: vendorMap.get(p.vendorId) || 'Desconhecido',
    }));
  }, [payments, vendors]);

  const summary = useMemo(() => {
    return enrichedPayments.reduce((acc, p) => {
        if (p.status === PaymentStatus.Paid) {
            acc.paid.amount += p.parcelValue;
            acc.paid.count += 1;
        } else if (p.status === PaymentStatus.Open) {
            acc.open.amount += p.parcelValue;
            acc.open.count += 1;
        } else if (p.status === PaymentStatus.Overdue) {
            acc.overdue.amount += p.parcelValue;
            acc.overdue.count += 1;
        }
        return acc;
    }, {
        paid: { amount: 0, count: 0 },
        open: { amount: 0, count: 0 },
        overdue: { amount: 0, count: 0 },
    });
  }, [enrichedPayments]);

  const requestSort = (key: keyof EnrichedPayment) => {
    let direction: SortDirection = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const vendorsWithPayments = useMemo(() => {
    const vendorMap = new Map(vendors.map(v => [v.id, v]));
    
    const paymentsByVendorId = enrichedPayments.reduce((acc, p) => {
        if (!acc[p.vendorId]) {
            acc[p.vendorId] = [];
        }
        acc[p.vendorId].push(p);
        return acc;
    }, {} as Record<string, EnrichedPayment[]>);

    return Object.keys(paymentsByVendorId)
        .map(vendorId => {
            const vendor = vendorMap.get(vendorId);
            if (!vendor) return null;

            let vendorPayments = paymentsByVendorId[vendorId];

            if (filter !== 'all') {
                vendorPayments = vendorPayments.filter(p => p.status === filter);
            }
            
            if (vendorPayments.length === 0) {
                return null;
            }

            if (sortConfig !== null) {
                vendorPayments.sort((a, b) => {
                    const valA = a[sortConfig.key];
                    const valB = b[sortConfig.key];
                    if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
                    if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
                    return 0;
                });
            }

            return {
                vendor,
                payments: vendorPayments,
            };
        })
        .filter((v): v is { vendor: Vendor; payments: EnrichedPayment[] } => v !== null)
        .sort((a, b) => a.vendor.name.localeCompare(b.vendor.name));
  }, [vendors, enrichedPayments, filter, sortConfig]);


  return (
    <div>
      <h2 className="text-3xl font-title text-brand-gray dark:text-white mb-6">Controle de Pagamentos</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <PaymentSummaryCard
            title="Total Pago"
            amount={summary.paid.amount}
            count={summary.paid.count}
            icon="check_circle"
            colorClassName="text-brand-green"
        />
        <PaymentSummaryCard
            title="Em Aberto"
            amount={summary.open.amount}
            count={summary.open.count}
            icon="hourglass_top"
            colorClassName="text-yellow-500"
        />
        <PaymentSummaryCard
            title="Vencido"
            amount={summary.overdue.amount}
            count={summary.overdue.count}
            icon="error"
            colorClassName="text-brand-red"
        />
      </div>

      <PaymentFilter currentFilter={filter} onFilterChange={setFilter} />

      <div className="space-y-6">
        {vendorsWithPayments.length > 0 ? (
          vendorsWithPayments.map(({ vendor, payments }) => (
            <VendorPaymentsCard
              key={vendor.id}
              vendor={vendor}
              payments={payments}
              nextPayment={nextPayment}
              sortConfig={sortConfig}
              requestSort={requestSort}
              onRegisterPayment={onRegisterPayment}
              onDeletePayment={onDeletePayment}
            />
          ))
        ) : (
          <div className="text-center p-10 text-brand-gray-light dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <Icon name="receipt_long" className="text-4xl mx-auto mb-2" />
            Nenhum pagamento encontrado para este filtro.
          </div>
        )}
      </div>

    </div>
  );
};

export default PaymentsScreen;
