
import React from 'react';
import SettingsForm from '../components/settings/SettingsForm';

interface SettingsScreenProps {
    onSave: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onSave }) => {
    return (
        <div>
            <h2 className="text-3xl font-title text-brand-gray dark:text-white mb-6">Ajustes</h2>
            <SettingsForm onSave={onSave} />
        </div>
    );
};

export default SettingsScreen;
