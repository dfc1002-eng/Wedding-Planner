import React, { useState, useEffect } from 'react';
import { Guest, GuestStatus, GuestFormData } from '../../types';
import { GUEST_GROUPS } from '../../constants';
import { formatPhoneNumber, cleanPhoneNumber } from '../../utils';
import Icon from '../ui/Icon';

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
        confirmedPlusOnes: 0,
    });
    const [isPhoneValid, setIsPhoneValid] = useState(false);

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
                confirmedPlusOnes: guest.confirmedPlusOnes || 0,
            });
        } else {
            // Reset form for new guest
            setFormData({
                name: '', phone: '', address: '', group: GUEST_GROUPS[0], plusOnes: 0,
                notes: '', status: GuestStatus.Pending, confirmedPlusOnes: 0,
            });
        }
    }, [guest, isOpen]);
    
    useEffect(() => {
        setIsPhoneValid(cleanPhoneNumber(formData.phone).length >= 10);
    }, [formData.phone]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        if (name === 'phone') {
            const formattedPhone = formatPhoneNumber(value);
            setFormData(prev => ({ ...prev, phone: formattedPhone }));
        } else if (name === 'plusOnes' || name === 'confirmedPlusOnes') {
            const numValue = parseInt(value, 10) || 0;
            setFormData(prev => ({ ...prev, [name]: numValue }));
        }
        else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isPhoneValid) return;
        
        const dataToSave = { ...formData, phone: cleanPhoneNumber(formData.phone) };

        if (dataToSave.status !== GuestStatus.Confirmed) {
            dataToSave.confirmedPlusOnes = 0;
        }

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
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium mb-1">Nome Completo *</label>
                                    <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600" />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium mb-1">Telefone *</label>
                                    <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required maxLength={15} className={`w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 ${!isPhoneValid && formData.phone ? 'border-red-500' : ''}`} />
                                </div>
                            </div>
                            
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium mb-1">Endereço *</label>
                                <input id="address" name="address" type="text" value={formData.address} onChange={handleChange} required className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="group" className="block text-sm font-medium mb-1">Grupo</label>
                                    <select id="group" name="group" value={formData.group} onChange={handleChange} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600">
                                        {GUEST_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                                    </select>
                                </div>
                                 <div>
                                    <label htmlFor="plusOnes" className="block text-sm font-medium mb-1">Qtd. de Acompanhantes</label>
                                    <input id="plusOnes" name="plusOnes" type="number" min="0" value={formData.plusOnes} onChange={handleChange} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600" />
                                </div>
                            </div>
                            
                            <div>
                               <label htmlFor="notes" className="block text-sm font-medium mb-1">Observações / Tipo de Convite</label>
                               <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={3} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600" placeholder="Ex: 'Minha amada irmã Juliana', 'Alergia a glúten'"></textarea>
                            </div>
                            
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium mb-1">Confirmação de Presença</label>
                                    <select id="status" name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600">
                                        {Object.values(GuestStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                {formData.status === GuestStatus.Confirmed && formData.plusOnes > 0 && (
                                    <div>
                                        <label htmlFor="confirmedPlusOnes" className="block text-sm font-medium mb-1">Acompanhantes Confirmados</label>
                                        <input id="confirmedPlusOnes" name="confirmedPlusOnes" type="number" min="0" max={formData.plusOnes} value={formData.confirmedPlusOnes} onChange={handleChange} className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600" />
                                    </div>
                                )}
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