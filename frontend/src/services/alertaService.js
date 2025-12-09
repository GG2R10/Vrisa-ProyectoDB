import client from '../api/client';

const alertaService = {
    // Obtener todas las alertas
    getAll: async (params = {}) => {
        try {
            const response = await client.get('/alertas/', { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener alertas' };
        }
    },

    // Obtener una alerta por ID
    getById: async (id) => {
        try {
            const response = await client.get(`/alertas/${id}/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener alerta' };
        }
    },

    // Crear nueva alerta
    create: async (data) => {
        try {
            const response = await client.post('/alertas/', data);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al crear alerta' };
        }
    },

    // Actualizar alerta
    update: async (id, data) => {
        try {
            const response = await client.put(`/alertas/${id}/`, data);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al actualizar alerta' };
        }
    },

    // Eliminar alerta
    delete: async (id) => {
        try {
            const response = await client.delete(`/alertas/${id}/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al eliminar alerta' };
        }
    },

    // Obtener alertas activas
    getActivas: async () => {
        try {
            const response = await client.get('/alertas/', { 
                params: { activa: true } 
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener alertas activas' };
        }
    },

    // Obtener alertas por estación
    getByEstacion: async (estacionId, params = {}) => {
        try {
            const response = await client.get('/alertas/', { 
                params: { ...params, estacion: estacionId } 
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener alertas de la estación' };
        }
    },

    // Obtener alertas por tipo
    getByTipo: async (tipo, params = {}) => {
        try {
            const response = await client.get('/alertas/', { 
                params: { ...params, tipo_alerta: tipo } 
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener alertas por tipo' };
        }
    },

    // Obtener alertas críticas activas
    getCriticasActivas: async () => {
        try {
            const response = await client.get('/alertas/', { 
                params: { 
                    tipo_alerta: 'critica',
                    activa: true 
                } 
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener alertas críticas' };
        }
    },

    // Obtener alertas recientes
    getRecientes: async (limit = 10) => {
        try {
            const response = await client.get('/alertas/', { 
                params: { 
                    ordering: '-fecha_hora_generacion',
                    limit: limit
                } 
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener alertas recientes' };
        }
    },

    // Marcar alerta como atendida/resuelta
    marcarResuelta: async (id) => {
        try {
            const response = await client.patch(`/alertas/${id}/`, { 
                activa: false 
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al marcar alerta como resuelta' };
        }
    }
};

export default alertaService;
