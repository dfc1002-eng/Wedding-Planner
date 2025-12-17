import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { WeddingDataProvider, useWedding } from './context/WeddingDataContext';
import { AuthProvider, useAuth } from './context/AuthContext';

import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Toast from './components/ui/Toast';

// --- MODAIS ---
import AddVendorModal from './components/modals/AddVendorModal';
import EditVendorModal from './components/modals/EditVendorModal';
import ConfirmationModal from './components/modals/ConfirmationModal';
import AddEditGuestModal from './components/modals/AddEditGuestModal';
import EditGiftModal from './components/modals/EditGiftModal';
import RegisterPaymentModal from './components/modals/RegisterPaymentModal';
import ThankYouModal from './components/modals/ThankYouModal';
import OnboardingModal from './components/modals/OnboardingModal';

// --- TELAS (Lazy Loading) ---
const DashboardScreen = React.lazy(() => import('./screens/DashboardScreen.tsx'));
const VendorsScreen = React.lazy(() => import('./screens/VendorsScreen.tsx'));
const PaymentsScreen = React.lazy(() => import('./screens/PaymentsScreen.tsx'));
const ChecklistScreen = React.lazy(() => import('./screens/ChecklistScreen.tsx'));
const GuestsScreen = React.lazy(() => import('./screens/GuestsScreen.tsx'));
const GiftListScreen = React.lazy(() => import('./screens/GiftListScreen.tsx'));
const SettingsScreen = React.lazy(() => import('./screens/SettingsScreen.tsx'));
const LoginScreen = React.lazy(() => import('./screens/LoginScreen.tsx'));
const PublicRSVPScreen = React.lazy(() => import('./screens/PublicRSVPScreen'));

import { Vendor, Payment, VendorStatus, NewVendorFormData, EditVendorData, Guest, GuestFormData, Gift, GiftFormData } from './types';

export type Screen = 'dashboard' | 'vendors' | 'payments' | 'checklist' | 'guests' | 'giftList' | 'settings';

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-full min-h-[200px]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-gold"></div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingFallback />;
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

