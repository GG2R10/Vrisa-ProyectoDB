import client from '../api/client';

const medicionService = {
    // Obtener todas las mediciones
    getAll: async (params = {}) => {
        try {
            const response = await client.get('/mediciones/', { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener mediciones' };
        }
    },

    // Obtener una medición por ID
    getById: async (id) => {
        try {
            const response = await client.get(`/mediciones/${id}/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener medición' };
        }
    },

    // Crear nueva medición
    create: async (data) => {
        try {
            const response = await client.post('/mediciones/', data);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al crear medición' };
        }
    },

    // Actualizar medición
    update: async (id, data) => {
        try {
            const response = await client.put(`/mediciones/${id}/`, data);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al actualizar medición' };
        }
    },

    // Eliminar medición
    delete: async (id) => {
        try {
            const response = await client.delete(`/mediciones/${id}/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al eliminar medición' };
        }
    },

    // Obtener mediciones por sensor
    getBySensor: async (sensorId, params = {}) => {
        try {
            const response = await client.get('/mediciones/', { 
                params: { ...params, sensor: sensorId } 
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener mediciones del sensor' };
        }
    },

    // Obtener mediciones por estación
    getByEstacion: async (estacionId, params = {}) => {
        try {
            const response = await client.get('/mediciones/', { 
                params: { ...params, estacion: estacionId } 
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener mediciones de la estación' };
        }
    },

    // Obtener mediciones por tipo
    getByTipo: async (tipo, params = {}) => {
        try {
            const response = await client.get('/mediciones/', { 
                params: { ...params, tipo_medicion: tipo } 
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener mediciones por tipo' };
        }
    },

    // Obtener mediciones en rango de fechas
    getByDateRange: async (fechaInicio, fechaFin, params = {}) => {
        try {
            const response = await client.get('/mediciones/', { 
                params: { 
                    ...params, 
                    fecha_hora__gte: fechaInicio, 
                    fecha_hora__lte: fechaFin 
                } 
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener mediciones por rango de fechas' };
        }
    },

    // Obtener últimas mediciones de una estación
    getUltimasByEstacion: async (estacionId, limit = 10) => {
        try {
            const response = await client.get('/mediciones/', { 
                params: { 
                    estacion: estacionId,
                    ordering: '-fecha_hora',
                    limit: limit
                } 
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener últimas mediciones' };
        }
    }
};

export default medicionService;
