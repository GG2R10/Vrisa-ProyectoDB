import client from '../api/client';

const authService = {
    // Login de usuario
    login: async (username, password) => {
        try {
            const response = await client.post('/api/token/', { username, password });
            const { access, refresh, user } = response.data;
            
            // Guardar tokens en localStorage
            localStorage.setItem('token', access);
            localStorage.setItem('refreshToken', refresh);
            localStorage.setItem('user', JSON.stringify(user));
            
            return { user, token: access };
        } catch (error) {
            throw error.response?.data || { message: 'Error de autenticación' };
        }
    },

    // Registro de usuario ciudadano
    register: async (userData) => {
        try {
            const response = await client.post('/usuarios/', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error en el registro' };
        }
    },

    // Registro de institución
    registerInstitution: async (institutionData) => {
        try {
            const response = await client.post('/instituciones/', institutionData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al registrar institución' };
        }
    },

    // Registro de estación
    registerStation: async (stationData) => {
        try {
            const response = await client.post('/estaciones/', stationData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al registrar estación' };
        }
    },

    // Obtener perfil del usuario actual
    getCurrentUser: async () => {
        try {
            const response = await client.get('/usuarios/me/');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener usuario' };
        }
    },

    // Refrescar token
    refreshToken: async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            const response = await client.post('/api/token/refresh/', { refresh: refreshToken });
            const { access } = response.data;
            
            localStorage.setItem('token', access);
            return access;
        } catch (error) {
            throw error.response?.data || { message: 'Error al refrescar token' };
        }
    },

    // Logout
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    }
};

export default authService;
