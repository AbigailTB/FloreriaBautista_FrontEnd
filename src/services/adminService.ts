import { HealthCheckResponse, BackupsResponse, MaintenanceResponse } from '../types';

const API_BASE_URL = 'http://localhost:5000/api/admin';

const getToken = async (): Promise<string> => {
  const response = await fetch('http://localhost:5000/api/dev/token');
  if (!response.ok) {
    throw new Error('Failed to fetch token');
  }
  return response.text();
};

const getHeaders = async () => {
  const token = await getToken();
  return {
    'accept': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const AdminService = {
  getDatabaseHealth: async (): Promise<HealthCheckResponse> => {
    const response = await fetch(`${API_BASE_URL}/database/health`, {
      headers: await getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch database health');
    }
    return response.json();
  },

  getBackups: async (): Promise<BackupsResponse> => {
    const response = await fetch(`${API_BASE_URL}/backups`, {
      headers: await getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch backups');
    }
    return response.json();
  },

  getDriveBackups: async (): Promise<BackupsResponse> => {
    const response = await fetch(`${API_BASE_URL}/backups/drive`, {
      headers: await getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch drive backups');
    }
    return response.json();
  },

  runMaintenance: async (): Promise<MaintenanceResponse> => {
    const response = await fetch(`${API_BASE_URL}/database/mantenimiento`, {
      method: 'POST',
      headers: await getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to run maintenance');
    }
    return response.json();
  },
};
