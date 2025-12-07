import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000/';

const client = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add Token to requests
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

export default client;
