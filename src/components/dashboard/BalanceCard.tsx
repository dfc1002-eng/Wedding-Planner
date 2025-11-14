import React from 'react';
import { formatCurrency } from '../../utils';
import Tooltip from '../ui/Tooltip';

interface BalanceCardProps {
    totalBudget: number;
    totalPaid: number;
    totalContracted: number;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ totalBudget, totalPaid, totalContracted }) => {
    const contractedPercentage = totalBudget > 0 ? (totalContracted / totalBudget) * 100 : 0;
    const paidPercentage = totalBudget > 0 ? (totalPaid / totalBudget) * 100 : 0;
    const remainingBudget = totalBudget - totalContracted;
    const remainingToPay = totalContracted - totalPaid;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
            <h3 className="font-bold text-brand-gray dark:text-white text-lg mb-4">Balanço Geral do Orçamento</h3>
            
            <div className="mb-4">
                <div className="flex justify-between items-end mb-1">
                    <span className="text-sm text-brand-gray-light dark:text-gray-400">Total Contratado</span>
                    <span className="text-2xl font-bold font-title text-brand-gray dark:text-white">{formatCurrency(totalContracted)}</span>
                </div>
                <Tooltip text="A barra rosa representa o valor já pago. A barra com transparência representa o valor a pagar do que foi contratado.">
                    <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                        <div
                            className="absolute top-0 left-0 h-4 bg-brand-pink rounded-l-full"
                            style={{ width: `${paidPercentage}%` }}
                            title={`Pago: ${formatCurrency(totalPaid)}`}
                        ></div>
                        <div
                            className="absolute top-0 h-4 bg-brand-pink/50 rounded-r-full"
                            style={{ left: `${paidPercentage}%`, width: `${contractedPercentage - paidPercentage}%` }}
                            title={`A Pagar: ${formatCurrency(remainingToPay)}`}
                        ></div>
                    </div>
                </Tooltip>
                 <div className="flex justify-between items-end text-xs mt-1">
                    <span className="text-brand-gray-light dark:text-gray-400">Orçamento Total: {formatCurrency(totalBudget)}</span>
                    <span className="text-brand-gray-light dark:text-gray-400">
                        {contractedPercentage.toFixed(0)}% do orçamento utilizado
                    </span>
                </div>
            </div>

            {/* Barra de progresso do orçamento */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-brand-gray-light dark:text-gray-400">Progresso do Orçamento</span>
                    <span className="text-sm font-semibold text-brand-gray dark:text-white">
                        {contractedPercentage.toFixed(0)}% utilizado
                    </span>
                </div>
                <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div
                        className="absolute top-0 left-0 h-2.5 bg-brand-gold rounded-full"
                        style={{ width: `${Math.min(contractedPercentage, 100)}%` }}
                    ></div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center mt-6">
                <div>
                    <p className="text-sm text-brand-gray-light dark:text-gray-400">Total Pago</p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">{formatCurrency(totalPaid)}</p>
                </div>
                <div>
                    <p className="text-sm text-brand-gray-light dark:text-gray-400">A Pagar</p>
                    <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{formatCurrency(remainingToPay)}</p>
                </div>
                <div className="col-span-2 md:col-span-1">
                    <Tooltip text="Valor restante do seu orçamento após subtrair tudo que já foi contratado (Orçamento Total - Total Contratado).">
                        <div>
                            <p className="text-sm text-brand-gray-light dark:text-gray-400">Disponível</p>
                            <p className={`text-lg font-bold ${remainingBudget >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-500'}`}>
                                {formatCurrency(remainingBudget)}
                            </p>
                        </div>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
};

export default BalanceCard;