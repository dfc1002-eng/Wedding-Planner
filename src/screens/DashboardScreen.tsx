import React, { useMemo } from 'react';
import { useWedding } from '../context/WeddingDataContext';
import { formatCurrency } from '../utils';

// Import components
import BalanceCard from '../components/dashboard/BalanceCard';
import StatCard from '../components/dashboard/StatCard';
import NextPaymentCard from '../components/dashboard/NextPaymentCard';
import CategoryChartCard from '../components/dashboard/CategoryChartCard';
import CategoryBudgetCard from '../components/dashboard/CategoryBudgetCard';
import Tooltip from '../components/ui/Tooltip';
import Icon from '../components/ui/Icon';

const DashboardScreen: React.FC = () => {
    const { 
        weddingData, 
        vendors, 
        daysLeft, 
        totalPaid, 
        nextPayment, 
        expensesByCategory,
        tasks
    } = useWedding();

    const totalContracted = useMemo(() => 
        vendors.reduce((acc, v) => acc + v.contractedValue, 0),
    [vendors]);

    const contractedByCategory = useMemo(() => {
        const categoryMap: { [key: string]: number } = {};
        vendors.forEach(vendor => {
            categoryMap[vendor.category] = (categoryMap[vendor.category] || 0) + vendor.contractedValue;
        });
        return Object.entries(categoryMap)
            .map(([name, value]) => ({ name, value }))
            .filter(item => item.value > 0)
            .sort((a,b) => b.value - a.value); // Sort descending by value
    }, [vendors]);

    const completedTasks = useMemo(() => tasks.filter(t => t.completed).length, [tasks]);
    const tasksPercentage = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

    const costPerGuest = useMemo(() => {
        if (weddingData.guestCount > 0) {
            return weddingData.totalBudget / weddingData.guestCount;
        }
        return 0;
    }, [weddingData.totalBudget, weddingData.guestCount]);

    return (
        <div className="space-y-6">
            
            {/* Section 1: Main Balance */}
            <BalanceCard 
                totalBudget={weddingData.totalBudget}
                totalPaid={totalPaid}
                totalContracted={totalContracted}
            />

            {/* Section 2: Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <StatCard value={daysLeft} label="Dias Restantes" icon="calendar_month" />
                 <StatCard value={weddingData.guestCount} label="Convidados" icon="people" />
                 <Tooltip text="Custo estimado por convidado, com base no orçamento total e na estimativa de convidados. (Orçamento Total / N° de Convidados)">
                    <StatCard 
                        value={formatCurrency(costPerGuest)} 
                        label="Custo por Convidado" 
                        icon="payments"
                    />
                 </Tooltip>
            </div>

            {/* Section 3: Key Info & Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <NextPaymentCard nextPayment={nextPayment} />

                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <h3 className="font-bold text-brand-gray dark:text-white text-lg">Progresso do Checklist</h3>
                        <Tooltip text="Porcentagem de tarefas marcadas como concluídas no seu checklist.">
                            <Icon name="info" className="text-brand-gray-light dark:text-gray-400 text-base cursor-pointer" />
                        </Tooltip>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative w-20 h-20">
                            <svg className="w-full h-full" viewBox="0 0 36 36">
                                <path
                                    d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#e5e7eb"
                                    className="dark:stroke-gray-700"
                                    strokeWidth="3"
                                />
                                <path
                                    d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#dbb27f"
                                    strokeWidth="3"
                                    strokeDasharray={`${tasksPercentage}, 100`}
                                    strokeLinecap="round"
                                    transform="rotate(-90 18 18)"
                                />
                            </svg>
                             <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xl font-bold text-brand-gray dark:text-white">{tasksPercentage.toFixed(0)}%</span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-brand-gray dark:text-gray-200">
                                {completedTasks} de {tasks.length} tarefas concluídas
                            </p>
                            <p className="text-sm text-brand-gray-light dark:text-gray-400 mt-1">
                                Continue assim para não perder nenhum prazo!
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 4: Detailed Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CategoryChartCard expensesByCategory={expensesByCategory} />
                <CategoryBudgetCard contractedByCategory={contractedByCategory} totalContracted={totalContracted} />
            </div>
        </div>
    );
};

export default DashboardScreen;