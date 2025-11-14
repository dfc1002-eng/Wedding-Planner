

import React, { useState, useMemo } from 'react';
import { useWedding } from '../context/WeddingDataContext';
import { Gift } from '../types';
import { formatCurrency } from '../utils';
import Icon from '../components/ui/Icon';
import Tooltip from '../components/ui/Tooltip';
import GiftListItem from '../components/gifts/GiftListItem';

interface GiftListScreenProps {
    onEditGift: (gift: Gift) => void;
    onToggleThankYou: (giftId: string) => void;
    onSendWhatsApp: (gift: Gift, phoneNumber?: string) => void;
}

const GiftListScreen: React.FC<GiftListScreenProps> = ({ onEditGift, onToggleThankYou, onSendWhatsApp }) => {
    const { gifts, guests } = useWedding();
    const [showUnthankedOnly, setShowUnthankedOnly] = useState(false);
    
    const guestPhoneMap = useMemo(() => {
        return new Map(guests.map(guest => [guest.id, guest.phone]));
    }, [guests]);

    const totalReceived = useMemo(() => {
        return gifts.reduce((acc, gift) => acc + gift.amount, 0);
    }, [gifts]);

    const filteredGifts = useMemo(() => {
        return gifts
            .filter(gift => {
                if (!showUnthankedOnly) return true;
                return !gift.thankYouSent;
            })
            .sort((a, b) => a.guestName.localeCompare(b.guestName));
    }, [gifts, showUnthankedOnly]);

    const handleExportCSV = () => {
        const headers = [ "Convidado", "Valor (R$)", "Descrição do Presente", "Agradecimento Enviado" ];
        const csvRows = filteredGifts.map(g => [
            `"${g.guestName.replace(/"/g, '""')}"`,
            g.amount.toFixed(2),
            `"${g.description.replace(/"/g, '""')}"`,
            g.thankYouSent ? 'Sim' : 'Não'
        ].join(','));
        
        const csvContent = [headers.join(','), ...csvRows].join('\n');
        const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "lista_de_presentes.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-title text-brand-gray dark:text-white">Lista de Presentes</h2>
                <Tooltip text="Exportar a lista de presentes filtrada para um arquivo CSV.">
                    <button
                        onClick={handleExportCSV}
                        className="bg-white hover:bg-gray-100 text-brand-gray dark:bg-gray-700 dark:hover:bg-gray-600 font-bold py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors border dark:border-gray-600"
                    >
                        <Icon name="download" />
                        <span>Exportar Lista</span>
                    </button>
                </Tooltip>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm mb-6 flex justify-between items-center">
                <h3 className="font-bold text-brand-gray dark:text-white text-lg">Total Recebido</h3>
                <p className="text-3xl font-title text-brand-green">{formatCurrency(totalReceived)}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
                <div className="flex justify-end items-center mb-4">
                     <label className="flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={showUnthankedOnly} 
                            onChange={() => setShowUnthankedOnly(!showUnthankedOnly)}
                            className="h-4 w-4 rounded border-gray-300 text-brand-gold focus:ring-brand-gold"
                        />
                        <span className="ml-2 text-sm font-medium">Mostrar apenas não agradecidos</span>
                    </label>
                </div>

                {/* Table Header */}
                <div className="hidden md:flex p-4 bg-gray-50 dark:bg-gray-900 rounded-t-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 md:space-x-4">
                    <div className="w-full md:w-5/12 font-semibold text-sm text-brand-gray-light dark:text-gray-400">Convidado / Presente</div>
                    <div className="w-full md:w-2/12 text-center font-semibold text-sm text-brand-gray-light dark:text-gray-400">Valor</div>
                    <div className="w-full md:w-2/12 text-center font-semibold text-sm text-brand-gray-light dark:text-gray-400">Status</div>
                    <div className="w-full md:w-3/12 text-center font-semibold text-sm text-brand-gray-light dark:text-gray-400">Ações</div>
                </div>

                {/* List Container */}
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {filteredGifts.length > 0 ? (
                        filteredGifts.map(gift => (
                            <GiftListItem
                                key={gift.id}
                                gift={gift}
                                onEdit={() => onEditGift(gift)}
                                onToggleThankYou={onToggleThankYou}
                                onSendWhatsApp={onSendWhatsApp}
                                phoneNumber={guestPhoneMap.get(gift.guestId)}
                            />
                        ))
                    ) : (
                         <div className="text-center p-10 text-brand-gray-light dark:text-gray-400">
                            <Icon name="sentiment_dissatisfied" className="text-4xl mx-auto mb-2" />
                            Nenhum presente encontrado.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GiftListScreen;
