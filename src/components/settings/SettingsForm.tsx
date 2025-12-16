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

const generateSlug = (name1: string, name2: string): string => {
    const combinedNames = `${name1}-e-${name2}`;
    return combinedNames
        .toLowerCase()
        .normalize('NFD') // Normalize for accents
        .replace(/[̀-ͯ]/g, '') // Remove accents
        .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric chars, keep spaces and hyphens
        .trim()
        .replace(/\s+/g, '-'); // Replace spaces with single hyphen
};

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
                [name]: type === 'number' ? (value === '' ? 0 : parseFloat(value) || 0) : value,
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

    const handleGenerateSlug = () => {
        const [name1, name2] = formData.coupleNames;
        if (name1 && name2) {
            const newSlug = generateSlug(name1, name2);
            setFormData(prev => ({ ...prev, slug: newSlug }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
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

                {/* Novo campo para o Slug */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Link Personalizado do Casamento (URL Amigável)
                    </label>
                    <div className="flex gap-2">
                        <FormField
                            id="slug"
                            type="text"
                            value={formData.slug || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                            placeholder="ex: diogo-e-renata"
                            className="flex-1"
                            inputClassName="font-mono"
                        />
                        <button
                            type="button"
                            onClick={handleGenerateSlug}
                            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                        >
                            <Icon name="auto_awesome" className="text-base" />
                            Gerar Slug
                        </button>
                    </div>
                    {formData.slug && (
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Seu link de RSVP será: <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-xs">
                                {window.location.origin}/rsvp/{formData.slug}
                            </code>
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1">
                    <FormField
                        id="totalBudget"
                        label="Orçamento Total (R$)"
                        type="number"
                        value={formData.totalBudget === 0 ? '' : formData.totalBudget} // Ajustado para exibir vazio se 0
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        placeholder="0.00"
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