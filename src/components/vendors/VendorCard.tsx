import React, { useState, useRef, ChangeEvent } from 'react';
import { format as formatDate } from 'date-fns';
import { Vendor, Payment, PaymentStatus } from '../../types';
import { formatCurrency, formatCurrencyNoCents, getCategoryIcon, cleanPhoneNumber } from '../../utils';
import StatusChip from '../ui/StatusChip';
import Icon from '../ui/Icon';
import Tooltip from '../ui/Tooltip';
import { useWedding } from '../../context/WeddingDataContext';

interface VendorCardProps {
    vendor: Vendor;
    payments: Payment[];
    isExpanded: boolean;
    onToggleExpand: () => void;
    onEdit: (vendor: Vendor) => void;
    onDelete: (vendorId: string) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const VendorCard: React.FC<VendorCardProps> = ({ vendor, payments, isExpanded, onToggleExpand, onEdit, onDelete }) => {
    const { handleUploadContract, handleDeleteContract } = useWedding();
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Security Check: Validate file size
        if (file.size > MAX_FILE_SIZE) {
            alert("O arquivo excede o tamanho máximo permitido de 5MB.");
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return;
        }

        setIsUploading(true);
        try {
            await handleUploadContract(vendor.id, file);
        } catch (error) {
            console.error("Erro ao fazer upload do contrato:", error);
            alert("Erro ao fazer upload do contrato. Tente novamente.");
        } finally {
            setIsUploading(false);
            // Limpar o input para permitir selecionar o mesmo arquivo novamente se necessário
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemoveContract = async () => {
        if (!vendor.contractUrl) return;
        
        // Confirmação simples antes de excluir
        if (window.confirm("Tem certeza que deseja excluir este contrato?")) {
            try {
                await handleDeleteContract(vendor.id, vendor.contractUrl);
            } catch (error) {
                console.error("Erro ao excluir contrato:", error);
                alert("Erro ao excluir contrato.");
            }
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 transition-shadow hover:shadow-lg flex flex-col">
            <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-grow">
                    <h3 className="font-bold text-xl text-brand-gray dark:text-white">{vendor.name}</h3>
                    <div className="flex items-center text-sm text-brand-gray-light dark:text-gray-400 mt-1">
                        <Icon name={getCategoryIcon(vendor.category)} className="text-base mr-1.5" />
                        <span>{vendor.category}</span>
                    </div>
                </div>
                <div className="flex-shrink-0 flex items-center space-x-2">
                    <StatusChip status={vendor.status} />
                    <button onClick={() => onEdit(vendor)} className="text-brand-gray-light hover:text-brand-pink-dark p-2 rounded-full bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors" aria-label={`Editar ${vendor.name}`}>
                        <Icon name="edit" className="text-base"/>
                    </button>
                    <button onClick={() => onDelete(vendor.id)} className="text-brand-gray-light hover:text-brand-red p-2 rounded-full bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors" aria-label={`Excluir ${vendor.name}`}>
                        <Icon name="delete" className="text-base"/>
                    </button>
                </div>
            </div>

            <div className="my-4 border-t border-gray-100 dark:border-gray-700"></div>

            {/* ALTERAÇÕES:
                1. 'flex flex-col gap-6': Cria um espaçamento vertical de 24px entre os itens.
                2. 'mt-4': Dá um respiro em relação à linha divisória de cima.
            */}
            <div className="flex flex-col gap-6 text-sm mt-4">
                <Tooltip text="Valor total acordado com o fornecedor em contrato." position="top">
                    <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-1">
                        <span className="text-brand-gray-light dark:text-gray-400">Contratado:</span>
                        <span className="font-bold text-base">{formatCurrencyNoCents(vendor.contractedValue)}</span>
                    </div>
                </Tooltip>
                
                <Tooltip text="Soma de todos os pagamentos já realizados para este fornecedor." position="top">
                    <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-1">
                        <span className="text-brand-gray-light dark:text-gray-400">Pago:</span>
                        <span className="font-bold text-green-600 dark:text-green-400 text-base">{formatCurrencyNoCents(vendor.amountPaid)}</span>
                    </div>
                </Tooltip>
                
                <Tooltip text="Valor que ainda falta pagar para quitar o contrato (Contratado - Pago)." position="top">
                    <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-1">
                        <span className="text-brand-gray-light dark:text-gray-400">Restante:</span>
                        <span className="font-bold text-red-600 dark:text-red-400 text-base">{formatCurrencyNoCents(vendor.contractedValue - vendor.amountPaid)}</span>
                    </div>
                </Tooltip>
            </div>

            {/* Informações de Contato e Contrato */}
            <div className="mt-3 space-y-2 text-sm">
                {vendor.phone && (
                    <div className="flex items-center justify-between text-brand-gray-light dark:text-gray-400">
                            <div className="flex items-center">
                            <Icon name="call" className="text-base mr-2" />
                            <a href={`tel:${vendor.phone}`} className="hover:text-brand-gold">{vendor.phone}</a>
                        </div>
                        <Tooltip text="Enviar WhatsApp" position="top">
                            <a
                                href={`https://wa.me/${cleanPhoneNumber(vendor.phone)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                aria-label={`Enviar WhatsApp para ${vendor.name}`}
                            >
                                <Icon name="whatsapp" className="text-xl" />
                            </a>
                        </Tooltip>
                    </div>
                )}
                
                {vendor.email && (
                    <div className="flex items-center text-brand-gray-light dark:text-gray-400">
                        <Icon name="mail" className="text-base mr-2" />
                        <a href={`mailto:${vendor.email}`} className="hover:text-brand-gold truncate">{vendor.email}</a>
                    </div>
                )}
                
                {/* Link de Contrato Antigo (Manter compatibilidade) */}
                {vendor.contractLink && !vendor.contractUrl && (
                    <div className="flex items-center text-brand-gray-light dark:text-gray-400">
                        <Icon name="description" className="text-base mr-2" />
                        <a
                            href={vendor.contractLink.startsWith('http') ? vendor.contractLink : `https://${vendor.contractLink}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-brand-gold truncate"
                        >
                            Ver Contrato (Link Externo)
                        </a>
                    </div>
                )}

                {/* Nova Funcionalidade: Upload de Contrato */}
                <div className="flex items-center text-brand-gray-light dark:text-gray-400 min-h-[24px]">
                    <Icon name="attach_file" className="text-base mr-2" />
                    
                    {isUploading ? (
                        <div className="flex items-center text-brand-gold">
                            <span className="animate-spin mr-2">
                                <Icon name="refresh" className="text-sm" />
                            </span>
                            <span>Enviando...</span>
                        </div>
                    ) : vendor.contractUrl ? (
                        <div className="flex items-center gap-2 w-full">
                            <a 
                                href={vendor.contractUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-brand-gold hover:underline font-medium truncate flex-1"
                                title={vendor.fileName || "Contrato"}
                            >
                                Ver Contrato
                            </a>
                            <button 
                                onClick={handleRemoveContract}
                                className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                title="Excluir contrato"
                            >
                                <Icon name="delete" className="text-sm" />
                            </button>
                        </div>
                    ) : (
                        <>
                            <button 
                                onClick={handleUploadClick}
                                className="hover:text-brand-gold hover:underline text-left"
                            >
                                Anexar Contrato
                            </button>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileChange} 
                                className="hidden" 
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            />
                        </>
                    )}
                </div>
            </div>

            <div className="mt-auto pt-4">
                 <div className="border-t border-gray-100 dark:border-gray-700 mb-4"></div>
                <button onClick={onToggleExpand} className="w-full text-left font-bold text-sm text-brand-gold hover:underline flex justify-between items-center">
                    Ver Parcelas ({payments.length})
                    <Icon name={isExpanded ? 'expand_less' : 'expand_more'} />
                </button>
                {isExpanded && (
                    <div className="mt-2 space-y-2 text-xs max-h-32 overflow-y-auto pr-2">
                        {payments.length > 0 ? payments.sort((a,b) => a.dueDate.getTime() - b.dueDate.getTime()).map(p => (
                            <div key={p.id} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                                <div>
                                    <p className="font-semibold">{formatDate(p.dueDate, "dd/MM/yyyy")}</p>
                                    <p>{formatCurrency(p.parcelValue)}</p>
                                </div>
                                <div className="text-right">
                                    <StatusChip status={p.status} />
                                    {p.status === PaymentStatus.Paid && p.paymentDate && (
                                        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                                            {formatDate(p.paymentDate, "dd/MM/yyyy")}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )) : <p className="text-gray-400 text-center p-2">Nenhuma parcela registrada.</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VendorCard;