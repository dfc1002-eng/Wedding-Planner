import React from 'react';
import { format as formatDate } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { useNavigate } from 'react-router-dom';
import { WeddingData, PaymentNotification } from '../../types';
import ReminderBell from '../ui/ReminderBell';
import Icon from '../ui/Icon';

interface HeaderProps {
    weddingData: WeddingData;
    paymentNotifications: PaymentNotification[];
}

const Header: React.FC<HeaderProps> = ({ weddingData, paymentNotifications }) => {
    const navigate = useNavigate();

    return (
        <header className="mb-8 flex justify-between items-start">
            <div>
                <h1 className="font-title text-5xl text-brand-gray dark:text-white">{weddingData.coupleNames.join(' & ')}</h1>
                <div className="mt-2 space-y-1">
                    <p className="text-brand-gray-light dark:text-gray-400 text-lg">
                        Dia do Casamento: {formatDate(weddingData.weddingDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                    {weddingData.venueName && (
                        <p className="text-brand-gray-light dark:text-gray-400 text-lg flex items-center">
                            <Icon name="location_on" className="text-xl mr-2" />
                            {weddingData.venueName}
                        </p>
                    )}
                     {weddingData.weddingWebsite && (
                        <a 
                            href={weddingData.weddingWebsite.startsWith('http') ? weddingData.weddingWebsite : `https://${weddingData.weddingWebsite}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-brand-gray-light dark:text-gray-400 text-lg flex items-center hover:text-brand-gold transition-colors"
                        >
                            <Icon name="link" className="text-xl mr-2" />
                            <span>Site do Casamento</span>
                        </a>
                    )}
                </div>
            </div>
            <ReminderBell 
                notifications={paymentNotifications}
                onNotificationClick={() => navigate('/payments')}
            />
        </header>
    );
};

export default Header;