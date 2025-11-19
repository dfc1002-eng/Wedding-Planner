
import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginScreen from './screens/LoginScreen';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardScreen from './screens/DashboardScreen';
import GuestsScreen from './screens/GuestsScreen';
import VendorsScreen from './screens/VendorsScreen';
import ChecklistScreen from './screens/ChecklistScreen';
import PaymentsScreen from './screens/PaymentsScreen';
import GiftListScreen from './screens/GiftListScreen';
import SettingsScreen from './screens/SettingsScreen';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Header />
          <main className="p-6">
            <Routes>
              <Route path="/" element={<DashboardScreen />} />
              <Route path="/convidados" element={<GuestsScreen />} />
              <Route path="/fornecedores" element={<VendorsScreen />} />
              <Route path="/checklist" element={<ChecklistScreen />} />
              <Route path="/pagamentos" element={<PaymentsScreen />} />
              <Route path="/presentes" element={<GiftListScreen />} />
              <Route path="/configuracoes" element={<SettingsScreen />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
