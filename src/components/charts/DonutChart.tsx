import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import Icon from '../ui/Icon';
import { getCategoryIcon } from '../../utils';

interface DonutChartProps {
  data: { name: string; value: number }[];
  colors: string[];
}

const DonutChart: React.FC<DonutChartProps> = ({ data, colors }) => {
  const totalValue = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="w-full h-48 flex items-center">
      <div className="w-1/2 h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              innerRadius={60}
              fill="#8884d8"
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
             <foreignObject x="30%" y="35%" width="40%" height="30%">
                <div className="w-full h-full flex flex-col items-center justify-center text-center">
                    <p className="text-brand-gray dark:text-gray-300 text-lg font-bold font-body">Total</p>
                </div>
            </foreignObject>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="w-1/2 pl-4">
        <ul className="space-y-2">
            {data.map((entry, index) => (
                <li key={`legend-${index}`} className="flex items-center text-sm font-body">
                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: colors[index % colors.length] }}></span>
                    <Icon name={getCategoryIcon(entry.name)} className="mr-1.5 text-base text-brand-gray-light" />
                    <span className="text-brand-gray dark:text-gray-400">{entry.name} ({totalValue > 0 ? ((entry.value / totalValue) * 100).toFixed(0) : 0}%)</span>
                </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default DonutChart;