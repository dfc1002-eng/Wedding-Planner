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

    const guideSteps = [
        {
            icon: 'settings',
            title: '1. Personalize seu Evento',
            desc: "Vá em 'Ajustes' para definir a data, orçamento total e criar seu Link Amigável (ex: /ana-e-pedro)."
        },
        {
            icon: 'groups',
            title: '2. Lista de Convidados',
            desc: "Adicione seus convidados. Use o botão de WhatsApp na lista para enviar o convite com o link de RSVP automático."
        },
        {
            icon: 'storefront',
            title: '3. Gestão de Fornecedores',
            desc: "Cadastre seus contratos. Lance pagamentos parciais e aditivos para manter o orçamento sob controle."
        },
        {
            icon: 'dashboard',
            title: '4. Acompanhe o Progresso',
            desc: "Use o Dashboard inicial para ver a contagem regressiva, pagamentos pendentes e confirmações de presença."
        }
    ];

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
                <div className="p-6 pb-0 bg-white dark:bg-gray-800 flex-shrink-0">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-2xl font-bold text-brand-gray dark:text-white font-title">
                            Central de Ajuda
                        </h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                            <Icon name="close" />
                        </button>
                    </div>

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

                <div className="p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900/30 flex-grow">
                    {activeTab === 'guide' ? (
                        <div className="space-y-4">
                            {guideSteps.map((step, idx) => (
                                <div key={idx} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex gap-4 shadow-sm">
                                    <div className="flex-shrink-0 bg-brand-pink/10 dark:bg-brand-gold/10 w-10 h-10 rounded-full flex items-center justify-center text-brand-pink dark:text-brand-gold">
                                        <Icon name={step.icon} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-brand-gray dark:text-white mb-1">{step.title}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{step.desc}</p>
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