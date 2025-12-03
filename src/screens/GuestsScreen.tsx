import React, { useState, useMemo, useEffect } from 'react';
import { useWedding } from '../context/WeddingDataContext';
import { useAuth } from '../context/AuthContext'; 
import { Guest, GuestStatus } from '../types';
import Icon from '../components/ui/Icon';
import GuestStats from '../components/guests/GuestStats';
import GuestListItem from '../components/guests/GuestListItem';
import Tooltip from '../components/ui/Tooltip';
import { GUEST_GROUPS } from '../constants'; 

interface GuestsScreenProps {
    onAddGuest: () => void;
    onEditGuest: (guest: Guest) => void;
    onDeleteGuest: (guestIds: string[]) => void;
    onChangeGuestsStatus: (guestIds: string[], newStatus: GuestStatus) => void;
}

const GuestsScreen: React.FC<GuestsScreenProps> = ({ onAddGuest, onEditGuest, onDeleteGuest, onChangeGuestsStatus }) => {
    const { guests } = useWedding();
    const { user } = useAuth(); 
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<GuestStatus | 'all'>('all');
    const [groupFilter, setGroupFilter] = useState<string | 'all'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedGuestIds, setSelectedGuestIds] = useState<Set<string>>(new Set()); 
    const ITEMS_PER_PAGE = 7;

    const filteredGuests = useMemo(() => {
        return guests
            .filter(guest => {
                if (statusFilter === 'all') return true;
                return guest.status === statusFilter;
            })
            .filter(guest => {
                if (groupFilter === 'all') return true;
                return guest.group === groupFilter;
            })
            .filter(guest => {
                return guest.name.toLowerCase().includes(searchTerm.toLowerCase());
            })
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [guests, searchTerm, statusFilter, groupFilter]);
    
    useEffect(() => {
        setCurrentPage(1);
        setSelectedGuestIds(new Set()); 
    }, [searchTerm, statusFilter, groupFilter]);

    const totalPages = Math.ceil(filteredGuests.length / ITEMS_PER_PAGE);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);
    
    const paginatedGuests = useMemo(() => {
        if (filteredGuests.length === 0) return [];
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredGuests.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredGuests, currentPage]);

    const handleSelectGuest = (guestId: string, isSelected: boolean) => {
        setSelectedGuestIds(prev => {
            const newSet = new Set(prev);
            if (isSelected) {
                newSet.add(guestId);
            } else {
                newSet.delete(guestId);
            }
            return newSet;
        });
    };

    const handleSelectAll = (isChecked: boolean) => {
        setSelectedGuestIds(prev => {
            const newSet = new Set(prev);
            if (isChecked) {
                paginatedGuests.forEach(guest => newSet.add(guest.id));
            } else {
                paginatedGuests.forEach(guest => newSet.delete(guest.id));
            }
            return newSet;
        });
    };

    const isAllPaginatedGuestsSelected = paginatedGuests.length > 0 && paginatedGuests.every(guest => selectedGuestIds.has(guest.id));

    const handleBulkDelete = () => {
        if (selectedGuestIds.size === 0) return;
        const guestNames = Array.from(selectedGuestIds).map(id => guests.find(g => g.id === id)?.name).filter(Boolean).join(', ');
        if (window.confirm(`Tem certeza que deseja excluir os convidados selecionados (${guestNames})? Esta ação não pode ser desfeita.`)) {
            onDeleteGuest(Array.from(selectedGuestIds));
            setSelectedGuestIds(new Set());
        }
    };

    const handleBulkStatusChange = (newStatus: GuestStatus) => {
        if (selectedGuestIds.size === 0) return;
        onChangeGuestsStatus(Array.from(selectedGuestIds), newStatus);
        setSelectedGuestIds(new Set());
    };

    const handleExportCSV = () => {
        if (guests.length === 0) {
            alert("Não há convidados para exportar.");
            return;
        }

        const headers = [
            "Nome",
            "Status",
            "Grupo",
            "Numero de Acompanhantes",
            "Telefone",
            "Endereço",
            "Observações"
        ];
        
        const escapeCsvField = (field: any) => {
            const stringField = String(field === null || field === undefined ? '' : field);
            if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
                return `"${stringField.replace(/"/g, '""')}"`;
            }
            return stringField;
        };

        const csvRows = guests.map(g => [
            escapeCsvField(g.name),
            escapeCsvField(g.status),
            escapeCsvField(g.group),
            g.plusOnes,
            escapeCsvField(g.phone),
            escapeCsvField(g.address),
            escapeCsvField(g.notes),
        ].join(','));

        const csvContent = [headers.join(','), ...csvRows].join('\n');

        const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "lista_de_convidados.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                <h2 className="text-3xl font-title text-brand-gray dark:text-white">Lista de Convidados</h2>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                     <Tooltip text="Exportar lista de convidados para um arquivo CSV.">
                        <button
                            onClick={handleExportCSV}
                            className="bg-white hover:bg-gray-100 text-brand-gray dark:bg-gray-700 dark:hover:bg-gray-600 font-bold py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors border dark:border-gray-600"
                        >
                            <Icon name="download" />
                            <span>Exportar CSV</span>
                        </button>
                    </Tooltip>
                    <Tooltip text="Cadastrar um novo convidado na sua lista">
                        <button
                            onClick={onAddGuest}
                            className="bg-brand-pink-light hover:bg-brand-pink text-brand-gray dark:bg-brand-gold dark:hover:bg-opacity-80 dark:text-gray-900 font-bold py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                        >
                            <Icon name="add" />
                            <span>Adicionar Convidado</span>
                        </button>
                    </Tooltip>
                </div>
            </div>
            
            <GuestStats guests={guests} />

            <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-md mt-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                    {/* Search Input */}
                    <div className="relative w-full md:max-w-xs">
                        <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray-light" />
                        <input
                            type="text"
                            placeholder="Buscar convidado..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 pl-10 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 focus:ring-brand-gold focus:border-brand-gold"
                        />
                    </div>

                    {/* Filter Buttons for Status */}
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium text-brand-gray-light dark:text-gray-400">Status:</span>
                        {(['all', ...Object.values(GuestStatus)] as const).map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-3 py-1 text-sm font-semibold rounded-full transition-all duration-200 ease-in-out ${
                                    statusFilter === status
                                        ? 'bg-brand-gold text-white shadow-md'
                                        : 'bg-white dark:bg-gray-700 text-brand-gray dark:text-gray-300 hover:bg-brand-pink-light dark:hover:bg-gray-600'
                                }`}
                            >
                                {status === 'all' ? 'Todos' : status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Dropdown for Groups */}
                <div className="mb-4">
                    <label htmlFor="groupFilter" className="block text-sm font-medium text-brand-gray-light dark:text-gray-400 mb-1">Filtrar por Grupo:</label>
                    <select
                        id="groupFilter"
                        value={groupFilter}
                        onChange={(e) => setGroupFilter(e.target.value)}
                        className="w-full md:w-auto p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 focus:ring-brand-gold focus:border-brand-gold"
                    >
                        <option value="all">Todos os Grupos</option>
                        {GUEST_GROUPS.map(group => (
                            <option key={group} value={group}>{group}</option>
                        ))}
                    </select>
                </div>

                {/* Bulk Actions Bar */}
                {selectedGuestIds.size > 0 && (
                    <div className="flex flex-col md:flex-row items-center justify-between p-3 mb-4 bg-brand-pink-light dark:bg-gray-700 rounded-lg shadow-inner">
                        <span className="text-sm font-semibold text-brand-gray dark:text-gray-200 mb-2 md:mb-0">
                            {selectedGuestIds.size} convidado(s) selecionado(s)
                        </span>
                        <div className="flex items-center space-x-2">
                            <select
                                onChange={(e) => handleBulkStatusChange(e.target.value as GuestStatus)}
                                value="" // Reset select after action
                                className="p-2 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-600 text-sm"
                            >
                                <option value="" disabled>Mudar Status</option>
                                {Object.values(GuestStatus).map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                            <button
                                onClick={handleBulkDelete}
                                className="bg-brand-red hover:opacity-90 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors flex items-center space-x-1"
                            >
                                <Icon name="delete" className="text-lg" />
                                <span>Excluir</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Desktop Table Header */}
                <div className="hidden md:flex px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-t-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
                    <div className="flex-shrink-0 w-6 mr-3">
                        <input
                            type="checkbox"
                            checked={isAllPaginatedGuestsSelected}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-brand-gold focus:ring-brand-gold"
                        />
                    </div>
                    <div className="flex-1 font-semibold text-sm text-brand-gray-light dark:text-gray-400">Convite</div>
                    <div className="md:w-32 text-center font-semibold text-sm text-brand-gray-light dark:text-gray-400">
                        <Tooltip text="Número de acompanhantes (não inclui o convidado principal)" position="top">
                            <span>Acompanhantes</span>
                        </Tooltip>
                    </div>
                    <div className="md:w-32 text-center font-semibold text-sm text-brand-gray-light dark:text-gray-400">Status</div>
                    <div className="md:w-40 text-center font-semibold text-sm text-brand-gray-light dark:text-gray-400">Ações</div>
                </div>

                {/* Guest List */}
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {paginatedGuests.length > 0 ? (
                        paginatedGuests.map(guest => (
                            <GuestListItem
                                key={guest.id}
                                guest={guest}
                                onEdit={() => onEditGuest(guest)}
                                onDelete={() => onDeleteGuest([guest.id])} 
                                isSelected={selectedGuestIds.has(guest.id)}
                                onSelect={handleSelectGuest}
                                userId={user?.uid} 
                            />
                        ))
                    ) : (
                         <div className="text-center p-10 text-brand-gray-light dark:text-gray-400">
                            <Icon name="sentiment_dissatisfied" className="text-4xl mx-auto mb-2" />
                            Nenhum convidado encontrado para este filtro.
                        </div>
                    )}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-between items-center p-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="bg-white hover:bg-gray-100 text-brand-gray dark:bg-gray-700 dark:hover:bg-gray-600 font-bold py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors border dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Icon name="chevron_left" />
                            <span>Anterior</span>
                        </button>
                        <span className="text-sm font-semibold text-brand-gray-light dark:text-gray-400">
                            Página {currentPage} de {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="bg-white hover:bg-gray-100 text-brand-gray dark:bg-gray-700 dark:hover:bg-gray-600 font-bold py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors border dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span>Próximo</span>
                            <Icon name="chevron_right" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GuestsScreen;