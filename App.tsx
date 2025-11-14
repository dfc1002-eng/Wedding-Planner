import React, { useState, useEffect } from 'react';
import { WeddingDataProvider, useWedding } from './src/context/WeddingDataContext';

import Sidebar from './src/components/layout/Sidebar';
import Header from './src/components/layout/Header';
import DashboardScreen from './src/screens/DashboardScreen';
import VendorsScreen from './src/screens/VendorsScreen';
import PaymentsScreen from './src/screens/PaymentsScreen';
import ChecklistScreen from './src/screens/ChecklistScreen';
import GuestsScreen from './src/screens/GuestsScreen';
import GiftListScreen from './src/screens/GiftListScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AddVendorModal from './src/components/modals/AddVendorModal';
import EditVendorModal from './src/components/modals/EditVendorModal';
import ConfirmationModal from './src/components/modals/ConfirmationModal';
import AddEditGuestModal from './src/components/modals/AddEditGuestModal';
import EditGiftModal from './src/components/modals/EditGiftModal';
import RegisterPaymentModal from './src/components/modals/RegisterPaymentModal';
import ThankYouModal from './src/components/modals/ThankYouModal';
import { Vendor, Payment, VendorStatus, NewVendorFormData, EditVendorData, Guest, GuestFormData, Gift, GiftFormData } from './src/types';
import Toast from './src/components/ui/Toast';

export type Screen = 'dashboard' | 'vendors' | 'payments' | 'checklist' | 'guests' | 'giftList' | 'settings';

