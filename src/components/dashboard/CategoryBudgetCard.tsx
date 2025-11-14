import React from 'react';
import { formatCurrency, getCategoryIcon } from '../../utils';
import Icon from '../ui/Icon';
import Tooltip from '../ui/Tooltip';

interface CategoryBudgetCardProps {
    contractedByCategory: { name: string; value: number }[];
    totalContracted: number;
}

const CategoryBudgetCard: React.FC<CategoryBudgetCardProps> = ({ contractedByCategory, totalContracted }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 mb-4">
            <h3 className="font-bold text-brand-gray dark:text-white text-lg">Contratado por Categoria</h3>
            <Tooltip text="Mostra o valor total contratado para cada categoria, ajudando a visualizar para onde o orçamento está alocado.">
                <Icon name="info" className="text-brand-gray-light dark:text-gray-400 text-base cursor-pointer" />
            </Tooltip>
        </div>
        <div className="space-y-3">
            {contractedByCategory.map((item, index) => (
                <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-brand-gray dark:text-gray-300 flex items-center">
                            <Icon name={getCategoryIcon(item.name)} className="mr-2 text-base text-brand-gray-light" />
                            {item.name}
                        </span>
                        <span className="text-brand-gray-light dark:text-gray-400">{formatCurrency(item.value)}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                            className="bg-brand-pink h-2 rounded-full"
                            style={{ width: totalContracted > 0 ? `${(item.value / totalContracted) * 100}%` : '0%' }}
                        ></div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default CategoryBudgetCard;