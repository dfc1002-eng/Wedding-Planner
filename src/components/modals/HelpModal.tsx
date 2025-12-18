import React, { useState } from 'react';
import Icon from '../ui/Icon';

interface HelpModalProps {
    onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState<'guide' | 'faq'>('guide');
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    // --- CONTEÚDO DO GUIA (ATUALIZADO) ---
    const guideSteps = [
        {
            icon: 'settings',
            title: '1. Personalize seu evento',
            desc: "Acesse a aba “Ajustes” para definir a data do casamento, o orçamento total e criar o seu Link Amigável (ex: /ana-e-pedro)."
        },
        {
            icon: 'storefront',
            title: '2. Gestão de fornecedores',
            desc: "Cadastre todos os fornecedores do seu casamento e acompanhe os gastos do início ao fim. Para ajudar no controle financeiro do seu casamento, inclua informações como valor do contrato, número de parcelas e tenha o orçamento sob controle."
        },
        {
            icon: 'payment',
            title: '3. Pagamentos',
            desc: "Tenha o controle financeiro do seu casamento em um só lugar. Nesta aba, você acompanha todos os pagamentos do seu grande dia de forma clara e organizada."
        },
        {
            icon: 'checklist',
            title: '4. Checklist',
            desc: "Um checklist completo para acompanhar cada etapa dos preparativos do seu casamento. A cada fornecedor incluído, ele será automaticamente integrado à aba de Fornecedores, facilitando a organização e o controle do planejamento."
        },
        {
            icon: 'people',
            title: '5. Lista de convidados',
            desc: "Adicione seus convidados e preencha as informações essenciais para manter o controle da lista de forma prática e organizada: com campos para quantidade de convidados, número de convites e até um botão de WhatsApp, facilitando o envio do convite com link de RSVP automático."
        },
        {
            icon: 'card_giftcard',
            title: '6. Lista de Presentes',
            desc: "Para ajudar no controle dos presentes do seu casamento, preencha as informações dos presentes recebidos e acompanhe o valor total arrecadado, além de registrar se o agradecimento já foi enviado a cada convidado."
        },
        {
            icon: 'grid_view',
            title: '7. Acompanhe o progresso do seu casamento',
            desc: "Utilize o Dashboard inicial para ter uma visão geral de todo o planejamento e acompanhar o progresso dos preparativos do seu grande dia."
        }
    ];

    // --- CONTEÚDO DAS DÚVIDAS (FAQ) ---
    const faqs = [
        {
            question: "Como envio o link de RSVP?",
            answer: "No menu 'Convidados', clique no ícone do WhatsApp ao lado do nome da pessoa. O sistema gera uma mensagem personalizada com o link correto."
        },
        {
            question: "O que é a URL Amigável?",
            answer: "É o endereço personalizado do seu site (ex: /rsvp/seus-nomes). Você configura isso no menu 'Ajustes'."
        },
        {
            question: "Como registo um pagamento?",
            answer: "Edite o fornecedor (ícone de lápis), vá até à secção de parcelas e marque a caixa de seleção da parcela como paga."
        },
        {
            question: "Como adicionar valor extra ao contrato?",
            answer: "Na edição do fornecedor, use o botão 'Adicionar Aditivo'. Isso serve para horas extras ou itens não previstos no contrato original."
        }
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div 
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-fadeIn"
                onClick={e => e.stopPropagation()}
            >
                {/* Cabeçalho */}
                <div className="p-6 pb-0 bg-white dark:bg-gray-800 flex-shrink-0">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-2xl font-bold text-brand-gray dark:text-white font-title">
                            Central de Ajuda
                        </h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                            <Icon name="close" />
                        </button>
                    </div>

                    {/* Abas */}
                    <div className="flex border-b border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => setActiveTab('guide')}
                            className={`pb-3 px-4 font-semibold text-sm transition-colors border-b-2 ${
                                activeTab === 'guide' 
                                    ? 'text-brand-pink dark:text-brand-gold border-brand-pink dark:border-brand-gold' 
                                    : 'text-gray-500 border-transparent hover:text-gray-700'
                            }`}
                        >
                            <div className="flex items-center gap-2"><Icon name="rocket_launch" /> Guia Rápido</div>
                        </button>
                        <button
                            onClick={() => setActiveTab('faq')}
                            className={`pb-3 px-4 font-semibold text-sm transition-colors border-b-2 ${
                                activeTab === 'faq' 
                                    ? 'text-brand-pink dark:text-brand-gold border-brand-pink dark:border-brand-gold' 
                                    : 'text-gray-500 border-transparent hover:text-gray-700'
                            }`}
                        >
                            <div className="flex items-center gap-2"><Icon name="help" /> Dúvidas</div>
                        </button>
                    </div>
                </div>

                {/* Corpo Scrollável */}
                <div className="p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900/30 flex-grow">
                    {activeTab === 'guide' ? (
                        <div className="space-y-4">
                            {guideSteps.map((step, idx) => (
                                <div key={idx} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex gap-4 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex-shrink-0 bg-brand-pink/10 dark:bg-brand-gold/10 w-12 h-12 rounded-full flex items-center justify-center text-brand-pink dark:text-brand-gold">
                                        <Icon name={step.icon} className="text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-brand-gray dark:text-white mb-1">{step.title}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed text-justify">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {faqs.map((faq, index) => (
                                <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                    <button 
                                        onClick={() => toggleFAQ(index)}
                                        className="w-full flex justify-between items-center p-4 text-left font-medium text-brand-gray dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                    >
                                        <span>{faq.question}</span>
                                        <Icon name={openFaqIndex === index ? 'expand_less' : 'expand_more'} className="text-gray-400" />
                                    </button>
                                    {openFaqIndex === index && (
                                        <div className="p-4 pt-0 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800">
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HelpModal;