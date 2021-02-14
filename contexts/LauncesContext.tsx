import { create } from 'node:domain';
import react, { useState, useContext, createContext } from 'react';

const LaunchContext = createContext(null);

export const useLaunch = () => {
    return useContext(LaunchContext);
}

export const LaunchProvider = ({ children } : any) => {
    const [launches, setLaunches] = useState<Array<any>>([]);

    const value = {
        launches,
        setLaunches,
    }

    return (
        <LaunchContext.Provider value={value}>
            {children}
        </LaunchContext.Provider>
    )
}