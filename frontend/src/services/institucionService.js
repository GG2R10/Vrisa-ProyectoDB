import client from '../api/client';

const institucionService = {
    // Obtener todas las instituciones
    getAll: async (params = {}) => {
        try {
            const response = await client.get('/instituciones/', { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener instituciones' };
        }
    },

    // Obtener una institución por ID
    getById: async (id) => {
        try {
            const response = await client.get(`/instituciones/${id}/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener institución' };
        }
    },

    // Crear nueva institución
    create: async (data) => {
        try {
            const response = await client.post('/instituciones/', data);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al crear institución' };
        }
    },

    // Actualizar institución
    update: async (id, data) => {
        try {
            const response = await client.put(`/instituciones/${id}/`, data);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al actualizar institución' };
        }
    },

    // Actualización parcial de institución
    partialUpdate: async (id, data) => {
        try {
            const response = await client.patch(`/instituciones/${id}/`, data);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al actualizar institución' };
        }
    },

    // Eliminar institución
    delete: async (id) => {
        try {
            const response = await client.delete(`/instituciones/${id}/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al eliminar institución' };
        }
    },

    // Aprobar institución (solo admin del sistema)
    approve: async (id) => {
        try {
            const response = await client.post(`/instituciones/${id}/aprobar/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al aprobar institución' };
        }
    },

    // Rechazar institución (solo admin del sistema)
    reject: async (id, motivo = '') => {
        try {
            const response = await client.post(`/instituciones/${id}/rechazar/`, { motivo });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al rechazar institución' };
        }
    },

    // Obtener instituciones pendientes
    getPending: async () => {
        try {
            const response = await client.get('/instituciones/sistema/pendientes/');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener instituciones pendientes' };
        }
    }
};

export default institucionService;

