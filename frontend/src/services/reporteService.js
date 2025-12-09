import client from '../api/client';

const reporteService = {
    // Generar reporte general (público)
    generarReporteGeneral: async (params = {}) => {
        try {
            const response = await client.get('/reportes/general/', { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al generar reporte general' };
        }
    },

    // Generar reporte detallado (requiere permisos)
    generarReporteDetallado: async (params = {}) => {
        try {
            const response = await client.get('/reportes/detallado/', { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al generar reporte detallado' };
        }
    },

    // Obtener estaciones disponibles para reportes según rol
    getEstacionesDisponibles: async () => {
        try {
            const response = await client.get('/reportes/estaciones_disponibles/');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener estaciones disponibles' };
        }
    },

    // Obtener todos los reportes
    getAll: async (params = {}) => {
        try {
            const response = await client.get('/reportes/', { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener reportes' };
        }
    },

    // Obtener un reporte por ID
    getById: async (id) => {
        try {
            const response = await client.get(`/reportes/${id}/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener reporte' };
        }
    },

    // Crear nuevo reporte
    create: async (data) => {
        try {
            const response = await client.post('/reportes/', data);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al crear reporte' };
        }
    },

    // Eliminar reporte
    delete: async (id) => {
        try {
            const response = await client.delete(`/reportes/${id}/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al eliminar reporte' };
        }
    },

    // Reportes específicos por tipo
    getReporteCalidadAire: async (estacionId, fechaInicio, fechaFin) => {
        try {
            const response = await client.get('/reportes/general/', {
                params: {
                    tipo_reporte: 'calidad_aire',
                    estacion_id: estacionId,
                    fecha_inicio: fechaInicio,
                    fecha_fin: fechaFin
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener reporte de calidad del aire' };
        }
    },

    getReporteTendencias: async (estacionId, fechaInicio, fechaFin) => {
        try {
            const response = await client.get('/reportes/general/', {
                params: {
                    tipo_reporte: 'tendencias',
                    estacion_id: estacionId,
                    fecha_inicio: fechaInicio,
                    fecha_fin: fechaFin
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener reporte de tendencias' };
        }
    },

    getReporteAlertas: async (fechaInicio, fechaFin) => {
        try {
            const response = await client.get('/reportes/general/', {
                params: {
                    tipo_reporte: 'alertas',
                    fecha_inicio: fechaInicio,
                    fecha_fin: fechaFin
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener reporte de alertas' };
        }
    },

    getReporteInfraestructura: async () => {
        try {
            const response = await client.get('/reportes/general/', {
                params: {
                    tipo_reporte: 'infraestructura'
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Error al obtener reporte de infraestructura' };
        }
    }
};

export default reporteService;
