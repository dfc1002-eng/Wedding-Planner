import React from 'react';
import { Gift, ThankYouStatus } from '../../types';
import { formatCurrency } from '../../utils';
import Icon from '../ui/Icon';
import StatusChip from '../ui/StatusChip';
import Tooltip from '../ui/Tooltip';

interface GiftListItemProps {
    gift: Gift;
    onEdit: () => void;
    onToggleThankYou: (giftId: string) => void;
    onSendWhatsApp: (gift: Gift, phoneNumber?: string) => void;
    phoneNumber?: string;
}

const GiftListItem: React.FC<GiftListItemProps> = ({ gift, onEdit, onToggleThankYou, onSendWhatsApp, phoneNumber }) => {
    
    const whatsAppTooltip = phoneNumber ? "Enviar mensagem de agradecimento" : "Telefone não cadastrado para este convidado.";

    return (
        <div className="px-4 py-3 flex flex-col md:flex-row md:items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors space-y-3 md:space-y-0">
            {/* Col 1: Convidado / Presente */}
            <div className="w-full md:w-5/12">
                <p className="font-bold text-brand-gray dark:text-white">{gift.guestName}</p>
                <p className="text-sm text-brand-gray-light dark:text-gray-400 line-clamp-2">
                    {gift.description || <span className="italic">Nenhuma descrição</span>}
                </p>
            </div>

            {/* Col 2: Valor */}
            <div className="w-full md:w-2/12 flex justify-between items-center md:justify-center">
                <span className="md:hidden text-sm font-semibold text-brand-gray-light">Valor</span>
                <p className="font-bold text-brand-gray dark:text-white">{formatCurrency(gift.amount)}</p>
            </div>

            {/* Col 3: Status */}
            <div className="w-full md:w-2/12 flex justify-between items-center md:justify-center">
                <span className="md:hidden text-sm font-semibold text-brand-gray-light">Status</span>
                <StatusChip status={gift.thankYouSent ? ThankYouStatus.Sent : ThankYouStatus.Pending} />
            </div>

            {/* Col 4: Ações */}
            <div className="w-full md:w-3/12 flex justify-between items-center md:justify-center">
                <span className="md:hidden text-sm font-semibold text-brand-gray-light">Ações</span>
                <div className="flex items-center space-x-1">
                    <Tooltip text={gift.thankYouSent ? "Desmarcar agradecimento" : "Marcar como agradecido"} position="top">
                        <button
                            onClick={() => onToggleThankYou(gift.id)}
                            className={`p-2 rounded-full transition-colors ${
                                gift.thankYouSent 
                                    ? 'text-brand-green hover:bg-gray-200 dark:hover:bg-gray-600' 
                                    : 'text-brand-gray-light hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                            aria-label={gift.thankYouSent ? `Desmarcar agradecimento para ${gift.guestName}`: `Marcar agradecimento para ${gift.guestName}`}
                        >
                            <Icon name="thumb_up" className="text-lg" />
                        </button>
                    </Tooltip>
                    <Tooltip text={whatsAppTooltip} position="top">
                         <button
                            onClick={() => onSendWhatsApp(gift, phoneNumber)}
                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-brand-gray-light disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label={`Enviar WhatsApp para ${gift.guestName}`}
                            disabled={!phoneNumber}
                        >
                            <Icon name="whatsapp" className="text-lg" />
                        </button>
                    </Tooltip>
                    <Tooltip text="Editar Presente" position="top">
                        <button onClick={onEdit} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-brand-gray-light" aria-label={`Editar presente de ${gift.guestName}`}>
                            <Icon name="edit" className="text-lg" />
                        </button>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
};

export default GiftListItem;