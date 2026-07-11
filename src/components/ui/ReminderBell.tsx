import React, { useState, useRef, useEffect } from 'react';
import { PaymentNotification } from '../../types';
import Icon from './Icon';
import { formatCurrency } from '../../utils';

interface ReminderBellProps {
    notifications: PaymentNotification[];
    onNotificationClick: () => void;
}

const ReminderBell: React.FC<ReminderBellProps> = ({ notifications, onNotificationClick }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const severityClasses = {
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500',
    };

    // Click outside handler
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);
    
    const handleBellClick = () => {
        if(notifications.length > 0) {
            onNotificationClick();
        }
        setIsOpen(prev => !prev);
    }

    return (
        <div className="relative" ref={wrapperRef}>
            <button 
                onClick={() => setIsOpen(prev => !prev)}
                className="relative p-2 rounded-full hover:bg-brand-pink-light dark:hover:bg-gray-700"
            >
                <Icon name="notifications" className="text-2xl text-brand-gray-light dark:text-gray-300" />
                {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-brand-red ring-2 ring-white dark:ring-gray-800" />
                )}
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700 z-20">
                    <div className="p-3 border-b dark:border-gray-700">
                        <h3 className="font-semibold text-sm">Lembretes de Pagamento ({notifications.length})</h3>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map(n => (
                                <div key={n.id} onClick={handleBellClick} className="flex items-start p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b dark:border-gray-700/50">
                                    <span className={`w-2.5 h-2.5 rounded-full mt-1.5 mr-3 flex-shrink-0 ${severityClasses[n.severity]}`} />
                                    <div className="text-sm">
                                        <p className="font-bold text-brand-gray dark:text-gray-200">{n.vendor.name}</p>
                                        <p className="text-gray-600 dark:text-gray-400">{n.message} - <span className="font-semibold">{formatCurrency(n.payment.parcelValue)}</span></p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center text-sm text-gray-500">
                                <Icon name="check_circle" className="text-3xl text-green-500 mx-auto mb-2" />
                                Nenhum lembrete pendente.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReminderBell;