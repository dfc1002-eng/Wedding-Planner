import React, { useState, useMemo, useEffect } from 'react';
import { useWedding } from '../context/WeddingDataContext';
import { Guest, GuestStatus } from '../types';
import Icon from '../components/ui/Icon';
import GuestStats from '../components/guests/GuestStats';
import GuestListItem from '../components/guests/GuestListItem';
import Tooltip from '../components/ui/Tooltip';

interface GuestsScreenProps {
    onAddGuest: () => void;
    onEditGuest: (guest: Guest) => void;
    onDeleteGuest: (guestId: string) => void;
}

const GuestsScreen: React.FC<GuestsScreenProps> = ({ onAddGuest, onEditGuest, onDeleteGuest }) => {
    const { guests } = useWedding();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<GuestStatus | 'all'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 7; // Alterado para 7 itens por página

    const filteredGuests = useMemo(() => {
        return guests
            .filter(guest => {
                if (statusFilter === 'all') return true;
                return guest.status === statusFilter;
            })
            .filter(guest => {
                return guest.name.toLowerCase().includes(searchTerm.toLowerCase());
            });
    }, [guests, searchTerm, statusFilter]);
    
    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    const totalPages = Math.ceil(filteredGuests.length / ITEMS_PER_PAGE);

    // Adjust current page if it's out of bounds (e.g., after deletion)
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


    const handleExportCSV = () => {
        if (guests.length === 0) {
            // Consider using a more user-friendly notification system if available
            alert("Não há convidados para exportar.");
            return;
        }

        const headers = [
            "Nome",
            "Status",
            "Grupo",
            "Acompanhantes Convidados",
            "Acompanhantes Confirmados",
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
            g.status === GuestStatus.Confirmed ? g.confirmedPlusOnes ?? 0 : 0,
            escapeCsvField(g.phone),
            escapeCsvField(g.address),
            escapeCsvField(g.notes),
        ].join(','));

        const csvContent = [headers.join(','), ...csvRows].join('\n');

        const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' }); // BOM for Excel
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

            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md mt-6">
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

                    {/* Filter Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
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

                {/* Desktop Table Header */}
                <div className="hidden md:flex p-4 bg-gray-50 dark:bg-gray-900 rounded-t-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
                    <div className="flex-1 font-semibold text-sm text-brand-gray-light dark:text-gray-400">Convidado</div>
                    <div className="md:w-32 text-center font-semibold text-sm text-brand-gray-light dark:text-gray-400">Acompanhantes</div>
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
                                onDelete={() => onDeleteGuest(guest.id)}
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