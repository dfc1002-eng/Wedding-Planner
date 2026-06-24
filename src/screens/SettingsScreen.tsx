
import React, { useState } from 'react';
import SettingsForm from '../components/settings/SettingsForm';
import { useAuth } from '../context/AuthContext';
import { updatePassword } from 'firebase/auth';
import Icon from '../components/ui/Icon';
import { useWedding } from '../context/WeddingDataContext';

interface SettingsScreenProps {
    onSave: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onSave }) => {
    const { user, logout } = useAuth(); // Pegamos user e logout daqui
    const { 
        activeWeddingId, 
        changeActiveWedding, 
        collaborators, 
        sharedWeddings, 
        handleAddCollaborator, 
        handleRemoveCollaborator 
    } = useWedding();
    
    // Estados para troca de senha
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    // Estados para colaboração
    const [collabInput, setCollabInput] = useState('');
    const [copied, setCopied] = useState(false);

    const handleCopyId = () => {
        if (!user) return;
        navigator.clipboard.writeText(user.uid);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const onAddCollab = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!collabInput.trim()) return;
        try {
            await handleAddCollaborator(collabInput.trim());
            setCollabInput('');
            alert('Colaborador adicionado com sucesso!');
        } catch (error) {
            console.error("Erro ao adicionar colaborador:", error);
            alert(`Erro ao adicionar: ${error}`);
        }
    };

    const onRemoveCollab = async (collabUid: string) => {
        if (window.confirm("Tem certeza que deseja remover este colaborador? Ele perderá acesso ao seu casamento.")) {
            try {
                await handleRemoveCollaborator(collabUid);
                alert('Colaborador removido.');
            } catch (error) {
                console.error("Erro ao remover colaborador:", error);
                alert(`Erro ao remover: ${error}`);
            }
        }
    };

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

            {/* --- SEÇÃO DE COLABORAÇÃO --- */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-brand-gray dark:text-white flex items-center">
                        <Icon name="groups" className="mr-2 text-brand-gold" />
                        Colaboração (Casamento Compartilhado)
                    </h3>
                </div>
                
                <div className="p-6 space-y-6">
                    {/* Alerta se estiver visualizando casamento alheio */}
                    {user && activeWeddingId !== user.uid && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-xl flex items-center gap-3">
                            <Icon name="warning" className="text-amber-500 text-2xl" />
                            <div className="flex-1 text-sm text-amber-800 dark:text-amber-300">
                                Você está visualizando o painel compartilhado de outro casal. Para gerenciar seu próprio painel, clique em voltar.
                            </div>
                            <button 
                                onClick={() => changeActiveWedding(null)}
                                className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-1.5 px-3 rounded-lg text-xs transition-colors"
                            >
                                Voltar ao meu
                            </button>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Lado Esquerdo: Seu ID e Convites */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-brand-gray-light dark:text-gray-400 mb-1">
                                    Seu ID Único de Acesso (Copie e envie para quem vai colaborar com você)
                                </label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        readOnly 
                                        value={user?.uid || ''} 
                                        className="flex-1 p-2 border rounded-md bg-gray-50 dark:bg-gray-900 dark:border-gray-600 text-sm font-mono focus:outline-none"
                                    />
                                    <button 
                                        onClick={handleCopyId}
                                        className="bg-brand-pink-light hover:bg-brand-pink text-brand-gray font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors border text-sm"
                                    >
                                        <Icon name={copied ? "check" : "content_copy"} />
                                        <span>{copied ? "Copiado!" : "Copiar"}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Casamentos compartilhados que participo */}
                            <div>
                                <h4 className="text-sm font-bold text-brand-gray dark:text-white mb-2 flex items-center">
                                    <Icon name="folder_shared" className="mr-1 text-brand-gold text-base" />
                                    Casamentos que posso colaborar
                                </h4>
                                {sharedWeddings.length === 0 ? (
                                    <p className="text-xs text-gray-400">Você ainda não foi convidado para colaborar em nenhum casamento.</p>
                                ) : (
                                    <div className="border dark:border-gray-600 rounded-lg divide-y dark:divide-gray-600 overflow-hidden bg-white dark:bg-gray-700">
                                        {sharedWeddings.map(wedding => (
                                            <div key={wedding.id} className="p-3 flex justify-between items-center text-sm gap-2">
                                                <div className="flex items-center gap-2">
                                                    <Icon name="favorite" className="text-brand-pink text-xs" />
                                                    <span className="font-semibold text-brand-gray dark:text-gray-200">
                                                        {wedding.coupleNames[0]} & {wedding.coupleNames[1]}
                                                    </span>
                                                </div>
                                                {activeWeddingId === wedding.id ? (
                                                    <span className="text-xs font-semibold bg-green-100 text-green-800 px-2.5 py-1 rounded-full dark:bg-green-950 dark:text-green-300">Ativo</span>
                                                ) : (
                                                    <button 
                                                        onClick={() => changeActiveWedding(wedding.id)}
                                                        className="bg-brand-gold hover:bg-brand-gold-dark text-white font-bold py-1 px-3 rounded text-xs transition-colors"
                                                    >
                                                        Acessar
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Lado Direito: Gerenciar Colaboradores do meu Casamento */}
                        <div className="space-y-4 border-t md:border-t-0 md:border-l dark:border-gray-700 md:pl-6 pt-4 md:pt-0">
                            <h4 className="text-sm font-bold text-brand-gray dark:text-white mb-2 flex items-center">
                                <Icon name="person_add" className="mr-1 text-brand-gold text-base" />
                                Gerenciar Colaboradores do seu Casamento
                            </h4>
                            
                            {user && activeWeddingId !== user.uid ? (
                                <p className="text-xs text-gray-400">Você precisa estar visualizando seu próprio casamento para gerenciar os colaboradores dele.</p>
                            ) : (
                                <>
                                    <form onSubmit={onAddCollab} className="flex gap-2">
                                        <input 
                                            type="text" 
                                            placeholder="Cole o ID Único do parceiro(a) aqui" 
                                            value={collabInput}
                                            onChange={e => setCollabInput(e.target.value)}
                                            className="flex-1 p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none text-sm transition-all"
                                        />
                                        <button 
                                            type="submit"
                                            className="bg-brand-green hover:opacity-90 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors"
                                        >
                                            Adicionar
                                        </button>
                                    </form>

                                    <div className="mt-3">
                                        <h5 className="text-xs font-semibold text-brand-gray-light dark:text-gray-400 uppercase tracking-wider mb-2">Colaboradores ativos</h5>
                                        {collaborators.length === 0 ? (
                                            <p className="text-xs text-gray-400">Nenhum colaborador adicionado ao seu casamento ainda.</p>
                                        ) : (
                                            <div className="border dark:border-gray-600 rounded-lg divide-y dark:divide-gray-600 overflow-hidden bg-white dark:bg-gray-700">
                                                {collaborators.map(collabId => (
                                                    <div key={collabId} className="p-2.5 flex justify-between items-center text-xs gap-2">
                                                        <span className="font-mono text-gray-500 dark:text-gray-300 truncate max-w-[200px]" title={collabId}>
                                                            {collabId}
                                                        </span>
                                                        <button 
                                                            type="button"
                                                            onClick={() => onRemoveCollab(collabId)}
                                                            className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                                                            title="Remover Colaborador"
                                                        >
                                                            <Icon name="delete" className="text-base" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
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
