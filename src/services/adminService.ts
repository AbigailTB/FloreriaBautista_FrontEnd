import {
  HealthCheckResponse,
  BackupsResponse,
  MaintenanceResponse,
} from '../types';

const API_BASE = '/api/admin';
const TOKEN_URL = '/api/dev/token';

// Cache del token para evitar múltiples llamadas seguidas
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

const getToken = async (): Promise<string> => {
  const now = Date.now();
  // Reusar token si fue obtenido hace menos de 5 minutos
  if (cachedToken && now < tokenExpiry) {
    return cachedToken;
  }
  const response = await fetch(TOKEN_URL);
  if (!response.ok) throw new Error('No se pudo obtener el token de autenticación');
  const token = (await response.text()).trim();
  cachedToken = token;
  tokenExpiry = now + 5 * 60 * 1000; // 5 minutos
  return token;
};

const authHeaders = async () => ({
  'Content-Type': 'application/json',
  Accept: 'application/json',
  Authorization: `Bearer ${await getToken()}`,
});

export const AdminService = {
  // ─── Base de datos ────────────────────────────────────────────
  getDatabaseHealth: async (): Promise<HealthCheckResponse> => {
    const res = await fetch(`${API_BASE}/database/health`, {
      headers: await authHeaders(),
    });
    if (!res.ok) throw new Error('Error al obtener estado de la base de datos');
    return res.json();
  },

  runMaintenance: async (): Promise<MaintenanceResponse> => {
    const res = await fetch(`${API_BASE}/database/mantenimiento`, {
      method: 'POST',
      headers: await authHeaders(),
    });
    if (!res.ok) throw new Error('Error al ejecutar mantenimiento');
    return res.json();
  },

  // ─── Respaldos ────────────────────────────────────────────────
  getBackups: async (): Promise<BackupsResponse> => {
    const res = await fetch(`${API_BASE}/backups`, {
      headers: await authHeaders(),
    });
    if (!res.ok) throw new Error('Error al obtener lista de respaldos');
    return res.json();
  },

  getDriveBackups: async (): Promise<BackupsResponse> => {
    const res = await fetch(`${API_BASE}/backups/drive`, {
      headers: await authHeaders(),
    });
    if (!res.ok) throw new Error('Error al obtener respaldos de Drive');
    return res.json();
  },

  createFullBackup: async (descripcion: string): Promise<{ success: boolean; message: string }> => {
    const res = await fetch(`${API_BASE}/backups/full`, {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify({ descripcion }),
    });
    if (!res.ok) throw new Error('Error al crear respaldo completo');
    return res.json();
  },

  createTableBackup: async (
    nombreTabla: string,
    descripcion: string
  ): Promise<{ success: boolean; message: string }> => {
    const res = await fetch(`${API_BASE}/backups/tabla`, {
      method: 'POST',
      headers: await authHeaders(),
      body: JSON.stringify({ nombreTabla, descripcion }),
    });
    if (!res.ok) throw new Error('Error al crear respaldo de tabla');
    return res.json();
  },
};