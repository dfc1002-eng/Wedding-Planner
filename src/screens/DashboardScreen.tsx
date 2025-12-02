import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWedding } from '../context/WeddingDataContext';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { formatCurrency } from '../utils';
import Icon from '../components/ui/Icon';
import ProgressBar from '../components/ui/ProgressBar';

// Mapeamento de Ícones (Lucide)
const CATEGORY_ICON_MAP: Record<string, string> = {
  'Buffet': 'restaurant',
  'Foto': 'camera_alt',
  'Fotografia': 'camera_alt',
  'Vídeo': 'videocam',
  'Filmagem': 'videocam',
  'Decoração': 'local_florist',
  'Florista': 'local_florist',
  'Música': 'music_note',
  'Banda': 'music_note',
  'DJ': 'headset',
  'Local': 'place',
  'Espaço': 'place',
  'Igreja': 'church',
  'Assessoria': 'assignment',
  'Cerimonial': 'assignment',
  'Bebidas': 'wine_bar',
  'Bar': 'local_bar',
  'Doces': 'cake',
  'Bolo': 'cake',
  'Vestido': 'checkroom',
  'Traje': 'checkroom',
  'Beleza': 'brush',
  'Dia da Noiva': 'brush',
  'Celebrante': 'mic',
  'Papelaria': 'email',
  'Convites': 'email',
  'Lembrancinhas': 'card_giftcard',
  'Transporte': 'directions_car',
  'Lua de Mel': 'flight',
  'Alianças': 'diamond',
  'default': 'store'
};

