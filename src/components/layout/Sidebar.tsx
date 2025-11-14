import React from 'react';
import Icon from '../ui/Icon';
import { Screen } from '../../../App';

interface SidebarProps {
    activeScreen: Screen;
    setActiveScreen: (screen: Screen) => void;
    isDarkMode: boolean;
    toggleDarkMode: () => void;
    isSidebarCollapsed: boolean;
    toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeScreen, setActiveScreen, isDarkMode, toggleDarkMode, isSidebarCollapsed, toggleSidebar }) => {
    const navItems = [
        { id: 'dashboard', icon: 'grid_view', label: 'Geral' },
        { id: 'vendors', icon: 'storefront', label: 'Fornecedores' },
        { id: 'payments', icon: 'payment', label: 'Pagamentos' },
        { id: 'checklist', icon: 'checklist', label: 'Checklist' },
        { id: 'guests', icon: 'people', label: 'Convidados' },
        { id: 'giftList', icon: 'card_giftcard', label: 'Presentes' },
        { id: 'settings', icon: 'settings', label: 'Ajustes' },
    ];

    return (
        <aside className={`bg-brand-background dark:bg-gray-800 h-screen sticky top-0 flex flex-col p-6 shadow-md transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
            <div className="flex items-center justify-between mb-10">
                {!isSidebarCollapsed && <h1 className="font-title text-2xl text-brand-gold">Wedding Planner</h1>}
                <button 
                    onClick={toggleSidebar}
                    className="p-2 rounded-full hover:bg-brand-pink-light dark:hover:bg-gray-700 transition-colors"
                    aria-label={isSidebarCollapsed ? "Expandir menu" : "Recolher menu"}
                >
                    <Icon name={isSidebarCollapsed ? 'chevron_right' : 'chevron_left'} className="text-2xl text-brand-gray dark:text-gray-300" />
                </button>
            </div>
            
            <nav className="flex flex-col space-y-2 flex-1">
                {navItems.map(item => (
                    <button 
                        key={item.id} 
                        onClick={() => setActiveScreen(item.id as Screen)} 
                        className={`flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                            activeScreen === item.id 
                                ? 'bg-brand-pink text-brand-gray font-bold dark:bg-brand-gold dark:text-gray-900' 
                                : 'text-brand-gray-light hover:bg-brand-pink-light dark:text-gray-400 dark:hover:bg-gray-700'
                        }`}
                    >
                        <Icon name={item.icon} className="text-2xl" />
                        {!isSidebarCollapsed && <span className="text-base">{item.label}</span>}
                    </button>
                ))}
            </nav>
            
            <div className="mt-auto">
                <button 
                    onClick={toggleDarkMode}
                    className="flex items-center w-full space-x-3 p-3 rounded-lg text-brand-gray-light hover:bg-brand-pink-light dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
                    aria-label={isDarkMode ? "Ativar modo claro" : "Ativar modo escuro"}
                >
                    <Icon name={isDarkMode ? 'light_mode' : 'dark_mode'} className="text-2xl" />
                    {!isSidebarCollapsed && <span className="text-base">{isDarkMode ? 'Modo Claro' : 'Modo Escuro'}</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;