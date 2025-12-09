import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const defaultTheme = {
    primaryColor: '#2563eb', // Blue-600
    secondaryColor: '#64748b', // Slate-500
    logoUrl: null,
    name: 'VriSA',
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(defaultTheme);

    // Load theme from local storage or user profile on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('institution_theme');
        if (savedTheme) {
            try {
                setTheme(JSON.parse(savedTheme));
            } catch (e) {
                console.error("Failed to parse theme", e);
            }
        }
    }, []);

    const updateTheme = (newTheme) => {
        setTheme((prev) => ({ ...prev, ...newTheme }));
        localStorage.setItem('institution_theme', JSON.stringify({ ...theme, ...newTheme }));
    };

    const resetTheme = () => {
        setTheme(defaultTheme);
        localStorage.removeItem('institution_theme');
    };

    // Apply CSS variables for dynamic usage
    useEffect(() => {
        document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
        document.documentElement.style.setProperty('--secondary-color', theme.secondaryColor);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, updateTheme, resetTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
