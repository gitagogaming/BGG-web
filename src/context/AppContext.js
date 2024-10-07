import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [action, setAction] = useState(null);

    const triggerAction = (newAction) => {
        setAction(newAction);
    };

    return (
        <AppContext.Provider value={{ action, triggerAction }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);