const AppLayout: React.FC = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(() => {
        const savedState = localStorage.getItem('sidebarExpanded');
        if (savedState !== null) return savedState === 'true';
        return window.innerWidth >= 768;
    });

    const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
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
    
    const { 
        weddingData, vendors, payments, tasks, paymentNotifications, loading: dataLoading,
        handleToggleTask, handleAddVendor, handleEditVendor, handleDeleteVendor,
        handleRegisterPayment, handleDeletePayment, handleAddGuest, handleEditGuest,
        handleDeleteGuest, handleChangeGuestsStatus, handleUpdateGift, handleToggleThankYouSent,
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

    useEffect(() => { localStorage.setItem('sidebarExpanded', String(isSidebarExpanded)); }, [isSidebarExpanded]);

    useEffect(() => {
        // Verifica se é um cadastro novo (nomes vazios) e força o onboarding
        const isNewData = weddingData.coupleNames[0] === '' && weddingData.coupleNames[1] === '';
        
        if (!authLoading && !dataLoading && user && isNewData && location.pathname !== '/settings') {
            setIsOnboardingOpen(true);
        }
    }, [authLoading, dataLoading, user, weddingData.coupleNames, location.pathname]);

    const handleCloseOnboarding = () => {
        localStorage.setItem('onboardingCompleted', 'true');
        setIsOnboardingOpen(false);
        navigate('/settings');
    };

    const toggleDarkMode = () => setIsDarkMode(prev => !prev);
    const toggleSidebar = () => setIsSidebarExpanded(prev => !prev);
    const showToast = (message: string, type: 'success' | 'error' = 'success') => setToast({ id: Date.now(), message, type });
    
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
            message: 'Tem certeza que deseja excluir este fornecedor?',
            onConfirm: () => { handleDeleteVendor(vendorId); setConfirmation(null); showToast('Fornecedor excluído.'); }
        });
    };

    const onConfirmDeletePayment = (paymentId: string) => {
        setConfirmation({
            title: 'Confirmar Exclusão',
            message: 'Tem certeza que deseja excluir este pagamento?',
            onConfirm: () => { handleDeletePayment(paymentId); setConfirmation(null); showToast('Pagamento excluído.'); }
        });
    };
    
     const onConfirmDeleteGuest = (guestIds: string[]) => {
        setConfirmation({
            title: 'Confirmar Exclusão',
            message: 'Tem certeza que deseja excluir estes convidados?',
            onConfirm: () => { handleDeleteGuest(guestIds); setConfirmation(null); showToast('Convidados excluídos.'); }
        });
    };

    const onRegisterPayment = (payment: Payment) => {
        const vendor = vendors.find(v => v.id === payment.vendorId);
        if (vendor) setPaymentToRegister({ vendor, payment });
        else showToast('Fornecedor não encontrado.', 'error');
    };
    
    // FIX: Make this async to catch errors
    const onConfirmRegisterPayment = async (data: any) => {
        try {
            await handleRegisterPayment(data);
            setPaymentToRegister(null);
            showToast(`Pagamento registrado!`);
        } catch (error) {
            console.error("Erro ao registrar pagamento:", error);
            showToast(`Erro ao registrar: ${error}`, 'error');
        }
    };

    const handleSaveNewVendor = (data: NewVendorFormData) => {
      handleAddVendor(data);
      setAddVendorModalOpen(false);
      setPrefilledCategory(undefined);
      showToast('Fornecedor adicionado!');
    };

    const handleSaveEditedVendor = (data: EditVendorData) => {
        handleEditVendor(data);
        setEditingVendor(null);
        showToast('Fornecedor atualizado!');
    };
    
    const handleSaveGuest = (data: GuestFormData) => {
        if (editingGuest) { handleEditGuest(editingGuest.id, data); showToast('Convidado atualizado!'); }
        else { handleAddGuest(data); showToast('Convidado adicionado!'); }
        setGuestModalOpen(false);
        setEditingGuest(null);
    };

    const handleSaveGift = (giftId: string, data: GiftFormData) => {
        handleUpdateGift(giftId, data);
        setEditingGift(null);
        showToast('Presente atualizado!');
    };

    const onToggleThankYou = (giftId: string) => {
        const isThanked = handleToggleThankYouSent(giftId);
        showToast(isThanked ? 'Agradecimento marcado!' : 'Agradecimento desmarcado.');
    };

    return (
        <div className="flex bg-gray-50 dark:bg-gray-900 min-h-screen text-brand-gray dark:text-gray-300">
            <Sidebar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />
            <div className="flex-1 min-w-0">
                <main className="p-10">
                    <Header weddingData={weddingData} paymentNotifications={paymentNotifications} />
                    <Suspense fallback={<LoadingFallback />}>
                        <Routes>
                            <Route path="/" element={<DashboardScreen />} />
                            <Route path="/dashboard" element={<Navigate to="/" replace />} />
                            <Route path="/vendors" element={<VendorsScreen onAddVendor={() => setAddVendorModalOpen(true)} onEditVendor={setEditingVendor} onDeleteVendor={onConfirmDeleteVendor} statusFilter={vendorStatusFilter} onFilterChange={setVendorStatusFilter} />} />
                            <Route path="/payments" element={<PaymentsScreen onRegisterPayment={onRegisterPayment} onDeletePayment={onConfirmDeletePayment} />} />
                            <Route path="/checklist" element={<ChecklistScreen onToggleTask={onToggleTask} />} />
                            <Route path="/guests" element={<GuestsScreen onAddGuest={() => setGuestModalOpen(true)} onEditGuest={(g) => { setEditingGuest(g); setGuestModalOpen(true); }} onDeleteGuest={onConfirmDeleteGuest} onChangeGuestsStatus={handleChangeGuestsStatus} />} />
                            <Route path="/giftList" element={<GiftListScreen onEditGift={setEditingGift} onToggleThankYou={onToggleThankYou} onSendWhatsApp={(g, p) => setThankYouModalData({ gift: g, phoneNumber: p })} />} />
                            <Route path="/settings" element={<SettingsScreen onSave={() => showToast('Ajustes salvos!')} />} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </Suspense>
                </main>
            </div>
            {toast && <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            
            {/* Modais */}
            {isOnboardingOpen && <OnboardingModal onClose={handleCloseOnboarding} />}
            {isAddVendorModalOpen && <AddVendorModal onClose={() => { setAddVendorModalOpen(false); setPrefilledCategory(undefined); }} onSave={handleSaveNewVendor} prefilledCategory={prefilledCategory} />}
            {editingVendor && <EditVendorModal vendor={editingVendor} payments={payments.filter(p => p.vendorId === editingVendor.id)} onClose={() => setEditingVendor(null)} onSave={handleSaveEditedVendor} />}
            {(isGuestModalOpen || editingGuest) && <AddEditGuestModal isOpen={isGuestModalOpen} onClose={() => { setGuestModalOpen(false); setEditingGuest(null); }} onSave={handleSaveGuest} guest={editingGuest} />}
            {editingGift && <EditGiftModal gift={editingGift} onClose={() => setEditingGift(null)} onSave={handleSaveGift} />}
            {paymentToRegister && <RegisterPaymentModal modalData={paymentToRegister} onClose={() => setPaymentToRegister(null)} onConfirm={onConfirmRegisterPayment} />}
            {confirmation && <ConfirmationModal isOpen={!!confirmation} onClose={() => setConfirmation(null)} onConfirm={confirmation.onConfirm} title={confirmation.title} message={confirmation.message} />}
            {thankYouModalData && <ThankYouModal isOpen={!!thankYouModalData} onClose={() => setThankYouModalData(null)} guestName={thankYouModalData.gift.guestName} phoneNumber={thankYouModalData.phoneNumber} coupleNames={weddingData.coupleNames} />}
        </div>
    );
};

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <WeddingDataProvider>
                   <Routes>
                     {/* Rotas Públicas */}
                     <Route path="/login" element={
                       <Suspense fallback={<LoadingFallback />}>
                         <LoginScreen />
                       </Suspense>
                     } />
                     
                     {/* Rotas de RSVP (curto e amigável) */}
                     <Route path="/rsvp/:userId" element={
                       <Suspense fallback={<LoadingFallback />}>
                         <PublicRSVPScreen />
                       </Suspense>
                     } />
                     <Route path="/rsvp/:userId/:slug" element={
                       <Suspense fallback={<LoadingFallback />}>
                         <PublicRSVPScreen />
                       </Suspense>
                     } />

                     {/* App Principal */}
                     <Route path="/*" element={
                       <ProtectedRoute>
                         <AppLayout />
                       </ProtectedRoute>
                     } />
                   </Routes>
                </WeddingDataProvider>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;