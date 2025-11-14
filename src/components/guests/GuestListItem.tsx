import React from 'react';
import { Guest, GuestStatus } from '../../types';
import Icon from '../ui/Icon';
import StatusChip from '../ui/StatusChip';
import Tooltip from '../ui/Tooltip';
import { cleanPhoneNumber } from '../../utils';

interface GuestListItemProps {
    guest: Guest;
    onEdit: () => void;
    onDelete: () => void;
}

const GuestListItem: React.FC<GuestListItemProps> = ({ guest, onEdit, onDelete }) => {
    const cleanedPhone = guest.phone ? cleanPhoneNumber(guest.phone) : '';

    return (
        <div className="px-4 py-3 flex flex-col md:flex-row md:items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            {/* Col 1: Nome e Grupo */}
            <div className="flex-1 mb-3 md:mb-0">
                <p className="font-bold text-brand-gray dark:text-white flex items-center">
                    {guest.status === GuestStatus.Confirmed && (
                        <Icon name="check_circle" className="text-brand-green mr-2" />
                    )}
                    {guest.name}
                </p>
                <p className="text-sm text-brand-gray-light dark:text-gray-400 flex items-center">
                    <Icon name="group" className="text-base mr-1.5" />
                    {guest.group}
                </p>
            </div>
            
            {/* Col 2: Acompanhantes */}
            <div className="md:w-32 flex justify-between items-center md:justify-center mb-2 md:mb-0">
                <span className="md:hidden text-sm font-semibold text-brand-gray-light">Acompanhantes</span>
                <Tooltip text="Número de acompanhantes (não inclui o convidado principal)" position="top">
                    <p className="text-sm font-bold text-brand-gray dark:text-white">
                        {guest.plusOnes}
                    </p>
                </Tooltip>
            </div>

            {/* Col 3: Status */}
            <div className="md:w-32 flex justify-between items-center md:justify-center mb-2 md:mb-0">
                <span className="md:hidden text-sm font-semibold text-brand-gray-light">Status</span>
                <Tooltip text="Status da confirmação de presença" position="top">
                    <StatusChip status={guest.status} />
                </Tooltip>
            </div>

            {/* Col 4: Ações */}
            <div className="md:w-40 flex justify-between items-center md:justify-center">
                <span className="md:hidden text-sm font-semibold text-brand-gray-light">Ações</span>
                <div className="flex items-center space-x-1">
                    {/* Botão de ligar removido */}
                    <Tooltip text="Enviar WhatsApp" position="top">
                        <a
                            href={`https://wa.me/55${cleanedPhone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-brand-gray-light disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label={`Enviar WhatsApp para ${guest.name}`}
                            disabled={!cleanedPhone}
                        >
                            <Icon name="whatsapp" className="text-lg" />
                        </a>
                    </Tooltip>
                    <Tooltip text="Editar Convidado" position="top">
                        <button onClick={onEdit} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-brand-gray-light" aria-label={`Editar ${guest.name}`}>
                            <Icon name="edit" className="text-lg" />
                        </button>
                    </Tooltip>
                    <Tooltip text="Excluir Convidado" position="top">
                        <button onClick={onDelete} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-brand-gray-light" aria-label={`Excluir ${guest.name}`}>
                            <Icon name="delete" className="text-lg" />
                        </button>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
};

export default GuestListItem;