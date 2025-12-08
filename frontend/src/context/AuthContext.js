import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Intentar obtener el usuario desde localStorage primero
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                } else {
                    // Si no existe en localStorage, obtenerlo del backend
                    const userData = await authService.getCurrentUser();
                    setUser(userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                }
            } catch (error) {
                console.error("Error en verificación de autenticación", error);
                logout();
            }
        }
        setLoading(false);
    };

    const login = async (username, password) => {
        try {
            const { user: userData, token } = await authService.login(username, password);
            setUser(userData);
            return true;
        } catch (error) {
            console.error("Error en login", error);
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const response = await authService.register(userData);
            return response;
        } catch (error) {
            console.error("Error en registro", error);
            throw error;
        }
    };

    const registerInstitution = async (institutionData) => {
        try {
            const response = await authService.registerInstitution(institutionData);
            return response;
        } catch (error) {
            console.error("Error al registrar institución", error);
            throw error;
        }
    };

    const registerStation = async (stationData) => {
        try {
            const response = await authService.registerStation(stationData);
            return response;
        } catch (error) {
            console.error("Error al registrar estación", error);
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            login, 
            logout, 
            register,
            registerInstitution,
            registerStation,
            loading 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
