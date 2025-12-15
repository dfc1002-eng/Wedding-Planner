import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { WeddingData, Guest, GuestStatus } from '../types';
import Icon from '../components/ui/Icon';
import { normalizeText } from '../utils';

const PublicRSVPScreen: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  
  const [weddingData, setWeddingData] = useState<WeddingData | null>(null);
  const [guestName, setGuestName] = useState('');
  const [foundGuest, setFoundGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [companionsCount, setCompanionsCount] = useState(0); // Novo estado para acompanhantes

  useEffect(() => {
    const fetchWeddingInfo = async () => {
      if (!userId) return;
      try {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Garante que a data é um objeto Date válido
          const weddingDate = data.weddingData?.toDate ? data.weddingData.toDate() : new Date();
          setWeddingData({ ...data, weddingDate } as WeddingData);
        } else {
          setError('Casamento não encontrado.');
        }
      } catch (err) {
        console.error("Erro ao buscar casamento:", err);
        setError('Erro ao carregar informações.');
      } finally {
        setLoading(false);
      }
    };
    fetchWeddingInfo();
  }, [userId]);

  const handleSearchGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !guestName.trim()) return;
    
    setLoading(true);
    setError('');
    setFoundGuest(null);
    setCompanionsCount(0); // Reset companions count on new search

    try {
      const searchNormalized = normalizeText(guestName);
      // Busca pelo campo normalizado
      const q = query(
        collection(db, 'guests'), 
        where('userId', '==', userId), 
        where('nameNormalized', '==', searchNormalized)
      );
      
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const guestData = snapshot.docs[0].data() as Guest;
        setFoundGuest({ ...guestData, id: snapshot.docs[0].id });
        // Pre-fill companionsCount if guest has previously confirmed with companions
        if (guestData.status === GuestStatus.Confirmed && typeof guestData.confirmedPlusOnes === 'number') {
            setCompanionsCount(guestData.confirmedPlusOnes);
        } else {
            setCompanionsCount(0);
        }
      } else {
        setError('Nome não encontrado na lista. Verifique a grafia exata.');
      }
    } catch (err) {
      console.error(err);
      setError('Erro ao buscar convidado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (status: GuestStatus) => {
    if (!foundGuest || !userId) return;
    setLoading(true);
    try {
      const guestRef = doc(db, 'guests', foundGuest.id);
      const updateData: { status: GuestStatus; confirmedPlusOnes?: number } = { status };

      if (status === GuestStatus.Confirmed) {
        updateData.confirmedPlusOnes = companionsCount;
      } else {
        // If declining, reset confirmedPlusOnes
        updateData.confirmedPlusOnes = 0; 
      }

      await updateDoc(guestRef, updateData);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError('Erro ao salvar resposta.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !weddingData) return <div className="min-h-screen flex items-center justify-center text-brand-gold animate-pulse">Carregando convite...</div>;
  
  if (error && !weddingData) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <Icon name="sentiment_dissatisfied" className="text-4xl text-gray-400 mb-2"/>
        <p className="text-gray-500">{error}</p>
    </div>
  );

  // Fallbacks de segurança para evitar crash
  const name1 = weddingData?.coupleNames?.[0] || 'Noivos';
  const name2 = weddingData?.coupleNames?.[1] || '';
  const dateStr = weddingData?.weddingDate 
    ? weddingData.weddingDate.toLocaleDateString('pt-BR', { dateStyle: 'long' }) 
    : 'Data a definir';

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6 font-sans">
      
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-brand-gold h-32 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <Icon name="favorite" className="text-white text-6xl opacity-90 relative z-10" />
        </div>

        <div className="p-8 text-center -mt-12 relative z-20">
            <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center shadow-md mb-4 border-4 border-white">
                <Icon name="diversity_1" className="text-brand-gold text-3xl" />
            </div>

            <h1 className="text-2xl font-title text-gray-800 mb-1">
                {name1} <span className="text-brand-gold">&</span> {name2}
            </h1>
            <p className="text-gray-500 text-sm uppercase tracking-widest mb-8">
                {dateStr}
            </p>

            {success ? (
                <div className="bg-green-50 p-6 rounded-xl border border-green-100 animate-fadeIn">
                    <Icon name="check_circle" className="text-5xl text-green-500 mb-3 mx-auto" />
                    <h3 className="text-xl font-bold text-green-700 mb-2">Resposta Enviada!</h3>
                    <p className="text-green-600 text-sm">Obrigado por confirmar.</p>
                </div>
            ) : !foundGuest ? (
                <form onSubmit={handleSearchGuest} className="space-y-4 animate-fadeIn">
                    <div className="text-left">
                        <label className="block text-sm font-medium text-gray-600 mb-1 ml-1">Seu nome completo</label>
                        <input 
                            type="text" 
                            placeholder="Como está no convite"
                            className="w-full p-4 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-brand-gold focus:bg-white outline-none transition-all"
                            value={guestName}
                            onChange={e => setGuestName(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded-lg">{error}</p>}
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-brand-gold text-white font-bold py-4 rounded-xl hover:bg-brand-gold-dark transition-all shadow-lg hover:shadow-brand-gold/30 disabled:opacity-70"
                    >
                        {loading ? 'Buscando...' : 'Encontrar meu Convite'}
                    </button>
                </form>
            ) : (
                <div className="space-y-6 animate-slideUp">
                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                        <p className="text-gray-400 text-xs uppercase tracking-wide font-bold">Olá,</p>
                        <p className="text-xl font-bold text-gray-800 mt-1">{foundGuest.name}</p>
                    </div>

                    {/* Dropdown de acompanhantes se permitido e ainda não confirmado */}
                    {foundGuest.plusOnes > 0 && foundGuest.status !== GuestStatus.Declined && (
                        <div className="text-left space-y-2">
                            <label htmlFor="companions-select" className="block text-sm font-medium text-gray-700 ml-1">
                                Você pode levar acompanhantes. Quantos irão com você?
                            </label>
                            <select
                                id="companions-select"
                                value={companionsCount}
                                onChange={(e) => setCompanionsCount(parseInt(e.target.value, 10))}
                                className="w-full p-3 border border-gray-300 bg-white rounded-xl focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all"
                            >
                                {Array.from({ length: foundGuest.plusOnes + 1 }, (_, i) => (
                                    <option key={i} value={i}>
                                        {i === 0 ? '0 (Irei sozinho)' : `${i} Pessoa(s)`}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            onClick={() => handleConfirm(GuestStatus.Declined)}
                            disabled={loading}
                            className="py-3 px-2 border-2 border-gray-200 text-gray-500 font-bold rounded-xl hover:bg-gray-50 hover:text-red-500 hover:border-red-200 transition-colors text-sm"
                        >
                            Não irei
                        </button>
                        <button 
                            onClick={() => handleConfirm(GuestStatus.Confirmed)}
                            disabled={loading}
                            className="py-3 px-2 bg-brand-green text-white font-bold rounded-xl hover:bg-brand-green-dark shadow-lg shadow-green-200 transition-all text-sm"
                        >
                            Confirmar
                        </button>
                    </div>
                    
                    <button 
                        onClick={() => { setFoundGuest(null); setGuestName(''); setError(''); setCompanionsCount(0); }}
                        className="text-xs text-gray-400 hover:text-brand-gold underline mt-4"
                    >
                        Não é você? Voltar
                    </button>
                </div>
            )}
        </div>
      </div>
      
      <div className="mt-8 flex items-center gap-2 text-gray-400 opacity-60">
        <Icon name="favorite" className="text-xs" />
        <span className="text-xs font-medium">Wedding Planner App</span>
      </div>
    </div>
  );
};

export default PublicRSVPScreen;