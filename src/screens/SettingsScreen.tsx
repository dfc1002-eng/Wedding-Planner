
import React, { useState } from 'react';
import SettingsForm from '../components/settings/SettingsForm';
import { useAuth } from '../context/AuthContext';
import { updatePassword } from 'firebase/auth';
import Icon from '../components/ui/Icon';

interface SettingsScreenProps {
    onSave: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onSave }) => {
    const { user, logout } = useAuth(); // Pegamos user e logout daqui
    
    // Estados para troca de senha
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordMessage(null);

        if (newPassword.length < 6) {
            setPasswordMessage({ text: 'A senha deve ter pelo menos 6 caracteres.', type: 'error' });
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordMessage({ text: 'As senhas não conferem.', type: 'error' });
            return;
        }

        if (user) {
            setIsLoading(true);
            try {
                await updatePassword(user, newPassword);
                setPasswordMessage({ text: 'Senha alterada com sucesso!', type: 'success' });
                setNewPassword('');
                setConfirmPassword('');
                setTimeout(() => setIsChangePasswordOpen(false), 2000);
            } catch (error: any) {
                console.error(error);
                if (error.code === 'auth/requires-recent-login') {
                    setPasswordMessage({ text: 'Por segurança, faça logout e login novamente antes de trocar a senha.', type: 'error' });
                } else {
                    setPasswordMessage({ text: 'Erro ao alterar senha. Tente novamente.', type: 'error' });
                }
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleLogout = async () => {
        const confirm = window.confirm("Tem certeza que deseja sair do sistema?");
        if (confirm) {
            try {
                await logout();
            } catch (error) {
                console.error("Erro ao sair", error);
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
            
            {/* --- SEÇÃO 1: DADOS DO CASAMENTO --- */}
            <section>
                <div className="flex items-center mb-4">
                    <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1"></div>
                    <span className="px-4 text-sm font-medium text-gray-400 uppercase tracking-wider">Configurações do Evento</span>
                    <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1"></div>
                </div>
                
                <SettingsForm onSave={onSave} />
            </section>

            {/* --- SEÇÃO 2: GERENCIAMENTO DA CONTA --- */}
            <div className="mt-12 pt-10 border-t border-gray-200 dark:border-gray-700">
                <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-brand-gray dark:text-white flex items-center">
                            <Icon name="manage_accounts" className="mr-2 text-brand-gold" />
                            Minha Conta
                        </h3>
                        <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-1 rounded">
                            ID: {user?.uid.slice(0, 8)}...
                        </span>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Campo de E-mail (Apenas Leitura) */}
                        <div>
                            <label className="block text-sm font-medium text-brand-gray-light dark:text-gray-400 mb-1">
                                E-mail de Acesso
                            </label>
                            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-600 text-brand-gray dark:text-gray-300">
                                <Icon name="email" className="mr-3 text-gray-400" />
                                <span className="flex-1">{user?.email}</span>
                                <Icon name="lock" className="text-gray-400" title="Não editável" />
                            </div>
                        </div>

                        {/* Alteração de Senha */}
                        <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                            <button 
                                onClick={() => setIsChangePasswordOpen(!isChangePasswordOpen)}
                                className="text-brand-gold hover:text-brand-gold-dark font-medium flex items-center text-sm transition-colors"
                            >
                                <Icon name={isChangePasswordOpen ? "expand_less" : "key"} className="mr-2" />
                                {isChangePasswordOpen ? "Cancelar alteração de senha" : "Alterar minha senha"}
                            </button>

                            {isChangePasswordOpen && (
                                <form onSubmit={handleChangePassword} className="mt-4 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700 animate-fade-in">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-brand-gray-light dark:text-gray-400 mb-1 uppercase tracking-wider">Nova Senha</label>
                                            <input 
                                                type="password" 
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition-all"
                                                placeholder="Mínimo 6 caracteres"
                                                disabled={isLoading}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-brand-gray-light dark:text-gray-400 mb-1 uppercase tracking-wider">Confirmar Senha</label>
                                            <input 
                                                type="password" 
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition-all"
                                                placeholder="Repita a senha"
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>
                                    
                                    {passwordMessage && (
                                        <div className={`mt-3 text-sm p-2 rounded flex items-center ${passwordMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            <Icon name={passwordMessage.type === 'success' ? 'check_circle' : 'error'} className="mr-2" />
                                            {passwordMessage.text}
                                        </div>
                                    )}

                                    <div className="mt-4 flex justify-end">
                                        <button 
                                            type="submit" 
                                            disabled={isLoading}
                                            className={`bg-brand-gold text-white px-6 py-2 rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all transform active:scale-95 flex items-center ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
                                        >
                                            {isLoading ? 'Salvando...' : 'Atualizar Senha'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* Botão de Logout */}
                        <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
                            <button 
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center p-3 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 hover:border-red-300 transition-all group"
                            >
                                <Icon name="logout" className="mr-2 group-hover:rotate-180 transition-transform duration-300" />
                                <span className="font-bold">Sair do Sistema (Logoff)</span>
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default SettingsScreen;
