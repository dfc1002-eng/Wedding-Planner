
import React, { useEffect, useState } from 'react';
import Icon from './Icon';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in
    setIsVisible(true);

    const timer = setTimeout(() => {
      // Animate out
      setIsVisible(false);
      // Allow time for animation before unmounting
      setTimeout(onClose, 300); 
    }, 4000);

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  const baseClasses = "fixed bottom-5 right-5 flex items-center p-4 text-white rounded-lg shadow-lg transition-all duration-300 ease-in-out z-50";
  const typeClasses = {
    success: 'bg-green-500',
    error: 'bg-red-500',
  };
  const animationClasses = isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5';

  const iconName = type === 'success' ? 'check_circle' : 'error';

  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${animationClasses}`}>
      <Icon name={iconName} className="mr-3 text-xl" />
      <span className="text-sm font-semibold">{message}</span>
      <button onClick={onClose} className="ml-4 p-1 rounded-full hover:bg-black/20">
        <Icon name="close" className="text-base"/>
      </button>
    </div>
  );
};

export default Toast;
