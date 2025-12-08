import client from '../api/client';

const sensorService = {
    // Obtener todos los sensores
    getAll: async (params = {}) => {
        try {
            const response = await client.get('/sensores/', { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener sensores' };
        }
    },

    // Obtener un sensor por ID
    getById: async (id) => {
        try {
            const response = await client.get(`/sensores/${id}/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener sensor' };
        }
    },

    // Crear nuevo sensor
    create: async (data) => {
        try {
            const response = await client.post('/sensores/', data);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al crear sensor' };
        }
    },

    // Actualizar sensor
    update: async (id, data) => {
        try {
            const response = await client.put(`/sensores/${id}/`, data);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al actualizar sensor' };
        }
    },

    // Actualización parcial de sensor
    partialUpdate: async (id, data) => {
        try {
            const response = await client.patch(`/sensores/${id}/`, data);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al actualizar sensor' };
        }
    },

    // Eliminar sensor
    delete: async (id) => {
        try {
            const response = await client.delete(`/sensores/${id}/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al eliminar sensor' };
        }
    },

    // Obtener sensores por estación
    getByEstacion: async (estacionId) => {
        try {
            const response = await client.get('/sensores/', { 
                params: { estacion: estacionId } 
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener sensores de la estación' };
        }
    },

    // Obtener sensores por tipo
    getByTipo: async (tipo) => {
        try {
            const response = await client.get('/sensores/', { 
                params: { tipo_sensor: tipo } 
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener sensores por tipo' };
        }
    }
};

export default sensorService;
