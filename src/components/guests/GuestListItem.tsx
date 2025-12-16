import React from 'react';
import { Guest, GuestStatus } from '../../types';
import Icon from '../ui/Icon';
import StatusChip from '../ui/StatusChip';
import Tooltip from '../ui/Tooltip';

interface GuestListItemProps {
    guest: Guest;
    onEdit: () => void;
    onDelete: () => void;
    isSelected: boolean;
    onSelect: (guestId: string, isSelected: boolean) => void;
    userId?: string;
    weddingSlug?: string; // Added weddingSlug prop
}

const GuestListItem: React.FC<GuestListItemProps> = ({ guest, onEdit, onDelete, isSelected, onSelect, userId, weddingSlug }) => {
    // Updated RSVP link logic to prioritize slug
    const identifier = weddingSlug || userId;
    const rsvpLink = identifier ? `${window.location.origin}/rsvp/${identifier}` : '';
    
    const messageText = `Olá ${guest.name}! Você está convidado(a) para o nosso casamento. Por favor, confirme sua presença aqui: ${rsvpLink}`;
    const whatsappHref = guest.phone 
        ? `https://wa.me/55${guest.phone.replace(/\D/g, '')}?text=${encodeURIComponent(messageText)}` 
        : '#';

    return (
        <div className="px-4 py-3 flex flex-col md:flex-row md:items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0">
            {/* Checkbox */}
            <div className="flex-shrink-0 mr-3 mb-2 md:mb-0">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => onSelect(guest.id, e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-brand-gold focus:ring-brand-gold cursor-pointer"
                />
            </div>

            {/* Nome */}
            <div className="flex-1 mb-2 md:mb-0">
                <p className="font-bold text-brand-gray dark:text-white flex items-center">
                    {guest.status === GuestStatus.Confirmed && (
                        <Icon name="check_circle" className="text-brand-green mr-2 text-sm" />
                    )}
                    {guest.name}
                </p>
                <p className="text-sm text-brand-gray-light dark:text-gray-400 flex items-center mt-0.5">
                    <Icon name="groups" className="text-sm mr-1.5 opacity-70" />
                    {guest.group}
                </p>
            </div>
            
            {/* Acompanhantes */}
            <div className="md:w-32 flex justify-between items-center md:justify-center mb-2 md:mb-0">
                <span className="md:hidden text-xs font-semibold text-gray-400 uppercase">Acompanhantes</span>
                <Tooltip text="Acompanhantes confirmados / limite permitido" position="top">
                    {guest.status === GuestStatus.Confirmed ? (
                        <div className="flex items-center font-medium text-gray-900 dark:text-gray-100">
                            <span className="text-green-600 mr-1">{guest.confirmedPlusOnes || 0}</span>
                            <span className="text-gray-400 mx-1">/</span>
                            <span className="text-gray-400">{guest.plusOnes || 0}</span>
                        </div>
                    ) : (
                        <div className="text-gray-400 text-xs">
                            Max: {guest.plusOnes || 0}
                        </div>
                    )}
                </Tooltip>
            </div>

            {/* Status */}
            <div className="md:w-32 flex justify-between items-center md:justify-center mb-2 md:mb-0">
                <span className="md:hidden text-xs font-semibold text-gray-400 uppercase">Status</span>
                <StatusChip status={guest.status} />
            </div>

            {/* Ações */}
            <div className="md:w-40 flex justify-end items-center gap-2">
                
                {/* BOTÃO NOVO (RSVP) */}
                <Tooltip text="Enviar Link RSVP via WhatsApp" position="top">
                    <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-1 px-2 py-1 rounded border border-green-200 bg-green-50 text-green-600 hover:bg-green-100 hover:border-green-300 transition-all text-[10px] font-bold uppercase tracking-wide ${!guest.phone ? 'opacity-40 cursor-not-allowed pointer-events-none grayscale' : ''}`}
                        aria-label={`Enviar RSVP para ${guest.name}`}
                    >
                        <Icon name="message-circle" className="text-xs" />
                        RSVP
                    </a>
                </Tooltip>

                <Tooltip text="Editar" position="top">
                    <button onClick={onEdit} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-brand-gold transition-colors">
                        <Icon name="edit" className="text-base" />
                    </button>
                </Tooltip>

                <Tooltip text="Excluir" position="top">
                    <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                        <Icon name="delete" className="text-base" />
                    </button>
                </Tooltip>
            </div>
        </div>
    );
};

export default GuestListItem;