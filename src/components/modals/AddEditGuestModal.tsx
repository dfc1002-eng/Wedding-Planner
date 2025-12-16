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

const DDI_OPTIONS = [
    { label: '🇧🇷 +55', value: '+55' },
    { label: '🇵🇹 +351', value: '+351' },
    { label: '🇺🇸 +1', value: '+1' },
    { label: '🇨🇦 +1', value: '+1' },
    { label: '🇪🇸 +34', value: '+34' },
    { label: '🇫🇷 +33', value: '+33' },
    { label: '🇮🇹 +39', value: '+39' },
    { label: '🇬🇧 +44', value: '+44' },
    { label: '🇩🇪 +49', value: '+49' },
    { label: '🇳🇱 +31', value: '+31' },
    { label: '🇮🇪 +353', value: '+353' },
    { label: '🇨🇳 +86', value: '+86' },
    { label: '🇦🇷 +54', value: '+54' },
    { label: '🇦🇺 +61', value: '+61' },
    { label: '🇯🇵 +81', value: '+81' },
    { label: '🇦🇴 +244', value: '+244' },
    { label: '🇲🇿 +258', value: '+258' },
];

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
    const [countryCode, setCountryCode] = useState('+55'); // Novo estado para DDI
    const [isPhoneValid, setIsPhoneValid] = useState(false);
    const [phoneError, setPhoneError] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (guest) {
            let guestPhone = guest.phone || '';
            let initialCountryCode = '+55';
            let phoneNumberWithoutCode = guestPhone;

            for (const ddi of DDI_OPTIONS) {
                if (guestPhone.startsWith(ddi.value)) {
                    initialCountryCode = ddi.value;
                    phoneNumberWithoutCode = guestPhone.substring(ddi.value.length);
                    break;
                }
            }

            setCountryCode(initialCountryCode);
            setFormData({
                name: guest.name,
                phone: formatPhoneNumber(phoneNumberWithoutCode),
                address: guest.address,
                group: guest.group,
                plusOnes: guest.plusOnes,
                notes: guest.notes,
                status: guest.status,
            });
        } else {
            // Reset form for new guest
            setCountryCode('+55'); // Reset DDI to default
            setFormData({
                name: '', phone: '', address: '', group: GUEST_GROUPS[0], plusOnes: 0,
                notes: '', status: GuestStatus.Pending,
            });
        }
    }, [guest, isOpen]);
    
    useEffect(() => {
        const cleaned = cleanPhoneNumber(formData.phone);
        // Basic validation: if phone is provided, it should have at least 8 digits (after DDI)
        if (formData.phone && cleaned.length < 8) { // Changed to 8 for more flexibility with DDIs
            setIsPhoneValid(false);
            setPhoneError('Telefone deve ter pelo menos 8 dígitos (sem DDI).');
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
        // Phone is required only if it's not empty. If provided, it must be valid.
        if (!formData.name || (formData.phone && !isPhoneValid)) return;
        
        const finalPhone = formData.phone ? countryCode + cleanPhoneNumber(formData.phone) : '';

        const dataToSave = { ...formData, phone: finalPhone };
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
                                {/* Campo de Telefone com Seletor DDI */}
                                <div className="flex flex-col">
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telefone</label>
                                    <div className="flex items-stretch">
                                        <select
                                            id="countryCode"
                                            name="countryCode"
                                            value={countryCode}
                                            onChange={(e) => setCountryCode(e.target.value)}
                                            className="w-32 flex-shrink-0 p-3 border border-r-0 border-gray-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 rounded-l-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none text-sm"
                                        >
                                            {DDI_OPTIONS.map(option => (
                                                <option key={option.value} value={option.value}>{option.label}</option>
                                            ))}
                                        </select>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            placeholder="Número de Telefone"
                                            className={`flex-1 p-3 border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 rounded-r-lg focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all text-sm ${
                                                !isPhoneValid && formData.phone ? 'border-red-500 ring-red-200' : ''
                                            }`}
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required={!!formData.phone} // Required if phone field is not empty
                                        />
                                    </div>
                                    {phoneError && <p className="mt-1 text-sm text-red-600">{phoneError}</p>}
                                </div>
                            </div>
                            
                            <FormField
                                id="address"
                                label="Endereço (Opcional)"
                                type="text"
                                value={formData.address}
                                onChange={handleChange}
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
                                    label="Limite de Acompanhantes (Convites Extras)"
                                    type="number"
                                    value={formData.plusOnes}
                                    onChange={handleChange}
                                    min="0"
                                    placeholder="0 (Sem acompanhantes)"
                                    hint="Define quantas pessoas este convidado pode levar além dele mesmo no RSVP."
                                />
                            </div>
                            
                            <FormField
                                id="notes"
                                label="Observações / Tipo de Convite"
                                type="textarea"
                                value={formData.notes}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Primo da noiva / Amigo de infância do noivo"
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
                        <button type="submit" disabled={!formData.name || (formData.phone && !isPhoneValid)} className="bg-brand-pink hover:opacity-90 text-brand-gray font-bold py-2 px-6 rounded-lg transition-colors dark:bg-brand-gold dark:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed">
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEditGuestModal;