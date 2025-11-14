import React, { createContext, useContext, ReactNode } from 'react';
import { useWeddingData } from '../hooks/useWeddingData';

type WeddingDataContextType = ReturnType<typeof useWeddingData>;

const WeddingDataContext = createContext<WeddingDataContextType | undefined>(undefined);

export const WeddingDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const value = useWeddingData();
    return (
        <WeddingDataContext.Provider value={value}>
            {children}
        </WeddingDataContext.Provider>
    );
};

export const useWedding = (): WeddingDataContextType => {
    const context = useContext(WeddingDataContext);
    if (context === undefined) {
        throw new Error('useWedding must be used within a WeddingDataProvider');
    }
    return context;
};
