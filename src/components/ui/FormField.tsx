"use client";

import React from 'react';

interface FormFieldProps {
    id: string;
    label: string;
    type?: 'text' | 'number' | 'email' | 'tel' | 'url' | 'date' | 'textarea' | 'select';
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    placeholder?: string;
    required?: boolean;
    min?: string | number;
    step?: string;
    rows?: number;
    options?: { value: string; label: string }[];
    className?: string;
    labelClassName?: string;
    inputClassName?: string;
    error?: string;
}

const FormField: React.FC<FormFieldProps> = ({
    id,
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    required = false,
    min,
    step,
    rows = 3,
    options,
    className = '',
    labelClassName = '',
    inputClassName = '',
    error,
}) => {
    const baseInputClasses = "w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 focus:ring-brand-gold focus:border-brand-gold";
    const errorInputClasses = error ? 'border-red-500' : '';

    const renderInput = () => {
        switch (type) {
            case 'textarea':
                return (
                    <textarea
                        id={id}
                        name={id}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        required={required}
                        rows={rows}
                        className={`${baseInputClasses} ${errorInputClasses} ${inputClassName}`}
                    ></textarea>
                );
            case 'select':
                return (
                    <select
                        id={id}
                        name={id}
                        value={value}
                        onChange={onChange}
                        required={required}
                        className={`${baseInputClasses} ${errorInputClasses} ${inputClassName}`}
                    >
                        {options?.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                );
            default:
                return (
                    <input
                        id={id}
                        name={id}
                        type={type}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        required={required}
                        min={min}
                        step={step}
                        className={`${baseInputClasses} ${errorInputClasses} ${inputClassName}`}
                    />
                );
        }
    };

    return (
        <div className={className}>
            <label htmlFor={id} className={`block text-sm font-medium mb-1 text-brand-gray-light dark:text-gray-400 ${labelClassName}`}>
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {renderInput()}
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
};

export default FormField;