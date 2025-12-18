import React, { useState } from 'react';
import { format as formatDate } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { useNavigate } from 'react-router-dom';
import { WeddingData, PaymentNotification } from '../../types';
import ReminderBell from '../ui/ReminderBell';
import Icon from '../ui/Icon';
// Importar o Modal
import HelpModal from '../modals/HelpModal';

interface HeaderProps {
    weddingData: WeddingData;
    paymentNotifications: PaymentNotification[];
}

const Header: React.FC<HeaderProps> = ({ weddingData, paymentNotifications }) => {
    const navigate = useNavigate();
    // Criar o estado para controlar o modal
    const [isHelpOpen, setIsHelpOpen] = useState(false);

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
            <div className="flex items-center gap-4"> {/* Div container para alinhar Help e ReminderBell */}
                {/* Botão de Ajuda */}
                <button
                    onClick={() => setIsHelpOpen(true)}
                    className="p-2 rounded-full text-brand-gray-light hover:bg-gray-100 hover:text-brand-pink dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Ajuda e Guia"
                >
                    <Icon name="help" className="text-xl" />
                </button>
                <ReminderBell 
                    notifications={paymentNotifications}
                    onNotificationClick={() => navigate('/payments')}
                />
            </div>
            {/* Renderizar o HelpModal condicionalmente */}
            {isHelpOpen && <HelpModal onClose={() => setIsHelpOpen(false)} />}
        </header>
    );
};

export default Header;