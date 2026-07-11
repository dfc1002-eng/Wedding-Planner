import React from 'react';
import Icon from '../ui/Icon';

interface StatCardProps {
    value: string | number;
    label: string;
    icon: string;
    className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ value, label, icon, className = '' }) => (
    <div className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm text-center flex flex-col justify-center items-center h-full ${className}`}>
        <Icon name={icon} className="text-3xl text-brand-gray-light dark:text-gray-400" />
        <p className="text-5xl font-title text-brand-gray dark:text-white mt-2">{value}</p>
        <p className="text-brand-gray-light dark:text-gray-400 mt-1">{label}</p>
    </div>
);

export default StatCard;