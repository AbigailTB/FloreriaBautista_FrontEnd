import axios from 'axios';

// Con el proxy de Vite, todas las rutas /api/* se redirigen a localhost:5000
const api = axios.create({
  baseURL: '/',
});

api.interceptors.request.use(async (config) => {
  try {
    const stored = localStorage.getItem('accessToken');
    if (stored && !stored.startsWith('local-token-')) {
      config.headers.Authorization = `Bearer ${stored}`;
    } else {
      const tokenRes = await fetch('/api/dev/token');
      if (tokenRes.ok) {
        const token = await tokenRes.text();
        config.headers.Authorization = `Bearer ${token.trim()}`;
      }
    }
  } catch {
    // Continuar sin token si falla
  }
  return config;
});

export default api;