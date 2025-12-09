import client from '../api/client';

const estacionService = {
    // Obtener todas las estaciones
    getAll: async (params = {}) => {
        try {
            const response = await client.get('/estaciones/', { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener estaciones' };
        }
    },

    // Obtener una estación por ID
    getById: async (id) => {
        try {
            const response = await client.get(`/estaciones/${id}/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener estación' };
        }
    },

    // Crear nueva estación
    create: async (data) => {
        try {
            const response = await client.post('/estaciones/', data);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al crear estación' };
        }
    },

    // Actualizar estación
    update: async (id, data) => {
        try {
            const response = await client.put(`/estaciones/${id}/`, data);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al actualizar estación' };
        }
    },

    // Actualización parcial de estación
    partialUpdate: async (id, data) => {
        try {
            const response = await client.patch(`/estaciones/${id}/`, data);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al actualizar estación' };
        }
    },

    // Eliminar estación
    delete: async (id) => {
        try {
            const response = await client.delete(`/estaciones/${id}/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al eliminar estación' };
        }
    },

    // Aprobar estación (admin de institución)
    approve: async (id) => {
        try {
            const response = await client.post(`/estaciones/${id}/aprobar/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al aprobar estación' };
        }
    },

    // Rechazar estación (admin de institución)
    reject: async (id, motivo = '') => {
        try {
            const response = await client.post(`/estaciones/${id}/rechazar/`, { motivo });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al rechazar estación' };
        }
    },

    // Obtener estaciones pendientes
    getPending: async () => {
        try {
            const response = await client.get('/estaciones/pendientes/');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener estaciones pendientes' };
        }
    },
    // Alias en español para compatibilidad
    getPendientes: async () => {
        return estacionService.getPending();
    },

    // Obtener estaciones por institución
    getByInstitution: async (institucionId) => {
        try {
            const response = await client.get('/estaciones/', {
                params: { institucion: institucionId }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener estaciones de la institución' };
        }
    },

    // Obtener estaciones activas (aprobadas)
    getActivas: async () => {
        try {
            const response = await client.get('/estaciones/', {
                params: { estado_validacion: 'aprobada' }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener estaciones activas' };
        }
    }
};

export default estacionService;

