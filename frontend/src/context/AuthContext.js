import React, { createContext, useContext, useState, useEffect } from 'react';
import client from '../api/client';

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
            // Validation logic here. For now, assume valid if exists or decode if JWT
            // TODO: Fetch user profile from /auth/me/ or similar
            try {
                // const response = await client.get('usuarios/me/'); 
                // setUser(response.data);
                // Verify if user is stored in localstorage for persistence without request
                const storedUser = localStorage.getItem('user');
                if (storedUser) setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Auth check failed", error);
                logout();
            }
        }
        setLoading(false);
    };

    const login = async (username, password) => {
        // Replace with actual URL
        // const response = await client.post('api/token/', { username, password });
        // const { access, user } = response.data;

        // Mock for development
        console.log("Logging in with", username);
        const mockUser = { username, role: username === 'admin' ? 'superadmin' : 'public' };
        const mockToken = 'mock-jwt-token';

        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        return true;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
