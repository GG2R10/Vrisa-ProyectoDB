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

    // Obtener perfil del usuario actual
    getCurrentUser: async () => {
        try {
            const response = await client.get('/usuarios/me/');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener usuario' };
        }
    },

    // Solicitar ser investigador
    requestInvestigador: async () => {
        try {
            const response = await client.post('/solicitudes/investigador/crear/');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al enviar solicitud' };
        }
    },

    // Solicitar ser autoridad
    requestAutoridad: async () => {
        try {
            const response = await client.post('/solicitudes/autoridad/crear/');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al enviar solicitud' };
        }
    },

    // Obtener solicitudes de investigador pendientes (admin sistema)
    getPendingInvestigadores: async () => {
        try {
            const response = await client.get('/solicitudes/investigador/?estado=pendiente');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener solicitudes' };
        }
    },

    // Obtener solicitudes de autoridad pendientes (admin sistema)
    getPendingAutoridades: async () => {
        try {
            const response = await client.get('/solicitudes/autoridad/?estado=pendiente');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener solicitudes' };
        }
    },

    // Aprobar solicitud de investigador (admin sistema)
    approveInvestigador: async (id) => {
        try {
            const response = await client.post(`/solicitudes/investigador/${id}/aprobar/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al aprobar solicitud' };
        }
    },

    // Rechazar solicitud de investigador (admin sistema)
    rejectInvestigador: async (id) => {
        try {
            const response = await client.post(`/solicitudes/investigador/${id}/rechazar/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al rechazar solicitud' };
        }
    },

    // Aprobar solicitud de autoridad (admin sistema)
    approveAutoridad: async (id) => {
        try {
            const response = await client.post(`/solicitudes/autoridad/${id}/aprobar/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al aprobar solicitud' };
        }
    },

    // Rechazar solicitud de autoridad (admin sistema)
    rejectAutoridad: async (id) => {
        try {
            const response = await client.post(`/solicitudes/autoridad/${id}/rechazar/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al rechazar solicitud' };
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