const DashboardScreen: React.FC = () => {
  const { vendors, totalPaid, tasks, guests, weddingData, nextPayment } = useWedding();
  const navigate = useNavigate();

  // --- CÁLCULOS FINANCEIROS ---
  const financialSummary = useMemo(() => {
    const totalBudget = weddingData.totalBudget || 0; 
    const totalContracted = vendors.reduce((acc, v) => acc + (v.contractedValue || 0), 0);
    const budgetUsage = totalBudget > 0 ? (totalContracted / totalBudget) * 100 : 0;
    
    return { totalBudget, totalContracted, budgetUsage };
  }, [vendors, weddingData.totalBudget]);

  // --- CÁLCULOS OPERACIONAIS ---
  const operationalSummary = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const totalGuests = guests.length;

    return { totalTasks, completedTasks, taskProgress, totalGuests };
  }, [tasks, guests]);

  // --- DADOS DOS GRÁFICOS ---
  const pieData = useMemo(() => {
    const map: Record<string, number> = {};
    vendors.forEach(v => {
      if (v.contractedValue) map[v.category] = (map[v.category] || 0) + v.contractedValue;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [vendors]);

  const barData = useMemo(() => {
    const map: Record<string, { category: string, contratado: number, pago: number }> = {};
    vendors.forEach(v => {
      if (!map[v.category]) map[v.category] = { category: v.category, contratado: 0, pago: 0 };
      map[v.category].contratado += (v.contractedValue || 0);
      map[v.category].pago += (v.amountPaid || 0);
    });
    return Object.values(map)
        .sort((a, b) => b.contratado - a.contratado)
        .slice(0, 7);
  }, [vendors]);

  const COLORS = ['#D4AF37', '#E5989B', '#4A4A4A', '#6B705C', '#A5A58D', '#B5838D'];

  // Componente Customizado para o Eixo Y
  const CustomYAxisTick = (props: any) => {
    const { x, y, payload } = props;
    const categoryName = payload.value;
    const iconName = CATEGORY_ICON_MAP[categoryName] || CATEGORY_ICON_MAP['default'];

    return (
      <g transform={`translate(${x},${y})`}>
        <foreignObject x={-110} y={-10} width={20} height={20}>
            <div className="flex items-center justify-center h-full w-full">
                 <Icon name={iconName} className="text-gray-400 text-sm" />
            </div>
        </foreignObject>
        <text 
            x={-85} 
            y={4} 
            dy={0} 
            textAnchor="start" 
            fill="#666" 
            className="text-xs font-medium"
            style={{ fontSize: '11px' }}
        >
          {categoryName.length > 12 ? `${categoryName.substring(0, 12)}...` : categoryName}
        </text>
      </g>
    );
  };

  const MetricCard = ({ title, value, icon, colorClass, subtext, onClick, progress }: any) => {
    // Extrai a cor base para usar no ícone (remove o 'bg-' e 'text-')
    const baseColor = colorClass.split(' ')[1].replace('text-', ''); // ex: blue-500

    return (
        <div 
          onClick={onClick}
          className={`bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between transition-all hover:scale-[1.02] hover:shadow-md group relative overflow-hidden ${onClick ? 'cursor-pointer' : ''}`}
        >
          {/* Decoração de fundo sutil */}
          <div className={`absolute top-0 right-0 w-16 h-16 opacity-5 rounded-bl-full transition-transform group-hover:scale-110 ${colorClass.split(' ')[0]}`}></div>

          <div className="flex items-start justify-between mb-4 relative z-10">
            <div>
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">{title}</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
            </div>
            <div className={`p-2.5 rounded-xl bg-opacity-10 ${colorClass.split(' ')[1].replace('text-', 'bg-')} ${colorClass.split(' ')[1]}`}>
              <Icon name={icon} className="text-xl" />
            </div>
          </div>
          
          <div className="relative z-10">
            {progress !== undefined && (
               <div className="mb-2">
                 <ProgressBar progress={progress} size="sm" color={colorClass.includes('green') ? 'bg-green-500' : 'bg-brand-gold'} />
               </div>
            )}
            {subtext && <p className="text-xs text-gray-500 dark:text-gray-400">{subtext}</p>}
          </div>
        </div>
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0].payload;
      const total = financialSummary.totalContracted || 1;
      const percentage = ((value / total) * 100).toFixed(1);

      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md text-sm">
          <p className="font-semibold text-gray-800">{name}</p>
          <p className="text-gray-600">{formatCurrency(value)}</p>
          <p className="text-xs text-gray-500 font-medium mt-1">{percentage}% do total gasto</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-10">
      
      {/* Cabeçalho */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-title text-brand-gray dark:text-white">Visão Geral</h1>
          <p className="text-gray-500 dark:text-gray-400">Olá, {weddingData.coupleNames[0]} & {weddingData.coupleNames[1]}! Aqui está o resumo do seu grande dia.</p>
        </div>
      </div>

      {/* 1. LINHA FINANCEIRA */}
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2">Financeiro</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard 
            title="Orçamento Definido" 
            value={formatCurrency(financialSummary.totalBudget)} 
            icon="savings" 
            colorClass="bg-blue-500 text-blue-500"
            subtext={financialSummary.totalBudget === 0 ? "Defina uma meta em Ajustes" : "Meta de gastos total"}
            onClick={() => navigate('/settings')}
        />
        <MetricCard 
            title="Total Contratado" 
            value={`${financialSummary.budgetUsage.toFixed(1)}%`} 
            icon="receipt_long" 
            colorClass="bg-purple-500 text-purple-500"
            subtext={`Valor: ${formatCurrency(financialSummary.totalContracted)}`}
            progress={financialSummary.budgetUsage}
            onClick={() => navigate('/vendors')}
        />
        <MetricCard 
            title="Total Pago" 
            value={formatCurrency(totalPaid)} 
            icon="check_circle" 
            colorClass="bg-green-500 text-green-500"
            subtext="Valor efetivamente quitado"
            onClick={() => navigate('/payments')}
        />
      </div>

      {/* 2. LINHA OPERACIONAL */}
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2">Planejamento</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard 
            title="Lista de Convidados" 
            value={operationalSummary.totalGuests} 
            icon="groups" 
            colorClass="bg-pink-500 text-pink-500"
            subtext="Pessoas na lista"
            onClick={() => navigate('/guests')}
        />
        <MetricCard 
            title="Checklist" 
            value={`${operationalSummary.taskProgress}%`} 
            icon="task_alt" 
            colorClass="bg-brand-gold text-brand-gold"
            subtext={`${operationalSummary.completedTasks} de ${operationalSummary.totalTasks} tarefas concluídas`}
            progress={operationalSummary.taskProgress}
            onClick={() => navigate('/checklist')}
        />
        
        {/* CARD DE PRÓXIMO PAGAMENTO (Refatorado para alto contraste) */}
        <div 
            onClick={() => navigate('/payments')}
            className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-5 rounded-2xl shadow-sm cursor-pointer transform transition hover:scale-[1.02] hover:shadow-md flex flex-col justify-between group relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            
            <div className="flex justify-between items-start relative z-10">
                <div>
                    <p className="text-xs font-bold text-amber-600/80 dark:text-amber-400 uppercase tracking-wider mb-1">Próximo Pagamento</p>
                    {nextPayment ? (
                        <>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(nextPayment.parcelValue)}</h3>
                            <p className="text-sm font-medium mt-1 text-amber-700 dark:text-amber-300 truncate max-w-[150px]">{nextPayment.vendorName}</p>
                        </>
                    ) : (
                        <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200">Tudo em dia! 🎉</h3>
                    )}
                </div>
                <div className="bg-white/60 dark:bg-black/20 p-2 rounded-lg shadow-sm">
                    <Icon name="event" className="text-xl text-amber-600 dark:text-amber-400" />
                </div>
            </div>
            
            {nextPayment && (
                <div className="mt-4 flex items-center gap-2 text-sm text-amber-800 dark:text-amber-200 bg-amber-100/50 dark:bg-amber-900/40 p-2 rounded-lg w-fit">
                    <Icon name="schedule" className="text-xs" />
                    <span className="font-semibold">Vence em: {nextPayment.dueDate.toLocaleDateString('pt-BR')}</span>
                </div>
            )}
        </div>
      </div>

      {/* 3. GRÁFICOS */}
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2">Análise Detalhada</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4 flex items-center gap-2">
            Orçamento por Categoria
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.3} />
                <XAxis type="number" hide />
                <YAxis 
                    dataKey="category" 
                    type="category" 
                    width={120} 
                    tick={<CustomYAxisTick />} 
                    interval={0}
                />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="contratado" fill="#D4AF37" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4 flex items-center gap-2">
             Divisão do Investimento
          </h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                    data={pieData} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={50} 
                    outerRadius={70} 
                    paddingAngle={5} 
                    dataKey="value"
                    label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                    labelLine={true}
                >
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{fontSize: '11px'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;