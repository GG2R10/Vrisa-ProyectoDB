import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { updateTheme, resetTheme } = useTheme();

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
                    const userData = JSON.parse(storedUser);
                    setUser(userData);
                    applyUserTheme(userData);
                } else {
                    // Si no existe en localStorage, obtenerlo del backend
                    const userData = await authService.getCurrentUser();
                    setUser(userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                    applyUserTheme(userData);
                }
            } catch (error) {
                console.error("Error en verificación de autenticación", error);
                logout();
            }
        }
        setLoading(false);
    };

    const applyUserTheme = (userData) => {
        try {
            // Si el usuario tiene colores institucionales, aplicarlos
            if (userData && userData.admin_institucion) {
                updateTheme({
                    primaryColor: userData.admin_institucion.color_primario,
                    secondaryColor: userData.admin_institucion.color_secundario,
                    name: userData.admin_institucion.institucion_nombre
                });
            } else if (userData && (userData.admin_estacion || userData.tecnico)) {
                const role = userData.admin_estacion || userData.tecnico;
                updateTheme({
                    primaryColor: role.color_primario,
                    secondaryColor: role.color_secundario,
                    name: role.institucion_nombre
                });
            } else {
                resetTheme();
            }
        } catch (error) {
            console.error("Error applying user theme:", error);
            resetTheme();
        }
    };

    const login = async (username, password) => {
        try {
            const { user: userData, token } = await authService.login(username, password);
            setUser(userData);
            applyUserTheme(userData);
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

    const logout = () => {
        authService.logout();
        setUser(null);
        resetTheme();
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            login, 
            logout, 
            register,
            loading 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

