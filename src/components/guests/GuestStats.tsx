import React, { useMemo } from 'react';
import { Guest, GuestStatus } from '../../types';
import Icon from '../ui/Icon';
import Tooltip from '../ui/Tooltip';

interface GuestStatsProps {
    guests: Guest[];
}

const StatCard: React.FC<{ icon: string; value: number; label: string; color: string }> = ({ icon, value, label, color }) => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex items-center gap-4 h-full">
        <div className={`p-3 rounded-full ${color}/10`}>
            <Icon name={icon} className={`text-2xl ${color.replace('bg-', 'text-')}`} />
        </div>
        <div>
            <p className="text-2xl font-bold text-brand-gray dark:text-white">{value}</p>
            <p className="text-sm text-brand-gray-light dark:text-gray-400">{label}</p>
        </div>
    </div>
);

const GuestStats: React.FC<GuestStatsProps> = ({ guests }) => {
    const stats = useMemo(() => {
        return guests.reduce((acc, guest) => {
            acc.totalPotentialPeople += 1 + guest.plusOnes;
            acc.totalGuests += 1;
            if (guest.status === GuestStatus.Confirmed) {
                acc.confirmed += 1;
                acc.totalPeopleConfirmed += 1 + (guest.confirmedPlusOnes || 0);
            }
            else if (guest.status === GuestStatus.Pending) acc.pending += 1;
            else if (guest.status === GuestStatus.Declined) acc.declined += 1;
            return acc;
        }, { totalPotentialPeople: 0, totalGuests: 0, confirmed: 0, pending: 0, declined: 0, totalPeopleConfirmed: 0 });
    }, [guests]);

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <Tooltip text="Soma de todos os convidados cadastrados mais todos os seus acompanhantes convidados. Representa o número máximo de pessoas esperadas.">
                <StatCard icon="supervisor_account" value={stats.totalPotentialPeople} label="Estimativa Total" color="bg-purple-500" />
            </Tooltip>
            <Tooltip text="Número total de convites (unidades/famílias) que foram cadastrados.">
                <StatCard icon="groups" value={stats.totalGuests} label="Convites Enviados" color="bg-blue-500" />
            </Tooltip>
            <Tooltip text="Soma de convidados confirmados + acompanhantes confirmados. Este é o número para o buffet.">
                <StatCard icon="person_check" value={stats.totalPeopleConfirmed} label="Pessoas Confirmadas" color="bg-brand-green" />
            </Tooltip>
            <Tooltip text="Convites que ainda não tiveram resposta de confirmação.">
                <StatCard icon="hourglass_top" value={stats.pending} label="Pendentes" color="bg-yellow-500" />
            </Tooltip>
            <Tooltip text="Convites que foram respondidos com 'Não'.">
                <StatCard icon="cancel" value={stats.declined} label="Recusaram" color="bg-red-500" />
            </Tooltip>
        </div>
    );
};

export default GuestStats;