const AppContent: React.FC = () => {
    const [activeScreen, setActiveScreen] = useState<Screen>('dashboard');
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(() => {
        const savedState = localStorage.getItem('sidebarExpanded');
        if (savedState !== null) {
            return savedState === 'true';
        }
        // Recolhido por padrão em telas menores
        return window.innerWidth >= 768;
    });

    // Modal States
    const [isAddVendorModalOpen, setAddVendorModalOpen] = useState(false);
    const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
    const [isGuestModalOpen, setGuestModalOpen] = useState(false);
    const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
    const [editingGift, setEditingGift] = useState<Gift | null>(null);
    const [confirmation, setConfirmation] = useState<{ title: string; message: string; onConfirm: () => void; } | null>(null);
    const [paymentToRegister, setPaymentToRegister] = useState<{ vendor: Vendor; payment: Payment } | null>(null);
    const [thankYouModalData, setThankYouModalData] = useState<{ gift: Gift; phoneNumber?: string } | null>(null);
    const [prefilledCategory, setPrefilledCategory] = useState<string | undefined>(undefined);
    const [toast, setToast] = useState<{ id: number; message: string; type: 'success' | 'error' } | null>(null);
    
    // Global State & Handlers from Context
    const { 
        weddingData, 
        vendors,
        payments,
        tasks,
        paymentNotifications,
        handleToggleTask,
        handleAddVendor,
        handleEditVendor,
        handleDeleteVendor,
        handleRegisterPayment,
        handleDeletePayment,
        handleAddGuest,
        handleEditGuest,
        handleDeleteGuest,
        handleUpdateGift,
        handleToggleThankYouSent,
    } = useWedding();

    const [vendorStatusFilter, setVendorStatusFilter] = useState<VendorStatus | 'all'>('all');

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    useEffect(() => {
        localStorage.setItem('sidebarExpanded', String(isSidebarExpanded));
    }, [isSidebarExpanded]);

    const toggleDarkMode = () => setIsDarkMode(prev => !prev);
    const toggleSidebar = () => setIsSidebarExpanded(prev => !prev);
    
    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ id: Date.now(), message, type });
    };
    
    const onToggleTask = (taskId: string) => {
        const wasCompleted = handleToggleTask(taskId);
        const task = tasks.find(t => t.id === taskId);
        if (wasCompleted && task?.createsVendorCategory) {
            setPrefilledCategory(task.createsVendorCategory);
            setAddVendorModalOpen(true);
        }
    }

    const onConfirmDeleteVendor = (vendorId: string) => {
        setConfirmation({
            title: 'Confirmar Exclusão',
            message: 'Tem certeza que deseja excluir este fornecedor? Todas as informações e pagamentos associados serão perdidos permanentemente.',
            onConfirm: () => {
                handleDeleteVendor(vendorId);
                setConfirmation(null);
                showToast('Fornecedor excluído com sucesso.');
            }
        });
    };

    const onConfirmDeletePayment = (paymentId: string) => {
        setConfirmation({
            title: 'Confirmar Exclusão',
            message: 'Tem certeza que deseja excluir este pagamento? Esta ação não pode ser desfeita.',
            onConfirm: () => {
                handleDeletePayment(paymentId);
                setConfirmation(null);
                showToast('Pagamento excluído com sucesso.');
            }
        });
    };
    
     const onConfirmDeleteGuest = (guestId: string) => {
        setConfirmation({
            title: 'Confirmar Exclusão',
            message: 'Tem certeza que deseja excluir este convidado? Esta ação não pode ser desfeita.',
            onConfirm: () => {
                handleDeleteGuest(guestId);
                setConfirmation(null);
                showToast('Convidado excluído com sucesso.');
            }
        });
    };

    const onRegisterPayment = (payment: Payment) => {
        const vendor = vendors.find(v => v.id === payment.vendorId);
        if (vendor) {
            setPaymentToRegister({ vendor, payment });
        } else {
            showToast('Fornecedor não encontrado para este pagamento.', 'error');
        }
    };
    
    const onConfirmRegisterPayment = (data: { vendorId: string; vendorName: string; paidAmount: number; paymentDate: Date; paymentId: string; }) => {
        handleRegisterPayment(data);
        setPaymentToRegister(null);
        showToast(`Pagamento para ${data.vendorName} registrado!`);
    };

    const handleSaveNewVendor = (data: NewVendorFormData) => {
      handleAddVendor(data);
      setAddVendorModalOpen(false);
      setPrefilledCategory(undefined);
      showToast('Novo fornecedor adicionado com sucesso!');
    };

    const handleSaveEditedVendor = (data: EditVendorData) => {
        handleEditVendor(data);
        setEditingVendor(null);
        showToast('Fornecedor atualizado com sucesso!');
    };
    
    const handleSaveGuest = (data: GuestFormData) => {
        if (editingGuest) {
            handleEditGuest(editingGuest.id, data);
            showToast('Convidado atualizado com sucesso!');
        } else {
            handleAddGuest(data);
            showToast('Novo convidado adicionado com sucesso!');
        }
        setGuestModalOpen(false);
        setEditingGuest(null);
    };

    const handleSaveGift = (giftId: string, data: GiftFormData) => {
        handleUpdateGift(giftId, data);
        setEditingGift(null);
        showToast('Presente atualizado com sucesso!');
    };

    const onToggleThankYou = (giftId: string) => {
        const isThanked = handleToggleThankYouSent(giftId);
        showToast(isThanked ? 'Agradecimento marcado!' : 'Agradecimento desmarcado.');
    };

    const renderScreen = () => {
        switch (activeScreen) {
            case 'dashboard':
                return <DashboardScreen />;
            case 'vendors':
                return <VendorsScreen 
                            onAddVendor={() => setAddVendorModalOpen(true)} 
                            onEditVendor={setEditingVendor}
                            onDeleteVendor={onConfirmDeleteVendor}
                            statusFilter={vendorStatusFilter}
                            onFilterChange={setVendorStatusFilter}
                        />;
            case 'payments':
                return <PaymentsScreen 
                           onRegisterPayment={onRegisterPayment}
                           onDeletePayment={onConfirmDeletePayment}
                       />;
            case 'checklist':
                return <ChecklistScreen onToggleTask={onToggleTask} />;
            case 'guests':
                return <GuestsScreen 
                            onAddGuest={() => setGuestModalOpen(true)}
                            onEditGuest={(guest) => { setEditingGuest(guest); setGuestModalOpen(true); }}
                            onDeleteGuest={onConfirmDeleteGuest}
                       />;
            case 'giftList':
                return <GiftListScreen 
                            onEditGift={setEditingGift} 
                            onToggleThankYou={onToggleThankYou} 
                            onSendWhatsApp={(gift, phoneNumber) => setThankYouModalData({ gift, phoneNumber })}
                        />;
            case 'settings':
                return <SettingsScreen onSave={() => showToast('Ajustes salvos com sucesso!')} />;
            default:
                return <DashboardScreen />;
        }
    };

    return (
        <div className="flex bg-gray-50 dark:bg-gray-900 min-h-screen text-brand-gray dark:text-gray-300">
            <Sidebar 
                activeScreen={activeScreen} 
                setActiveScreen={setActiveScreen} 
                isDarkMode={isDarkMode} 
                toggleDarkMode={toggleDarkMode}
                isExpanded={isSidebarExpanded}
                toggleSidebar={toggleSidebar}
            />
            <div className="flex-1">
                <main className="p-10">
                    <Header 
                        weddingData={weddingData} 
                        paymentNotifications={paymentNotifications}
                        setActiveScreen={setActiveScreen}
                    />
                    {renderScreen()}
                </main>
            </div>

            {/* Toast Container */}
            {toast && <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Modals */}
            {isAddVendorModalOpen && <AddVendorModal onClose={() => { setAddVendorModalOpen(false); setPrefilledCategory(undefined); }} onSave={handleSaveNewVendor} prefilledCategory={prefilledCategory} />}
            {editingVendor && (
                <EditVendorModal 
                    vendor={editingVendor} 
                    payments={payments.filter(p => p.vendorId === editingVendor.id)}
                    onClose={() => setEditingVendor(null)} 
                    onSave={handleSaveEditedVendor} 
                />
            )}
            {(isGuestModalOpen || editingGuest) && (
                 <AddEditGuestModal 
                    isOpen={isGuestModalOpen}
                    onClose={() => { setGuestModalOpen(false); setEditingGuest(null); }}
                    onSave={handleSaveGuest}
                    guest={editingGuest}
                />
            )}
             {editingGift && (
                <EditGiftModal
                    gift={editingGift}
                    onClose={() => setEditingGift(null)}
                    onSave={handleSaveGift}
                />
            )}
            {paymentToRegister && (
                <RegisterPaymentModal
                    modalData={paymentToRegister}
                    onClose={() => setPaymentToRegister(null)}
                    onConfirm={onConfirmRegisterPayment}
                />
            )}
            {confirmation && (
                <ConfirmationModal
                    isOpen={!!confirmation}
                    onClose={() => setConfirmation(null)}
                    onConfirm={confirmation.onConfirm}
                    title={confirmation.title}
                    message={confirmation.message}
                />
            )}
            {thankYouModalData && (
                <ThankYouModal
                    isOpen={!!thankYouModalData}
                    onClose={() => setThankYouModalData(null)}
                    guestName={thankYouModalData.gift.guestName}
                    phoneNumber={thankYouModalData.phoneNumber}
                    coupleNames={weddingData.coupleNames}
                />
            )}
        </div>
    );
};

const App: React.FC = () => {
    return (
        <WeddingDataProvider>
            <AppContent />
        </WeddingDataProvider>
    );
};

export default App;