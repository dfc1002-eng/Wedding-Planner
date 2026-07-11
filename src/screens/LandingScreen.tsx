import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Icon from '../components/ui/Icon';

const LandingScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();


  return (
    <div className="min-h-screen bg-brand-background dark:bg-gray-900 text-brand-gray dark:text-gray-200 font-sans selection:bg-brand-pink selection:text-brand-gray">
      {/* 1. Header (Navbar) */}
      <header className="sticky top-0 z-50 bg-brand-background/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-brand-pink-light/50 dark:border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <Icon name="favorite" className="text-brand-gold text-3xl animate-pulse" />
              <span className="font-title text-2xl text-brand-gray dark:text-white font-bold leading-none">
                Meu <span className="text-brand-gold">Sim</span>
              </span>
            </div>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium pl-8 mt-0.5">
              Planejando o Casamento dos meus Sonhos
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-400">
            <a href="#problemas" className="hover:text-brand-gold transition-colors">Desafios Reais</a>
            <a href="#rjwedding" className="hover:text-brand-gold transition-colors">RJ Wedding</a>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold text-white bg-brand-gold hover:bg-brand-gold/90 transition-all shadow-md active:scale-95"
              >
                <Icon name="grid_view" /> Acessar Painel
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold hover:text-brand-gold transition-colors dark:text-gray-300"
                >
                  Entrar
                </Link>
                <Link
                  to="/cadastro"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-brand-gold hover:bg-brand-gold/90 transition-all shadow-md active:scale-95 hover:-translate-y-0.5"
                >
                  <Icon name="person_add" /> Começar Grátis
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-12 pb-24 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-brand-pink/20 dark:bg-brand-pink/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-gold/10 dark:bg-brand-gold/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-pink-light/70 dark:bg-gray-800 text-[#c59a68] dark:text-brand-gold text-xs font-bold uppercase tracking-wider">
              <Icon name="star" className="text-xs" /> Meu Sim - O Planner Oficial da RJ Wedding
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-title text-brand-gray dark:text-white leading-[1.15] font-bold">
              Organize o casamento dos seus sonhos <span className="italic font-light block text-brand-gold">sem o estresse de planilhas</span>
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl">
              Cansou de planilhas de gastos estouradas e checklists confusos? O Meu Sim é a ferramenta inteligente de gestão para noivos focada em organizar tarefas, controlar custos, gerenciar fornecedores e fazer RSVP automático em um só lugar.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                to={user ? "/dashboard" : "/cadastro"}
                className="flex items-center justify-center gap-3 px-8 py-4 bg-brand-gold text-white font-bold rounded-2xl shadow-xl shadow-brand-gold/10 hover:bg-brand-gold/90 transition-all hover:-translate-y-1 active:scale-95 text-center"
              >
                Criar Minha Conta Grátis <Icon name="arrow_forward" />
              </Link>
              <a
                href="#problemas"
                className="flex items-center justify-center gap-2 px-6 py-4 bg-brand-pink-light dark:bg-gray-800 hover:bg-brand-pink dark:hover:bg-gray-700 text-brand-gray dark:text-white font-semibold rounded-2xl border border-brand-pink-dark/30 dark:border-gray-700 transition-all shadow-sm"
              >
                Conhecer Recursos
              </a>
            </div>

            <div className="flex items-center gap-6 pt-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1.5">
                <Icon name="check_circle" className="text-brand-green" /> 100% Gratuito
              </div>
              <div className="flex items-center gap-1.5">
                <Icon name="check_circle" className="text-brand-green" /> RSVP via WhatsApp
              </div>
              <div className="flex items-center gap-1.5">
                <Icon name="check_circle" className="text-brand-green" /> Sem limite de fornecedores
              </div>
            </div>
          </div>

          {/* APP DASHBOARD VISUAL MOCKUP */}
          <div className="md:col-span-6">
            <div className="relative mx-auto max-w-lg bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-brand-pink-light/40 dark:border-gray-800 overflow-hidden transform hover:-rotate-1 hover:scale-[1.01] transition-all duration-300">
              {/* Fake Window Header */}
              <div className="bg-gray-50 dark:bg-gray-950 px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-red-400 rounded-full inline-block"></span>
                  <span className="w-3 h-3 bg-yellow-400 rounded-full inline-block"></span>
                  <span className="w-3 h-3 bg-green-400 rounded-full inline-block"></span>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">app.meusim.com.br</span>
                <span className="w-4"></span>
              </div>

              {/* Fake Dashboard Content */}
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xs text-gray-400 dark:text-gray-500 uppercase font-bold tracking-wider">Painel Geral</h3>
                    <h2 className="text-xl font-title text-brand-gray dark:text-white font-semibold">Mariana & Gabriel</h2>
                  </div>
                  <span className="px-3 py-1 bg-brand-pink/50 dark:bg-gray-800 text-brand-gray dark:text-brand-gold text-xs font-semibold rounded-full">
                    12 Outubro de 2026
                  </span>
                </div>

                {/* Dashboard Stats Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-brand-background dark:bg-gray-800 p-3 rounded-2xl border border-gray-100 dark:border-gray-700 text-center">
                    <span className="text-gray-400 dark:text-gray-500 text-[10px] uppercase font-bold">Tarefas</span>
                    <div className="text-lg font-bold text-brand-gray dark:text-white mt-1">68%</div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-brand-gold h-full rounded-full" style={{ width: '68%' }}></div>
                    </div>
                  </div>
                  <div className="bg-brand-background dark:bg-gray-800 p-3 rounded-2xl border border-gray-100 dark:border-gray-700 text-center">
                    <span className="text-gray-400 dark:text-gray-500 text-[10px] uppercase font-bold">RSVP</span>
                    <div className="text-lg font-bold text-brand-gray dark:text-white mt-1">112 / 180</div>
                    <span className="text-[10px] text-brand-green font-semibold">62% confirmados</span>
                  </div>
                  <div className="bg-brand-background dark:bg-gray-800 p-3 rounded-2xl border border-gray-100 dark:border-gray-700 text-center">
                    <span className="text-gray-400 dark:text-gray-500 text-[10px] uppercase font-bold">Orçamento</span>
                    <div className="text-lg font-bold text-brand-gray dark:text-white mt-1">R$ 52.400</div>
                    <span className="text-[10px] text-red-500 dark:text-red-400">82% planejado</span>
                  </div>
                </div>

                {/* Checklist Preview */}
                <div className="space-y-3">
                  <h4 className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase">Checklist do Mês</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-850 rounded-xl border border-gray-100 dark:border-gray-800/80">
                      <Icon name="check_box" className="text-brand-gold text-lg" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-404 line-through truncate">Degustação com buffet contratado</p>
                      </div>
                      <span className="text-[9px] px-2 py-0.5 bg-gray-200 text-gray-500 rounded font-semibold">Concluído</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-850 rounded-xl border border-gray-100 dark:border-gray-808/80">
                      <Icon name="check_box_outline_blank" className="text-brand-gray-light text-lg" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-brand-gray dark:text-gray-300 truncate">Contratar decoração floral da igreja</p>
                      </div>
                      <span className="text-[9px] px-2 py-0.5 bg-brand-pink text-brand-gray font-semibold rounded">Urgente</span>
                    </div>
                  </div>
                </div>

                {/* RSVP / WhatsApp integration preview */}
                <div className="p-3 bg-green-50/50 dark:bg-green-950/20 border border-green-200/50 dark:border-green-800/30 rounded-2xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Icon name="whatsapp" className="text-green-500 text-xl" />
                    <div>
                      <p className="text-[11px] font-bold text-green-800 dark:text-green-400">Agradecimento WhatsApp</p>
                      <p className="text-[9px] text-green-700/80 dark:text-green-300/60">Marília e Tiago enviaram um presente!</p>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-[10px] font-bold rounded-lg transition-all flex items-center gap-1 shadow-sm">
                    <Icon name="send" className="text-[10px]" /> Enviar Mensagem
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Pain Points & Problems Section */}
      <section id="problemas" className="py-20 bg-brand-pink-light/30 dark:bg-gray-900/40 border-y border-brand-pink-light/30 dark:border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-xs text-brand-gold uppercase font-bold tracking-widest">Os Desafios Reais</h2>
            <h3 className="text-3xl sm:text-4xl font-title text-brand-gray dark:text-white font-bold">
              Organizar um casamento é lindo, mas a gestão do processo pode ser exaustiva...
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Conversamos com milhares de casais no portal da **RJ Wedding** e listamos as maiores frustrações. Nós criamos uma solução inteligente para cada uma delas.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 text-left">
            {/* Problema 1 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-md border border-gray-100 dark:border-gray-700/50 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-950/40 text-red-500 rounded-2xl flex items-center justify-center mb-6">
                <Icon name="trending_down" className="text-2xl" />
              </div>
              <h4 className="text-lg font-bold text-brand-gray dark:text-white mb-2">Descontrole Orçamentário</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Mais de 70% dos casais gastam muito mais do que planejado porque não acompanham as parcelas de fornecedores ou os valores que faltam pagar.
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center gap-2 text-xs text-brand-green font-bold uppercase">
                <Icon name="check" /> No App: Controle de parcelas e saúde orçamentária
              </div>
            </div>

            {/* Problema 2 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-md border border-gray-100 dark:border-gray-700/50 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950/40 text-orange-500 rounded-2xl flex items-center justify-center mb-6">
                <Icon name="playlist_remove" className="text-2xl" />
              </div>
              <h4 className="text-lg font-bold text-brand-gray dark:text-white mb-2">Checklist Caótico</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Listas de tarefas gigantescas e genéricas baixadas na internet que não se adaptam à data ou às características específicas do seu evento.
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center gap-2 text-xs text-brand-green font-bold uppercase">
                <Icon name="check" /> No App: Checklist automatizado conforme a sua data
              </div>
            </div>

            {/* Problema 3 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-md border border-gray-100 dark:border-gray-700/50 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/40 text-blue-500 rounded-2xl flex items-center justify-center mb-6">
                <Icon name="quickreply" className="text-2xl" />
              </div>
              <h4 className="text-lg font-bold text-brand-gray dark:text-white mb-2">O Drama do RSVP</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Passar semanas mandando mensagens no WhatsApp cobrando confirmação de presença dos convidados e organizando as respostas manuais.
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center gap-2 text-xs text-brand-green font-bold uppercase">
                <Icon name="check" /> No App: Link de confirmação de presença instantâneo
              </div>
            </div>

            {/* Problema 4 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-md border border-gray-100 dark:border-gray-700/50 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-955/40 text-purple-500 rounded-2xl flex items-center justify-center mb-6">
                <Icon name="assignment" className="text-2xl" />
              </div>
              <h4 className="text-lg font-bold text-brand-gray dark:text-white mb-2">Fornecedores Descentralizados</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Contratos no e-mail, telefones nos contatos do celular e anotações de valores em papel de pão. Perder prazos de pagamentos de fornecedores é fácil.
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center gap-2 text-xs text-brand-green font-bold uppercase">
                <Icon name="check" /> No App: Ficha de fornecedores centralizada
              </div>
            </div>

            {/* Problema 5 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-md border border-gray-100 dark:border-gray-700/50 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-950/40 text-green-500 rounded-2xl flex items-center justify-center mb-6">
                <Icon name="sentiment_satisfied" className="text-2xl" />
              </div>
              <h4 className="text-lg font-bold text-brand-gray dark:text-white mb-2">Controle de Presentes e Agradecimentos</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Receber dezenas de presentes na lista e ficar confuso sobre quem mandou o quê, ou demorar semanas para enviar um agradecimento simpático.
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center gap-2 text-xs text-brand-green font-bold uppercase">
                <Icon name="check" /> No App: Integração direta com WhatsApp para agradecer
              </div>
            </div>

            {/* Problema 6 (Integração RJ Wedding) */}
            <div className="bg-brand-gold/10 dark:bg-brand-gold/5 p-8 rounded-3xl shadow-md border border-brand-gold/30 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-[#dbb27f]/20 text-[#a98150] dark:text-brand-gold rounded-2xl flex items-center justify-center mb-6">
                <Icon name="menu_book" className="text-2xl" />
              </div>
              <h4 className="text-lg font-bold text-[#8c673c] dark:text-brand-gold mb-2">Falta de Dicas e Inspiração</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Gerenciar tarefas é bom, mas o que fazer quando não sabemos como escolher o fotógrafo ideal ou qual o prazo de envio do RSVP?
              </p>
              <div className="mt-4 pt-4 border-t border-brand-gold/30 flex items-center gap-2 text-xs text-brand-gold font-bold uppercase">
                <Icon name="check" /> Conexão direta com o Portal de Dicas da RJ Wedding
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. RJ Wedding Branding & Integration */}
      <section id="rjwedding" className="py-24 bg-brand-pink-light/10 dark:bg-gray-900/60 border-t border-brand-pink-light/30 dark:border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-5 space-y-6">
              <div className="w-20 h-20 rounded-3xl bg-[#dbb27f]/10 dark:bg-gray-800 border border-[#dbb27f]/30 flex items-center justify-center text-brand-gold mb-4">
                <Icon name="workspace_premium" className="text-4xl" />
              </div>
              <h2 className="text-xs text-brand-gold uppercase font-bold tracking-widest">Garantia RJ Wedding</h2>
              <h3 className="text-3xl sm:text-4xl font-title text-brand-gray dark:text-white font-bold leading-tight">
                A ferramenta oficial do portal de casamentos nº 1 do Rio
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                A **RJ Wedding** (rjweddings.com) é o portal definitivo de noivos do Rio de Janeiro. Ao longo de anos, ajudamos milhares de noivos com artigos de inspiração, roteiros práticos e curadoria de fornecedores.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                O **Meu Sim** é o fechamento de ouro desse ecossistema. Ele transforma todo o conhecimento teórico do nosso portal em uma ferramenta ativa, viva e automatizada no seu celular ou computador.
              </p>
              <div className="pt-2">
                <a
                  href="https://www.rjweddings.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold text-brand-gold hover:text-brand-gold-dark transition-colors"
                >
                  Conhecer o portal de dicas RJ Wedding <Icon name="open_in_new" className="text-sm" />
                </a>
              </div>
            </div>

            <div className="md:col-span-7">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/80">
                  <div className="text-4xl font-title font-bold text-[#dbb27f] mb-2">10k+</div>
                  <h4 className="text-sm font-bold text-brand-gray dark:text-white mb-1">Casais Ajudados</h4>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Milhares de casamentos planejados no Rio de Janeiro e em todo o Brasil.</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/80">
                  <div className="text-4xl font-title font-bold text-[#dbb27f] mb-2">100%</div>
                  <h4 className="text-sm font-bold text-brand-gray dark:text-white mb-1">Foco nos Noivos</h4>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Desenvolvido pensando exclusivamente na usabilidade simples para casais reais.</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/80">
                  <div className="text-4xl font-title font-bold text-[#dbb27f] mb-2">R$ 0</div>
                  <h4 className="text-sm font-bold text-brand-gray dark:text-white mb-1">Totalmente Gratuito</h4>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Acesso livre a todas as funcionalidades de checklist, orçamento, presentes e RSVP.</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/80">
                  <div className="text-4xl font-title font-bold text-[#dbb27f] mb-2">24h</div>
                  <h4 className="text-sm font-bold text-brand-gray dark:text-white mb-1">Acesso Remoto</h4>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Seus dados salvos em nuvem para acessar juntos do smartphone ou do notebook.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials Section */}
      <section className="py-20 bg-brand-background dark:bg-gray-900 border-t border-brand-pink-light/40 dark:border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs text-brand-gold uppercase font-bold tracking-widest">Prova Social</h2>
            <h3 className="text-3xl font-title text-brand-gray dark:text-white font-bold">Quem usou, recomenda</h3>
            <p className="text-gray-500 dark:text-gray-400">Casais que organizaram seus casamentos sem planilhas estressantes e economizaram tempo e dinheiro.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-brand-pink-light/30 dark:border-gray-700 shadow-sm relative">
              <Icon name="format_quote" className="text-5xl text-brand-pink absolute top-4 right-6 opacity-45" />
              <div className="flex gap-1 text-brand-gold mb-4">
                <Icon name="star" /><Icon name="star" /><Icon name="star" /><Icon name="star" /><Icon name="star" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 italic mb-6">
                "Estávamos desesperados com o orçamento do nosso casamento no Rio. A calculadora do app nos ajudou a dividir a verba de forma correta e o controle de pagamentos nos manteve na linha. Casamos sem nenhuma dívida!"
              </p>
              <div>
                <h5 className="font-bold text-brand-gray dark:text-white text-sm">Carolina & Bruno</h5>
                <span className="text-xs text-gray-400">Casamento em Out/2025</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-brand-pink-light/30 dark:border-gray-700 shadow-sm relative">
              <Icon name="format_quote" className="text-5xl text-brand-pink absolute top-4 right-6 opacity-45" />
              <div className="flex gap-1 text-brand-gold mb-4">
                <Icon name="star" /><Icon name="star" /><Icon name="star" /><Icon name="star" /><Icon name="star" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 italic mb-6">
                "O RSVP público salvou a nossa vida! Enviamos o link do nosso site para todos os convidados no WhatsApp e a lista de presentes já atualizava o status em tempo real. E o agradecimento por lá foi super prático."
              </p>
              <div>
                <h5 className="font-bold text-brand-gray dark:text-white text-sm">Luana & Marcos</h5>
                <span className="text-xs text-gray-400">Casamento em Mai/2026</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-brand-pink-light/30 dark:border-gray-700 shadow-sm relative">
              <Icon name="format_quote" className="text-5xl text-brand-pink absolute top-4 right-6 opacity-45" />
              <div className="flex gap-1 text-brand-gold mb-4">
                <Icon name="star" /><Icon name="star" /><Icon name="star" /><Icon name="star" /><Icon name="star" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 italic mb-6">
                "O checklist automatizado com base na data nos deu um norte incrível. Sabíamos exatamente o que contratar a cada mês. Indico de olhos fechados para qualquer casal que queira paz mental."
              </p>
              <div>
                <h5 className="font-bold text-brand-gray dark:text-white text-sm">Fernanda & Vinícius</h5>
                <span className="text-xs text-gray-400">Casamento em Jan/2026</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Call To Action (CTA) Section */}
      <section className="py-24 bg-brand-pink-light/30 dark:bg-gray-900/50 border-t border-brand-pink-light/30 dark:border-gray-800 text-center transition-colors">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          <h2 className="text-4xl sm:text-5xl font-title text-brand-gray dark:text-white font-bold leading-tight">
            Prontos para começar a planejar sem estresse?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Crie sua conta em 30 segundos, digite a data do seu casamento e tenha o controle total do seu grande dia. Sem pegadinhas, 100% grátis e desenvolvido pelo time da RJ Wedding.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to={user ? "/dashboard" : "/cadastro"}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-brand-gold text-white font-bold rounded-2xl shadow-xl hover:bg-brand-gold-dark transition-all hover:-translate-y-1 active:scale-95 text-sm"
            >
              Começar a Planejar Grátis <Icon name="favorite" className="text-sm" />
            </Link>
            <Link
              to={user ? "/dashboard" : "/login"}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-brand-pink-light dark:bg-gray-800 text-brand-gray dark:text-white font-semibold rounded-2xl border border-brand-pink-dark/30 dark:border-gray-700 hover:bg-brand-pink dark:hover:bg-gray-700 transition-all text-sm"
            >
              Já tenho uma conta
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="bg-brand-background dark:bg-gray-900 py-12 border-t border-brand-pink-light/40 dark:border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-400 dark:text-gray-500">
          <div className="flex items-center gap-2">
            <Icon name="favorite" className="text-brand-gold text-xl" />
            <div className="flex flex-col text-left">
              <span className="font-title font-bold text-brand-gray dark:text-white leading-none">Meu Sim</span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">Planejando o Casamento dos meus Sonhos</span>
            </div>
          </div>

          <p>© {new Date().getFullYear()} Meu Sim. Desenvolvido para o seu grande dia. Todos os direitos reservados.</p>

          <div className="flex gap-4">
            <a href="https://www.rjweddings.com/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition-colors">
              RJ Wedding Portal
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingScreen;
