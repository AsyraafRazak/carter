import axios from 'axios';

export const API_BASE =
  import.meta.env.VITE_API_URL; // Use VITE_API_URL from .env file or default to localhost

const api = axios.create({
  baseURL: API_BASE
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export function pdfUrl(path) {
  if (!path) return '';

  if (path.startsWith('http')) {
    return path;
  }

  // Remove trailing /api from API_BASE
  const origin = API_BASE.replace(/\/api$/, '');

  return `${origin}${path.startsWith('/') ? path : `/${path}`}`;
}

export default api;