import React from 'react';

interface TooltipProps {
  children: React.ReactNode;
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const getPositionClasses = (position: string) => {
    switch (position) {
        case 'bottom':
            return 'top-full left-1/2 -translate-x-1/2 mt-2';
        case 'left':
            return 'top-1/2 -translate-y-1/2 right-full mr-2';
        case 'right':
            return 'top-1/2 -translate-y-1/2 left-full ml-2';
        case 'top':
        default:
            return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
    }
}

const Tooltip: React.FC<TooltipProps> = ({ children, text, position = 'bottom' }) => {
  if (!text) return <>{children}</>;

  return (
    <div className="relative group">
      {children}
      <div className={`absolute ${getPositionClasses(position)} w-max max-w-xs
                      bg-brand-gray dark:bg-gray-900 text-white text-xs font-semibold 
                      rounded-md p-2 shadow-lg z-10
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300
                      invisible group-hover:visible
                      pointer-events-none`}>
        {text}
        <div 
          className="absolute bg-brand-gray dark:bg-gray-900 h-2 w-2 transform rotate-45"
          style={{
            bottom: position === 'top' ? '-4px' : 'auto',
            top: position === 'bottom' ? '-4px' : 'auto',
            left: position === 'left' ? 'auto' : 'calc(50% - 4px)',
            right: position === 'left' ? '-4px' : 'auto',
          }}
        ></div>
      </div>
    </div>
  );
};

export default Tooltip;