import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 a 100
  size?: 'sm' | 'md' | 'lg';
  color?: string; // Classe de cor do Tailwind (ex: bg-green-500)
  showPercentage?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  size = 'md', 
  color = 'bg-brand-gold', 
  showPercentage = false 
}) => {
  // Garante que o valor fica entre 0 e 100
  const safeProgress = Math.min(100, Math.max(0, progress));

  const heightClass = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-4' : 'h-2.5';
  const textSizeClass = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className="w-full flex items-center gap-3">
      <div className={`flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${heightClass}`}>
        <div 
          className={`h-full rounded-full transition-all duration-500 ease-out ${color}`} 
          style={{ width: `${safeProgress}%` }}
        />
      </div>
      {showPercentage && (
        <span className={`font-medium text-gray-600 dark:text-gray-400 ${textSizeClass}`}>
          {Math.round(safeProgress)}%
        </span>
      )}
    </div>
  );
};

export default ProgressBar;