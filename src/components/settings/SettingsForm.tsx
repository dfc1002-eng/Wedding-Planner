"use client";


import React, { useState, useEffect } from 'react';
import { useWedding } from '../../context/WeddingDataContext';
import { WeddingData } from '../../types';
import { format as formatDate } from 'date-fns';
import Icon from '../ui/Icon';
import FormField from '../ui/FormField'; // Importar FormField

interface SettingsFormProps {
    onSave: () => void;
}

const SettingsForm: React.FC<SettingsFormProps> = ({ onSave }) => {
    const { weddingData, setWeddingData } = useWedding();
    const [formData, setFormData] = useState<WeddingData>(weddingData);

    useEffect(() => {
        setFormData(weddingData);
    }, [weddingData]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        if (name.startsWith('coupleName')) {
            const index = parseInt(name.split('-')[1], 10);
            const newCoupleNames = [...formData.coupleNames] as [string, string];
            newCoupleNames[index] = value;
            setFormData(prev => ({ ...prev, coupleNames: newCoupleNames }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'number' ? parseFloat(value) || 0 : value,
            }));
        }
    };
    
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Appending T00:00:00 ensures the date is parsed in the local timezone
        setFormData(prev => ({
            ...prev,
            [name]: new Date(value + 'T00:00:00')
        }));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setWeddingData(formData);
        onSave();
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        id="coupleName-0"
                        label="Noiva(o)"
                        type="text"
                        value={formData.coupleNames[0]}
                        onChange={handleChange}
                        required
                    />
                    <FormField
                        id="coupleName-1"
                        label="Noivo(a)"
                        type="text"
                        value={formData.coupleNames[1]}
                        onChange={handleChange}
                        required
                    />
                </div>

                <FormField
                    id="weddingDate"
                    label="Data do Casamento"
                    type="date"
                    value={formData.weddingDate ? formatDate(formData.weddingDate, 'yyyy-MM-dd') : ''}
                    onChange={handleDateChange}
                    required
                    labelClassName="flex items-center"
                    className="relative"
                >
                    <Icon name="calendar_today" className="absolute left-3 top-1/2 -translate-y-1/2 text-base" />
                </FormField>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        id="venueName"
                        label="Local do Casamento"
                        type="text"
                        value={formData.venueName || ''}
                        onChange={handleChange}
                        placeholder="Ex: Espaço dos Sonhos"
                    />
                    <FormField
                        id="weddingWebsite"
                        label="Site do Casamento (URL)"
                        type="url"
                        value={formData.weddingWebsite || ''}
                        onChange={handleChange}
                        placeholder="https://exemplo.com"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        id="totalBudget"
                        label="Orçamento Total (R$)"
                        type="number"
                        value={formData.totalBudget}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                    />
                    <FormField
                        id="guestCount"
                        label="Número de Convidados (Estimativa)"
                        type="number"
                        value={formData.guestCount}
                        onChange={handleChange}
                        required
                        min="0"
                    />
                </div>

                <div className="pt-4 flex justify-end">
                    <button type="submit" className="bg-brand-pink hover:opacity-90 text-brand-gray font-bold py-2 px-6 rounded-lg transition-colors dark:bg-brand-gold dark:text-gray-900 flex items-center space-x-2">
                        <Icon name="save" className="text-lg" />
                        <span>Salvar Alterações</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SettingsForm;