import React from 'react';
import DonutChart from '../charts/DonutChart';
import Tooltip from '../ui/Tooltip';
import Icon from '../ui/Icon';

interface CategoryChartCardProps {
    expensesByCategory: { name: string; value: number }[];
}

const CategoryChartCard: React.FC<CategoryChartCardProps> = ({ expensesByCategory }) => {
    const chartColors = ['#dbb27f', '#f8eae0', '#a9a9a9', '#a3b18a', '#e9beb4'];
    
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <h3 className="font-bold text-brand-gray dark:text-white text-lg">Pagamentos por Categoria</h3>
                <Tooltip text="Gráfico mostrando a distribuição do valor total já pago entre as diferentes categorias de fornecedores.">
                    <Icon name="info" className="text-brand-gray-light dark:text-gray-400 text-base cursor-pointer" />
                </Tooltip>
            </div>
            <DonutChart data={expensesByCategory} colors={chartColors} />
        </div>
    );
};

export default CategoryChartCard;