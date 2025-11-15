"use client";

import React, { useState, useEffect } from 'react';
import { Guest, GuestStatus, GuestFormData } from '../../types';
import { GUEST_GROUPS } from '../../constants';
import { formatPhoneNumber, cleanPhoneNumber } from '../../utils';
import Icon from '../ui/Icon';
import FormField from '../ui/FormField'; // Importar FormField

interface AddEditGuestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: GuestFormData) => void;
    guest: Guest | null;
}

const AddEditGuestModal: React.FC<AddEditGuestModalProps> = ({ isOpen, onClose, onSave, guest }) => {
    const [formData, setFormData] = useState<GuestFormData>({
        name: '',
        phone: '',
        address: '',
        group: GUEST_GROUPS[0],
        plusOnes: 0,
        notes: '',
        status: GuestStatus.Pending,
    });
    const [isPhoneValid, setIsPhoneValid] = useState(false);
    const [phoneError, setPhoneError] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (guest) {
            setFormData({
                name: guest.name,
                phone: formatPhoneNumber(guest.phone),
                address: guest.address,
                group: guest.group,
                plusOnes: guest.plusOnes,
                notes: guest.notes,
                status: guest.status,
            });
        } else {
            // Reset form for new guest
            setFormData({
                name: '', phone: '', address: '', group: GUEST_GROUPS[0], plusOnes: 0,
                notes: '', status: GuestStatus.Pending,
            });
        }
    }, [guest, isOpen]);
    
    useEffect(() => {
        const cleaned = cleanPhoneNumber(formData.phone);
        if (formData.phone && cleaned.length < 10) {
            setIsPhoneValid(false);
            setPhoneError('Telefone deve ter pelo menos 10 dígitos.');
        } else {
            setIsPhoneValid(true);
            setPhoneError(undefined);
        }
    }, [formData.phone]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        if (name === 'phone') {
            const formattedPhone = formatPhoneNumber(value);
            setFormData(prev => ({ ...prev, phone: formattedPhone }));
        } else if (name === 'plusOnes') {
            const numValue = parseInt(value, 10) || 0;
            setFormData(prev => ({ ...prev, [name]: numValue }));
        }
        else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isPhoneValid || !formData.name) return;
        
        const dataToSave = { ...formData, phone: cleanPhoneNumber(formData.phone) };
        onSave(dataToSave);
    };

    if (!isOpen) return null;

    return (
         <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                 <form onSubmit={handleSubmit}>
                     <div className="p-6 max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold font-title text-brand-gray dark:text-white">
                                {guest ? 'Editar Convidado' : 'Novo Convidado'}
                            </h2>
                            <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                <Icon name="close" />
                            </button>
                        </div>

                        <div className="space-y-4">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    id="name"
                                    label="Nome Completo"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                                <FormField
                                    id="phone"
                                    label="Telefone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    error={phoneError}
                                    inputClassName={!isPhoneValid && formData.phone ? 'border-red-500' : ''}
                                />
                            </div>
                            
                            <FormField
                                id="address"
                                label="Endereço"
                                type="text"
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    id="group"
                                    label="Grupo"
                                    type="select"
                                    value={formData.group}
                                    onChange={handleChange}
                                    options={GUEST_GROUPS.map(g => ({ value: g, label: g }))}
                                />
                                <FormField
                                    id="plusOnes"
                                    label="Qtd. de Acompanhantes"
                                    type="number"
                                    value={formData.plusOnes}
                                    onChange={handleChange}
                                    min="0"
                                />
                            </div>
                            
                            <FormField
                                id="notes"
                                label="Observações / Tipo de Convite"
                                type="textarea"
                                value={formData.notes}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Ex: 'Minha amada irmã Juliana', 'Alergia a glúten'"
                            />
                            
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    id="status"
                                    label="Confirmação de Presença"
                                    type="select"
                                    value={formData.status}
                                    onChange={handleChange}
                                    options={Object.values(GuestStatus).map(s => ({ value: s, label: s }))}
                                />
                             </div>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-b-xl">
                        <button type="button" onClick={onClose} className="py-2 px-6 rounded-lg text-brand-gray dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">Cancelar</button>
                        <button type="submit" disabled={!formData.name || !isPhoneValid} className="bg-brand-pink hover:opacity-90 text-brand-gray font-bold py-2 px-6 rounded-lg transition-colors dark:bg-brand-gold dark:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed">
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEditGuestModal;