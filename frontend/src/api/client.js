import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000/';

const client = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar el token a todas las peticiones
client.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor para manejar errores de autenticación y refresh token
client.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Si el error es 401 y no hemos intentado refrescar el token aún
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                // Intentar refrescar el token
                const response = await axios.post(
                    `${baseURL}api/token/refresh/`,
                    { refresh: refreshToken }
                );

                const { access } = response.data;
                localStorage.setItem('token', access);

                // Actualizar el header de la petición original
                originalRequest.headers.Authorization = `Bearer ${access}`;
                
                // Reintentar la petición original
                return client(originalRequest);
            } catch (refreshError) {
                // Si el refresh token también falla, limpiar storage y redirigir a login
                console.error('Error al refrescar token:', refreshError);
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                
                // Redirigir a login solo si no estamos ya ahí
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
                
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default client;
