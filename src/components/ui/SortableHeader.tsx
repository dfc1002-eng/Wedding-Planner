import React from 'react';
import Icon from './Icon';

export type SortDirection = 'ascending' | 'descending';

export interface SortConfig<T> {
  key: keyof T;
  direction: SortDirection;
}

interface SortableHeaderProps<T> {
  label: string;
  sortKey: keyof T;
  sortConfig: SortConfig<T> | null;
  requestSort: (key: keyof T) => void;
  className?: string;
}

const SortableHeader = <T,>({
  label,
  sortKey,
  sortConfig,
  requestSort,
  className = '',
}: SortableHeaderProps<T>) => {
  const isSorting = sortConfig?.key === sortKey;
  const iconName = isSorting
    ? sortConfig.direction === 'ascending'
      ? 'arrow_upward'
      : 'arrow_downward'
    : 'unfold_more';
  const iconClass = isSorting ? 'text-brand-gray dark:text-white' : 'text-brand-gray-light/50 dark:text-gray-500';

  return (
    <th className={`p-5 text-xs font-semibold text-brand-gray-light dark:text-gray-400 uppercase tracking-wider ${className}`}>
      <button
        onClick={() => requestSort(sortKey)}
        className="flex items-center gap-1 group"
        aria-label={`Ordenar por ${label}`}
      >
        <span>{label}</span>
        <Icon name={iconName} className={`text-base transition-colors ${iconClass} group-hover:text-brand-gray dark:group-hover:text-white`} />
      </button>
    </th>
  );
};

export default SortableHeader;
