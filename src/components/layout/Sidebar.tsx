import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../ui/Icon';
import Tooltip from '../ui/Tooltip';

interface SidebarProps {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
    isExpanded: boolean;
    toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isDarkMode, toggleDarkMode, isExpanded, toggleSidebar }) => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Extrai o ID da tela da URL (ex: /vendors -> vendors). Default para 'dashboard'
    const currentPath = location.pathname.substring(1) || 'dashboard';

    const navItems = [
        { id: 'dashboard', icon: 'grid_view', label: 'Geral' },
        { id: 'vendors', icon: 'storefront', label: 'Fornecedores' },
        { id: 'payments', icon: 'payment', label: 'Pagamentos' },
        { id: 'checklist', icon: 'checklist', label: 'Checklist' },
        { id: 'guests', icon: 'people', label: 'Convidados' },
        { id: 'giftList', icon: 'card_giftcard', label: 'Presentes' },
        { id: 'settings', icon: 'settings', label: 'Ajustes' },
    ];

    const handleNavigation = (id: string) => {
        navigate(id === 'dashboard' ? '/' : `/${id}`);
    };

    return (
        <aside className={`h-screen sticky top-0 flex flex-col p-4 bg-brand-background dark:bg-gray-800 shadow-md transition-all duration-300 ease-in-out ${isExpanded ? 'w-64' : 'w-20'}`}>
            <div className={`flex items-center mb-4 h-8 ${isExpanded ? 'justify-start' : 'justify-center'}`}>
                {isExpanded ? (
                    <h1 className="font-title text-2xl text-brand-gold">Wedding Planner</h1>
                ) : (
                    <Icon name="favorite" className="text-3xl text-brand-gold" />
                )}
            </div>

            <div className="mb-6">
                <Tooltip text={isExpanded ? 'Recolher menu' : 'Expandir menu'} position="right" disabled={isExpanded}>
                    <button
                        onClick={toggleSidebar}
                        className={`flex items-center w-full p-3 rounded-lg text-brand-gray-light hover:bg-brand-pink-light dark:text-gray-400 dark:hover:bg-gray-700 transition-colors ${isExpanded ? 'justify-end' : 'justify-center'}`}
                        aria-label={isExpanded ? "Recolher menu" : "Expandir menu"}
                    >
                        <Icon 
                            name={isExpanded ? 'chevron_left' : 'chevron_right'} 
                            className="text-2xl transition-transform duration-300" 
                        />
                    </button>
                </Tooltip>
            </div>
            
            <nav className="flex flex-col space-y-2 flex-grow">
                {navItems.map(item => (
                    <Tooltip key={item.id} text={item.label} position="right" disabled={isExpanded}>
                        <button 
                            onClick={() => handleNavigation(item.id)} 
                            className={`flex items-center space-x-3 p-3 rounded-lg text-left transition-colors w-full ${isExpanded ? '' : 'justify-center'} ${
                                currentPath === item.id || (currentPath === 'dashboard' && item.id === 'dashboard' && location.pathname === '/')
                                    ? 'bg-brand-pink text-brand-gray font-bold dark:bg-brand-gold dark:text-gray-900' 
                                    : 'text-brand-gray-light hover:bg-brand-pink-light dark:text-gray-400 dark:hover:bg-gray-700'
                            }`}
                        >
                            <Icon name={item.icon} className="text-2xl flex-shrink-0" />
                            {isExpanded && <span className="text-base truncate">{item.label}</span>}
                        </button>
                    </Tooltip>
                ))}
            </nav>

            <div className="mt-auto space-y-2">
                <Tooltip text={isDarkMode ? 'Modo Claro' : 'Modo Escuro'} position="right" disabled={isExpanded}>
                    <button 
                        onClick={toggleDarkMode}
                        className={`flex items-center w-full space-x-3 p-3 rounded-lg text-brand-gray-light hover:bg-brand-pink-light dark:text-gray-400 dark:hover:bg-gray-700 transition-colors ${isExpanded ? '' : 'justify-center'}`}
                        aria-label={isDarkMode ? "Ativar modo claro" : "Ativar modo escuro"}
                    >
                        <Icon name={isDarkMode ? 'light_mode' : 'dark_mode'} className="text-2xl flex-shrink-0" />
                        {isExpanded && <span className="text-base">{isDarkMode ? 'Modo Claro' : 'Modo Escuro'}</span>}
                    </button>
                </Tooltip>
            </div>
        </aside>
    );
};

export default Sidebar;