import React, { createContext, useState, useContext } from 'react';

const CurrentGameConfigContext = createContext();

export const CurrentGameConfigProvider = ({ children }) => {
    const [currentGameConfig, setCurrentGameConfig] = useState({});

    return (
        <CurrentGameConfigContext.Provider value={{ currentGameConfig, setCurrentGameConfig }}>
            {children}
        </CurrentGameConfigContext.Provider>
    );
};

export const useCurrentGameConfig = () => {
    const context = useContext(CurrentGameConfigContext);
    if (!context) {
        throw new Error('useCurrentGameConfig must be used within a CurrentGameConfigProvider');
    }
    return context;
};