

import React, { useState, useEffect } from 'react';
import { useWedding } from '../../context/WeddingDataContext';
import { WeddingData } from '../../types';
import { format as formatDate } from 'date-fns';
import Icon from '../ui/Icon';

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
                    <div>
                        <label htmlFor="coupleName-0" className="block text-sm font-medium mb-1 text-brand-gray-light dark:text-gray-400">Noiva(o)</label>
                        <input
                            type="text"
                            id="coupleName-0"
                            name="coupleName-0"
                            value={formData.coupleNames[0]}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="coupleName-1" className="block text-sm font-medium mb-1 text-brand-gray-light dark:text-gray-400">Noivo(a)</label>
                        <input
                            type="text"
                            id="coupleName-1"
                            name="coupleName-1"
                            value={formData.coupleNames[1]}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="weddingDate" className="flex items-center text-sm font-medium mb-1 text-brand-gray-light dark:text-gray-400">
                        <Icon name="calendar_today" className="mr-2 text-base" />
                        <span>Data do Casamento</span>
                    </label>
                    <input
                        type="date"
                        id="weddingDate"
                        name="weddingDate"
                        value={formData.weddingDate ? formatDate(formData.weddingDate, 'yyyy-MM-dd') : ''}
                        onChange={handleDateChange}
                        className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="venueName" className="block text-sm font-medium mb-1 text-brand-gray-light dark:text-gray-400">Local do Casamento</label>
                        <input
                            type="text"
                            id="venueName"
                            name="venueName"
                            value={formData.venueName || ''}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600"
                            placeholder="Ex: Espaço dos Sonhos"
                        />
                    </div>
                    <div>
                        <label htmlFor="weddingWebsite" className="block text-sm font-medium mb-1 text-brand-gray-light dark:text-gray-400">Site do Casamento (URL)</label>
                        <input
                            type="url"
                            id="weddingWebsite"
                            name="weddingWebsite"
                            value={formData.weddingWebsite || ''}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600"
                            placeholder="https://exemplo.com"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="totalBudget" className="block text-sm font-medium mb-1 text-brand-gray-light dark:text-gray-400">Orçamento Total (R$)</label>
                        <input
                            type="number"
                            id="totalBudget"
                            name="totalBudget"
                            value={formData.totalBudget}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600"
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="guestCount" className="block text-sm font-medium mb-1 text-brand-gray-light dark:text-gray-400">Número de Convidados (Estimativa)</label>
                        <input
                            type="number"
                            id="guestCount"
                            name="guestCount"
                            value={formData.guestCount}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600"
                            min="0"
                            required
                        />
                    </div>
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