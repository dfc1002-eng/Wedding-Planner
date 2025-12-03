import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import { useAuth } from '../context/AuthContext';
import { FirebaseError } from 'firebase/app';
import Icon from '../components/ui/Icon'; // Assuming Icon component exists

const LoginScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate(); // Inicializar useNavigate
  
  // Using the renamed functions from AuthContext
  const { signIn, signUp } = useAuth();

  const getFirebaseErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case 'auth/invalid-email': return 'O endereço de e-mail está mal formatado.';
      case 'auth/user-not-found': return 'Nenhum usuário encontrado com este e-mail.';
      case 'auth/wrong-password': return 'Senha incorreta.';
      case 'auth/email-already-in-use': return 'Este e-mail já está em uso.';
      case 'auth/weak-password': return 'A senha deve ter pelo menos 6 caracteres.';
      case 'auth/invalid-credential': return 'Credenciais inválidas. Verifique seu e-mail e senha.';
      case 'auth/network-request-failed': return 'Erro de rede. Verifique sua conexão com a internet.';
      default: return 'Ocorreu um erro. Tente novamente.';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      
      // 🚨 CORREÇÃO: Força a navegação para o App
      // O App.tsx decidirá se vai para o Dashboard ou Onboarding
      navigate('/');
      
    } catch (err: any) {
      console.error("Erro auth:", err);
      if (err instanceof FirebaseError) {
        setError(getFirebaseErrorMessage(err.code));
      } else {
        setError('Ocorreu um erro inesperado. Tente novamente.');
      }
    } finally {
      // Nota: Se o navigate funcionar, o componente desmonta e isso não roda, o que é ok.
      // Se der erro, precisamos parar o loading.
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-gray-900 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 p-8">
        <div className="text-center mb-8">
            <Icon name="favorite" className="text-brand-gold text-5xl mb-3" />
            <h1 className="text-3xl font-title text-brand-gray dark:text-white mb-2">Wedding Planner</h1>
            <p className="text-gray-500 dark:text-gray-400">A sua jornada para o grande dia começa aqui!</p>
        </div>

        <h2 className="text-xl font-semibold text-center text-brand-gray dark:text-white mb-6">
          {isLogin ? 'Faça Login' : 'Crie Sua Conta'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
            />
          </div>
          
          {error && (
            <div className="bg-red-50 p-3 rounded-lg flex items-center gap-2 text-red-700 text-sm animate-fadeIn">
                <Icon name="error" className="text-lg"/>
                {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 font-bold text-white bg-brand-gold rounded-lg shadow-md hover:bg-brand-gold-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold transition-all transform active:scale-95 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
            >
              {loading ? (
                <><Icon name="hourglass_empty" className="animate-spin" /> {isLogin ? 'Entrando...' : 'Criando...'}</>
              ) : (
                <><Icon name={isLogin ? 'login' : 'person_add'} /> {isLogin ? 'Entrar' : 'Criar Conta'}</>
              )}
            </button>
          </div>
        </form>
        
        <div className="text-sm text-center mt-6">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null); // Clear errors when switching form type
              setEmail(''); // Clear fields when switching
              setPassword('');
            }}
            className="font-medium text-brand-pink hover:text-brand-pink-dark transition-colors"
            disabled={loading}
          >
            {isLogin
              ? 'Não tem uma conta? Crie uma aqui!'
              : 'Já tem uma conta? Faça login aqui!'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;