import axios from 'axios';
import { create } from 'node:domain';
import react, { useState, useContext, createContext, SetStateAction } from 'react';

type Values = {
    launches: Array<any>,
    setLaunches: React.Dispatch<SetStateAction<Array<any>>>,
    fetchData: (string, {}) => Promise<any>;
}

const LaunchContext = createContext(null);

export const useLaunch = () => {
    return useContext(LaunchContext);
}

export const LaunchProvider = ({ children } : any) => {
    const [launches, setLaunches] = useState<Array<any>>([]);

    const fetchData = async (url:string, params: {} = {}) => {
        const config = {params: params}
        
        return axios(url, config);
    };

    const value:Values = {
        launches,
        setLaunches,
        fetchData,
    }

    return (
        <LaunchContext.Provider value={value}>
            {children}
        </LaunchContext.Provider>
    )
}