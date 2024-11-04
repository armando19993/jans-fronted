import axios from 'axios';
import Cookies from 'js-cookie';

// Crear instancia básica sin token
const instance = axios.create({
  baseURL: 'https://api.jansprogramming.com.co/api/',
  baseURL: 'http://localhost:4000/api/',
});

// Crear instancia con token
const instanceWithToken = axios.create({
  baseURL: 'https://api.jansprogramming.com.co/api/',
  baseURL: 'http://localhost:4000/api/',
});

// Añadir el token a los headers de cada solicitud
instanceWithToken.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { instance, instanceWithToken };
